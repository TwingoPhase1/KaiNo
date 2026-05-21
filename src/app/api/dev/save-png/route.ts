import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * POST /api/dev/save-png
 * Development-only endpoint to save client-generated PNG icons into the public directory.
 * This is crucial for PWA compliance without introducing massive heavy native image libraries.
 */
export async function POST(request: Request) {
  // Enforce development-only safety guard
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Forbidden: Development only' }, { status: 403 });
  }

  try {
    const { filename, data } = await request.json();
    if (!filename || !data) {
      return NextResponse.json({ error: 'Bad Request: Missing filename or data' }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal attacks
    const sanitizedFilename = path.basename(filename);
    if (!sanitizedFilename || sanitizedFilename === '.' || sanitizedFilename === '..') {
      return NextResponse.json({ error: 'Bad Request: Invalid filename' }, { status: 400 });
    }

    // Extract the raw base64 data from the canvas Data URL
    // Format: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
    const base64Data = data.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the PNG file to the public directory
    const publicPath = path.join(process.cwd(), 'public', sanitizedFilename);
    fs.writeFileSync(publicPath, buffer);

    console.log(`[PWA Dev Tool] Successfully saved PNG icon to ${publicPath}`);
    return NextResponse.json({ success: true, message: `Saved ${sanitizedFilename} successfully` });
  } catch (error: any) {
    console.error('❌ [PWA Dev Tool] Failed to save base64 PNG icon:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
