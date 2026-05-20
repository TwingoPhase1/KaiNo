import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:proxy_password@localhost:5432/kaino';

export const pool = new Pool({
  connectionString,
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
