'use client';

import { useState } from 'react';
import { MegaMenu } from '@/components/layout/MegaMenu';
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
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

const MOCK_STATS: DashboardStats = {
  totalLeads: 150,
  totalClients: 85,
  pendingTasks: 23,
};

const MOCK_CLIENTS: Client[] = Array(5).fill(null).map((_, index) => ({
  id: `client-${index}`,
  name: 'Client Name',
  email: 'client@example.com',
  phone: '0123456789',
  company: 'Company Inc.',
  position: 'Manager',
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <MegaMenu />
      <main className="flex-1 p-8 ml-[32rem]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Tableau de bord
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Total Leads
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalLeads}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Total Clients
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalClients}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Pending Tasks
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.pendingTasks}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900">
                    <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sales Chart */}
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sales Chart
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  [Chart Placeholder]
                </span>
              </div>
            </div>
          </Card>

          {/* Client List */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Client List
              </h2>
              <DataTable
                columns={columns}
                data={clients}
                isLoading={isLoading}
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
