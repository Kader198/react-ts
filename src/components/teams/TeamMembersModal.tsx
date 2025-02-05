import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, UserCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { FormInput } from '../ui/form-input';
import { apiService } from '../../services/api';
import { User } from '../../types/models';

interface TeamMembersModalProps {
  teamId: string;
  currentMembers: User[];
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
  if (!user.avatar) {
    return <UserCircle className="h-8 w-8 text-gray-400" />;
  }

  return (
    <img
      src={user.avatar}
      alt={user.name}
      className="h-8 w-8 rounded-full"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
      }}
    />
  );
};

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  teamId,
  currentMembers,
  onAddMember,
  onRemoveMember,
}) => {
  const [search, setSearch] = useState('');

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.listUsers(),
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const isCurrentMember = (userId: string) => 
    currentMembers.some(member => member.id === userId);

  return (
    <div className="space-y-4">
      <div className="relative">
        <FormInput
          id="search"
          name="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Current Members</h3>
        <div className="space-y-2">
          {currentMembers.map(member => (
            <div 
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserAvatar user={member} />
                  <UserCircle className="h-8 w-8 text-gray-400 hidden fallback-icon absolute top-0 left-0" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Available Users</h3>
        <div className="space-y-2">
          {filteredUsers
            .filter(user => !isCurrentMember(user.id))
            .map(user => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <UserAvatar user={user} />
                    <UserCircle className="h-8 w-8 text-gray-400 hidden fallback-icon absolute top-0 left-0" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddMember(user.id)}
                >
                  Add
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}; 