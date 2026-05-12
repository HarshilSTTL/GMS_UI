import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'escalation-rules.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read escalation rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const rules = JSON.parse(data);

    const newRule = {
      id: `e${Date.now()}`,
      name: body.name,
      trigger: body.trigger,
      level: body.level,
      targetRole: body.targetRole,
      notifyVia: body.notifyVia || [],
      autoActions: body.autoActions || [],
      active: body.active ?? true,
    };

    rules.rules.push(newRule);
    await writeFile(DATA_FILE, JSON.stringify(rules, null, 2));

    return NextResponse.json(newRule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const rules = JSON.parse(data);

    const index = rules.rules.findIndex((r: any) => r.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Rule not found' }, { status: 404 });

    rules.rules[index] = { ...rules.rules[index], ...body };
    await writeFile(DATA_FILE, JSON.stringify(rules, null, 2));

    return NextResponse.json(rules.rules[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await readFile(DATA_FILE, 'utf-8');
    const rules = JSON.parse(data);

    rules.rules = rules.rules.filter((r: any) => r.id !== id);
    await writeFile(DATA_FILE, JSON.stringify(rules, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
}
