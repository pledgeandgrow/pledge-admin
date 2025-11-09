'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Task } from '@/hooks/useTasks';

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'in_review', 'blocked', 'done', 'archived']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  progress: z.number().min(0).max(100),
  estimate_hours: z.number().min(0).optional(),
  actual_hours: z.number().min(0).optional(),
  project_id: z.string().optional(),
  parent_task_id: z.string().optional(),
  assignee_ids: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
  projects?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string }>;
  parentTasks?: Array<{ id: string; title: string }>;
  isSubmitting?: boolean;
}

export function TaskForm({ 
  task, 
  onSubmit, 
  onCancel, 
  projects = [], 
  users = [], 
  parentTasks = [],
  isSubmitting = false
}: TaskFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    task?.start_at ? new Date(task.start_at) : undefined
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.due_at ? new Date(task.due_at) : undefined
  );
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(task?.assignee_ids || []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      progress: task?.progress || 0,
      estimate_hours: task?.estimate_hours || 0,
      actual_hours: task?.actual_hours || 0,
      project_id: task?.project_id || '',
      parent_task_id: task?.parent_task_id || '',
      assignee_ids: task?.assignee_ids || [],
      tags: task?.tags || [],
    },
  });

  // Watch the progress value for the slider
  const progress = watch('progress');

  // Update form values when tags change
  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  // Update form values when assignees change
  useEffect(() => {
    setValue('assignee_ids', selectedAssignees);
  }, [selectedAssignees, setValue]);

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit({
      ...data,
      tags,
      assignee_ids: selectedAssignees,
    });
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddAssignee = (userId: string) => {
    if (userId && !selectedAssignees.includes(userId)) {
      setSelectedAssignees([...selectedAssignees, userId]);
    }
  };

  const handleRemoveAssignee = (userId: string) => {
    setSelectedAssignees(selectedAssignees.filter(id => id !== userId));
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter task title"
            {...register('title')}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter task description"
            {...register('description')}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div>
          <Label>Progress ({progress}%)</Label>
          <Controller
            name="progress"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Slider
                defaultValue={[value]}
                max={100}
                step={5}
                onValueChange={(vals) => onChange(vals[0])}
                className="mt-2"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {startDate ? (
                    format(startDate, 'PPP', { locale: fr })
                  ) : (
                    <span>Pick a start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {dueDate ? (
                    format(dueDate, 'PPP', { locale: fr })
                  ) : (
                    <span>Pick a due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estimate_hours">Estimate (hours)</Label>
            <Input
              id="estimate_hours"
              type="number"
              min="0"
              step="0.5"
              {...register('estimate_hours', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="actual_hours">Actual (hours)</Label>
            <Input
              id="actual_hours"
              type="number"
              min="0"
              step="0.5"
              {...register('actual_hours', { valueAsNumber: true })}
            />
          </div>
        </div>

        {projects.length > 0 && (
          <div>
            <Label>Project</Label>
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {parentTasks.length > 0 && (
          <div>
            <Label>Parent Task</Label>
            <Controller
              name="parent_task_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {parentTasks.map(parentTask => (
                      <SelectItem key={parentTask.id} value={parentTask.id}>
                        {parentTask.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div>
          <Label>Assignees</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAssignees.map(userId => {
              const user = getUserById(userId);
              return user ? (
                <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveAssignee(userId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
          <Select onValueChange={handleAddAssignee}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Add assignee" />
            </SelectTrigger>
            <SelectContent>
              {users
                .filter(user => !selectedAssignees.includes(user.id))
                .map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!newTag}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
