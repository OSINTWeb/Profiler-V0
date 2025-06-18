import React, { useState, useEffect } from "react";
import InfoCardsContainer from "./StatsCard";
import { Header } from "../Header";
import InfoCardList from "./InfocardList";
import "@/index.css";
import Datta from "@/Data/export_test@gmail.com.json";
import PhoneData from "@/Data/+918318943598.json";
import user from "@/Data/Aditya.json";
import ActivityProfileCard from "./ActivityProfileCard";
import BreachedAccount from "./Breached";
import LoadingSkeleton from "../LoadingSkeleton";
import { NewTimeline } from "./NewTimeline";
import Footer from "../Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const UI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const PaidSearch = params.get("PaidSearch");
  const query = params.get("query");
  const typeofsearch = params.get("typeofsearch");
  const UserId = params.get("userId");
  const [DATA, setDATA] = useState([]);
  const [hidebutton, sethidebutton] = useState(false);
  const [isloading, setisloading] = useState(true);
  const [error, setError] = useState(null);
  const [HibpCount, setHibpCount] = useState(0);
  const [hibpData, setHibpData] = useState([]);
  const [nonHibpData, setNonHibpData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Auth0 and authentication state
  const { user, isAuthenticated, loginWithRedirect, isLoading: authLoading } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [authStep, setAuthStep] = useState("checking"); // 'checking', 'authenticating', 'fetching_user', 'checking_credits', 'fetching_data', 'complete', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const FetchURL = import.meta.env.VITE_ADVANCE_BACKEND;
  const AUTH_URL = import.meta.env.VITE_AUTH_BACKEND;

  // Step 1: Handle Auth0 authentication
  useEffect(() => {
    const handleAuthentication = async () => {
      if (authLoading) {
        setAuthStep("checking");
        return;
      }

      if (!isAuthenticated || !user) {
        setAuthStep("authenticating");
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

      const res = await fetch(
        `${AUTH_URL}/api/auth/findbyemail?email=${encodeURIComponent(user.email)}`
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

      // Proceed to check credits
      setAuthStep("checking_credits");
      await checkCreditsAndFetchData(userDataObj);
    } catch (err) {
      console.error("User fetch error:", err);
      setErrorMessage(`Failed to fetch user data: ${err.message}`);
      setAuthStep("error");
      setisloading(false);
    }
  };

  // Step 3: Check credits and fetch advance data
  const checkCreditsAndFetchData = async (userInfo) => {
    try {
      // Check if user has sufficient credits (0.5 for advance search)
      if (query === "45206164641316463216463164") {
        setAuthStep("complete");
        setisloading(false);
        fetchAdvanceData(userInfo);
        return;
      }
      const requiredCredits = 0.5;

      if (userInfo.credits < requiredCredits) {
        setErrorMessage(
          `Insufficient credits. You need at least ${requiredCredits} credits to perform this advanced search. Current balance: ${userInfo.credits}`
        );
        setAuthStep("error");
        setisloading(false);
        return;
      }

      // Update URL if parameters are missing
      if ((!params.get("PaidSearch") || !params.get("query")) && PaidSearch && query) {
        const newParams = new URLSearchParams();
        newParams.set("PaidSearch", PaidSearch);
        newParams.set("query", query);
        if (typeofsearch) newParams.set("typeofsearch", typeofsearch);
        if (userInfo.id) newParams.set("userId", userInfo.id);
        navigate(`?${newParams.toString()}`, { replace: true });
      }

      // Add a delay before fetching data (as requested)
      setAuthStep("fetching_data");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 second delay

      await fetchAdvanceData(userInfo);
    } catch (err) {
      console.error("Credits check error:", err);
      setErrorMessage(`Credits check failed: ${err.message}`);
      setAuthStep("error");
      setisloading(false);
    }
  };

  // Step 4: Fetch advance data
  const fetchAdvanceData = async (userInfo) => {
    try {
      if (!query || !PaidSearch) {
        setErrorMessage("Missing query or search type parameters");
        setAuthStep("error");
        setisloading(false);
        return;
      }

      // Handle demo data case
      if (query === "45206164641316463216463164") {
        let newData;
        if (PaidSearch === "Phone") {
          newData = Datta;
        } else if (PaidSearch === "Email") {
          newData = Datta;
        } else if (PaidSearch === "Username") {
          newData = user;
        }
        if (newData) {
          setDATA(newData);
          setUsingFallback(false);
          setAuthStep("complete");
          setisloading(false);
        }
        return;
      }

      try {
        const queryType = PaidSearch.toLowerCase();
        console.log("Fetching advance data for:", query, "Type:", queryType);

        const response = await fetch(
          `${FetchURL}/AdvanceResult?type=${queryType.toLowerCase()}&query=${encodeURIComponent(
            query
          )}`
        );

        if (response.ok) {
          const result = await response.json();
          console.log("API success:", result);
          setDATA(result);
          setUsingFallback(false);

          // Deduct credits after successful API call
          await deductCredits(userInfo.id, 0.5);

          setAuthStep("complete");
          setisloading(false);
        } else {
          console.error(`API error: ${response.status}`);
          throw new Error(`API returned ${response.status}`);
        }
      } catch (apiErr) {
        console.error("Error with server API call:", apiErr);
        console.log("API attempt failed. Using fallback data");

        // Use fallback data based on search type
        let fallbackData;
        if (PaidSearch === "Phone") {
          fallbackData = PhoneData;
        } else if (PaidSearch === "Email") {
          fallbackData = Datta;
        } else if (PaidSearch === "Username") {
          fallbackData = user;
        } else {
          fallbackData = Datta; // Default fallback
        }

        setDATA(fallbackData);
        setUsingFallback(true);
        setAuthStep("complete");
        setisloading(false);
      }
    } catch (err) {
      console.error("Failed to fetch advance data:", err);
      setErrorMessage(`Failed to fetch advance data: ${err.message}`);
      setAuthStep("error");
      setisloading(false);
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
        // Update local user data
        setUserData((prev) => ({
          ...prev,
          credits: prev.credits - amount,
        }));
      }
    } catch (creditErr) {
      console.error("Failed to update credits:", creditErr);
    }
  };

  // Check for page refresh and redirect if needed
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

  useEffect(() => {
    if (DATA.length > 0) {
      const hibpItems = DATA.filter((item) => item.module === "hibp");
      const nonHibpItems = DATA.filter((item) => item.module !== "hibp");
      setNonHibpData(nonHibpItems);
      if (hibpItems.length > 0) {
        setHibpData(hibpItems);
        // console.log("HIBP ITEMS", hibpItems[0].data.length);
        setHibpCount(hibpItems[0].data.length);
      }
    }
  }, [DATA]);

  // Loading states
  if (isloading || authStep !== "complete") {
    // Show the older LoadingSkeleton when fetching data
    if (authStep === "fetching_data") {
      return (
        <div className="flex flex-col text-white gap-10 justify-center items-center mx-auto  sm:px-12 md:px-16 lg:px-36 scrollbar py-3 scrollbar-hidden w-full overflow-x-hidden px-2">
          <div className="h-screen absolute top-0 left-0 w-full z-[-1] scrollbar-hidden">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/3fa80b610429bb88de86c8b20c39e87e7307087081b833e523b4bd950d758363?placeholderIfAbsent=true"
              className="md:object-fit lg:object-cover opacity-30 w-full h-full absolute top-0 left-0"
              alt="Background top"
            />
          </div>
          <LoadingSkeleton />
        </div>
      );
    }

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
                setisloading(true);
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
                    : "100%",
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white gap-10 justify-center items-center mx-auto  sm:px-12 md:px-16 lg:px-36 scrollbar py-3 scrollbar-hidden w-full overflow-x-hidden px-2">
      <div className="h-screen absolute top-0 left-0 w-full z-[-1] scrollbar-hidden">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/3fa80b610429bb88de86c8b20c39e87e7307087081b833e523b4bd950d758363?placeholderIfAbsent=true"
          className="md:object-fit lg:object-cover opacity-30 w-full h-full absolute top-0 left-0"
          alt="Background top"
        />
      </div>

      {usingFallback && (
        <div className="bg-orange-600 text-white p-2 sm:p-3 rounded-md mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
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
              setDATA([]);
              setAuthStep("fetching_data");
              setisloading(true);

              if (userData) {
                await fetchAdvanceData(userData);
              }
            }}
            className="bg-white text-orange-600 px-2 sm:px-3 py-1 rounded hover:bg-orange-100 transition-colors duration-200 font-medium text-xs sm:text-sm w-full sm:w-auto"
          >
            Retry API
          </button>
        </div>
      )}

      {/* User Credits Header */}

      {DATA.length > 0 ? (
        <>
          <Header />
          {/* {JSON.stringify(nonHibpData.map((item) => item.widgets[0]?.content[0]?.value))} */}
          {query !== "45206164641316463216463164" && (
            <div className="flex items-center justify-center w-full mb-6">
              <h2 className="text-white text-2xl font-semibold relative group">
                Results for: <span className="text-teal-300">{query}</span>
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent transform scale-x-100 transition-transform duration-300"></div>
              </h2>
            </div>
          )}
          {hibpData.length > 0 && (
            <button
              className="bg-[#131315] text-white border flex gap-3 flex-1 grow shrink basis-auto px-4 py-4 rounded-md border-red-500 border-solid overflow-visible shadow-md shadow-red-700/40 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/70 transition-all duration-300 group relative"
              onClick={() => {
                document.getElementById("breached-account")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="text-red-200 font-bold text-lg">View Breached Data</div>{" "}
              <sup>{HibpCount}</sup>
            </button>
          )}
          <div className="flex justify-between w-full">
            <InfoCardsContainer data={nonHibpData} />
          </div>
          <div className="flex justify-between w-full">
            <NewTimeline data={nonHibpData} />
            {/* <Timeline data={DATA} /> */}
          </div>
          <div className="flex justify-between w-full">
            <ActivityProfileCard userData={nonHibpData} />
          </div>
          <div id="breached-account" className="flex justify-between w-full">
            <BreachedAccount userData={hibpData} />
          </div>
          <div className="w-full">
            <InfoCardList
              users={nonHibpData}
              hidebutton={hidebutton}
              PaidSearch={PaidSearch}
              sethidebutton={sethidebutton}
            />
          </div>
          <Footer />
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg sm:text-xl md:text-2xl">No data available</div>
        </div>
      )}
    </div>
  );
};

export default UI;
