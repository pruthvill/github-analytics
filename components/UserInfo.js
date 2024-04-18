import React from 'react';

const UserInfo = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col items-center">
        <img
          src={userData.avatar_url}
          alt="User Avatar"
          className="w-40 h-40 rounded-full mb-4"
        />
        <h2 className="text-3xl font-bold mb-1 text-gray-800">{userData.name}</h2>
        <p className="text-gray-600 mb-4">{userData.login}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-gray-800 mb-2">
          <span className="font-semibold">Bio:</span> {userData.bio || 'N/A'}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold">Location:</span>{' '}
          {userData.location || 'N/A'}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="text-center">
          <p className="text-gray-800 font-bold">{userData.public_repos}</p>
          <p className="text-gray-600">Repositories</p>
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-bold">{userData.followers}</p>
          <p className="text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-bold">{userData.following}</p>
          <p className="text-gray-600">Following</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;