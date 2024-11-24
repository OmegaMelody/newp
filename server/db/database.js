require('dotenv').config(); // Завантажуємо змінні середовища з файлу .env

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Перевіряємо підключення до бази даних
pool.connect()
  .then(() => console.log('Connected to the database successfully'))
  .catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Завершуємо процес, якщо підключення не вдалося
  });

module.exports = {
  pool,
};
