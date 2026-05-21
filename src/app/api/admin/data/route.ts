export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/server-db';
import { getWebAuthnConfig } from '@/lib/get-webauthn-config';
import { isSystemAdmin } from '@/lib/auth-check';

/**
 * GET /api/admin/data
 * Secure API endpoint to fetch PostgreSQL server-side statistics, users, shopping lists, and articles.
 * Strictly restricted to the primary System Administrator.
 */
export async function GET() {
  try {
    const { jwtSecret } = await getWebAuthnConfig();

    // 1. Authenticate JWT session
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('kaino-admin-token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized: Session cookie missing' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(tokenCookie.value, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Session invalid or expired' }, { status: 401 });
    }

    const userId = decoded.id;

    // 2. Validate System Admin privilege
    const isAdmin = await isSystemAdmin(userId);
    if (!isAdmin) {
      console.warn(`⚠️ Security Alert: Unauthorized access attempt to /api/admin/data by user ID ${userId} (${decoded.username})`);
      return NextResponse.json({ error: 'Forbidden: You do not have administrator privileges on this server' }, { status: 403 });
    }

    // 3. Query PostgreSQL directly to gather fresh metrics
    const [
      usersCountRes,
      listsCountRes,
      itemsCountRes,
      articlesCountRes,
      usersListRes,
      listsListRes,
      itemsListRes,
      articlesListRes
    ] = await Promise.all([
      query('SELECT COUNT(*)::int as count FROM admin_users'),
      query('SELECT COUNT(*)::int as count FROM lists'),
      query('SELECT COUNT(*)::int as count FROM list_items'),
      query('SELECT COUNT(*)::int as count FROM article_references'),
      query('SELECT id, username, created_at FROM admin_users ORDER BY created_at DESC'),
      query('SELECT id, name, created_at FROM lists ORDER BY created_at DESC'),
      query('SELECT id, list_id, is_checked FROM list_items'),
      query('SELECT id, article_name, last_price, suggested_category, updated_at FROM article_references ORDER BY updated_at DESC')
    ]);

    const stats = {
      users: usersCountRes.rows[0].count,
      lists: listsCountRes.rows[0].count,
      items: itemsCountRes.rows[0].count,
      articles: articlesCountRes.rows[0].count
    };

    // Determine the primary system admin ID (the oldest registered user)
    let adminId = '';
    const rawUsers = usersListRes.rows;
    if (rawUsers.length > 0) {
      const sorted = [...rawUsers].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      adminId = sorted[0].id;
    }

    // Map users with isAdmin flag
    const users = rawUsers.map((u: any) => ({
      id: u.id,
      username: u.username,
      createdAt: new Date(u.created_at),
      isAdmin: u.id === adminId
    }));

    // Map lists with aggregate totals
    const items = itemsListRes.rows;
    const shoppingLists = listsListRes.rows.map((l: any) => {
      const listItems = items.filter((i: any) => i.list_id === l.id);
      const completed = listItems.filter((i: any) => i.is_checked === true).length;
      return {
        id: l.id,
        name: l.name,
        shareId: l.id,
        createdBy: l.id === adminId ? 'admin' : 'collaborator',
        createdAt: new Date(l.created_at),
        totalItems: listItems.length,
        completedItems: completed
      };
    });

    // Map articles
    const articles = articlesListRes.rows.map((a: any) => ({
      id: a.id,
      name: a.article_name,
      lastPrice: a.last_price,
      category: a.suggested_category,
      lastSeen: new Date(a.updated_at),
      createdAt: new Date(a.updated_at),
      frequency: 1
    }));

    return NextResponse.json({
      success: true,
      stats,
      users,
      shoppingLists,
      articles
    });

  } catch (error: any) {
    console.error('❌ Failed to retrieve admin dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/data
 * Secure API endpoint to delete database objects (users, lists, articles) directly on the PostgreSQL server.
 * Strictly restricted to the primary System Administrator.
 */
export async function DELETE(request: Request) {
  try {
    const { jwtSecret } = await getWebAuthnConfig();

    // 1. Authenticate JWT session
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('kaino-admin-token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Unauthorized: Session cookie missing' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(tokenCookie.value, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Session invalid or expired' }, { status: 401 });
    }

    const userId = decoded.id;

    // 2. Validate System Admin privilege
    const isAdmin = await isSystemAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Bad Request: Missing type or id parameters' }, { status: 400 });
    }

    // 4. Perform target deletion
    if (type === 'user') {
      // Security check: system administrator cannot delete their own account
      const { rows } = await query('SELECT id FROM admin_users ORDER BY created_at ASC LIMIT 1');
      if (rows.length > 0 && rows[0].id === id) {
        return NextResponse.json({ error: 'Forbidden: You cannot delete the primary System Administrator account.' }, { status: 403 });
      }

      await query('DELETE FROM admin_users WHERE id = $1', [id]);
      console.log(`🗑️ Admin successfully deleted user account ${id}`);

    } else if (type === 'list') {
      await query('DELETE FROM lists WHERE id = $1', [id]);
      console.log(`🗑️ Admin successfully deleted shopping list ${id}`);

    } else if (type === 'article') {
      await query('DELETE FROM article_references WHERE id = $1', [id]);
      console.log(`🗑️ Admin successfully deleted NLP reference article ${id}`);

    } else {
      return NextResponse.json({ error: 'Bad Request: Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Resource successfully deleted' });

  } catch (error: any) {
    console.error('❌ Failed to execute admin deletion:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
