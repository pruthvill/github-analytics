import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin, faCodeBranch, faEye, faStarAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

// Hardcoded API key
const API_KEY = "YOUR_GOOGLE_API_KEY";

const Chatbot = ({ username, userData, repoData }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState(null);
  const chatContainerRef = useRef(null);

  const handleUserInput = async (input) => {
    if (input.toLowerCase() === 'exit') {
      await chat.destroy();
      return;
    }

    const result = await chat.sendMessage(input, { role: 'user' });
    const response = await result.response;
    const text = response.text();
    setChatHistory((prevHistory) => [...prevHistory, { type: 'user', text: input }, { type: 'chatbot', text }]);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await handleUserInput(e.target.value);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const newChat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 200,
        },
      });
      setChat(newChat);

      return () => {
        newChat.destroy();
      };
    };

    initializeChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when chatHistory updates
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  // Personalized greeting based on user's GitHub username
  const greetingMessage = `Hi ${userData.name || username}! How can I assist you today?`;

  // Data analytics
  const numRepos = repoData.length;
  const followers = userData.followers;
  const publicRepos = userData.public_repos;
  const following = userData.following;
  const createdAt = new Date(userData.created_at);
  const accountAge = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365));
  const totalStars = repoData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalWatchers = repoData.reduce((sum, repo) => sum + repo.watchers_count, 0);
  const totalForks = repoData.reduce((sum, repo) => sum + repo.forks_count, 0);
  const mostStarredRepo = repoData.reduce((max, repo) => (repo.stargazers_count > max.stargazers_count ? repo : max), repoData[0]);
  const mostWatchedRepo = repoData.reduce((max, repo) => (repo.watchers_count > max.watchers_count ? repo : max), repoData[0]);
  const mostForkedRepo = repoData.reduce((max, repo) => (repo.forks_count > max.forks_count ? repo : max), repoData[0]);

  // Analyze data
  const ratioPublicReposFollowers = publicRepos / followers;
  const ratioFollowingFollowers = following / followers;
  const reposPerYear = numRepos / accountAge;
  const starsPerRepo = totalStars / numRepos;
  const watchersPerRepo = totalWatchers / numRepos;
  const forksPerRepo = totalForks / numRepos;

  // Generate insights based on analysis
  let insights = [];
  if (numRepos > 10 && ratioPublicReposFollowers > 1) {
    insights.push(`You have a lot of public repositories (${numRepos}) and more public repos than followers.`);
  }
  if (ratioFollowingFollowers > 1) {
    insights.push(`You are following more users (${following}) than your number of followers (${followers}).`);
  }
  if (followers > 100) {
    insights.push(`You have a relatively large number of followers (${followers}).`);
  }
  if (reposPerYear > 2) {
    insights.push(`You have been actively contributing to GitHub, creating an average of ${reposPerYear.toFixed(1)} repositories per year.`);
  }
  if (starsPerRepo > 10) {
    insights.push(`Your repositories have a high number of stars (${starsPerRepo.toFixed(1)} on average).`);
  }
  if (watchersPerRepo > 5) {
    insights.push(`Your repositories have a high number of watchers (${watchersPerRepo.toFixed(1)} on average).`);
  }
  if (forksPerRepo > 3) {
    insights.push(`Your repositories have a high number of forks (${forksPerRepo.toFixed(1)} on average).`);
  }
  if (insights.length === 0) {
    insights.push(`Your GitHub profile looks good! You have a balanced number of repositories, followers, and following.`);
  }

  // Filter out duplicate repositories
  const uniqueRepos = Array.from(new Set([mostStarredRepo, mostWatchedRepo, mostForkedRepo]));

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Chatbot</h2>
      <div
        ref={chatContainerRef}
        className="overflow-y-auto max-h-96 space-y-4"
        style={{ maxHeight: "400px" }}
      >
        {/* Display personalized greeting */}
        <div className="bg-indigo-600 text-white self-start p-2 rounded-lg">
          {greetingMessage}
        </div>
        {/* Display chat history */}
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-gray-100 text-gray-800 self-end'
                : 'bg-indigo-600 text-white self-start'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Display data analytics insights */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Data Analytics Insights</h3>
        {insights.map((insight, index) => (
          <p key={index}>{insight}</p>
        ))}
      </div>
      {/* Display user's social media links */}
      <div className="mt-6 flex justify-center space-x-4">
        {userData.html_url && (
          <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} size="2x" className="text-gray-600 hover:text-gray-800" />
          </a>
        )}
        {userData.twitter_username && (
          <a href={`https://twitter.com/${userData.twitter_username}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" className="text-gray-600 hover:text-gray-800" />
          </a>
        )}
        {userData.blog && (
          <a href={userData.blog} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size="2x" className="text-gray-600 hover:text-gray-800" />
          </a>
        )}
      </div>
      {/* Display user's top repositories */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Top Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueRepos.map((repo, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">{repo.name}</h4>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faCodeBranch} className="text-gray-600" />
                <span>{repo.forks_count} Forks</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                <span>{repo.watchers_count} Watchers</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faStarAlt} className="text-gray-600" />
                <span>{repo.stargazers_count} Stars</span>
              </div>
              <p className="text-gray-600 truncate">{repo.description}</p>
              <p className="text-gray-600">Last updated: {format(new Date(repo.updated_at), 'MMM d, yyyy')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
