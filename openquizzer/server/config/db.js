require("dotenv").config();
const { Pool } = require("pg");

//One pool for the entire server process
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//only available to local machine for now

pool.on("connect", () => console.log("PostgreSQL pool ready"));
pool.on("error", (err) => console.error("DB pool error", err));

module.exports = pool;
