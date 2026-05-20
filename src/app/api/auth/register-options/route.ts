export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

export async function GET(request: Request) {
  try {
    const { rpId, rpName, jwtSecret } = await getWebAuthnConfig();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'Admin';

    const userId = crypto.randomUUID();

    let options: any;
    try {
      options = await generateRegistrationOptions({
        rpName,
        rpID: rpId,
        userID: new TextEncoder().encode(userId),
        userName: username,
        userDisplayName: username,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
      });
    } catch (webauthnError: any) {
      console.error('❌ Failed to generate registration options:', webauthnError);
      return NextResponse.json({ error: 'Erreur génération options passkey', details: webauthnError.message }, { status: 500 });
    }

    let challengeToken: string;
    try {
      challengeToken = jwt.sign(
        { challenge: options.challenge, username, userId },
        jwtSecret,
        { expiresIn: '5m' }
      );
    } catch (jwtSignError: any) {
      console.error('❌ Failed to sign JWT challenge token:', jwtSignError);
      return NextResponse.json({ error: 'Erreur génération token', details: jwtSignError.message }, { status: 500 });
    }

    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'kaino-auth-challenge',
        value: challengeToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 300,
        path: '/',
      });
    } catch (cookieError: any) {
      console.error('❌ Cookie error:', cookieError);
      return NextResponse.json({ error: 'Erreur configuration cookie', details: cookieError.message }, { status: 500 });
    }

    return NextResponse.json(options);
  } catch (error: any) {
    console.error('❌ Unexpected error in register-options:', error);
    return NextResponse.json(
      { error: 'Erreur interne', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}
