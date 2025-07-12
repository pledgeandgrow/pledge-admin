import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Test } from './types';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TestCardProps {
  test: Test;
  onClick: () => void;
}

export function TestCard({ test, onClick }: TestCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
    passed: 'bg-green-100 text-green-800 border-green-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  const completedItems = test.check_items?.filter(item => item.is_completed).length || 0;
  const totalItems = test.check_items?.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
        statusColors[test.status].split(' ')[0].replace('bg-', 'border-')
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{test.title}</CardTitle>
          <Badge className={statusColors[test.status]}>
            {test.status === 'pending' && 'En attente'}
            {test.status === 'in_progress' && 'En cours'}
            {test.status === 'passed' && 'Réussi'}
            {test.status === 'failed' && 'Échoué'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{test.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Progression</span>
          <span className="text-xs font-medium">{completedItems}/{totalItems}</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {test.project_name && (
            <Badge variant="outline" className="text-xs">
              {test.project_name}
            </Badge>
          )}
          <Badge variant="outline" className={`text-xs ${priorityColors[test.priority]}`}>
            {test.priority === 'low' && 'Priorité basse'}
            {test.priority === 'medium' && 'Priorité moyenne'}
            {test.priority === 'high' && 'Priorité haute'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500 flex justify-between">
        <div className="flex items-center">
          {test.due_date && (
            <>
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>
                {new Date(test.due_date) < new Date() 
                  ? 'En retard' 
                  : `Échéance: ${new Date(test.due_date).toLocaleDateString('fr-FR')}`}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {test.created_at && formatDistanceToNow(new Date(test.created_at), { addSuffix: true, locale: fr })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
