import { query } from './server-db';

/**
 * Ensures that the system_settings table exists in PostgreSQL and creates it if not.
 * This table is used to store server-wide configuration such as the default language
 * without requiring electric-sql client regeneration.
 */
export async function ensureSettingsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  
  // Insert initial default language ('fr' for French) if it is not already present
  await query(`
    INSERT INTO system_settings (key, value)
    VALUES ('default_language', 'fr')
    ON CONFLICT (key) DO NOTHING;
  `);
}

/**
 * Fetches the default server language from the system_settings table.
 * Defaults to 'fr' if not found.
 */
export async function getDefaultLanguage(): Promise<string> {
  try {
    await ensureSettingsTable();
    const { rows } = await query("SELECT value FROM system_settings WHERE key = 'default_language'");
    return rows[0]?.value || 'fr';
  } catch (error) {
    console.error("Error in getDefaultLanguage:", error);
    return 'fr'; // Safe fallback
  }
}

/**
 * Sets the default server language in the system_settings table.
 */
export async function setDefaultLanguage(lang: string): Promise<void> {
  try {
    await ensureSettingsTable();
    await query(
      "INSERT INTO system_settings (key, value) VALUES ('default_language', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [lang]
    );
  } catch (error) {
    console.error("Error in setDefaultLanguage:", error);
    throw error;
  }
}
