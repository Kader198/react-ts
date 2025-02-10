import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Task } from '../../../types/models';
import { taskService } from '../services/taskService';

export function useTasks(page: number, pageSize: number, search?: string, filters?: Record<string, string>) {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', page, pageSize,search, filters];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await taskService.listTasks({
        page,
        pageSize,
        search,
        filters,
      });
      return result;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => taskService.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      taskService.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error('Failed to update task status');
    },
  });

  return {
    data,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
  };
} 