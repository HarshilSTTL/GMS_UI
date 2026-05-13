import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'notification-templates.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const templates = JSON.parse(data);

    const newTemplate = {
      id: `n${Date.now()}`,
      name: body.name,
      event: body.event,
      channels: body.channels || [],
      content: body.content,
      active: body.active ?? true,
    };

    templates.templates.push(newTemplate);
    await writeFile(DATA_FILE, JSON.stringify(templates, null, 2));

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const templates = JSON.parse(data);

    const index = templates.templates.findIndex((t: any) => t.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    templates.templates[index] = { ...templates.templates[index], ...body };
    await writeFile(DATA_FILE, JSON.stringify(templates, null, 2));

    return NextResponse.json(templates.templates[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await readFile(DATA_FILE, 'utf-8');
    const templates = JSON.parse(data);

    templates.templates = templates.templates.filter((t: any) => t.id !== id);
    await writeFile(DATA_FILE, JSON.stringify(templates, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
