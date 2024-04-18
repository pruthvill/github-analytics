import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ repoData }) => {
  const lineChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!repoData) return;

    if (!chartInstance.current) {
      chartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {},
        options: {},
      });
    }

    updateChartData();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [repoData]);

  const updateChartData = () => {
    if (!repoData || !chartInstance.current) return;

    const labels = repoData.map(repo => repo.name);
    const forks = repoData.map(repo => repo.forks_count);

    const data = {
      labels,
      datasets: [
        {
          label: 'Forks',
          fill: false,
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: forks,
        },
      ],
    };

    chartInstance.current.data = data;
    chartInstance.current.update();
  };

  return <canvas ref={lineChartRef} style={{ minWidth: '300px', minHeight: '300px' }} />;
};

export default LineChart;
