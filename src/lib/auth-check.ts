import { query } from './server-db';

/**
 * Checks if a given user ID corresponds to the primary server administrator.
 * The primary server administrator is strictly defined as the very first user
 * registered in the `admin_users` table by date of creation (`created_at` ASC).
 *
 * @param userId - The UUID of the user to check
 * @returns Promise<boolean> - True if the user is the primary system administrator
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { rows } = await query('SELECT id FROM admin_users ORDER BY created_at ASC LIMIT 1');
    if (rows.length > 0 && rows[0].id === userId) {
      return true;
    }
  } catch (error) {
    console.error('❌ Error executing isSystemAdmin check:', error);
  }
  return false;
}
