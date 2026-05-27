export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';

/**
 * GET /api/dev/db-status
 * Diagnostics endpoint to inspect the server-side PostgreSQL database state.
 */
export async function GET() {
  try {
    // 1. Check all public tables
    const tablesRes = await query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    const tables = tablesRes.rows.map(r => r.tablename);

    // 2. Check for the existence of the 'electric' schema
    const schemaRes = await query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'electric'
    `);
    const hasElectricSchema = schemaRes.rows.length > 0;

    // 3. Check for electrification triggers on Kaino tables
    const triggersRes = await query(`
      SELECT trigger_name, event_manipulation, event_object_table 
      FROM information_schema.triggers 
      WHERE event_object_table IN ('lists', 'list_items', 'admin_users', 'article_references')
    `);
    const triggers = triggersRes.rows.map(r => ({
      triggerName: r.trigger_name,
      table: r.event_object_table,
      event: r.event_manipulation
    }));

    // 4. Query counts of Kaino tables if they exist
    const counts: Record<string, number> = {};
    const tableChecks = ['admin_users', 'lists', 'list_items', 'article_references'];
    for (const table of tableChecks) {
      if (tables.includes(table)) {
        try {
          const countRes = await query(`SELECT COUNT(*)::int as count FROM ${table}`);
          counts[table] = countRes.rows[0]?.count || 0;
        } catch (e: any) {
          counts[table] = -1; // Error querying
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        tables,
        hasElectricSchema,
        triggers,
        counts
      }
    });

  } catch (error: any) {
    console.error('❌ Database diagnostics failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.detail,
      code: error.code
    }, { status: 500 });
  }
}
