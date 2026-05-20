export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDefaultLanguage, setDefaultLanguage } from '@/lib/settings-db';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';

const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'de', 'it'];

/**
 * GET /api/settings
 * Public route to retrieve the default server language.
 */
export async function GET() {
  try {
    const defaultLanguage = await getDefaultLanguage();
    return NextResponse.json({ default_language: defaultLanguage });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

/**
 * POST /api/settings
 * Authenticated admin route to update the default server language.
 */
export async function POST(request: Request) {
  try {
    const { jwtSecret } = await getWebAuthnConfig();

    // 1. Authenticate administrative session via JWT cookie
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('kaino-admin-token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    try {
      jwt.verify(tokenCookie.value, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session token' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { default_language } = body;

    if (!default_language) {
      return NextResponse.json({ error: 'Missing default_language parameter' }, { status: 400 });
    }

    if (!SUPPORTED_LANGUAGES.includes(default_language)) {
      return NextResponse.json(
        { error: `Unsupported language. Allowed values are: ${SUPPORTED_LANGUAGES.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Save to database
    await setDefaultLanguage(default_language);

    return NextResponse.json({
      success: true,
      default_language,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
