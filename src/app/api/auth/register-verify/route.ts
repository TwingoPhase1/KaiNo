import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/server-db';
import { createCredential } from '@/lib/auth-db';

const JWT_SECRET = process.env.JWT_SECRET || 'kaino-default-secret-key-12345';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the challenge cookie
    const challengeCookie = cookies().get('kaino-auth-challenge');
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

    const { challenge, username, userId } = decoded;

    // Verify registration response
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Passkey verification failed' }, { status: 400 });
    }

    const { credential } = verification.registrationInfo;

    // Check if the user already exists in admin_users. If not, create them
    const { rows } = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
    let finalUserId = userId;

    if (rows.length === 0) {
      const createdAt = new Date().toISOString();
      await query(
        'INSERT INTO admin_users (id, username, password_hash, created_at) VALUES ($1, $2, $3, $4)',
        [userId, username, '', createdAt]
      );
    } else {
      finalUserId = rows[0].id;
    }

    // Store the credential in the database
    // Base64url encode the Uint8Array public key for simple database storage
    const publicKeyBase64Url = Buffer.from(credential.publicKey).toString('base64url');

    await createCredential({
      id: credential.id,
      user_id: finalUserId,
      public_key: publicKeyBase64Url,
      counter: credential.counter,
      transports: body.response.transports || [],
    });

    // Create session JWT
    const token = jwt.sign(
      { id: finalUserId, username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set secure HTTP-Only session cookie
    cookies().set({
      name: 'kaino-admin-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Clear challenge cookie
    cookies().delete('kaino-auth-challenge');

    return NextResponse.json({ success: true, message: 'Passkey registered successfully' });
  } catch (error: any) {
    console.error('Error during passkey registration verification:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
