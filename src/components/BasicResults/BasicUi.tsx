import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import emailData from "@/Data/EmailBasic.json";
import { useAuth0 } from "@auth0/auth0-react";
// TypeScript interfaces
interface LinkedInProfile {
  displayName?: string;
  headline?: string;
  location?: string;
  photoUrl?: string;
  companyName?: string;
  linkedInUrl?: string;
  phoneNumbers?: string[];
  summary?: string;
  emails?: string[];
  schools?: {
    educationHistory?: Array<{
      schoolName: string;
      degreeName: string;
      startEndDate: {
        start: { month: number; year: number };
        end: { month: number; year: number };
      };
      fieldOfStudy: string;
    }>;
  };
  positions?: {
    positionHistory?: Array<{
      title: string;
      companyName: string;
      companyLogo?: string;
      startEndDate: {
        start: { month: number; year: number };
        end?: { month: number; year: number };
      };
      duration?: string;
      description?: string;
    }>;
  };
  skills?: string[];
}

interface GravatarProfile {
  displayName?: string;
  aboutMe?: string;
  thumbnailUrl?: string;
  currentLocation?: string;
  job_title?: string;
  company?: string;
  emails?: Array<{ value: string; primary?: string }>;
  profileUrl?: string;
  preferredUsername?: string;
  accounts?: Array<{
    name: string;
    display: string;
    url: string;
    iconUrl?: string;
    verified?: boolean;
  }>;
  hash?: string;
}

interface SocialMediaInfo {
  live: boolean;
  note?: string;
}

interface SocialMediaChecker {
  [key: string]: SocialMediaInfo | string;
  error?: string;
}

const DataSection = ({ title, children, icon }) => (
  <div className="bg-black rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center mb-3 sm:mb-4 pb-2 border-b border-gray-100">
      {icon && (
        <div className="mr-2 sm:mr-3 text-blue-500 text-lg sm:text-xl md:text-2xl">{icon}</div>
      )}
      <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const formatValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return "-";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value) as React.ReactNode;
  } catch {
    return String(value) as React.ReactNode;
  }
};

const DataItem = ({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: unknown;
  isLink?: boolean;
}) => {
  if (value === null || value === undefined) return null;
  const safeStringValue = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  };

  return (
    <div className="mb-2 sm:mb-3 last:mb-0">
      <div className="text-sm sm:text-md font-medium text-white mb-1">{label}</div>
      {isLink && typeof value === "string" ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-200 hover:underline break-all hover:text-blue-800 transition-colors duration-150 text-sm sm:text-base"
        >
          {value}
        </a>
      ) : (
        <div className="text-white break-all text-sm sm:text-base">{safeStringValue(value)}</div>
      )}
    </div>
  );
};

const DataList = ({ label, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-2 sm:mb-3 last:mb-0">
      <div className="text-sm sm:text-md font-medium text-white mb-1">{label}</div>
      <ul className="list-disc pl-4 sm:pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-white text-sm sm:text-base">
            {typeof item === "object" ? (
              <div className="ml-1 sm:ml-2">
                {Object.entries(item).map(([key, val]) => (
                  <DataItem key={key} label={key} value={val} />
                ))}
              </div>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserProfileCard = () => {
  const [Data, setData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");
  const FetchURL = import.meta.env.VITE_ADVANCE_BACKEND;
  const AUTH_URL = import.meta.env.VITE_AUTH_BACKEND;
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const { user, isAuthenticated, loginWithRedirect, isLoading: authLoading } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [authStep, setAuthStep] = useState("checking"); // 'checking', 'authenticating', 'fetching_user', 'checking_credits', 'fetching_data', 'complete', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to check if Trello data is safe to use
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;

  // Step 1: Handle Auth0 authentication
  useEffect(() => {
    const handleAuthentication = async () => {
      if (authLoading) {
        setAuthStep("checking");
        return;
      }

      if (!isAuthenticated || !user) {
        setAuthStep("authenticating");
        // console.log('User not authenticated, redirecting to login...');
        loginWithRedirect();
        return;
      }

      // User is authenticated, proceed to fetch user data
      setAuthStep("fetching_user");
      await fetchUserData();
    };

    handleAuthentication();
  }, [user, isAuthenticated, authLoading]);

  // Step 2: Fetch user data from database
  const fetchUserData = async () => {
    try {
      setAuthStep("fetching_user");
      // console.log('Fetching user data for:', user.email);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/findbyemail?email=${encodeURIComponent(user.email)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const userInfo = data.data;

      if (!userInfo?._id) {
        throw new Error("User data incomplete - missing user ID");
      }

      const userDataObj = {
        id: userInfo._id,
        email: userInfo.email,
        name: userInfo.name || "",
        credits: userInfo.credits || 0,
      };

      setUserData(userDataObj);
      setUserId(userInfo._id);

      // console.log('User data fetched successfully:', userDataObj);

      // Proceed to check credits
      setAuthStep("checking_credits");
      await checkCreditsAndFetchData(userDataObj);
    } catch (err) {
      // console.error("User fetch error:", err);
      setErrorMessage(`Failed to fetch user data: ${err.message}`);
      setAuthStep("error");
      setIsLoading(false);
    }
  };

  // Step 3: Check credits and fetch profile data
  const checkCreditsAndFetchData = async (userInfo) => {
    try {
      // Check if user has sufficient credits (minimum 0.05 for basic search)
      const requiredCredits = 0.05;

      if (userInfo.credits < requiredCredits) {
        setErrorMessage(
          `Insufficient credits. You need at least ${requiredCredits} credits to perform this search. Current balance: ${userInfo.credits}`
        );
        setAuthStep("error");
        setIsLoading(false);
        return;
      }

      // console.log(`Credits check passed. Current balance: ${userInfo.credits}, Required: ${requiredCredits}`);

      // Add a delay before fetching data (as requested)
      setAuthStep("fetching_data");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 second delay

      await fetchProfileData(userInfo);
    } catch (err) {
      // console.error("Credits check error:", err);
      setErrorMessage(`Credits check failed: ${err.message}`);
      setAuthStep("error");
      setIsLoading(false);
    }
  };

  // Step 4: Fetch profile data
  const fetchProfileData = async (userInfo) => {
    try {
      if (!query) {
        setErrorMessage("No email query provided");
        setAuthStep("error");
        setIsLoading(false);
        return;
      }

      console.log("Fetching profile data for email:", query);

      // Handle demo data case
      if (query === "dheerajydv19@proton.me") {
        // console.log('Using demo data for specified email');
        setApiData(emailData);
        setUsingFallback(false);
        setAuthStep("complete");
        setIsLoading(false);
        return;
      }

      try {
        const backendUrl = FetchURL;
        const response = await fetch(
          `${backendUrl}/BasicSearch?email=${encodeURIComponent(query)}`
        );

        if (response.ok) {
          const data = await response.json();
          // console.log("API success:", data);
          setApiData(data);
          setUsingFallback(false);

          // Deduct credits after successful API call
          await deductCredits(userInfo.id, 0.05);

          setAuthStep("complete");
          setIsLoading(false);
        } else {
          // console.error(`API error: ${response.status}`);
          throw new Error(`API returned ${response.status}`);
        }
      } catch (apiErr) {
        // console.error("Error with server API call:", apiErr);
        // console.log("API attempt failed. Using fallback data from EmailBasic.json");
        setApiData(emailData);
        setUsingFallback(true);
        setAuthStep("complete");
        setIsLoading(false);
      }
    } catch (err) {
      // console.error("Failed to fetch profile data:", err);
      setErrorMessage(`Failed to fetch profile data: ${err.message}`);
      setAuthStep("error");
      setIsLoading(false);
    }
  };

  // Step 5: Deduct credits after successful API call
  const deductCredits = async (userId, amount) => {
    try {
      const creditsResponse = await fetch(`${AUTH_URL}/api/credits/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          amount: amount,
        }),
      });

      if (creditsResponse.ok) {
        // console.log(`Successfully deducted ${amount} credits`);
        // Update local user data
        setUserData((prev) => ({
          ...prev,
          credits: prev.credits - amount,
        }));
      } else {
        // console.error("Failed to deduct credits:", creditsResponse.status);
      }
    } catch (creditErr) {
      // console.error("Failed to update credits:", creditErr);
    }
  };
  const isTrelloDataValid = (trelloData) => {
    if (!trelloData || !Array.isArray(trelloData) || trelloData.length === 0) {
      return false;
    }

    const firstUser = trelloData[0];
    return typeof firstUser === "object" && firstUser !== null;
  };

  useEffect(() => {
    const isPageRefresh = !window.performance
      .getEntriesByType("navigation")
      .map((nav) => (nav as PerformanceNavigationTiming).type)
      .includes("reload");

    if (!isPageRefresh) {
      navigate("/");
      return;
    }
  }, [navigate]);

  // Loading states
  if (isLoading || authStep !== "complete") {
    const getLoadingMessage = () => {
      switch (authStep) {
        case "checking":
          return "Checking authentication...";
        case "authenticating":
          return "Redirecting to login...";
        case "fetching_user":
          return "Fetching user data...";
        case "checking_credits":
          return "Checking credits...";
        case "fetching_data":
          return "Loading profile data...";
        case "error":
          return errorMessage || "An error occurred";
        default:
          return "Loading...";
      }
    };

    return (
      <div className="flex flex-col justify-center items-center h-screen px-4">
        <div className="text-white text-lg sm:text-xl md:text-2xl mb-4 text-center">
          {getLoadingMessage()}
        </div>
        {authStep === "error" ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 text-white p-4 rounded-lg max-w-md text-center">
            <h3 className="text-lg font-medium text-red-400 mb-2">Error</h3>
            <p className="text-sm text-white mb-4">{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage("");
                setAuthStep("checking");
                setIsLoading(true);
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
        )}

        {/* Progress indicator */}
        {authStep !== "error" && (
          <div className="mt-6 w-64 bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{
                width:
                  authStep === "checking"
                    ? "20%"
                    : authStep === "authenticating"
                    ? "40%"
                    : authStep === "fetching_user"
                    ? "60%"
                    : authStep === "checking_credits"
                    ? "80%"
                    : authStep === "fetching_data"
                    ? "90%"
                    : "100%",
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Use apiData if available, otherwise fall back to props data
  const displayData = apiData || Data;

  if (!displayData)
    return (
      <div className="p-3 sm:p-4 text-center text-white text-sm sm:text-base">
        No data available
      </div>
    );

  const {
    hibp,
    gravatar,
    trello,
    notion,
    adobe,
    linkedin,
    goodreads,
    social_media_checker,
    ghunt,
    protonmail,
    infostealers,
  } = displayData;
  const gravatarProfile =
    gravatar && ((gravatar.profile || gravatar.entry?.[0]) as GravatarProfile);
  const linkedinProfile =
    linkedin && !linkedin.Error
      ? ((Array.isArray(linkedin) && linkedin.length > 0
          ? linkedin[0]
          : linkedin) as LinkedInProfile)
      : null;
  const ghuntProfile = ghunt && ghunt.PROFILE_CONTAINER?.profile;

  const isEmpty = (obj) => {
    return (
      obj === null ||
      obj === undefined ||
      (typeof obj === "object" && Object.keys(obj).length === 0)
    );
  };

  return (
    <>
      {!isLoading || !Data ? (
        <div className="max-w-6xl mx-auto p-2 sm:p-4">
          {usingFallback && (
            <div className="bg-orange-600 text-white p-2 sm:p-3 rounded-md mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-bold text-sm sm:text-base">Using demo data</p>
                  <p className="text-xs sm:text-sm">
                    API connection failed. Showing sample data for demonstration.
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setUsingFallback(false);
                  setApiData(null);
                  setAuthStep("fetching_data");
                  setIsLoading(true);

                  if (userData) {
                    await fetchProfileData(userData);
                  }
                }}
                className="bg-white text-orange-600 px-2 sm:px-3 py-1 rounded hover:bg-orange-100 transition-colors duration-200 font-medium text-xs sm:text-sm w-full sm:w-auto"
              >
                Retry API
              </button>
            </div>
          )}

          {/* User Credits Header */}
          {userData && (
            <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm sm:text-base">
                      Welcome, {userData.name || "User"}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{userData.email}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-white font-medium text-sm sm:text-base">
                    Credits: <span className="text-green-400">{userData.credits.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    Search cost: {query === "dheerajydv19@proton.me" ? "0.00" : "0.05"} credits
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-3 sm:mb-4 overflow-hidden">
              {gravatarProfile?.thumbnailUrl ? (
                <img
                  src={gravatarProfile.thumbnailUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl sm:text-2xl md:text-3xl">👤</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              {gravatarProfile?.displayName || linkedinProfile?.displayName || "User Profile"}
            </h1>
            <p className="text-white max-w-2xl mx-auto text-sm sm:text-base px-4">
              {gravatarProfile?.aboutMe || linkedinProfile?.headline}
            </p>
          </div>

          {/* Personal Information Section */}
          <DataSection title="Personal Information" icon="👤">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                {/* Basic Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
                  <div className="mb-3 sm:mb-0 sm:mr-5">
                    {notion?.value?.value?.profile_photo ? (
                      <img
                        src={notion.value.value.profile_photo}
                        alt={notion.value.value.name || "Profile"}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md"
                      />
                    ) : gravatarProfile?.thumbnailUrl ? (
                      <img
                        src={gravatarProfile.thumbnailUrl}
                        alt="Profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl shadow-md">
                        {notion?.value?.value?.name
                          ? notion.value.value.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1">
                      {notion?.value?.value?.name ||
                        gravatarProfile?.displayName ||
                        (query?.split("@")[0] || "")
                          .replace(/[^a-zA-Z0-9]/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h3>
                    <p className="text-white mb-1 text-sm sm:text-base">
                      <span className="text-gray-400 mr-2">Email:</span>
                      <span className="text-teal-200 break-all">{query}</span>
                    </p>
                    {gravatarProfile?.currentLocation && (
                      <p className="text-white text-sm sm:text-base">
                        <span className="text-gray-400 mr-2">Location:</span>
                        {gravatarProfile.currentLocation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-950 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">
                    Contact Details
                  </h4>
                  <DataItem label="Primary Email" value={query} isLink />

                  {linkedin && linkedin.Error && (
                    <div className="mt-2 sm:mt-3">
                      <span className="text-gray-400 text-sm sm:text-base">LinkedIn:</span>
                      <span className="text-yellow-400 ml-2 text-sm sm:text-base">
                        Account Exists
                      </span>
                    </div>
                  )}

                  {isTrelloDataValid(trello) && (
                    <div className="mt-2 sm:mt-3">
                      <span className="text-gray-400 text-sm sm:text-base">Trello:</span>
                      <span
                        className={`ml-2 text-sm sm:text-base ${
                          trello[0].active ? "text-green-400" : "text-gray-400"
                        }`}
                      >
                        {trello[0].active ? "Active Account" : "Inactive Account"}
                      </span>
                    </div>
                  )}

                  {notion?.value?.value && (
                    <div className="mt-2 sm:mt-3">
                      <span className="text-gray-400 text-sm sm:text-base">Notion:</span>
                      <span className="text-green-400 ml-2 text-sm sm:text-base">
                        Active Account
                      </span>
                    </div>
                  )}

                  {adobe && adobe.length > 0 && (
                    <div className="mt-2 sm:mt-3">
                      <span className="text-gray-400 text-sm sm:text-base">Adobe:</span>
                      <span
                        className={`ml-2 text-sm sm:text-base ${
                          adobe[0].status.code === "active" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {adobe[0].status.code === "active" ? "Active Account" : "Inactive Account"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Security Summary */}
                <div className="bg-gray-950 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-medium text-white mb-2 sm:mb-3">
                    Security Summary
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm sm:text-base">Data Breaches:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          hibp && hibp[0] !== "not_found"
                            ? "bg-red-900 text-red-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {hibp && hibp[0] !== "not_found" ? `${hibp.length} Found` : "None Found"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm sm:text-base">Malware Infection:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          infostealers && infostealers.stealers && infostealers.stealers.length > 0
                            ? "bg-red-900 text-red-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {infostealers && infostealers.stealers && infostealers.stealers.length > 0
                          ? "Infected"
                          : "Clean"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm sm:text-base">
                        Social Media Presence:
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-200">
                        {social_media_checker &&
                          Object.keys(social_media_checker).filter(
                            (key) => key !== "error" && social_media_checker[key]?.live
                          ).length}{" "}
                        Accounts
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm sm:text-base">ProtonMail:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-200">
                        {protonmail && protonmail.protonmail.includes("not a protonmail")
                          ? "No"
                          : "Yes"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Media Preview */}
                {social_media_checker && !social_media_checker.error && (
                  <div className="bg-gray-950 hover:bg-gray-900 text-white p-3 sm:p-4 rounded-lg">
                    <h4 className="font-medium mb-2 sm:mb-3 text-lg sm:text-2xl">
                      Social Media Presence
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {Object.entries(social_media_checker as SocialMediaChecker).map(
                        ([platform, info]) =>
                          platform !== "error" &&
                          typeof info === "object" &&
                          info.live && (
                            <div
                              key={platform}
                              className="bg-gray-800 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm capitalize flex items-center justify-center"
                            >
                              {platform}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DataSection>

          {/* Personal Information */}
          <DataSection title="Personal Information" icon="👤">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <DataItem label="Name" value={gravatarProfile?.displayName} />
                <DataItem
                  label="Location"
                  value={gravatarProfile?.currentLocation || linkedinProfile?.location}
                />
              </div>
              <div>
                <DataItem
                  label="Job Title"
                  value={
                    gravatarProfile?.job_title ||
                    linkedinProfile?.positions?.positionHistory?.[0]?.title
                  }
                />
                <DataItem
                  label="Company"
                  value={gravatarProfile?.company || linkedinProfile?.companyName}
                />
                <DataItem
                  label="Primary Email"
                  value={gravatarProfile?.emails?.[0]?.value || linkedinProfile?.emails?.[0]}
                  isLink
                />
              </div>
            </div>
          </DataSection>

          {/* Google Profile */}
          {ghunt && ghunt.PROFILE_CONTAINER && (
            <DataSection title="Google Profile" icon="🔍">
              {ghunt.PROFILE_CONTAINER.profile ? (
                <div>
                  {/* Profile Header with Photo (Cover Photo Removed) */}
                  <div className="text-center mb-6 sm:mb-8">
                    {/* Profile Photo */}
                    <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden border-4 border-gray-800 mb-3 sm:mb-4">
                      {ghunt.PROFILE_CONTAINER.profile.profilePhotos?.PROFILE?.url ? (
                        <img
                          src={ghunt.PROFILE_CONTAINER.profile.profilePhotos.PROFILE.url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Replace broken image with user icon
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150?text=👤";
                          }}
                        />
                      ) : (
                        <span className="text-2xl sm:text-3xl md:text-4xl">👤</span>
                      )}
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                      {ghunt.PROFILE_CONTAINER.profile.names?.PROFILE?.fullname ||
                        ghunt.PROFILE_CONTAINER.profile.emails?.PROFILE?.value
                          ?.split("@")[0]
                          ?.replace(/[^a-zA-Z0-9]/g, " ")
                          ?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
                        "Google User"}
                    </h1>

                    <p className="text-white text-base sm:text-lg max-w-2xl mx-auto px-4 break-all">
                      {ghunt.PROFILE_CONTAINER.profile.emails?.PROFILE?.value}
                    </p>

                    {/* User Type Badges */}
                    <div className="flex flex-wrap justify-center mt-3 gap-2">
                      {ghunt.PROFILE_CONTAINER.profile.profileInfos?.PROFILE?.userTypes?.map(
                        (type, index) => (
                          <span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs sm:text-sm"
                          >
                            {type}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Fix for the Stats Maps value type issue */}
                  {ghunt.PROFILE_CONTAINER.maps &&
                    ghunt.PROFILE_CONTAINER.maps.stats &&
                    Object.keys(ghunt.PROFILE_CONTAINER.maps.stats).length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h5 className="font-medium text-base sm:text-lg text-white mb-2 sm:mb-3">
                          Maps Activity Statistics
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {Object.entries(ghunt.PROFILE_CONTAINER.maps.stats).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="bg-gray-900 p-2 sm:p-3 rounded-lg text-center"
                              >
                                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                                  {String(value)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{key}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="bg-gray-950 p-3 sm:p-4 rounded-lg text-white">
                  <p className="text-sm sm:text-base">
                    {ghunt.error || "No Google profile information found for this email address."}
                  </p>
                </div>
              )}
            </DataSection>
          )}

          {/* Gravatar Profile */}
          <DataSection title="Gravatar Profile" icon="🌐">
            {gravatarProfile ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  {/* Profile Info */}
                  <div className="flex flex-col items-center lg:items-start mb-4 sm:mb-6">
                    {gravatarProfile.thumbnailUrl && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-gray-800">
                        <img
                          src={gravatarProfile.thumbnailUrl}
                          alt="Gravatar Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center lg:text-left">
                      {gravatarProfile.displayName || "Not Available"}
                    </h3>
                    <p className="text-white text-center lg:text-left text-sm sm:text-base">
                      {gravatarProfile.job_title || ""}{" "}
                      {gravatarProfile.company ? `at ${gravatarProfile.company}` : ""}
                    </p>
                    {gravatarProfile.currentLocation && (
                      <div className="flex items-center mt-2">
                        <span className="text-gray-400 text-sm sm:text-base">Location:</span>
                        <p className="text-white ml-2 font-medium text-sm sm:text-base">
                          {gravatarProfile.currentLocation}
                        </p>
                      </div>
                    )}
                    {gravatarProfile.profileUrl && (
                      <a
                        href={gravatarProfile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-teal-200 hover:underline flex items-center text-sm sm:text-base"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        View Gravatar Profile
                      </a>
                    )}
                    {gravatarProfile.preferredUsername && (
                      <div className="mt-2 text-white text-sm sm:text-base">
                        <span className="text-gray-400">Username:</span>
                        <span className="ml-2">{gravatarProfile.preferredUsername}</span>
                      </div>
                    )}
                  </div>

                  {/* About Me */}
                  {gravatarProfile.aboutMe && (
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">About</h4>
                      <div className="bg-gray-950 hover:bg-gray-900 text-white p-3 sm:p-4 rounded-lg">
                        <p className="text-white whitespace-pre-line text-sm sm:text-base">
                          {gravatarProfile.aboutMe}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {gravatarProfile.emails && gravatarProfile.emails.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                        Contact
                      </h4>
                      <div className="bg-gray-950 hover:bg-gray-900 p-3 sm:p-4 rounded-lg">
                        {gravatarProfile.emails.map((email, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center mb-2 last:mb-0"
                          >
                            <span className="text-gray-400 mr-2 text-sm sm:text-base">Email:</span>
                            <a
                              href={`mailto:${email.value}`}
                              className="text-teal-200 hover:underline break-all text-sm sm:text-base"
                            >
                              {email.value}
                            </a>
                            {email.primary === "true" && (
                              <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 px-2 py-0.5 bg-blue-900 text-blue-100 text-xs rounded-full w-fit">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {/* Social Accounts */}
                  {gravatarProfile.accounts && gravatarProfile.accounts.length > 0 && (
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                        Social Accounts
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-white">
                        {gravatarProfile.accounts.map((account, index) => (
                          <div
                            key={index}
                            className="bg-gray-950 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center hover:bg-gray-900 transition-colors duration-150"
                          >
                            <div className="flex items-center justify-center  mb-2 sm:mb-0 text-white flex-1">
                              <div>
                                {account.iconUrl && (
                                  <img
                                    src={account.iconUrl}
                                    alt={account.name}
                                    className="w-5 h-5 invert sm:w-6 sm:h-6 mr-2 sm:mr-3"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-white text-sm sm:text-base">
                                  {account.name}
                                </h5>
                                <p className="text-xs sm:text-sm text-gray-300">
                                  {account.display}
                                </p>
                              </div>
                              <a
                                href={account.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-2 sm:px-3 py-1 mr-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
                              >
                                Visit
                              </a>
                              {account.verified && (
                                <span
                                  className="text-green-400 text-lg sm:text-xl"
                                  title="Verified"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Information */}
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                      Technical Details
                    </h4>
                    <div className="bg-gray-950 hover:bg-gray-900 p-3 sm:p-4 rounded-lg">
                      {gravatarProfile.hash && (
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm sm:text-base">Hash:</span>
                          <span className="ml-2 text-white font-mono text-xs sm:text-sm break-all">
                            {gravatarProfile.hash}
                          </span>
                        </div>
                      )}
                      {gravatarProfile.thumbnailUrl && (
                        <div className="mt-2 sm:mt-3">
                          <span className="text-gray-400 text-sm sm:text-base">Avatar URL:</span>
                          <div className="mt-1">
                            <a
                              href={gravatarProfile.thumbnailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-200 hover:underline text-xs sm:text-sm break-all"
                            >
                              {gravatarProfile.thumbnailUrl}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-950 p-3 sm:p-4 rounded-lg text-white">
                <p className="text-sm sm:text-base">
                  No Gravatar profile found for this email address.
                </p>
              </div>
            )}
          </DataSection>

          {/* Trello Details */}
          {isTrelloDataValid(trello) && (
            <DataSection title="Trello Profile" icon="📋">
              <div className="bg-gray-950 p-4 rounded-lg text-white">
                <div className="flex items-start">
                  {/* Profile Image with Error Handling */}
                  <div className="mr-5 relative">
                    {trello[0].avatarUrl ? (
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-800 bg-gray-800">
                        <img
                          src={trello[0].avatarUrl}
                          alt={trello[0].fullName || "Trello User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide broken image and show initials instead
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.currentTarget.parentNode as HTMLElement).classList.add(
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                            const initialsSpan = document.createElement("span");
                            initialsSpan.className = "text-2xl font-bold text-white";
                            initialsSpan.textContent =
                              trello[0].initials ||
                              (trello[0].fullName
                                ? trello[0].fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "TU");
                            e.currentTarget.parentNode?.appendChild(initialsSpan);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg flex items-center justify-center bg-blue-600 text-white">
                        <span className="text-2xl font-bold">
                          {trello[0].initials ||
                            (trello[0].fullName
                              ? trello[0].fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "TU")}
                        </span>
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full ${
                        trello[0].active ? "bg-green-500" : "bg-gray-500"
                      } flex items-center justify-center border-2 border-gray-900`}
                    >
                      <span className="text-xs text-white font-bold">
                        {trello[0].active ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>

                  {/* Basic Profile Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {trello[0].fullName || "Trello User"}
                      {trello[0].confirmed && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-900 text-blue-100 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-300 mb-1">@{trello[0].username || "user"}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          trello[0].active
                            ? "bg-green-900 text-green-100"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {trello[0].active ? "Active" : "Inactive"}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-900 text-purple-100 text-xs rounded">
                        {trello[0].memberType || "Member"}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-900 text-blue-100 text-xs rounded">
                        Last Active:{" "}
                        {trello[0].dateLastActive
                          ? new Date(trello[0].dateLastActive).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Account Details */}
                  <div>
                    <h4 className="font-medium text-lg text-white mb-3 border-b border-gray-800 pb-1">
                      Account Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white font-mono text-sm">
                          {trello[0].id || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        {trello[0].email ? (
                          <a
                            href={`mailto:${trello[0].email}`}
                            className="text-teal-200 hover:underline"
                          >
                            {trello[0].email}
                          </a>
                        ) : (
                          <span className="text-white">N/A</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joined:</span>
                        <span className="text-white">
                          {trello[0].joined !== undefined
                            ? trello[0].joined
                              ? "Yes"
                              : "No"
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Confirmed:</span>
                        <span className="text-white">
                          {trello[0].confirmed !== undefined
                            ? trello[0].confirmed
                              ? "Yes"
                              : "No"
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Activity Blocked:</span>
                        <span className="text-white">
                          {trello[0].activityBlocked !== undefined
                            ? trello[0].activityBlocked
                              ? "Yes"
                              : "No"
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Locale:</span>
                        <span className="text-white">{trello[0].prefs?.locale || "Not set"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Security & Stats */}
                  <div>
                    <h4 className="font-medium text-lg text-white mb-3 border-b border-gray-800 pb-1">
                      Security & Statistics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Two-Factor Authentication:</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            !trello[0].prefs?.twoFactor?.enabled
                              ? "bg-red-900 text-red-100"
                              : "bg-green-900 text-green-100"
                          }`}
                        >
                          {trello[0].prefs?.twoFactor?.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Color Blind Mode:</span>
                        <span className="text-white">
                          {trello[0].prefs?.colorBlind ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Privacy:</span>
                        <span className="text-white">
                          Name: {trello[0].prefs?.privacy?.fullName || "unknown"}, Avatar:{" "}
                          {trello[0].prefs?.privacy?.avatar || "unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <span className="text-gray-400">Boards:</span>
                        <span className="bg-blue-900 text-blue-100 px-2 py-0.5 rounded text-sm">
                          {trello[0].idBoards?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Organizations:</span>
                        <span className="bg-blue-900 text-blue-100 px-2 py-0.5 rounded text-sm">
                          {trello[0].idOrganizations?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DataSection>
          )}

          {/* LinkedIn Details */}
          {linkedinProfile && (
            <DataSection title="LinkedIn Profile" icon="💼">
              {linkedinProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Profile Information */}
                  <div className="md:col-span-2">
                    <div className="flex items-start mb-6">
                      {linkedinProfile.photoUrl && (
                        <img
                          src={linkedinProfile.photoUrl}
                          alt={linkedinProfile.displayName || "LinkedIn Profile"}
                          className="w-24 h-24 mr-4 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-2xl text-white mb-2">
                          {linkedinProfile.displayName}
                        </h4>
                        <p className="text-white text-lg mb-2">{linkedinProfile.headline}</p>
                        <p className="text-white">{linkedinProfile.location}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-3 text-xl">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DataItem label="Company" value={linkedinProfile.companyName} />
                        <DataItem label="LinkedIn URL" value={linkedinProfile.linkedInUrl} isLink />
                        {linkedinProfile.phoneNumbers?.length > 0 && (
                          <DataItem
                            label="Phone Numbers"
                            value={linkedinProfile.phoneNumbers.join(", ")}
                          />
                        )}
                      </div>
                    </div>

                    {/* Existing Summary Section */}
                    <h4 className="font-semibold mb-3 text-2xl text-white">Summary</h4>
                    <p className="whitespace-pre-line bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                      {linkedinProfile.summary}
                    </p>

                    {/* Existing Education Section */}
                    <h4 className="font-semibold mb-3 text-2xl text-white mt-1">Education</h4>
                    <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg mt-4">
                      <div className="space-y-3">
                        {linkedinProfile.schools?.educationHistory?.map((edu, index) => (
                          <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                            <h5 className="font-medium text-white">
                              <span className="text-white">School Name: </span>
                              {edu.schoolName}
                            </h5>
                            <p className="text-md text-white">
                              <span className="text-white">Degree: </span>
                              {edu.degreeName}
                            </p>
                            <p className="text-md text-white mt-1">
                              <span className="text-white">Duration: </span>
                              {edu.startEndDate.start.month}/{edu.startEndDate.start.year} -{" "}
                              {edu.startEndDate.end.month}/{edu.startEndDate.end.year}
                            </p>
                            <p className="text-md text-white mt-1">
                              <span className="text-white">Field of Study: </span>
                              {edu.fieldOfStudy}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Existing Experience Section */}
                    <h4 className="font-semibold mt-6 mb-3 text-2xl text-white">Experience</h4>
                    <div className="space-y-4">
                      {linkedinProfile.positions?.positionHistory?.map((position, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-950 hover:bg-gray-900 text-white rounded-lg transition-colors duration-150"
                        >
                          <div className="flex items-start">
                            {position.companyLogo && (
                              <img
                                src={position.companyLogo}
                                alt={position.companyName}
                                className="w-12 h-12 mr-3 object-contain bg-black p-1 rounded"
                              />
                            )}
                            <div>
                              <h5 className="font-medium text-white">{position.title}</h5>
                              <p className="text-md text-white">{position.companyName}</p>
                              <p className="text-xs text-white mt-1">
                                {position.startEndDate.start.month}/
                                {position.startEndDate.start.year} -{" "}
                                {position.startEndDate.end.month
                                  ? `${position.startEndDate.end.month}/${position.startEndDate.end.year}`
                                  : "Present"}
                                {position.duration && ` • ${position.duration}`}
                              </p>
                            </div>
                          </div>
                          {position.description && (
                            <p className="text-white mt-3 text-md whitespace-pre-line">
                              {position.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Existing Skills Section */}
                    <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-2xl">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {linkedinProfile.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md hover:bg-blue-200 transition-colors duration-150"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-950 p-4 rounded-lg text-white">
                  {linkedin?.Error ? (
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-yellow-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <p className="font-bold">Authentication Error</p>
                        <p>Could not retrieve LinkedIn profile information.</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {linkedin.Error.Message?.Message || linkedin.Error.Code}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No LinkedIn profile found for this email address.</p>
                  )}
                </div>
              )}
            </DataSection>
          )}

          {/* Other Services */}
          <DataSection title="Other Services" icon="🛠️">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-950 hover:bg-gray-900 text-white p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 sm:mb-3 text-lg sm:text-2xl">Notion</h4>
                {notion?.value?.value ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4">
                      {notion.value.value.profile_photo ? (
                        <img
                          src={notion.value.value.profile_photo}
                          alt={notion.value.value.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-md mb-2 sm:mb-0 sm:mr-4 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-900 rounded-md flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
                          <span className="text-white text-sm sm:text-xl font-bold">
                            {notion.value.value.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                      <div className="text-center sm:text-left">
                        <h5 className="text-base sm:text-lg font-semibold text-white">
                          {notion.value.value.name}
                        </h5>
                        <div className="flex items-center justify-center sm:justify-start mt-1">
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              notion.value.value.onboarding_completed
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {notion.value.value.onboarding_completed
                              ? "Onboarded"
                              : "Active Account"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                      <p className="text-white text-xs sm:text-sm">
                        <span className="font-medium">User ID:</span>
                        <span className="ml-2 text-gray-300 break-all">
                          {notion.value.value.id}
                        </span>
                      </p>
                      <p className="text-white text-xs sm:text-sm">
                        <span className="font-medium">Version:</span>
                        <span className="ml-2 text-gray-300">{notion.value.value.version}</span>
                      </p>
                      <p className="text-white text-xs sm:text-sm">
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">
                          <a
                            href={`mailto:${notion.value.value.email}`}
                            className="text-teal-200 hover:underline break-all"
                          >
                            {notion.value.value.email}
                          </a>
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-white text-sm sm:text-md">No Notion Data available</p>
                )}
              </div>

              <div className="bg-gray-950 hover:bg-gray-900 text-white p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 sm:mb-3 text-lg sm:text-2xl">Adobe</h4>
                {adobe && adobe.length > 0 && (
                  <div className="bg-gray-950 p-3 sm:p-4 rounded-lg text-white">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center mb-2 sm:mb-3">
                          <span
                            className={`px-2 py-1 mr-2 mb-1 sm:mb-0 rounded text-xs ${
                              adobe[0].status.code === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {adobe[0].status.code}
                          </span>
                          <h3 className="text-sm sm:text-lg font-medium">
                            {adobe[0].type === "individual"
                              ? "Individual Account"
                              : "Organization Account"}
                          </h3>
                        </div>

                        {adobe[0].authenticationMethods && (
                          <div className="mt-3 sm:mt-4">
                            <h4 className="text-sm sm:text-md font-medium mb-2">
                              Authentication Methods:
                            </h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {adobe[0].authenticationMethods.map((method, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                                >
                                  {method.id}
                                  {method.url && (
                                    <a
                                      href={method.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-1 sm:ml-2 text-blue-400 hover:underline"
                                    >
                                      (link)
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 sm:mt-4">
                          <h4 className="text-sm sm:text-md font-medium mb-2">Account Details:</h4>
                          <p className="text-xs sm:text-sm">
                            <strong>Has T2E Linked:</strong> {adobe[0].hasT2ELinked ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-950 hover:bg-gray-900 text-white p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2 sm:mb-3 text-lg sm:text-2xl">Goodreads</h4>
                {goodreads && (goodreads.username?.length > 0 || goodreads.profiles?.length > 0) ? (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base">
                      <strong>Username:</strong> {goodreads.username?.[0] || "N/A"}
                    </p>
                    {goodreads.profiles?.[0] && (
                      <p className="text-sm sm:text-base">
                        <strong>Profile:</strong>{" "}
                        <a
                          href={goodreads.profiles[0]}
                          className="text-blue-400 hover:underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                    <p className="text-sm sm:text-base">
                      <strong>Location:</strong> {goodreads.location?.[0] || "N/A"}
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Books Read:</strong> {goodreads.book_counts?.[0] || "0"}
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Friends:</strong> {goodreads.friend_counts?.[0] || "0"}
                    </p>
                  </div>
                ) : (
                  <p className="text-white text-sm sm:text-md">
                    No Goodreads profile found for this email address.
                  </p>
                )}
              </div>
            </div>
          </DataSection>

          {/* infostealer */}
          {infostealers && (
            <DataSection title="Infostealer Information" icon="🔒">
              {infostealers.stealers && infostealers.stealers.length > 0 ? (
                <div className="bg-gray-950 hover:bg-gray-900 p-5 rounded-lg mb-4 border-l-4 border-red-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-400">Security Alert</h3>
                      <div className="mt-2 text-md text-white">{infostealers.message}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-950 hover:bg-gray-900 p-5 rounded-lg mb-4 border-l-4 border-green-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-400">No Infection Detected</h3>
                      <div className="mt-2 text-md text-white">{infostealers.message}</div>
                    </div>
                  </div>
                </div>
              )}

              {infostealers.stealers && infostealers.stealers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <div className="bg-gray-950 hover:bg-gray-900 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-xl text-white mb-3">Infection Details</h4>
                      {infostealers.stealers[0] && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DataItem
                              label="Date Compromised"
                              value={new Date(
                                infostealers.stealers[0].date_compromised
                              ).toLocaleString()}
                            />
                            <DataItem
                              label="Computer Name"
                              value={infostealers.stealers[0].computer_name}
                            />
                            <DataItem
                              label="Operating System"
                              value={infostealers.stealers[0].operating_system}
                            />
                            <DataItem label="IP Address" value={infostealers.stealers[0].ip} />
                          </div>
                          <div className="mt-4">
                            <h5 className="font-medium text-white mb-2">Malware Information</h5>
                            <div className="bg-gray-900 p-3 rounded border border-gray-700">
                              <p className="text-white break-all">
                                <span className="font-medium">Malware Path: </span>
                                {infostealers.stealers[0].malware_path}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-950 hover:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium text-xl text-white mb-3">Affected Credentials</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {infostealers.stealers[0]?.top_logins && (
                          <div>
                            <h5 className="font-medium text-white mb-2">Top Compromised Logins</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {infostealers.stealers[0].top_logins.map((login, index) => (
                                <li key={index} className="text-white">
                                  {login}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {infostealers.stealers[0]?.top_passwords && (
                          <div>
                            <h5 className="font-medium text-white mb-2">
                              Top Compromised Passwords
                            </h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {infostealers.stealers[0].top_passwords.map((password, index) => (
                                <li key={index} className="text-white">
                                  {password}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-950 hover:bg-gray-900 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-xl text-white mb-3">Compromise Summary</h4>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-400">
                            {infostealers.total_user_services}
                          </div>
                          <div className="text-sm text-gray-300">User Services Affected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-400">
                            {infostealers.total_corporate_services}
                          </div>
                          <div className="text-sm text-gray-300">Corporate Services Affected</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-950 hover:bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-medium text-xl text-white mb-3">Antivirus Status</h4>
                      {infostealers.stealers[0]?.antiviruses && (
                        <div>
                          <p className="text-gray-300 mb-2">
                            Detected but failed to prevent infection:
                          </p>
                          <div className="space-y-2">
                            {infostealers.stealers[0].antiviruses.map((av, index) => (
                              <div
                                key={index}
                                className="flex items-center p-2 bg-gray-900 rounded-lg"
                              >
                                <svg
                                  className="h-5 w-5 text-red-500 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-white">{av}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DataSection>
          )}

          {/* ProtonMai */}
          {protonmail && (
            <DataSection title="ProtonMail" icon="✉️">
              <div className="bg-gray-950 p-4 rounded-lg text-white">
                <p>{protonmail.protonmail}</p>
              </div>
            </DataSection>
          )}

          {/* HIBP Breach Data */}
          {hibp && hibp.length > 0 && hibp[0] !== "not_found" && (
            <DataSection title="Breach Information" icon="⚠️">
              <div className="space-y-6">
                {hibp.map(
                  (breach, index) =>
                    typeof breach === "object" &&
                    breach !== null && (
                      <div
                        key={index}
                        className="p-4 bg-gray-950 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150"
                      >
                        <div className="flex items-start mb-3">
                          {breach.LogoPath && (
                            <img
                              src={breach.LogoPath}
                              alt={breach.Name}
                              className="w-12 h-12 mr-3 object-contain bg-black p-1 rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-2xl">{breach.Name}</h4>
                            <p className="text-md text-white">
                              Breach date: {breach.BreachDate} •{" "}
                              {breach.PwnCount ? breach.PwnCount.toLocaleString() : "Unknown"}{" "}
                              accounts affected
                            </p>
                          </div>
                        </div>
                        {breach.Description && (
                          <div
                            dangerouslySetInnerHTML={{ __html: breach.Description }}
                            className="prose max-w-none text-white mb-3 text-md"
                          />
                        )}
                        {breach.DataClasses && (
                          <DataList label="Compromised Data" items={breach.DataClasses} />
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                          <div
                            className={`px-2 py-1 rounded text-xs text-center font-medium ${
                              breach.IsVerified
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-blue-800"
                            }`}
                          >
                            Verified: {breach.IsVerified ? "✓" : "✗"}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs text-center font-medium ${
                              breach.IsSensitive
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-red-800"
                            }`}
                          >
                            Sensitive: {breach.IsSensitive ? "✓" : "✗"}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs text-center font-medium ${
                              breach.IsRetired
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-yellow-800"
                            }`}
                          >
                            Retired: {breach.IsRetired ? "✓" : "✗"}
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs text-center font-medium ${
                              breach.IsMalware
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-red-800"
                            }`}
                          >
                            Malware: {breach.IsMalware ? "✓" : "✗"}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </DataSection>
          )}
          {hibp && hibp.length > 0 && hibp[0] === "not_found" && (
            <DataSection title="Breach Information" icon="✅">
              <div className="bg-green-900 bg-opacity-20 border border-green-500 text-white p-4 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-green-300">Good News!</h3>
                    <p className="mt-1">No data breaches found for this email address.</p>
                  </div>
                </div>
              </div>
            </DataSection>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-lg sm:text-xl md:text-2xl">
            Loading Data from JSONPlaceholder...
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileCard;