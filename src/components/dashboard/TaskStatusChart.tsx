import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TaskStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: '300px'
    },
    title: {
      text: undefined
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Tasks',
      data: data.map(item => ({
        name: item.status,
        y: item.count,
        color: getStatusColor(item.status)
      }))
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

const getStatusColor = (status: string): string => {
  const colors = {
    'To Do': '#E5E7EB',
    'In Progress': '#60A5FA',
    'In Review': '#F59E0B',
    'Done': '#34D399',
    'Blocked': '#EF4444'
  };
  return colors[status as keyof typeof colors] || '#CBD5E1';
}; 