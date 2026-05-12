import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'workflows.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read workflows' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const workflows = JSON.parse(data);

    const newWorkflow = {
      id: `w${Date.now()}`,
      name: body.name,
      category: body.category,
      active: body.active ?? true,
      steps: body.steps || [],
      createdAt: new Date().toISOString(),
    };

    workflows.workflows.push(newWorkflow);
    await writeFile(DATA_FILE, JSON.stringify(workflows, null, 2));

    return NextResponse.json(newWorkflow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const workflows = JSON.parse(data);

    const index = workflows.workflows.findIndex((w: any) => w.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });

    workflows.workflows[index] = { ...workflows.workflows[index], ...body };
    await writeFile(DATA_FILE, JSON.stringify(workflows, null, 2));

    return NextResponse.json(workflows.workflows[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await readFile(DATA_FILE, 'utf-8');
    const workflows = JSON.parse(data);

    workflows.workflows = workflows.workflows.filter((w: any) => w.id !== id);
    await writeFile(DATA_FILE, JSON.stringify(workflows, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}
