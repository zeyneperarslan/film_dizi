const mysql = require('mysql2');

// XAMPP için varsayılan ayarlar
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP'da genelde şifresizdir
  database: 'filmboxd_db' // Kendi oluşturduğun db adıyla değiştir
});

connection.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err);
  } else {
    console.log('MySQL bağlantısı başarılı!');
  }
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('FilmBoxd Backend Sunucusu Çalışıyor!');
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
}); 