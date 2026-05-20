import { headers } from 'next/headers';

/**
 * Resolves WebAuthn Relying Party configuration dynamically from the
 * incoming HTTP request headers. This eliminates the need for manual
 * RP_ID / ORIGIN environment variables — the app auto-adapts to any
 * domain (localhost, staging, production) without configuration.
 *
 * Priority order:
 *   1. Environment variables RP_ID / ORIGIN (explicit override)
 *   2. X-Forwarded-Host / X-Forwarded-Proto (reverse proxy / load balancer)
 *   3. Host header (direct access)
 *   4. Fallback: localhost / http://localhost:3000
 */
export async function getWebAuthnConfig() {
  const headerStore = await headers();

  // --- Resolve hostname (RP_ID) ---
  let rpId = process.env.RP_ID;
  if (!rpId) {
    // Prefer X-Forwarded-Host (set by reverse proxies like Nginx, Caddy, Cloudflare)
    const forwarded = headerStore.get('x-forwarded-host');
    const hostRaw = forwarded || headerStore.get('host');
    // Strip port number if present (e.g. "example.com:3000" → "example.com")
    rpId = hostRaw?.split(':')[0] || 'localhost';
  }

  // --- Resolve origin ---
  let origin = process.env.ORIGIN;
  if (!origin) {
    const proto = headerStore.get('x-forwarded-proto') || 'http';
    const forwarded = headerStore.get('x-forwarded-host');
    const hostRaw = forwarded || headerStore.get('host') || 'localhost:3000';
    origin = `${proto}://${hostRaw}`;
  }

  const rpName = process.env.RP_NAME || 'Kaino';
  const jwtSecret = process.env.JWT_SECRET || 'kaino-default-secret-key-12345';

  return { rpId, origin, rpName, jwtSecret };
}
