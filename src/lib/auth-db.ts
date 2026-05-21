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
    // 1. Create admin_users table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);

    // 2. Create admin_credentials table if it doesn't exist
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

    // 3. Create lists table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);

    // 4. Create list_items table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS list_items (
        id UUID PRIMARY KEY,
        list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        quantity TEXT,
        price REAL,
        assigned_to TEXT,
        is_checked BOOLEAN NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      );
    `);

    // 5. Create article_references table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS article_references (
        id UUID PRIMARY KEY,
        article_name TEXT NOT NULL,
        last_price REAL,
        suggested_category TEXT,
        updated_at TIMESTAMPTZ NOT NULL
      );
    `);

    // 6. Electrify tables progressively and tolerate unavailability
    const tables = ['admin_users', 'admin_credentials', 'lists', 'list_items', 'article_references'];
    for (const table of tables) {
      try {
        await query(`ALTER TABLE ${table} ENABLE ELECTRIC;`);
        console.log(`🔌 Table ${table} successfully electrified!`);
      } catch (electricError: any) {
        // Suppress error if already electrified or if Electric functions don't exist yet
        console.log(`ℹ️ ElectricSQL not ready yet or table ${table} already electrified: ${electricError.message}`);
      }
    }

  } catch (error: any) {
    console.error('❌ Failed to ensure authentication and application tables:', error);
    throw new Error(`Failed to initialize database tables: ${error.message}`);
  }
}

export async function getCredentialById(id: string): Promise<PasskeyCredential | null> {
  try {
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
  } catch (error: any) {
    console.error('❌ Failed to get credential by ID:', error);
    throw new Error(`Failed to retrieve credential: ${error.message}`);
  }
}

export async function getCredentialsByUserId(userId: string): Promise<PasskeyCredential[]> {
  try {
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
  } catch (error: any) {
    console.error('❌ Failed to get credentials by user ID:', error);
    throw new Error(`Failed to retrieve credentials: ${error.message}`);
  }
}

export async function createCredential(cred: Omit<PasskeyCredential, 'created_at'>) {
  try {
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
  } catch (error: any) {
    console.error('❌ Failed to create credential:', error);
    throw new Error(`Failed to create credential: ${error.message}`);
  }
}

export async function updateCredentialCounter(id: string, counter: number) {
  try {
    await ensureAuthTables();
    await query('UPDATE admin_credentials SET counter = $1 WHERE id = $2', [counter, id]);
  } catch (error: any) {
    console.error('❌ Failed to update credential counter:', error);
    throw new Error(`Failed to update credential counter: ${error.message}`);
  }
}
