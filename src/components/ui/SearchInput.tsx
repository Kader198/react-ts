import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, ...props }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="search"
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
          onSearch?.(e.target.value);
        }}
        className="block w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 
          text-sm placeholder:text-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          bg-gray-50 hover:bg-white transition-colors duration-200"
      />
    </div>
  );
}; 