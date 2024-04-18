'use client'

import React, { useState } from 'react';
import axios from 'axios';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import UserInfo from './UserInfo';
import Chatbot from './Chatbot';

const GithubAnalytics = () => {
  const [username, setUsername] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repoResponse, userResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}/repos`),
        axios.get(`https://api.github.com/users/${username}`)
      ]);
      setRepoData(repoResponse.data);
      setUserData(userResponse.data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen  max-w-full mx-auto mt-0 m-0">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Github Analytics</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Fetch Data
            </button>
          </div>
        </div>
        {loading && (
          <p className="text-gray-600 mb-4 text-center">Loading...</p>
        )}
        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}
        {repoData && userData && (
          <>
            <UserInfo userData={userData} />
            <Chatbot username={username} userData={userData} repoData={repoData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Bar Chart</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <BarChart repoData={repoData} />
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Line Chart</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <LineChart repoData={repoData} />
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Pie Chart</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <PieChart repoData={repoData} />
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Scatter Chart</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <ScatterChart repoData={repoData} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GithubAnalytics;