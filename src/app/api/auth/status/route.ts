import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'kaino-default-secret-key-12345';

export async function GET() {
  try {
    const tokenCookie = cookies().get('kaino-admin-token');
    if (!tokenCookie) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as any;
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
    console.error('Error checking auth status:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
