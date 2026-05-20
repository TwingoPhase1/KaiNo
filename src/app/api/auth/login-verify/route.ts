export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/server-db';
import { getCredentialById, updateCredentialCounter } from '@/lib/auth-db';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

export async function POST(request: Request) {
  try {
    const { rpId, origin, jwtSecret } = await getWebAuthnConfig();
    let body: any;
    
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body', details: parseError.message }, { status: 400 });
    }

    const cookieStore = await cookies();
    const challengeCookie = cookieStore.get('kaino-auth-challenge');
    if (!challengeCookie) {
      console.error('❌ Challenge cookie missing');
      return NextResponse.json({ error: 'Challenge expiré ou manquant' }, { status: 400 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(challengeCookie.value, jwtSecret);
    } catch (jwtError: any) {
      console.error('❌ Invalid JWT token:', jwtError);
      return NextResponse.json({ error: 'Token invalide ou expiré', details: jwtError.message }, { status: 400 });
    }

    const { challenge } = decoded;

    let credential: any;
    try {
      credential = await getCredentialById(body.id);
    } catch (dbCredError: any) {
      console.error('❌ Database error retrieving credential:', dbCredError);
      return NextResponse.json({ error: 'Erreur base de données (passkey)', details: dbCredError.message }, { status: 500 });
    }
    
    if (!credential) {
      console.error('❌ Credential not found');
      return NextResponse.json({ error: 'Passkey introuvable' }, { status: 401 });
    }

    let verification: any;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: challenge,
        expectedOrigin: origin,
        expectedRPID: rpId,
        credential: {
          id: credential.id,
          publicKey: Buffer.from(credential.public_key, 'base64url'),
          counter: credential.counter,
          transports: credential.transports as any[],
        },
      });
    } catch (verifyError: any) {
      console.error('❌ Passkey verification failed:', verifyError);
      return NextResponse.json({ error: 'Échec de la vérification du passkey', details: verifyError.message }, { status: 401 });
    }

    if (!verification.verified || !verification.authenticationInfo) {
      console.error('❌ Passkey not verified');
      return NextResponse.json({ error: 'Passkey non vérifié' }, { status: 401 });
    }

    const { newCounter } = verification.authenticationInfo;

    try {
      await updateCredentialCounter(credential.id, newCounter);
    } catch (updateError: any) {
      console.error('❌ Failed to update credential counter:', updateError);
      return NextResponse.json({ error: 'Erreur mise à jour passkey', details: updateError.message }, { status: 500 });
    }

    let user: any;
    try {
      const { rows } = await query('SELECT * FROM admin_users WHERE id = $1', [credential.user_id]);
      if (rows.length === 0) {
        console.error('❌ User not found');
        return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
      }
      user = rows[0];
    } catch (dbUserError: any) {
      console.error('❌ Database error retrieving user:', dbUserError);
      return NextResponse.json({ error: 'Erreur base de données (utilisateur)', details: dbUserError.message }, { status: 500 });
    }

    let token: string;
    try {
      token = jwt.sign(
        { id: user.id, username: user.username },
        jwtSecret,
        { expiresIn: '1d' }
      );
    } catch (jwtSignError: any) {
      console.error('❌ Failed to sign JWT:', jwtSignError);
      return NextResponse.json({ error: 'Erreur de création de session', details: jwtSignError.message }, { status: 500 });
    }

    try {
      cookieStore.set({
        name: 'kaino-admin-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      cookieStore.delete('kaino-auth-challenge');
    } catch (cookieError: any) {
      console.error('❌ Cookie error:', cookieError);
      return NextResponse.json({ error: 'Erreur de configuration du cookie', details: cookieError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Connexion réussie' });
  } catch (error: any) {
    console.error('❌ Unexpected error during login:', error);
    return NextResponse.json(
      { error: 'Erreur interne', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}
