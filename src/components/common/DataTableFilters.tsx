import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Search } from 'lucide-react';
import { Select } from '../ui/select';

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableFiltersProps {
  onSearch: (value: string) => void;
  onFilter?: (value: string) => void;
  filterOptions?: FilterOption[];
  onAdd?: () => void;
  addButtonText?: string;
}

export function DataTableFilters({
  onSearch,
  onFilter,
  filterOptions,
  onAdd,
  addButtonText = 'Add New'
}: DataTableFiltersProps) {
  const [selectedFilter, setSelectedFilter] = React.useState('');

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {filterOptions && onFilter && (
          <Select
            value={selectedFilter}
            onChange={(e) => {
              setSelectedFilter(e.target.value);
              onFilter(e.target.value);
            }}
            className="w-[180px]"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
} 