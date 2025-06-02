import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "@/hooks/Logout_button";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [currentUser, setCurrentUser] = React.useState(null);
  console.log("User data:", user, isAuthenticated);
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <p className="text-white">Loading profile data...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8 flex flex-col gap-4 justify-center  w-full ">
        {/* Header */}
        <div className="flex justify-end">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Account Profile</h1>
            <p className="text-white mt-2">Manage your account information and preferences</p>
          </div>
          <div
            className="flex space-x-3
       
          "
          >
            <LogoutButton />
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#131315] rounded-xl p-6 border border-white/50">
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-white group-hover:border-white transition-colors"
                  />
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                </div>
                <h2 className="text-xl font-bold text-white text-center">{currentUser.name}</h2>
                <p className="text-white text-sm mt-1">@{currentUser.nickname}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {currentUser.email_verified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-800">
                      Verified
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400 border border-blue-800">
                    {currentUser.user_metadata?.subscription || "basic"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/20 text-purple-400 border border-purple-800">
                    {currentUser.app_metadata?.plan || "free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-[#131315] rounded-xl p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Full Name</h4>
                  <p className="text-gray-200">
                    {currentUser.given_name} {currentUser.family_name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Email Address</h4>
                  <p className="text-gray-200">{currentUser.email}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Profile Updated</h4>
                  <p className="text-gray-300 text-sm">{formatDate(currentUser.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
