import { ChevronLeft, ChevronRight, Edit2, Filter, MoreVertical, Search, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { useDataTableStore } from '../../stores/dataTableStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Drawer } from '../ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { FilterBadge } from './FilterBadge';

interface FilterOption {
  label: string;
  value: string;
  className?: string;
}

export interface Column<T> {
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
    options: FilterOption[];
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

  const searchInputRef = React.useRef<HTMLInputElement>(null);

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

  // Add effect to focus search input when search completes
  useEffect(() => {
    if (!isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  const activeFiltersCount = Object.values(filterValues).filter(Boolean).length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4 w-full lg:w-auto ">
          <div className="flex flex-col sm:flex-row gap-4 items-center ">
            {searchable && (
              <div className="w-full sm:w-80 flex-shrink-0">
                <FormInput
                  ref={searchInputRef}
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  icon={Search}
                  className="w-full border-gray-200 focus:ring-primary/20"
                />
              </div>
            )}

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap  items-center gap-2">
                {filters?.map((filter) => {
                  const value = filterValues[String(filter.key)];
                  if (!value || value === 'all') return null;
                  
                  const option = filter.options.find(opt => opt.value === value);
                  if (!option) return null;

                  return (
                    <FilterBadge
                      key={String(filter.key)}
                      label={filter.label}
                      value={option.label}
                      onRemove={() => handleFilterChange(String(filter.key), '')}
                      className={option.className}
                    />
                  );
                })}
                
              </div>
            )}
          </div>
        </div>

        {filters && filters.length > 0 && (
          <div className="flex-shrink-0 ">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="min-w-[120px] font-medium hover:bg-gray-50 border-gray-200"
            >
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" className="ml-2 bg-primary/10 text-primary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        )}
      </div>

      <Drawer
        isOpen={showFilters}
        onClose={toggleFilters}
        title="Filter Options"
      >
        <div className="space-y-6">
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilters();
                  Object.keys(filterValues).forEach(key => {
                    onFilterChange(key, '');
                  });
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {filters?.map((filter) => (
              <div key={String(filter.key)} className="space-y-2">
                <FormSelect
                  label={filter.label}
                  value={filterValues[String(filter.key)] || ''}
                  onChange={(e) => handleFilterChange(String(filter.key), e.target.value)}
                  options={[
                    { label: `All ${filter.label}`, value: 'all' },
                    ...filter.options
                  ]}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      <div className="rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              {columns.map((column) => (
                <TableHead 
                  key={String(column.accessorKey)}
                  className="font-medium text-gray-600"
                >
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of{' '}
            {totalCount} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 