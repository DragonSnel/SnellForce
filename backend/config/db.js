const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("📡 PostgreSQL подключен!"))
  .catch(err => console.error("❌ Ошибка подключения к БД:", err));

module.exports = pool;
