import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { SpecificationType, SpecificationStatisticsType } from '@/components/informatique/cahier-des-charges/types';
import * as fs from 'fs';
import * as path from 'path';

const SPECIFICATIONS_FILE = path.join(process.cwd(), 'data', 'cahier-des-charges.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(SPECIFICATIONS_FILE))) {
  fs.mkdirSync(path.dirname(SPECIFICATIONS_FILE), { recursive: true });
}

// Ensure the specifications file exists
if (!fs.existsSync(SPECIFICATIONS_FILE)) {
  fs.writeFileSync(SPECIFICATIONS_FILE, '[]', 'utf-8');
}

// Helper functions
const readSpecifications = (): SpecificationType[] => {
  try {
    const data = fs.readFileSync(SPECIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading specifications:', error);
    return [];
  }
};

const writeSpecifications = (specifications: SpecificationType[]) => {
  try {
    fs.writeFileSync(SPECIFICATIONS_FILE, JSON.stringify(specifications, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing specifications:', error);
    throw new Error('Failed to write specifications');
  }
};

// GET /api/specifications
export async function GET() {
  try {
    const specifications = readSpecifications();
    return NextResponse.json(specifications);
  } catch (error) {
    console.error('Error in GET /api/specifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/specifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const specifications = readSpecifications();
    const newSpecification: SpecificationType = {
      id: uuidv4(),
      title,
      content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    specifications.push(newSpecification);
    writeSpecifications(specifications);

    return NextResponse.json(newSpecification, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/specifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/specifications/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const body = await request.json();
    const { title, content, status } = body;

    const specifications = readSpecifications();
    const specificationIndex = specifications.findIndex((s) => s.id === id);

    if (specificationIndex === -1) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    const updatedSpecification = {
      ...specifications[specificationIndex],
      ...(title && { title }),
      ...(content && { content }),
      ...(status && { status }),
      updatedAt: new Date().toISOString(),
    };

    specifications[specificationIndex] = updatedSpecification;
    writeSpecifications(specifications);

    return NextResponse.json(updatedSpecification);
  } catch (error) {
    console.error('Error in PATCH /api/specifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/specifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const specifications = readSpecifications();
    const specificationIndex = specifications.findIndex((s) => s.id === id);

    if (specificationIndex === -1) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }

    specifications.splice(specificationIndex, 1);
    writeSpecifications(specifications);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/specifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/cahier-des-charges/statistics
export async function GETStatistics() {
  try {
    const specifications = readSpecifications();
    
    const statistics: SpecificationStatisticsType = {
      total: specifications.length,
      draft: specifications.filter(s => s.status === 'draft').length,
      review: specifications.filter(s => s.status === 'review').length,
      approved: specifications.filter(s => s.status === 'approved').length,
      archived: specifications.filter(s => s.status === 'archived').length,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error in GET /api/cahier-des-charges/statistics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
