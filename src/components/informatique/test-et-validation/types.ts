export type TestType = 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'accessibility' | 'other';
export type TestStatus = 'draft' | 'in_progress' | 'passed' | 'failed' | 'blocked' | 'skipped';
export type TestPriority = 'low' | 'medium' | 'high' | 'critical';
export type TestEnvironment = 'development' | 'staging' | 'production';

export interface TestStep {
  id: string;
  description: string;
  expected_result: string;
  actual_result?: string;
  status: 'passed' | 'failed' | 'pending';
  notes?: string;
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  project: string;
  status: "passed" | "failed" | "in_progress" | "pending";
  type: string;
  priority: "low" | "medium" | "high" | "critical";
  environment: string;
  assignee: string;
  created_at: string;
  updated_at?: string;
  due_date: string;
  progress: number;
  steps: TestStep[];
  attachments?: Attachment[];
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  type: TestType;
  status: TestStatus;
  priority: TestPriority;
  environment: TestEnvironment;
  project_id?: string;
  project_name?: string;
  prerequisites: string[];
  steps: TestStep[];
  expected_results: string[];
  actual_results?: string[];
  assigned_to?: string[];
  related_components: string[];
  created_at: string;
  updated_at: string;
  executed_at?: string;
  execution_time?: number; // in seconds
  attachments?: string[];
  tags?: string[];
  version?: string;
  notes?: string;
  completion_percentage?: number;
}

export interface TestStatistics {
  total: number;
  by_type: {
    unit: number;
    integration: number;
    e2e: number;
    performance: number;
    security: number;
    accessibility: number;
    other: number;
  };
  by_status: {
    draft: number;
    in_progress: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  by_environment: {
    development: number;
    staging: number;
    production: number;
  };
  success_rate: number; // percentage of passed tests
  average_execution_time: number; // in seconds
}

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  status: string;
  client: string;
  start_date: string;
  end_date?: string;
}
