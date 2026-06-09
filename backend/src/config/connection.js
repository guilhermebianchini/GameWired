import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function query(text, params) {
  const result = await pool.query(text, params)
  return result
}

export { pool }

export default query