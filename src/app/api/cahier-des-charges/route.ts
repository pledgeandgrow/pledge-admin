import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { SpecificationType } from '@/components/informatique/cahier-des-charges/types';
import { readSpecifications, writeSpecifications } from './utils';

// GET /api/cahier-des-charges
export async function GET() {
  try {
    const specifications = readSpecifications();
    return NextResponse.json(specifications);
  } catch (error) {
    console.error('Error in GET /api/cahier-des-charges:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/cahier-des-charges
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
    console.error('Error in POST /api/cahier-des-charges:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


