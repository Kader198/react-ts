import React, { useCallback } from 'react';
import { Search } from 'lucide-react';
import { FormInput } from '../ui/form-input';
import { useDataTableStore } from '../../stores/dataTableStore';

const SearchInput = React.memo(() => {
  const { searchTerm, setSearchTerm } = useDataTableStore();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <FormInput
      placeholder="Search..."
      value={searchTerm}
      onChange={handleSearchChange}
      icon={Search}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export { SearchInput }; 