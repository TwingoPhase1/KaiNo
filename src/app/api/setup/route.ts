export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/lib/server-db';
import { ensureAuthTables } from '@/lib/auth-db';

/**
 * GET /api/setup
 * Checks if the system requires initial administrator setup.
 * This endpoint verifies the existence of records in the `admin_users` table
 * and dynamically initializes the database authentication tables if not present.
 * 
 * Returns { setup_required: true } if no admin users exist, prompting the setup flow.
 */
export async function GET() {
  try {
    console.log('🔍 Checking setup status...');
    await ensureAuthTables();

    console.log('🔍 Counting admin users...');
    const { rows } = await query('SELECT COUNT(*)::int as count FROM admin_users');
    const count = rows[0]?.count || 0;
    
    console.log('✅ Setup check complete. Admin users count:', count);
    return NextResponse.json({ setup_required: count === 0 });
  } catch (error: any) {
    console.error('❌ Error checking setup status:', error);
    return NextResponse.json(
      { error: 'Erreur vérification setup', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}

