import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  // Whitelist allowed files to prevent directory traversal
  const allowedFiles = [
    'Swagat 3.0 Mobile - Merged (2).html',
    'CitizenVoice_WhatsApp_v1.html',
    'Admin Console - Standalone (1).html',
    'GMS_Officer_Portal_v2.html',
    'Gujarat_CM_Dashboard_v2.html',
    'Swagat 3.0 - Standalone (3).html',
  ];

  if (!allowedFiles.includes(file)) {
    return NextResponse.json({ error: 'File not allowed' }, { status: 403 });
  }

  try {
    const filePath = join(process.cwd(), 'public', file);
    const fileContent = readFileSync(filePath, 'utf-8');

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${file}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
