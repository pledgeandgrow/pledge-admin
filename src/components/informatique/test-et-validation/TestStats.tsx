import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestStatsProps {
  stats: {
    total_count: number;
    pending_count: number;
    in_progress_count: number;
    passed_count: number;
    failed_count: number;
    completion_rate: number;
  };
}

export function TestStats({ stats }: TestStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{stats.total_count}</span>
          <span className="text-sm text-gray-500">Total des tests</span>
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-50">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-yellow-700">{stats.pending_count}</span>
          <span className="text-sm text-yellow-700">En attente</span>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-blue-700">{stats.in_progress_count}</span>
          <span className="text-sm text-blue-700">En cours</span>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-700">{stats.passed_count}</span>
          <span className="text-sm text-green-700">Réussis</span>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-red-700">{stats.failed_count}</span>
          <span className="text-sm text-red-700">Échoués</span>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-purple-700">{stats.completion_rate}%</span>
          <span className="text-sm text-purple-700">Taux de complétion</span>
        </CardContent>
      </Card>
    </div>
  );
}
