'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  MessageSquare,
  Link,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { TaskWithProject } from '@/hooks/useTasks';

// Extended interface for the task with proper assignees type
interface ExtendedTaskWithProject extends TaskWithProject {
  assignees?: Array<{
    id: string;
    name: string;
    avatar_url?: string;
  }>;
}

interface TaskDetailProps {
  task: ExtendedTaskWithProject;
  onEdit: (task: ExtendedTaskWithProject) => void;
  onDelete: (taskId: string) => void;
  onBack: () => void;
}

export function TaskDetail({ task, onEdit, onDelete, onBack }: TaskDetailProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusIcons = {
    todo: <Clock className="h-5 w-5 text-gray-500" />,
    in_progress: <Clock className="h-5 w-5 text-blue-500" />,
    in_review: <AlertCircle className="h-5 w-5 text-amber-500" />,
    blocked: <AlertCircle className="h-5 w-5 text-red-500" />,
    done: <CheckCircle className="h-5 w-5 text-green-500" />,
    archived: <CheckCircle className="h-5 w-5 text-gray-400" />,
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'PPP', { locale: fr });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'in_review': return 'In Review';
      case 'blocked': return 'Blocked';
      case 'done': return 'Done';
      case 'archived': return 'Archived';
      default: return status;
    }
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant={confirmDelete ? "destructive" : "outline"} 
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              {task.project_name && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Link className="h-4 w-4 mr-1" />
                  Project: {task.project_name}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`${priorityColors[task.priority as keyof typeof priorityColors]} border-0`}
              >
                {task.priority}
              </Badge>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {statusIcons[task.status as keyof typeof statusIcons]}
                <span>{getStatusText(task.status)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Progress</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>0%</span>
                    <span>{task.progress || 0}%</span>
                    <span>100%</span>
                  </div>
                  <Progress 
                    value={task.progress || 0} 
                    className="h-2" 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{formatDate(task.start_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{formatDate(task.due_at)}</span>
                  </div>
                  {task.completed_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium">{formatDate(task.completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Time Tracking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimate:</span>
                    <span className="font-medium">
                      {task.estimate_hours ? `${task.estimate_hours} hours` : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual:</span>
                    <span className="font-medium">
                      {task.actual_hours ? `${task.actual_hours} hours` : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>

              {task.assignees && task.assignees.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Assignees</h3>
                  <div className="space-y-2">
                    {task.assignees.map((assignee, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatar_url || ''} alt={assignee.name} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.created_by && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Created By</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">User ID: {task.created_by}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {task.comments && task.comments.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-sm font-medium flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Comments ({task.comments.length})
              </h3>
              <div className="space-y-4">
                {task.comments.map((comment: any, index: number) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{comment.author?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{comment.author || 'Unknown'}</span>
                      </div>
                      {comment.created_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex justify-between w-full">
            <span>Created: {formatDate(task.created_at)}</span>
            <span>Last updated: {formatDate(task.updated_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
