export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

export async function GET() {
  try {
    const { jwtSecret } = await getWebAuthnConfig();

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('kaino-admin-token');
    if (!tokenCookie) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const decoded = jwt.verify(tokenCookie.value, jwtSecret) as any;
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id,
          username: decoded.username,
        },
      });
    } catch (err) {
      return NextResponse.json({ authenticated: false });
    }
  } catch (error: any) {
    console.error('❌ Error checking auth status:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
