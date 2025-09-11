require('dotenv').config(); // Завантажуємо змінні середовища з файлу .env

const { Pool } = require('pg');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Перевіряємо підключення до бази даних
pool.connect()
  .then(client => {
    console.log('Connected to the database successfully');
    client.release(); // Важливо звільняти клієнт
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err.message);
    console.error(err.stack);
    process.exit(1); // Завершуємо процес у разі невдачі
  });


module.exports = {
  pool,
};
