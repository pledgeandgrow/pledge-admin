'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
  target?: number;
}

interface RevenueChartProps {
  data?: RevenueData[];
  title?: string;
  description?: string;
}

export function RevenueChart({ 
  data = [], 
  title = 'Revenue Overview',
  description = 'Monthly revenue performance'
}: RevenueChartProps) {
  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate growth rate (comparing last two months)
  const growthRate = data.length >= 2 
    ? ((data[data.length - 1].revenue - data[data.length - 2].revenue) / data[data.length - 2].revenue) * 100
    : 0;

  const isPositiveGrowth = growthRate >= 0;

  // Mock data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 55000 },
    { month: 'Jun', revenue: 67000, target: 60000 },
  ];

  // Find max value for scaling
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.revenue, d.target || 0))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className={`flex items-center gap-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(growthRate).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">${item.revenue.toLocaleString()}</span>
                </div>
                <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                  />
                  {item.target && (
                    <div
                      className="absolute inset-y-0 left-0 border-r-2 border-dashed border-gray-400"
                      style={{ left: `${(item.target / maxValue) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded" />
              <span>Actual Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border-r-2 border-dashed border-gray-400" />
              <span>Target</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
