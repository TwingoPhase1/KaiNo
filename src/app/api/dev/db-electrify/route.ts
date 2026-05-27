export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';

/**
 * GET /api/dev/db-electrify
 * Force tables electrification and return exact error logs on failure.
 */
export async function GET() {
  const results: Record<string, { success: boolean; message: string; error?: any }> = {};
  const tables = ['admin_users', 'admin_credentials', 'lists', 'list_items', 'article_references'];

  for (const table of tables) {
    try {
      await query(`ALTER TABLE ${table} ENABLE ELECTRIC;`);
      results[table] = {
        success: true,
        message: '🔌 Table electrified successfully!'
      };
    } catch (e: any) {
      results[table] = {
        success: false,
        message: e.message,
        error: {
          code: e.code,
          detail: e.detail,
          hint: e.hint
        }
      };
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    electrification: results
  });
}
