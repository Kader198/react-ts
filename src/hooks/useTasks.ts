import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/models';
import { apiService } from '../services/api';
import { toast } from 'react-hot-toast';

export function useTasks(page: number, pageSize: number, search?: string, filters?: Record<string, string>) {
  const queryClient = useQueryClient();
  const queryKey = ['tasks', page, pageSize,search, filters];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await apiService.listTasks({
        page,
        pageSize,
        search,
        filters,
      });
      return result;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => apiService.createTask(newTask),
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
      apiService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTask(id),
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
      apiService.updateTask(id, { status }),
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