import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:proxy_password@localhost:5432/kaino';

export const pool = new Pool({
  connectionString,
});

export async function query(text: string, params?: any[]) {
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    console.error('Database query failed:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      params: params ? params.map(p => typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p) : [],
      error: error.message,
      code: error.code,
      detail: error.detail,
      table: error.table
    });
    throw new Error(`Database error: ${error.message} (code: ${error.code || 'unknown'})`);
  }
}
