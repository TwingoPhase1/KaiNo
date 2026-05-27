export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';

/**
 * GET /api/dev/db-electrify
 * Force tables electrification and return exact error logs on failure.
 * Tries CALL electric.electrify('table') procedure syntax.
 */
export async function GET() {
  const results: Record<string, { success: boolean; method: string; message: string; error?: any }> = {};
  const tables = ['admin_users', 'admin_credentials', 'lists', 'list_items', 'article_references'];

  for (const table of tables) {
    let success = false;
    let method = 'CALL electric.electrify';
    let message = '';
    let errorDetail: any = null;

    // Method A: CALL electric.electrify('table_name')
    try {
      await query(`CALL electric.electrify('${table}');`);
      success = true;
      message = '🔌 Table electrified successfully via CALL electric.electrify!';
    } catch (e: any) {
      errorDetail = {
        code: e.code,
        message: e.message,
        detail: e.detail
      };
    }

    // Method B: CALL electric.electrify('public.table_name')
    if (!success) {
      try {
        method = 'CALL electric.electrify (schema qualified)';
        await query(`CALL electric.electrify('public.${table}');`);
        success = true;
        message = '🔌 Table electrified successfully via CALL electric.electrify(public.table)!';
        errorDetail = null;
      } catch (e: any) {
        errorDetail = {
          code: e.code,
          message: e.message,
          detail: e.detail
        };
      }
    }

    // Method C: Fallback to ALTER TABLE
    if (!success) {
      try {
        method = 'ALTER TABLE';
        await query(`ALTER TABLE ${table} ENABLE ELECTRIC;`);
        success = true;
        message = '🔌 Table electrified successfully via ALTER TABLE ENABLE ELECTRIC!';
        errorDetail = null;
      } catch (e: any) {
        errorDetail = {
          code: e.code,
          message: e.message,
          detail: e.detail
        };
      }
    }

    results[table] = {
      success,
      method,
      message: success ? message : (errorDetail?.message || 'Unknown error'),
      error: errorDetail
    };
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    electrification: results
  });
}
