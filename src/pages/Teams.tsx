import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader, Edit2, Trash2, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/common/DataTable';
import { ModalForm } from '../components/common/ModalForm';
import { TeamForm } from '../components/teams/TeamForm';
import { apiService } from '../services/api';
import { Team } from '../types/models';
import { TeamMembersModal } from '../components/teams/TeamMembersModal';

export const Teams: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => apiService.listTeams(),
  });

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Members',
      accessorKey: 'members',
      cell: (team: Team) => (
        <div className="flex items-center gap-2">
          <span>{team.members?.length || 0}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManageMembers(team)}
          >
            <UsersIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (team: Team) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(team)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(team)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Partial<Team>) => apiService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) =>
      apiService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      apiService.addTeamMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      apiService.removeTeamMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (team: Team) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      await deleteMutation.mutateAsync(team.id);
    }
  };

  const handleManageMembers = (team: Team) => {
    setSelectedTeam(team);
    setIsMembersModalOpen(true);
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedTeam) return;
    await addMemberMutation.mutateAsync({
      teamId: selectedTeam.id,
      userId,
    });
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) return;
    await removeMemberMutation.mutateAsync({
      teamId: selectedTeam.id,
      userId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      await updateMutation.mutateAsync({
        id: editingTeam.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organization's teams
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            New Team
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          data={teams}
          columns={columns}
        />
      )}

      <ModalForm
        title={editingTeam ? 'Edit Team' : 'New Team'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <TeamForm
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingTeam}
        />
      </ModalForm>

      <ModalForm
        title="Manage Team Members"
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setIsMembersModalOpen(false);
        }}
      >
        {selectedTeam && (
          <TeamMembersModal
            teamId={selectedTeam.id}
            currentMembers={selectedTeam.members || []}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
        )}
      </ModalForm>
    </div>
  );
}; 