import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ repoData }) => {
  const barChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!repoData) return;

    if (!chartInstance.current) {
      chartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
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
    const stars = repoData.map(repo => repo.stargazers_count);

    const data = {
      labels,
      datasets: [
        {
          label: 'Stars',
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
          data: stars,
        },
      ],
    };

    chartInstance.current.data = data;
    chartInstance.current.update();
  };

  return <canvas ref={barChartRef} style={{ minWidth: '300px', minHeight: '300px' }} />;
};

export default BarChart;
