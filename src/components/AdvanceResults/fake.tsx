import React from "react";

const FakeCard = ({ platform, id, username, creationDate, followers, profileImage }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg w-full max-w-md">
      <div className="flex items-center gap-3">
        <img src={profileImage} alt="profile" className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {platform} <span className="text-sm text-gray-400">ID: {id}</span>
          </h3>
          <p className="text-sm text-gray-400">Username: {username}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-300">Creation Date: {creationDate}</p>
        {followers && <p className="text-sm text-gray-300">Followers: {followers}</p>}
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-gray-800 px-3 py-1 rounded-md text-sm">View Account</button>
        <button className="bg-blue-600 px-3 py-1 rounded-md text-sm">Expand Result</button>
      </div>
    </div>
  );
};

const FakeCardList = () => {
  const fakeData = [
    {
      platform: "Flickr",
      id: "17411314@N00",
      username: "alaki",
      creationDate: "10 June, 2005",
      followers: 163,
      profileImage: "https://via.placeholder.com/50/09f/fff.png",
    },
    {
      platform: "Fitbit",
      id: "223FTH",
      username: "Illuminati i.",
      creationDate: "N/A",
      profileImage: "https://via.placeholder.com/50/09f/fff.png",
    },
    {
      platform: "TouchTunes",
      id: "501959",
      username: "TESTERUSER",
      creationDate: "8 November, 2011",
      profileImage: "https://via.placeholder.com/50/09f/fff.png",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4 justify-center">
      {fakeData.map((data, index) => (
        <FakeCard key={index} {...data} />
      ))}
    </div>
  );
};

export default FakeCardList;
