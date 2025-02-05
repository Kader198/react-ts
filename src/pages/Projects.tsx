import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Calendar, CheckCircle, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { apiService } from '../services/api';
import { Project } from '../types/models';
import { ProjectForm } from '../components/projects/ProjectForm';
import { ModalForm } from '../components/common/ModalForm';

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    members: [],
  });

  // Queries
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: apiService.listProjects,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newProject: Partial<Project>) => apiService.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      apiService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Handlers
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      members: [],
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      dueDate: project.dueDate,
      members: project.members,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(project.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      await updateMutation.mutateAsync({
        id: editingProject.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage your team's projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{project.description}</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.map((member, idx) => (
                    <img
                      key={idx}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                      src={member.avatar}
                      alt={member.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    project.status === 'In Progress' 
                      ? "bg-primary/10 text-primary"
                      : "bg-green-100 text-green-800"
                  )}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalForm
        title={editingProject ? 'Edit Project' : 'New Project'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingProject}
        />
      </ModalForm>
    </div>
  );
}; 