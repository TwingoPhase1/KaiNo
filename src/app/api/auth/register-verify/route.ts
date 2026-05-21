export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/server-db';
import { createCredential, ensureAuthTables } from '@/lib/auth-db';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

export async function POST(request: Request) {
  try {
    const { rpId, origin, jwtSecret } = await getWebAuthnConfig();
    await ensureAuthTables();
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

    const { challenge, username, userId } = decoded;

    let verification: any;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: challenge,
        expectedOrigin: origin,
        expectedRPID: rpId,
      });
    } catch (verifyError: any) {
      console.error('❌ Passkey verification failed:', verifyError);
      return NextResponse.json({ error: 'Échec de la vérification du passkey', details: verifyError.message }, { status: 400 });
    }

    if (!verification.verified || !verification.registrationInfo) {
      console.error('❌ Passkey not verified');
      return NextResponse.json({ error: 'Passkey non vérifié' }, { status: 400 });
    }

    const { credential } = verification.registrationInfo;

    let finalUserId = userId;
    try {
      const { rows } = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
      if (rows.length === 0) {
        const createdAt = new Date().toISOString();
        await query(
          'INSERT INTO admin_users (id, username, password_hash, created_at) VALUES ($1, $2, $3, $4)',
          [userId, username, '', createdAt]
        );
      } else {
        finalUserId = rows[0].id;
      }
    } catch (dbUserError: any) {
      console.error('❌ Database error when checking/creating user:', dbUserError);
      return NextResponse.json({ error: 'Erreur base de données (utilisateur)', details: dbUserError.message }, { status: 500 });
    }

    try {
      const publicKeyBase64Url = Buffer.from(credential.publicKey).toString('base64url');
      await createCredential({
        id: credential.id,
        user_id: finalUserId,
        public_key: publicKeyBase64Url,
        counter: credential.counter,
        transports: body.response.transports || [],
      });
    } catch (dbCredError: any) {
      console.error('❌ Database error when creating credential:', dbCredError);
      return NextResponse.json({ error: 'Erreur base de données (passkey)', details: dbCredError.message }, { status: 500 });
    }

    let token: string;
    try {
      token = jwt.sign(
        { id: finalUserId, username },
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

    return NextResponse.json({ success: true, message: 'Passkey enregistré avec succès' });
  } catch (error: any) {
    console.error('❌ Unexpected error during passkey registration:', error);
    return NextResponse.json(
      { error: 'Erreur interne', details: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}
