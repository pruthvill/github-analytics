import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ repoData }) => {
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!repoData) return;

    if (!chartInstance.current) {
      chartInstance.current = new Chart(pieChartRef.current, {
        type: 'pie',
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

    const languages = {};
    repoData.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = languages[repo.language] ? languages[repo.language] + 1 : 1;
      }
    });

    const languageLabels = Object.keys(languages);
    const languageData = Object.values(languages);

    const data = {
      labels: languageLabels,
      datasets: [
        {
          data: languageData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(231,233,237,0.6)',
            'rgba(220,53,69,0.6)',
            'rgba(51,153,255,0.6)',
            'rgba(255,193,7,0.6)',
          ],
          hoverOffset: 4,
        },
      ],
    };

    chartInstance.current.data = data;
    chartInstance.current.update();
  };

  return <canvas ref={pieChartRef} style={{ minWidth: '300px', minHeight: '300px' }} />;
};

export default PieChart;
