const postgres = require('postgres');
const { Pool } = require('pg')
require('dotenv').config()

const sql = postgres(process.env.DATABASE_URL);

module.exports = sql;