export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';

/**
 * GET /api/dev/db-electrify
 * Force tables electrification and return exact error logs on failure.
 * Tries both 'ALTER TABLE ENABLE ELECTRIC' and 'SELECT electric.electrify(...)'
 */
export async function GET() {
  const results: Record<string, { success: boolean; method: string; message: string; error?: any }> = {};
  const tables = ['admin_users', 'admin_credentials', 'lists', 'list_items', 'article_references'];

  for (const table of tables) {
    let success = false;
    let method = 'ALTER TABLE';
    let message = '';
    let errorDetail: any = null;

    // Method A: ALTER TABLE ENABLE ELECTRIC
    try {
      await query(`ALTER TABLE ${table} ENABLE ELECTRIC;`);
      success = true;
      message = '🔌 Table electrified successfully via ALTER TABLE!';
    } catch (e: any) {
      errorDetail = {
        code: e.code,
        message: e.message,
        detail: e.detail
      };
    }

    // Method B: SELECT electric.electrify('table_name')
    if (!success) {
      try {
        method = 'SELECT electric.electrify';
        await query(`SELECT electric.electrify('${table}');`);
        success = true;
        message = '🔌 Table electrified successfully via SELECT electric.electrify!';
        errorDetail = null;
      } catch (e: any) {
        errorDetail = {
          code: e.code,
          message: e.message,
          detail: e.detail
        };
      }
    }

    // Method C: SELECT electric.electrify('public.table_name')
    if (!success) {
      try {
        method = 'SELECT electric.electrify (schema qualified)';
        await query(`SELECT electric.electrify('public.${table}');`);
        success = true;
        message = '🔌 Table electrified successfully via SELECT electric.electrify(public.table)!';
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
