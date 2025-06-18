// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const POOL_CONFIG = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

async function initializeDatabase() {
  // 1. Geçici bağlantı ile veritabanını oluştur (varsa dokunma)
  const tempConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await tempConn.end();

  // 2. Asıl bağlantı havuzunu oluştur
  pool = mysql.createPool({
    ...POOL_CONFIG,
    database: DB_NAME
  });

  // 3. Tabloları tek tek oluşturalım
  const conn = await pool.getConnection();
  try {
    // users tablosu (halihazırda varsa dokunma)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // movies tablosu
    await conn.query(`
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

    // ratings tablosu
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // favorites tablosu
    await conn.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // watch_history tablosu
    await conn.query(`
      CREATE TABLE IF NOT EXISTS watch_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // comments tablosu
    await conn.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        movie_id INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Veritabanı ve tablolar başarıyla hazırlandı.');
  } finally {
    conn.release();
  }
}

async function getPool() {
  if (!pool) {
    await initializeDatabase();
  }
  return pool;
}

module.exports = { initializeDatabase, getPool };
