'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

interface DashboardStats {
  totalLeads: number;
  totalClients: number;
  pendingTasks: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastContact: string;
  amount: number;
}

const MOCK_STATS: DashboardStats = {
  totalLeads: 150,
  totalClients: 85,
  pendingTasks: 23,
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
  },
  // Add more mock clients as needed
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            New Lead
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            New Client
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Leads</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalLeads}</p>
          <div className="mt-2 text-sm text-green-600">+12% from last month</div>
        </Card>
        
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>
          <div className="mt-2 text-sm text-green-600">+5% from last month</div>
        </Card>
        
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Pending Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.pendingTasks}</p>
          <div className="mt-2 text-sm text-red-600">+3 from yesterday</div>
        </Card>
      </div>

      {/* Recent Clients */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Clients</h2>
        <Card className="p-6 shadow-md">
          <DataTable columns={columns} data={clients} />
        </Card>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card className="p-6 shadow-md">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">New client added: Acme Corp</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Today at 10:30 AM</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <svg className="h-5 w-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Invoice #12345 paid</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 3:45 PM</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Meeting scheduled with John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow at 9:00 AM</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
