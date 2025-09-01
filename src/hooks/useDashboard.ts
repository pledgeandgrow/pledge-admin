'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/components/dashboard/ClientList';
import { Project } from '@/components/dashboard/ProjectsList';
import { Task } from '@/components/dashboard/TasksList';

// Mock data for now, will connect to Supabase later
const MOCK_STATS = {
  totalLeads: 150,
  totalClients: 85,
  pendingTasks: 23,
  completedProjects: 42,
};

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    company: 'Acme Inc',
    status: 'Active',
    lastContact: '2023-05-15',
    amount: 5000,
    source: 'Website',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    phone: '+33 6 98 76 54 32',
    company: 'Globex Corp',
    status: 'Pending',
    lastContact: '2023-06-10',
    amount: 7500,
    source: 'Referral',
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+33 6 45 67 89 01',
    company: 'Initech',
    status: 'Active',
    lastContact: '2023-06-18',
    amount: 3200,
    source: 'Social Media',
    priority: 'High',
  },
  {
    id: '4',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    phone: '+33 6 23 45 67 89',
    company: 'Soylent Corp',
    status: 'On Hold',
    lastContact: '2023-06-05',
    amount: 1500,
    source: 'Email Campaign',
    priority: 'Low',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+33 6 90 12 34 56',
    company: 'Umbrella Corp',
    status: 'Active',
    lastContact: '2023-06-20',
    amount: 9800,
    source: 'Website',
    priority: 'High',
  },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    client: 'Acme Inc',
    status: 'Active',
    deadline: '2023-09-30',
    progress: 65,
    budget: 12000,
    team: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: 'Globex Corp',
    status: 'On Hold',
    deadline: '2023-11-15',
    progress: 30,
    budget: 25000,
    team: ['Emma Wilson', 'David Chen', 'Lisa Brown', 'Tom Davis'],
  },
  {
    id: '3',
    name: 'Brand Identity',
    client: 'Initech',
    status: 'Completed',
    deadline: '2023-07-10',
    progress: 100,
    budget: 8500,
    team: ['Sarah Smith', 'Mike Johnson'],
  },
  {
    id: '4',
    name: 'SEO Optimization',
    client: 'Soylent Corp',
    status: 'Active',
    deadline: '2023-10-05',
    progress: 45,
    budget: 5000,
    team: ['John Doe', 'Lisa Brown'],
  },
  {
    id: '5',
    name: 'Content Marketing',
    client: 'Umbrella Corp',
    status: 'Active',
    deadline: '2023-12-20',
    progress: 15,
    budget: 7500,
    team: ['Emma Wilson', 'Tom Davis'],
  },
];

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalize homepage design',
    description: 'Complete the homepage mockup and get client approval',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-09-15',
    assignedTo: 'John Doe',
    project: 'Website Redesign',
    completed: false,
  },
  {
    id: '2',
    title: 'Set up API endpoints',
    description: 'Create RESTful API endpoints for the mobile app',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-09-20',
    assignedTo: 'Emma Wilson',
    project: 'Mobile App Development',
    completed: false,
  },
  {
    id: '3',
    title: 'Create logo variations',
    description: 'Design 3 variations of the logo for client review',
    status: 'completed',
    priority: 'medium',
    dueDate: '2023-07-05',
    assignedTo: 'Sarah Smith',
    project: 'Brand Identity',
    completed: true,
  },
  {
    id: '4',
    title: 'Keyword research',
    description: 'Identify top 20 keywords for SEO campaign',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-09-10',
    assignedTo: 'Lisa Brown',
    project: 'SEO Optimization',
    completed: false,
  },
  {
    id: '5',
    title: 'Content calendar',
    description: 'Create Q4 content calendar for blog and social media',
    status: 'pending',
    priority: 'low',
    dueDate: '2023-09-25',
    assignedTo: 'Tom Davis',
    project: 'Content Marketing',
    completed: false,
  },
  {
    id: '6',
    title: 'Client meeting',
    description: 'Weekly progress meeting with Acme Inc',
    status: 'pending',
    priority: 'high',
    dueDate: '2023-09-12',
    assignedTo: 'John Doe',
    project: 'Website Redesign',
    completed: false,
  },
];

export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In the future, this will be replaced with actual Supabase calls
        // const { data: statsData, error: statsError } = await supabase.from('stats').select('*');
        // if (statsError) throw new Error(statsError.message);
        
        // const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
        // if (clientsError) throw new Error(clientsError.message);
        
        // etc...
        
        setStats(MOCK_STATS);
        setClients(MOCK_CLIENTS);
        setProjects(MOCK_PROJECTS);
        setTasks(MOCK_TASKS);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      // In the future, this will update the task in Supabase
      // await supabase.from('tasks').update({ completed }).eq('id', taskId);
      
      // For now, just update the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed, status: completed ? 'completed' : 'in_progress' } 
            : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return {
    isLoading,
    error,
    stats,
    clients,
    projects,
    tasks,
    toggleTaskCompletion,
  };
}
