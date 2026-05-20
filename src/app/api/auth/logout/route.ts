import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().delete('kaino-admin-token');
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
