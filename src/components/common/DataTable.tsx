import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Search, Filter, X, MoreVertical } from 'lucide-react';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDataTableStore } from '../../stores/dataTableStore';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: {
    key: keyof T;
    label: string;
    options: { label: string; value: string }[];
  }[];
  searchable?: boolean;
  pageSize?: number;
  totalCount: number;
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  filters,
  searchable = true,
  pageSize = 10,
  totalCount,
  isLoading,
  onEdit,
  onDelete,
  onPageChange,
  onSearchChange,
  onFilterChange,
}: DataTableProps<T>) {
  const {
    searchTerm,
    filters: filterValues,
    page,
    showFilters,
    isSearching,
    setSearchTerm,
    setFilter,
    clearFilters,
    setPage,
    toggleFilters,
    setIsSearching,
  } = useDataTableStore();

  // Debounced search with loading state
  useEffect(() => {
    if (!isSearching) return;

    const handler = setTimeout(() => {
      onSearchChange(searchTerm);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, isSearching, onSearchChange, setIsSearching]);

  // Memoize handlers to prevent rerenders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value);
    onFilterChange(key, value);
  }, [setFilter, onFilterChange]);

  // Update page when changed
  useEffect(() => {
    onPageChange(page);
  }, [page, onPageChange]);

  const activeFiltersCount = Object.values(filterValues).filter(Boolean).length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-1">
          {searchable && (
            <div className="w-full sm:w-64">
              <FormInput
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                icon={Search}
              />
            </div>
          )}
          
          {filters && filters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {showFilters && filters && (
        <div className="rounded-lg shadow-md bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  clearFilters();
                  Object.keys(filterValues).forEach(key => {
                    onFilterChange(key, '');
                  });
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filters.map((filter) => (
              <FormSelect
                key={String(filter.key)}
                label={filter.label}
                value={filterValues[String(filter.key)] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange(String(filter.key), value);
                }}
                options={[
                  { label: `All ${filter.label}`, value: '' },
                  ...filter.options
                ]}
              />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-md relative">
        {isSearching && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching...</span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-32 text-center"
                >
                  {isLoading ? (
                    <span className="text-gray-500">Loading data...</span>
                  ) : (
                    <span className="text-gray-500">No results found</span>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.id}
                  className={isLoading ? 'opacity-50' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell ? column.cell(item) : String(item[column.accessorKey])}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(item)}>
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => onDelete(item)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
                          {onEdit && (
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of{' '}
            {totalCount} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 