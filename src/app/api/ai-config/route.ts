import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'data', 'ai-config.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const config = JSON.parse(data);

    // Calculate stats
    const activeFeatures = config.features.filter((f: any) => f.active).length;
    const totalFeatures = config.features.length;
    const avgConfidence = config.stats?.avgConfidence || 0;

    return NextResponse.json({
      features: config.features,
      stats: {
        activeFeatures,
        totalFeatures,
        apiCallsToday: config.stats?.apiCallsToday || 0,
        costToday: config.stats?.costToday || 0,
        avgConfidence,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read AI config' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readFile(DATA_FILE, 'utf-8');
    const config = JSON.parse(data);

    // Handle bulk save (all features)
    if (body.action === 'save' && body.features) {
      config.features = body.features;
      await writeFile(DATA_FILE, JSON.stringify(config, null, 2));
      return NextResponse.json({ success: true });
    }

    // Handle single feature update
    const index = config.features.findIndex((f: any) => f.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Feature not found' }, { status: 404 });

    config.features[index] = { ...config.features[index], active: body.active, threshold: body.threshold };
    await writeFile(DATA_FILE, JSON.stringify(config, null, 2));

    return NextResponse.json(config.features[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update AI feature' }, { status: 500 });
  }
}
