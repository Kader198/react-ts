import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TaskStatusChartProps {
  data: Array<{
    status: string;
    count: number;
  }>;
}

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
  const COLORS = {
    'todo': '#9ca3af',
    'in-progress': '#3b82f6',
    'in-review': '#f59e0b',
    'completed': '#10b981'
  };

  const formattedData = data.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' '),
    value: item.count
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name.toLowerCase().replace(' ', '-') as keyof typeof COLORS]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}; 