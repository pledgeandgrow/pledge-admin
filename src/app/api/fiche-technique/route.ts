import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Technology } from '@/components/informatique/fiche-technique/types';

const TECHNOLOGIES_FILE = path.join(process.cwd(), 'data', 'technologies.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(TECHNOLOGIES_FILE))) {
  fs.mkdirSync(path.dirname(TECHNOLOGIES_FILE), { recursive: true });
}

// Ensure the file exists
if (!fs.existsSync(TECHNOLOGIES_FILE)) {
  fs.writeFileSync(TECHNOLOGIES_FILE, '[]', 'utf-8');
}

const readTechnologies = (): Technology[] => {
  try {
    const data = fs.readFileSync(TECHNOLOGIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading technologies:', error);
    return [];
  }
};

const writeTechnologies = (technologies: Technology[]) => {
  try {
    fs.writeFileSync(TECHNOLOGIES_FILE, JSON.stringify(technologies, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing technologies:', error);
    throw error;
  }
};

// GET /api/fiche-technique
export async function GET() {
  try {
    const technologies = readTechnologies();
    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Error in GET /api/fiche-technique:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/fiche-technique
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const technologies = readTechnologies();

    const newTechnology: Technology = {
      ...data,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    technologies.push(newTechnology);
    writeTechnologies(technologies);

    return NextResponse.json(newTechnology, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/fiche-technique:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/fiche-technique/[id]
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const data = await request.json();
    const technologies = readTechnologies();

    const index = technologies.findIndex(tech => tech.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    const updatedTechnology: Technology = {
      ...technologies[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    technologies[index] = updatedTechnology;
    writeTechnologies(technologies);

    return NextResponse.json(updatedTechnology);
  } catch (error) {
    console.error('Error in PATCH /api/fiche-technique:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/fiche-technique/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const technologies = readTechnologies();

    const index = technologies.findIndex(tech => tech.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    technologies.splice(index, 1);
    writeTechnologies(technologies);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/fiche-technique:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
