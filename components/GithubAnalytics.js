'use client'
import React, { useState } from 'react';
import axios from 'axios';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';

const GithubAnalytics = () => {
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repoResponse, userResponse] = await Promise.all([ // Fetch both repo and user data simultaneously
        axios.get(`https://api.github.com/users/${username}/repos`),
        axios.get(`https://api.github.com/users/${username}`)
      ]);
      setRepoData(repoResponse.data);
      setUserData(userResponse.data); // Set user data state
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 pt-2">
      <h1 className="text-3xl mb-4">Github Analytics</h1>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
          Fetch Data
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {repoData && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="w-1/2">
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-2">Bar Chart</h2>
                  <div className="relative pb-3/4">
                    <BarChart repoData={repoData} />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
                  <div className="relative pb-3/4">
                    <LineChart repoData={repoData} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/2">
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-2">Pie Chart</h2>
                  <div className="relative pb-3/4">
                    <PieChart repoData={repoData} />
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-2">Scatter Chart</h2>
                  <div className="relative pb-3/4">
                    <ScatterChart repoData={repoData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GithubAnalytics;
