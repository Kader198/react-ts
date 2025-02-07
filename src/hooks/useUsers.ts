import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, type CreateUserData, type UpdateUserData } from '../services/userService';

export const useUsers = (page: number, pageSize: number, search?: string, filters?: Record<string, string>) => {
  const queryClient = useQueryClient();

  const queryKey = ['users', page, pageSize, search, filters];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => userService.getUsers(page, pageSize, search, filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    data,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}; 