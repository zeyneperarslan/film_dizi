const mysql = require('mysql2/promise');

// Temel MySQL sunucusu bağlantı bilgileri (veritabanı adı olmadan)
// TODO: Bu bilgileri .env dosyasından okumak daha güvenlidir.
const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP varsayılan şifresi genellikle boştur
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const DATABASE_NAME = 'filmboxd_db';

// Ana bağlantı havuzu (başlangıçta null)
let pool = null;

async function initializeDatabase() {
  let connection;
  try {
    // 1. Veritabanı olmadan MySQL sunucusuna bağlan
    connection = await mysql.createConnection({
      host: MYSQL_CONFIG.host,
      user: MYSQL_CONFIG.user,
      password: MYSQL_CONFIG.password
    });

    // 2. Veritabanını oluştur (varsa dokunma)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    console.log(`Veritabanı '${DATABASE_NAME}' kontrol edildi/oluşturuldu.`);
    await connection.end(); // Geçici bağlantıyı kapat

    // 3. Belirtilen veritabanı ile ana bağlantı havuzunu oluştur
    pool = mysql.createPool({
      ...MYSQL_CONFIG,
      database: DATABASE_NAME,
    });

    // 4. Kullanıcılar tablosunu oluştur (varsa dokunma)
    // Havuzdan bir bağlantı alıp sorguyu çalıştırmak daha güvenli
    const poolConnection = await pool.getConnection();
    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("'users' tablosu kontrol edildi/oluşturuldu.");
    poolConnection.release();

    console.log('Veritabanı ve tablo(lar) başarıyla başlatıldı.');

  } catch (error) {
    console.error('Veritabanı başlatılırken hata:', error);
    if (connection) {
      await connection.end();
    }
    // Hata durumunda uygulamanın devam etmemesi için process.exit kullanılabilir
    process.exit(1);
  }
}

// Havuzu doğrudan export etmek yerine, başlatıldıktan sonra erişilebilecek bir fonksiyon export edelim
// veya promise tabanlı yapalım ki index.js beklemesini sağlasın.
// Şimdilik, doğrudan initialize edip pool'u export edeceğiz ama bu asenkron olduğu için
// index.js'in pool'u kullanmadan önce hazır olmasını garantilemek için dikkatli olmak gerek.

// En iyi yaklaşım, initializeDatabase'in bir Promise döndürmesi ve index.js'in bunu beklemesidir.
async function getPool() {
  if (!pool) {
    await initializeDatabase();
  }
  return pool;
}

// Hemen başlatma işlemini tetikleyelim.
// `index.js` bu modülü import ettiğinde `initializeDatabase` çalışacak.
// Ancak `index.js` içindeki kodlar `pool`'un oluşmasını beklemeyebilir.
// Bu nedenle `getPool` fonksiyonunu kullanmak daha doğru olur.

// module.exports = pool; // Bu eski yöntem artık doğrudan kullanılamaz çünkü pool asenkron oluşuyor.

module.exports = { initializeDatabase, getPool }; // Fonksiyonları export edelim 