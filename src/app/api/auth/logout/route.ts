export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('kaino-admin-token');
    return NextResponse.json({ success: true, message: 'Déconnexion réussie' });
  } catch (error: any) {
    console.error('❌ Error during logout:', error);
    return NextResponse.json({ error: 'Erreur interne', details: error.message }, { status: 500 });
  }
}
