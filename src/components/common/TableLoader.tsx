import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TableLoaderProps {
  columns: number;
  rows?: number;
}

export const TableLoader: React.FC<TableLoaderProps> = ({ columns, rows = 5 }) => {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex gap-4 mb-6">
        <Skeleton width={200} height={40} />
        <Skeleton width={120} height={40} />
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-1 sm:grid-flow-col gap-4 bg-gray-50 p-4">
          {Array(columns).fill(0).map((_, i) => (
            <Skeleton key={i} height={20} />
          ))}
        </div>

        {/* Body Rows */}
        {Array(rows).fill(0).map((_, rowIndex) => (
          <div 
            key={rowIndex}
            className="grid grid-cols-1 sm:grid-flow-col gap-4 p-4 border-t"
          >
            {Array(columns).fill(0).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height={20}
                width={colIndex === 0 ? '100%' : '80%'}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton width={150} height={20} />
        <div className="flex gap-2">
          <Skeleton width={40} height={40} borderRadius={8} />
          <Skeleton width={40} height={40} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}; 