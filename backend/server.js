require('dotenv').config();
const express = require('express');
console.log('### Express module after require in server.js:', typeof express, express ? Object.keys(express) : 'Express is null or undefined'); // DEBUG LINE
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
const { initializeDatabase, getPool } = require('./db'); // getPool fonksiyonunu db.js'den import et

const {
  PORT,
  JWT_SECRET,
  TMDB_API_KEY,
  FRONTEND_URL
} = process.env;

const app = express();
app.use(cors({ origin: FRONTEND_URL })); // Frontend origin'i belirtildi
app.use(express.json());

// const users = []; // In-memory kullanıcı deposu kaldırıldı
// const JWT_SECRET = 'sizin-cok-gizli-jwt-anahtariniz'; // Gerçek uygulamada .env dosyasında saklanmalı

// Ana uygulama mantığını asenkron bir IIFE (Immediately Invoked Function Expression) içine alalım
// ki veritabanı bağlantısını bekleyebilelim.
(async () => {
  try {
    await initializeDatabase();
    const pool = await getPool(); // Veritabanı havuzunu al (ve gerekirse başlatılmasını bekle)
    console.log('Veritabanı havuzu server.js içinde başarıyla alındı.');

    // Tabloları oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tmdb_id INT UNIQUE,
        title VARCHAR(255),
        overview TEXT,
        genre VARCHAR(100),
        release_date DATE,
        poster_path VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    app.get('/', (req, res) => {
      res.send('FilmBoxd Backend Sunucusu Çalışıyor! Veritabanı bağlantısı aktif.');
    });

    // Kullanıcı Kayıt Endpoint'i
    app.post('/api/auth/register', async (req, res) => {
      console.log('--- REGISTER ENDPOINT ENTERED ---'); // YENİ LOG
      console.log('Request body:', req.body); // YENİ LOG - Gelen isteğin içeriğini görmek için
      let connection;
      try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
          return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
        }

        connection = await pool.getConnection();

        // Kullanıcı adı veya e-posta zaten var mı kontrolü
        const [existingUsers] = await connection.execute(
          'SELECT * FROM users WHERE username = ? OR email = ?',
          [username, email]
        );

        if (existingUsers.length > 0) {
          const existingField = existingUsers[0].username === username ? 'Kullanıcı adı' : 'E-posta adresi';
          return res.status(400).json({ message: `Bu ${existingField} zaten kayıtlı.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.execute(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hashedPassword]
        );

        console.log('### Kullanıcı Ekleme Sonucu:', result); // DEBUG LINE: INSERT sonucunu logla

        const newUser = { id: result.insertId, username, email }; // Şifreyi geri döndürme

        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
          message: 'Kullanıcı başarıyla kaydedildi.', 
          token, 
          userId: newUser.id, 
          username: newUser.username 
        });

      } catch (error) {
        console.error('Kayıt sırasında hata:', error);
        // Genel bir hata mesajı veya daha spesifik bir mesaj döndürülebilir
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Bu kullanıcı adı veya e-posta zaten mevcut.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' });
      } finally {
        if (connection) connection.release();
      }
    });

    // Kullanıcı Giriş Endpoint'i
    app.post('/api/auth/login', async (req, res) => {
      let connection;
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: 'Lütfen e-posta ve şifrenizi girin.' });
        }

        connection = await pool.getConnection();

        const [usersFound] = await connection.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (usersFound.length === 0) {
          return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const user = usersFound[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
          return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
          message: 'Giriş başarılı.',
          token,
          userId: user.id,
          username: user.username,
          // preferences: user.preferences // Henüz preferences tablosu/kolonu yok
        });

      } catch (error) {
        console.error('Giriş sırasında hata:', error);
        res.status(500).json({ message: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' });
      } finally {
        if (connection) connection.release();
      }
    });

    // 1) Arama: /api/search?q=…
    app.get('/api/search', async (req, res) => {
      const { q } = req.query;
      if (!q) return res.status(400).json({ message: 'Sorgu boş.' });
      try {
        const tmdb = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          { params: { api_key: TMDB_API_KEY, query: q } }
        );
        res.json(tmdb.data.results);
      } catch (e) {
        res.status(500).json({ message: 'TMDb hatası.' });
      }
    });

    // 2) Öneriler (Basit içerik temelli: en yüksek rating’li filmler)
    app.get('/api/recommendations', async (req, res) => {
      try {
        const conn = await pool.getConnection();
        // En çok puan veren kullanıcılardan top 10 film:
        const [rows] = await conn.query(`
          SELECT m.*,
                 AVG(r.rating) as avg_rating
            FROM movies m
            JOIN ratings r ON m.id = r.movie_id
           GROUP BY m.id
           ORDER BY avg_rating DESC
           LIMIT 10;
        `);
        conn.release();
        res.json(rows);
      } catch (err) {
        res.status(500).json({ message: 'Öneri üretilemedi.' });
      }
    });

    app.listen(PORT, () =>
      console.log(`Sunucu ${PORT} portunda`));

  } catch (dbError) {
    console.error('Uygulama başlatılırken veritabanı hatası:', dbError);
    process.exit(1); // Veritabanı olmadan uygulama çalışamaz
  }
})(); // IIFE'yi hemen çağır