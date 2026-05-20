import { NextResponse } from 'next/server';
import { parseShoppingItem } from '@/lib/parser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input_string } = body;

    if (input_string === undefined) {
      return NextResponse.json({ error: 'input_string is required' }, { status: 400 });
    }

    const parsed = parseShoppingItem(input_string);

    return NextResponse.json({
      name: parsed.name,
      quantity: parsed.quantity,
      price: parsed.price || null,
      assigned_to: parsed.assignedTo || null,
    });
  } catch (error: any) {
    console.error('Error in parsing endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
