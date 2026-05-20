import { query } from './server-db';

export interface PasskeyCredential {
  id: string;
  user_id: string;
  public_key: string;
  counter: number;
  transports?: string[];
  created_at: Date;
}

export async function ensureAuthTables() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        public_key TEXT NOT NULL,
        counter BIGINT NOT NULL DEFAULT 0,
        transports TEXT,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);
  } catch (error) {
    console.error('❌ Failed to ensure authentication tables:', error);
  }
}

export async function getCredentialById(id: string): Promise<PasskeyCredential | null> {
  await ensureAuthTables();
  const { rows } = await query('SELECT * FROM admin_credentials WHERE id = $1', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    user_id: row.user_id,
    public_key: row.public_key,
    counter: parseInt(row.counter, 10),
    transports: row.transports ? row.transports.split(',') : [],
    created_at: new Date(row.created_at),
  };
}

export async function getCredentialsByUserId(userId: string): Promise<PasskeyCredential[]> {
  await ensureAuthTables();
  const { rows } = await query('SELECT * FROM admin_credentials WHERE user_id = $1', [userId]);
  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    public_key: row.public_key,
    counter: parseInt(row.counter, 10),
    transports: row.transports ? row.transports.split(',') : [],
    created_at: new Date(row.created_at),
  }));
}

export async function createCredential(cred: Omit<PasskeyCredential, 'created_at'>) {
  await ensureAuthTables();
  await query(
    `INSERT INTO admin_credentials (id, user_id, public_key, counter, transports, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      cred.id,
      cred.user_id,
      cred.public_key,
      cred.counter,
      cred.transports ? cred.transports.join(',') : null,
      new Date().toISOString(),
    ]
  );
}

export async function updateCredentialCounter(id: string, counter: number) {
  await ensureAuthTables();
  await query('UPDATE admin_credentials SET counter = $1 WHERE id = $2', [counter, id]);
}
