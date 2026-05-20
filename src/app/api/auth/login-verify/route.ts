export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/server-db';
import { getCredentialById, updateCredentialCounter } from '@/lib/auth-db';

const JWT_SECRET = process.env.JWT_SECRET || 'kaino-default-secret-key-12345';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the challenge cookie
    const cookieStore = await cookies();
    const challengeCookie = cookieStore.get('kaino-auth-challenge');
    if (!challengeCookie) {
      return NextResponse.json({ error: 'Authentication challenge expired or missing' }, { status: 400 });
    }

    // Verify and decode challenge token
    let decoded: any;
    try {
      decoded = jwt.verify(challengeCookie.value, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid challenge token' }, { status: 400 });
    }

    const { challenge } = decoded;

    // Retrieve credential by ID from database
    const credential = await getCredentialById(body.id);
    if (!credential) {
      return NextResponse.json({ error: 'Credential not found in database' }, { status: 401 });
    }

    // Verify assertion response
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: credential.id,
        publicKey: Buffer.from(credential.public_key, 'base64url'),
        counter: credential.counter,
        transports: credential.transports as any[],
      },
    });

    if (!verification.verified || !verification.authenticationInfo) {
      return NextResponse.json({ error: 'Passkey verification failed' }, { status: 401 });
    }

    const { newCounter } = verification.authenticationInfo;

    // Update credential counter
    await updateCredentialCounter(credential.id, newCounter);

    // Retrieve user information to generate session JWT
    const { rows } = await query('SELECT * FROM admin_users WHERE id = $1', [credential.user_id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User associated with passkey not found' }, { status: 404 });
    }

    const user = rows[0];

    // Create session JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set secure HTTP-Only session cookie
    cookieStore.set({
      name: 'kaino-admin-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Clear challenge cookie
    cookieStore.delete('kaino-auth-challenge');

    return NextResponse.json({ success: true, message: 'Authenticated successfully' });
  } catch (error: any) {
    console.error('Error during login verification:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
