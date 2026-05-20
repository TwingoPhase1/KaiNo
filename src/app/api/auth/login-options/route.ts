export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

export async function GET() {
  try {
    const { rpId, jwtSecret } = await getWebAuthnConfig();

    let options: any;
    try {
      options = await generateAuthenticationOptions({
        rpID: rpId,
        userVerification: 'preferred',
      });
    } catch (webauthnError: any) {
      console.error('❌ Failed to generate login options:', webauthnError);
      return NextResponse.json({ error: 'Erreur génération options de connexion', details: webauthnError.message }, { status: 500 });
    }

    let challengeToken: string;
    try {
      challengeToken = jwt.sign(
        { challenge: options.challenge },
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
    console.error('❌ Unexpected error in login-options:', error);
    return NextResponse.json(
      { error: 'Erreur interne', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}
