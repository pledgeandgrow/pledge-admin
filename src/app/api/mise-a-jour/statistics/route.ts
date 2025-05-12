import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { Update, UpdateStatistics } from '@/components/informatique/mise-a-jour/types';

const UPDATES_FILE = path.join(process.cwd(), 'data', 'updates.json');

const readUpdates = (): Update[] => {
  try {
    const data = fs.readFileSync(UPDATES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading updates:', error);
    return [];
  }
};

// GET /api/mise-a-jour/statistics
export async function GET() {
  try {
    const updates = readUpdates();
    
    const statistics: UpdateStatistics = {
      total: updates.length,
      by_type: {
        feature: updates.filter(u => u.type === 'feature').length,
        bugfix: updates.filter(u => u.type === 'bugfix').length,
        security: updates.filter(u => u.type === 'security').length,
        performance: updates.filter(u => u.type === 'performance').length,
        documentation: updates.filter(u => u.type === 'documentation').length,
        other: updates.filter(u => u.type === 'other').length,
      },
      by_status: {
        planned: updates.filter(u => u.status === 'planned').length,
        in_progress: updates.filter(u => u.status === 'in_progress').length,
        completed: updates.filter(u => u.status === 'completed').length,
        cancelled: updates.filter(u => u.status === 'cancelled').length,
      },
      by_priority: {
        low: updates.filter(u => u.priority === 'low').length,
        medium: updates.filter(u => u.priority === 'medium').length,
        high: updates.filter(u => u.priority === 'high').length,
        critical: updates.filter(u => u.priority === 'critical').length,
      },
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error in GET /api/mise-a-jour/statistics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
