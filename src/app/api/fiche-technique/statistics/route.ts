import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { Technology, TechnologyStatistics } from '@/components/informatique/fiche-technique/types';

const TECHNOLOGIES_FILE = path.join(process.cwd(), 'data', 'technologies.json');

const readTechnologies = (): Technology[] => {
  try {
    const data = fs.readFileSync(TECHNOLOGIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading technologies:', error);
    return [];
  }
};

// GET /api/fiche-technique/statistics
export async function GET() {
  try {
    const technologies = readTechnologies();
    
    const statistics: TechnologyStatistics = {
      total: technologies.length,
      frameworks: technologies.filter(t => t.type === 'framework').length,
      languages: technologies.filter(t => t.type === 'language').length,
      libraries: technologies.filter(t => t.type === 'library').length,
      tools: technologies.filter(t => t.type === 'tool').length,
      databases: technologies.filter(t => t.type === 'database').length,
      platforms: technologies.filter(t => t.type === 'platform').length,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error in GET /api/fiche-technique/statistics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
