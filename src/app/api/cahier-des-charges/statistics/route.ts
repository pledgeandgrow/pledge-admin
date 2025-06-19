import { NextResponse } from 'next/server';
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

// Helper function to read specifications
const readSpecifications = (): SpecificationType[] => {
  try {
    const data = fs.readFileSync(SPECIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading specifications:', error);
    return [];
  }
};

// GET /api/cahier-des-charges/statistics
export async function GET() {
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
