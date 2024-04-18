import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';


const ScatterChart = ({ repoData }) => {
  const scatterChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!repoData) return;

    if (!chartInstance.current) {
      // If chart instance doesn't exist, create a new one
      chartInstance.current = new Chart(scatterChartRef.current, {
        type: 'scatter',
        data: {},
        options: {},
      });
    }

    // Update chart data
    updateChartData();

    // Cleanup function to destroy the chart instance when component unmounts
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
    const forks = repoData.map(repo => repo.forks_count);
    const createdAt = repoData.map(repo => repo.created_at);

    const data = {
      datasets: [
        {
          label: 'Stars vs. Forks',
          data: stars.map((star, index) => ({
            x: forks[index],
            y: star,
            repo: labels[index],
            createdAt: formatCreatedAt(createdAt[index]),
          })),
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };

    chartInstance.current.data = data;
    chartInstance.current.update();
  };

  const formatCreatedAt = (date) => {
    // Use moment library to format date
    return moment(date).format('MMMM D, YYYY');
  };

  return <canvas ref={scatterChartRef} style={{ minWidth: '300px', minHeight: '300px' }} />;
};

export default ScatterChart;
