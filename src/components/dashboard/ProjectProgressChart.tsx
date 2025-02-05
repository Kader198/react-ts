import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ProjectProgressChartProps {
  data: Array<{
    project: string;
    progress: number;
  }>;
}

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ data }) => {
  const formattedData = data.map(item => ({
    name: item.project,
    progress: item.progress
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit="%" />
        <Tooltip 
          formatter={(value: number) => [`${value}%`, 'Progress']}
        />
        <Bar
          dataKey="progress"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}; 