'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProject } from '@/hooks/useProject';
import { Plus, MoreVertical, CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskType {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  start_at?: string;
  due_at?: string;
  completed_at?: string;
  assignee_id?: string;
  assignee_name?: string;
  project_id: string;
  parent_task_id?: string;
  tags?: string[];
  comments?: string;
}

interface ProjectTasksProps {
  projectId: string;
}

export function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    progress: 0,
    start_at: '',
    due_at: '',
    assignee_id: '',
    parent_task_id: '',
    tags: [] as string[],
    comments: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<{id: string, name: string}[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const { fetchProjectTasks, addProjectTask, updateProjectTask, deleteProjectTask, fetchTeamMembers } = useProject(projectId);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await fetchProjectTasks();
        setTasks(fetchedTasks);
        
        const members = await fetchTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project tasks',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [projectId, fetchProjectTasks, fetchTeamMembers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value, 10) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      progress: 0,
      start_at: '',
      due_at: '',
      assignee_id: '',
      parent_task_id: '',
      tags: [],
      comments: '',
    });
    setEditingTask(null);
  };

  const handleOpenDialog = (task?: TaskType) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        progress: task.progress || 0,
        start_at: task.start_at || '',
        due_at: task.due_at || '',
        assignee_id: task.assignee_id || '',
        parent_task_id: task.parent_task_id || '',
        tags: task.tags || [],
        comments: task.comments || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        // Update existing task
        await updateProjectTask(editingTask.id, {
          ...formData,
          project_id: projectId,
        });
        
        setTasks(prev => 
          prev.map(task => 
            task.id === editingTask.id 
              ? { ...task, ...formData } 
              : task
          )
        );
        
        toast({
          title: 'Success',
          description: 'Task updated successfully',
        });
      } else {
        // Add new task
        const newTask = await addProjectTask({
          ...formData,
          project_id: projectId,
        });
        
        setTasks(prev => [...prev, newTask]);
        
        toast({
          title: 'Success',
          description: 'Task added successfully',
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteProjectTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
        return <Badge variant="outline">À faire</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En cours</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Bloqué</Badge>;
      case 'done':
        return <Badge className="bg-green-500">Terminé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">Haute</Badge>;
      case 'medium':
        return <Badge variant="default">Moyenne</Badge>;
      case 'low':
        return <Badge variant="secondary">Basse</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Non assigné';
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'Inconnu';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tâches du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tâches du projet</CardTitle>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter une tâche
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher des tâches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="blocked">Bloqué</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {tasks.length === 0 
                ? "Aucune tâche n'a été ajoutée à ce projet." 
                : "Aucune tâche ne correspond à votre recherche."}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getAssigneeName(task.assignee_id)}</TableCell>
                      <TableCell>
                        {task.due_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {formatDate(task.due_at)}
                          </div>
                        ) : (
                          'Non définie'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{task.progress || 0}%</span>
                          </div>
                          <Progress 
                            value={task.progress || 0} 
                            className="h-2" 
                            indicatorClassName={`${
                              task.progress === 100 
                                ? 'bg-green-500' 
                                : task.progress > 50 
                                ? 'bg-blue-500' 
                                : 'bg-amber-500'
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(task)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(task.id)}>
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'}
              </DialogTitle>
              <DialogDescription>
                {editingTask 
                  ? 'Modifiez les détails de cette tâche.' 
                  : 'Ajoutez une nouvelle tâche à ce projet.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statut
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="blocked">Bloqué</SelectItem>
                      <SelectItem value="done">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priorité
                  </Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="progress" className="text-right">
                    Progression
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>0%</span>
                      <span>{formData.progress}%</span>
                      <span>100%</span>
                    </div>
                    <Input
                      id="progress"
                      name="progress"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.progress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start_at" className="text-right">
                    Date de début
                  </Label>
                  <Input
                    id="start_at"
                    name="start_at"
                    type="date"
                    value={formData.start_at}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="due_at" className="text-right">
                    Date d'échéance
                  </Label>
                  <Input
                    id="due_at"
                    name="due_at"
                    type="date"
                    value={formData.due_at}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignee_id" className="text-right">
                    Assigné à
                  </Label>
                  <Select 
                    value={formData.assignee_id} 
                    onValueChange={(value) => handleSelectChange('assignee_id', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Non assigné</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parent_task_id" className="text-right">
                    Tâche parente
                  </Label>
                  <Select 
                    value={formData.parent_task_id} 
                    onValueChange={(value) => handleSelectChange('parent_task_id', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une tâche parente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune</SelectItem>
                      {tasks
                        .filter(task => !editingTask || task.id !== editingTask.id)
                        .map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="tags" className="text-right pt-2">
                    Tags
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-xs hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="newTag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Ajouter un tag"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddTag}
                        disabled={!newTag}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comments" className="text-right">
                    Commentaires
                  </Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingTask ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
