import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { SearchTypeSelector } from "./paidcomponents/SearchTypeselect";
import { SearchOptions } from "./paidcomponents/Options";
import { SearchTypes } from "./paidcomponents/SearchTypes";
import { X, ExternalLink } from "lucide-react";

import "@/index.css";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth0 } from "@auth0/auth0-react";
import CountrySelect from "@/pages/contryselect";
import background from "./background.mp4";
import searchbg from "./searchbg.mp4";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth0();
  const [isUser, setIsUser] = useState(false);
  const [input, setInput] = useState({ datatype: "Email", value: "" });
  const [selected, setSelected] = useState<string>("Paid");
  const [PaidSearch, setPaidSearch] = useState("Email");
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [countryCodeDigits, setCountryCodeDigits] = useState(10); // Default number of digits for the selected country code
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [emailError, setEmailError] = useState<string>(""); // State for email validation error
  const [query, setQuery] = useState("");
  const [phoneError, setPhoneError] = useState<string>(""); // State for phone validation
  const [typeofsearch, settypeofsearch] = useState("Advance");
  const [userCredits, setUserCredits] = useState(0);
  const [userData, setUserData] = useState({
    _id: "",
    email: "",
    name: "",
    phone: "",
    credits: 0,
  });
  const FreemiumTools = [
    {
      title: "Mail2LinkedIn",
      description: "Find LinkedIn with Just an Email while you search for a person",
      link: "https://mail2linkedin.profiler.me/",
    },
    {
      title: "EmailIntel",
      description: "Reveal where an email is registered across 30+ popular platforms.",
      link: "https://emailintel.profiler.me/",
    },
    {
      title: "Basic Search",
      description: "Search for a person by email, or phone number",
      link: "/basicsearch",
    },
  ];
  const [miniCredits, setMiniCredits] = useState(0);
  const [creditsError, setCreditsError] = useState("");
  useEffect(() => {
    const requiredCredits = typeofsearch === "Basic" ? 0.05 : 0.5;
    setMiniCredits(requiredCredits);

    if (userCredits < requiredCredits) {
      setCreditsError(
        `You need at least ${requiredCredits} credits to perform this ${typeofsearch.toLowerCase()} search.`
      );
    } else {
      setCreditsError("");
    }
  }, [userCredits, typeofsearch]);

  useEffect(() => {
    // Calculate required credits based on search type
    const requiredCredits = typeofsearch === "Basic" ? 0.05 : 0.5;
    setMiniCredits(requiredCredits);
    // Check if user has enough credits
    if (userCredits < requiredCredits) {
      setCreditsError(
        `You need at least ${requiredCredits} credits to perform this ${typeofsearch} search.`
      );
    } else {
      setCreditsError("");
    }
  }, [userCredits, typeofsearch]); // Now properly watching both userCredits and typeofsearch

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUserData = async () => {
      if (!user) {
        console.error("User data is not available");
        return;
      }
      setIsLoading(true);
      const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;
      const response = await fetch(
       `${API_BASE_URL}/api/auth/findbyemail?email=${user.email}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data._id) {
        throw new Error("User data incomplete");
      }

      setUserData({
        _id: data.data._id,
        email: data.data.email,
        name: data.data.name || "Customer",
        phone: data.data.phone || "",
        credits: data.data.credits || 0,
      });
      setUserCredits(data.data.credits || 0);
      setIsLoading(false);
    };

    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    const storedInputValue = localStorage.getItem("inputValue");
    if (storedInputValue) {
      setInput((prev) => ({ ...prev, value: storedInputValue }));
      localStorage.removeItem("inputValue");
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  console.log("userCredits", countryCode,countryCodeDigits);
  const validatePhone = (phone) => {
    const phoneRegex = new RegExp(`^[0-9]{${countryCodeDigits}}$`);
    return phoneRegex.test(phone);
  };
  return (
    <div className="h-screen flex flex-col  items-center  overflow-y-auto scrollbar">
      <div className="flex h-full w-full flex-col items-center overflow-x-hidden ">
        <Header />
         {selected === "Paid" && (
        <div className="absolute w-full h-screen bg-black z-[-1] overflow-hidden md:object-cover  ">
          {!isUser && (
            <video
              className="w-full  h-full absolute top-0 left-0   object-cover lg:scale-105 md:scale-150 sm:scale-100"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={background} type="video/mp4" />
            </video>
          )}
          {isUser && (
            <video
              className="w-full   h-full absolute top-0 left-0   object-cover lg:scale-105 md:scale-150 sm:scale-100"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={searchbg} type="video/mp4" />
            </video>
          )}
        </div>
      )}
        <div className="form  text-white h-full flex mb-56  w-full  flex-col items-center mt-[8%] gap-4 px-1 ">
          <SearchTypeSelector selected={selected} setSelected={setSelected} />
          
          {selected === "Offers" && (
            <div className="w-full mx-auto mb-2">
              <div className="rounded-lg py-3 px-6 flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
                  <h2 className="text-2xl font-bold text-green-300 animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.9)] [text-shadow:_0_0_15px_rgba(34,197,94,1),_0_0_20px_rgba(34,197,94,0.8),_0_0_25px_rgba(34,197,94,0.6)] bg-gradient-to-r from-green-400 to-green-300 bg-clip-text">
                    LIMITED TIME OFFER
                  </h2>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse ml-3"></div>
                </div>
                <p className="text-gray-300 mt-1 text-center text-lg">
                  Get up to 5-10 credits for free on following platform
                </p>
                <a
                  href={`https://docs.google.com/forms/d/1NfQdBCQnjBEHe7Gup46BZLmRfWj2hnAXdyt_rwMMIJk/viewform?edit_requested=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 group"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      loginWithRedirect();
                    }
                  }}
                >
                  <button
                    className={`px-8 py-3 rounded-lg text-white font-medium
                    border shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
                    transition-all duration-300 transform
                    ${
                      isAuthenticated
                        ? "bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(34,197,94,0.25)] hover:scale-105"
                        : "bg-white/5 border-white/10 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">
                        {isAuthenticated ? "Get Free Credits" : "Login to Get Free Credits"}
                      </span>
                      <ExternalLink
                        size={16}
                        className="transform transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                </a>
              </div>
              <div className="flex flex-wrap gap-4  justify-center items-center w-full mt-10">
                {FreemiumTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#131315] rounded-lg w-64 p-4 border border-white/10 hover:border-gray-500 transition-colors"
                  >
                    <h3 className="font-bold text-lg flex items-center justify-between">
                      {tool.title}
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </h3>
                    <p className="text-gray-300 text-sm mt-2">{tool.description}</p>
                    <button
                      onClick={() => {
                        window.open(tool.link, "_blank");
                      }}
                      className="mt-4 w-full border border-white/10 text-teal-300  py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Search Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <SearchTypes
            settypeofsearch={settypeofsearch}
            selected={selected}
            typeofsearch={typeofsearch}

          />
          {selected === "Paid" && (
            <div className="p-6 w-full flex flex-col justify-center items-center gap-3 ">
              <div className="self-center flex w-[600px] max-w-full gap-3 text-base flex-wrap justify-center ">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-5 text-[#f4f4f4] font-medium grow shrink basis-auto  px-5 py-0.5 rounded-md border border-white/15  bg-[#000000/15]">
                        {PaidSearch === "Phone" && (
                          <CountrySelect
                            value={countryCode}
                            onChange={setCountryCode}
                            onDigitsChange={setCountryCodeDigits}
                          />
                        )}
                        <Input
                          type="text"
                          placeholder={
                            selected === "Paid" ? `Enter your ${input.datatype}` : "Enter your Tool"
                          }
                          onChange={(e) => {
                            if (userCredits >= miniCredits) {
                              setInput((prev) => ({ ...prev, value: e.target.value }));
                              if (selected === "Free") {
                                setQuery(e.target.value);
                              } else if (PaidSearch === "Username") {
                                setQuery(e.target.value);
                                setEmailError("");
                                setPhoneError("");
                              } else if (PaidSearch === "Email") {
                                if (!validateEmail(e.target.value)) {
                                  setEmailError("The email you typed is invalid.");
                                } else {
                                  setQuery(e.target.value);
                                  setEmailError("");
                                }
                              } else if (PaidSearch === "Phone") {
                                if (!validatePhone(e.target.value)) {
                                  setPhoneError("The phone number you entered is invalid.");
                                } else {
                                  setQuery(countryCode + e.target.value);
                                  setPhoneError("");
                                }
                              }
                            }
                          }}
                          value={input.value}
                          className="bg-black border-none text-white placeholder:text-[#f4f4f4] focus-visible:ring-0"
                          disabled={userCredits < miniCredits}
                        />
                        {input.value && (
                          <button
                            onClick={() => setInput((prev) => ({ ...prev, value: "" }))}
                            className="text-gray-400 hover:text-white transition-all duration-200"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your search query</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="bg-gradient-to-b from-[#677272] to-[#212121] border border-gray-700 shadow-[0px_2px_0px_rgba(255,255,255,0.3)] text-white font-normal text-center leading-none px-8 py-5 rounded-lg text-lg w-full sm:w-auto mx-2  "
                  onClick={() => {
                    const params = new URLSearchParams({
                      PaidSearch: PaidSearch,
                      query: query,
                      typeofsearch: typeofsearch,
                      Token: userData._id,
                    });
                    if (query != "") {
                      if (typeofsearch === "Basic") {
                        window.open(`/result/${typeofsearch}?${params.toString()}`, "_blank");
                      } else {
                        window.open(`/result/${typeofsearch}?${params.toString()}`, "_blank");
                      }
                    }
                  }}
                  disabled={
                    !input.value ||
                    isLoading ||
                    !!emailError ||
                    !!phoneError ||
                    typeofsearch === "" ||
                    (PaidSearch === "Phone" && typeofsearch === "Basic") ||
                    userCredits < miniCredits
                  }
                >
                  Search
                </Button>
              </div>
              {PaidSearch === "Email" && input.value && emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
              {PaidSearch === "Phone" && input.value && phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
              {userCredits < miniCredits && (
                <p className="text-red-500 text-sm mt-1">{creditsError}</p>
              )}
            </div>
          )}
          {selected === "Paid" && (
            <>
              <SearchOptions
                setPaidSearch={setPaidSearch}
                setInput={setInput}
                input={input}
                PaidSearch={PaidSearch}
                typeofsearch={typeofsearch}
              />
            </>
          )}
          {selected === "Paid" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                className="group relative overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-950 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/30 w-full sm:w-auto border border-gray-600"
                onClick={() => {
                  if (!PaidSearch) {
                    alert("Please select a search type first");
                    return;
                  }
                  const params = new URLSearchParams({
                    query: "45206164641316463216463164",
                    type: "Advance",
                    PaidSearch: PaidSearch,
                    Token: userData._id,
                  });
                  window.open(`/result/Advance?${params.toString()}`, "_blank");
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Demo: Advanced Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>{" "}
              <button
                className="group relative overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-gray-950 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/30 w-full sm:w-auto border border-gray-600"
                onClick={() => {
                  if (!PaidSearch) {
                    alert("Please select a search type first");
                    return;
                  }
                  const params = new URLSearchParams({
                    query: "dheerajydv19@proton.me",
                    type: "Basic",
                    PaidSearch: PaidSearch,
                    Token: userData._id,
                  });
                  window.open(`/result/Basic?${params.toString()}`, "_blank");
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Demo: Basic Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
