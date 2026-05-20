export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'kaino-default-secret-key-12345';
const RP_ID = process.env.RP_ID || 'localhost';

export async function GET() {
  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: 'preferred',
    });

    // Store the challenge in a short-lived secure JWT cookie
    const challengeToken = jwt.sign(
      { challenge: options.challenge },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'kaino-auth-challenge',
      value: challengeToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300, // 5 minutes
      path: '/',
    });

    return NextResponse.json(options);
  } catch (error: any) {
    console.error('Error generating login options:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
