export type TestStatus = 'pending' | 'in_progress' | 'passed' | 'failed';

export interface TestCheckItem {
  id?: string;
  test_id: string;
  description: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Test {
  id?: string;
  title: string;
  description: string;
  status: TestStatus;
  project_id?: string;
  project_name?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  check_items?: TestCheckItem[];
}
