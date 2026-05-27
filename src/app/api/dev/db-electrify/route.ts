export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';

/**
 * GET /api/dev/db-electrify
 * Force tables electrification and return exact error logs on failure.
 * Preserves the original CALL error if all fallbacks fail.
 */
export async function GET() {
  const results: Record<string, { success: boolean; method: string; message: string; error?: any }> = {};
  const tables = ['admin_users', 'admin_credentials', 'lists', 'list_items', 'article_references'];

  for (const table of tables) {
    let success = false;
    let method = 'CALL electric.electrify';
    let message = '';
    let originalError: any = null;

    // Method A: CALL electric.electrify('table_name')
    try {
      await query(`CALL electric.electrify('${table}');`);
      success = true;
      message = '🔌 Table electrified successfully via CALL electric.electrify!';
    } catch (e: any) {
      originalError = {
        code: e.code,
        message: e.message,
        detail: e.detail,
        hint: e.hint
      };
    }

    // Method B: CALL electric.electrify('public.table_name')
    if (!success) {
      try {
        method = 'CALL electric.electrify (schema qualified)';
        await query(`CALL electric.electrify('public.${table}');`);
        success = true;
        message = '🔌 Table electrified successfully via CALL electric.electrify(public.table)!';
        originalError = null;
      } catch (e: any) {
        // Keep original error from Method A as the most descriptive
      }
    }

    // Method C: Fallback to ALTER TABLE
    if (!success) {
      try {
        method = 'ALTER TABLE';
        await query(`ALTER TABLE ${table} ENABLE ELECTRIC;`);
        success = true;
        message = '🔌 Table electrified successfully via ALTER TABLE ENABLE ELECTRIC!';
        originalError = null;
      } catch (e: any) {
        // Keep original error from Method A as the most descriptive
      }
    }

    results[table] = {
      success,
      method: success ? method : 'CALL electric.electrify',
      message: success ? message : (originalError?.message || 'Unknown error'),
      error: success ? null : originalError
    };
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    electrification: results
  });
}
