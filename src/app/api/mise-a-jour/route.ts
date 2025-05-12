import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Update } from '@/components/informatique/mise-a-jour/types';

const UPDATES_FILE = path.join(process.cwd(), 'data', 'updates.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(UPDATES_FILE))) {
  fs.mkdirSync(path.dirname(UPDATES_FILE), { recursive: true });
}

// Ensure the file exists
if (!fs.existsSync(UPDATES_FILE)) {
  fs.writeFileSync(UPDATES_FILE, '[]', 'utf-8');
}

const readUpdates = (): Update[] => {
  try {
    const data = fs.readFileSync(UPDATES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading updates:', error);
    return [];
  }
};

const writeUpdates = (updates: Update[]) => {
  try {
    fs.writeFileSync(UPDATES_FILE, JSON.stringify(updates, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing updates:', error);
    throw error;
  }
};

// GET /api/mise-a-jour
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let updates = readUpdates();

    // Apply filters if present
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    if (type) {
      updates = updates.filter(update => update.type === type);
    }
    if (status) {
      updates = updates.filter(update => update.status === status);
    }
    if (priority) {
      updates = updates.filter(update => update.priority === priority);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      updates = updates.filter(update =>
        update.title.toLowerCase().includes(searchLower) ||
        update.description.toLowerCase().includes(searchLower) ||
        update.changelog.toLowerCase().includes(searchLower)
      );
    }

    // Sort by priority and date
    updates.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error in GET /api/mise-a-jour:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/mise-a-jour
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const updates = readUpdates();

    const newUpdate: Update = {
      ...data,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    updates.push(newUpdate);
    writeUpdates(updates);

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/mise-a-jour:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/mise-a-jour/[id]
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const data = await request.json();
    const updates = readUpdates();

    const index = updates.findIndex(update => update.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    const updatedUpdate: Update = {
      ...updates[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    updates[index] = updatedUpdate;
    writeUpdates(updates);

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error('Error in PATCH /api/mise-a-jour:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/mise-a-jour/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const updates = readUpdates();

    const index = updates.findIndex(update => update.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 });
    }

    updates.splice(index, 1);
    writeUpdates(updates);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/mise-a-jour:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
