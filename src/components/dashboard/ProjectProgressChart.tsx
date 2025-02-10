import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ProjectProgressChartProps {
  data: {
    project: string;
    progress: number;
    total: number;
    completed: number;
  }[];
}

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ data }) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: '300px'
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: data.map(item => item.project),
      crosshair: true
    },
    yAxis: [{
      title: {
        text: 'Tasks'
      },
      min: 0
    }, {
      title: {
        text: 'Progress %'
      },
      opposite: true,
      min: 0,
      max: 100
    }],
    plotOptions: {
      column: {
        borderRadius: 5
      }
    },
    series: [{
      type: 'column',
      name: 'Completed Tasks',
      data: data.map(item => item.completed),
      color: '#34D399'
    }, {
      type: 'column',
      name: 'Total Tasks',
      data: data.map(item => item.total),
      color: '#60A5FA'
    }, {
      type: 'spline',
      name: 'Progress',
      data: data.map(item => item.progress),
      yAxis: 1,
      color: '#F59E0B',
      marker: {
        lineWidth: 2,
        lineColor: '#F59E0B',
        fillColor: 'white'
      }
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}; 