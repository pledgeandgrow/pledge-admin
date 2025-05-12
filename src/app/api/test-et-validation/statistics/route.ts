import { NextResponse } from 'next/server';
import { TestCase, TestStatistics } from '@/components/informatique/test-et-validation/types';
import fs from 'fs';
import path from 'path';

const testsFile = path.join(process.cwd(), 'data', 'tests.json');

function readTests(): TestCase[] {
  if (!fs.existsSync(testsFile)) {
    return [];
  }
  const fileContent = fs.readFileSync(testsFile, 'utf-8');
  return JSON.parse(fileContent);
}

export async function GET() {
  try {
    const tests = readTests();
    
    const statistics: TestStatistics = {
      total: tests.length,
      by_type: {
        unit: 0,
        integration: 0,
        e2e: 0,
        performance: 0,
        security: 0,
        accessibility: 0,
        other: 0,
      },
      by_status: {
        draft: 0,
        in_progress: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
      },
      by_priority: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      by_environment: {
        development: 0,
        staging: 0,
        production: 0,
      },
      success_rate: 0,
      average_execution_time: 0,
    };

    let totalExecutionTime = 0;
    let executedTests = 0;
    let passedTests = 0;

    tests.forEach(test => {
      // Count by type
      statistics.by_type[test.type]++;

      // Count by status
      statistics.by_status[test.status]++;

      // Count by priority
      statistics.by_priority[test.priority]++;

      // Count by environment
      statistics.by_environment[test.environment]++;

      // Calculate execution statistics
      if (test.execution_time) {
        totalExecutionTime += test.execution_time;
        executedTests++;
      }

      // Count passed tests
      if (test.status === 'passed') {
        passedTests++;
      }
    });

    // Calculate success rate
    const totalCompletedTests = statistics.by_status.passed + statistics.by_status.failed;
    statistics.success_rate = totalCompletedTests > 0
      ? Math.round((passedTests / totalCompletedTests) * 100)
      : 0;

    // Calculate average execution time
    statistics.average_execution_time = executedTests > 0
      ? Math.round(totalExecutionTime / executedTests)
      : 0;

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error in GET /api/test-et-validation/statistics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
