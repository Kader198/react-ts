import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TeamPerformanceChartProps {
  data: {
    date: string;
    completedTasks: number;
    hoursLogged: number;
  }[];
}

export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      height: '300px'
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: data.map(item => item.date),
      type: 'datetime',
      labels: {
        format: '{value:%b %d}'
      }
    },
    yAxis: [{
      title: {
        text: 'Completed Tasks'
      }
    }, {
      title: {
        text: 'Hours Logged'
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    series: [{
      type: 'area',
      name: 'Completed Tasks',
      data: data.map(item => item.completedTasks),
      color: '#60A5FA',
      fillOpacity: 0.3
    }, {
      type: 'spline',
      name: 'Hours Logged',
      data: data.map(item => item.hoursLogged),
      yAxis: 1,
      color: '#F59E0B'
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}; 