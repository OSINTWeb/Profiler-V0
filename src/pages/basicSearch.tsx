import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CountrySelect from "@/pages/contryselect";
import { X, Search, Mail, Phone as PhoneIcon, AlertCircle, Shield, User, Link as LinkIcon, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import background from "./background.mp4";
import { useAuth0 } from "@auth0/auth0-react";

const DataSection = ({ title, children, icon }) => (
  <div className="bg-black/70 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
    <div className="flex items-center mb-4 pb-2 border-b border-gray-800">
      {icon && <div className="mr-3 text-teal-500">{icon}</div>}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const DataItem = ({ label, value, isLink = false }) => {
  if (value === null || value === undefined) return null;
  
  const formatValue = (val) => {
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  };

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-md font-medium text-gray-300 mb-1">{label}</div>
      {isLink && typeof value === "string" ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-300 hover:underline break-all hover:text-teal-400 transition-colors duration-150"
        >
          {value}
        </a>
      ) : (
        <div className="text-white break-all">{formatValue(value)}</div>
      )}
    </div>
  );
};

export default function BasicSearch() {
  const [searchType, setSearchType] = useState<"Email" | "Phone">("Email");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCodeDigits, setCountryCodeDigits] = useState(10);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();

  // Function to validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to validate phone number format
  const validatePhone = (phone: string) => {
    const phoneRegex = new RegExp(`^[0-9]{${countryCodeDigits}}$`);
    return phoneRegex.test(phone);
  };

  // Handle search form submission
  const handleSearch = async () => {
    setErrorMessage("");
    
    // Validate input based on search type
    if (searchType === "Email" && !validateEmail(input)) {
      setEmailError("The email you typed is invalid.");
      return;
    }
    
    if (searchType === "Phone" && !validatePhone(input)) {
      setPhoneError("The phone number you entered is invalid.");
      return;
    }

    setIsLoading(true);
    setResults(null);
    
    try {
      const API_BASE_URL = "http://profilerfreemiumbackend-production.up.railway.app";
      const AUTH_URL = import.meta.env.VITE_AUTH_BACKEND || "";
      
      const query = searchType === "Phone" ? countryCode + input : input;
      
      let endpoint = `${API_BASE_URL}/BasicSearch`;
      
      if (searchType === "Email") {
        endpoint += `?email=${encodeURIComponent(query)}`;
      } else {
        endpoint += `/phone?phone=${encodeURIComponent(query)}`;
      }
      
      console.log(`Fetching data from: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("API success. Full data:", data);
      
      // Check specifically for LinkedIn data
      if (data.linkedin) {
        console.log("LinkedIn data found:", data.linkedin);
      } else {
        console.log("No LinkedIn data returned from API");
      }
      
      setResults(data);
      
      // If authenticated, deduct credits
      if (isAuthenticated && user) {
        try {
          const creditsResponse = await fetch(`${AUTH_URL}/api/credits/remove/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.sub,
              amount: 0.05, // Basic search credit cost
            }),
          });
          
          if (creditsResponse.ok) {
            console.log("Credits removed successfully");
          }
        } catch (creditErr) {
          console.error("Failed to update credits:", creditErr);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("An error occurred while searching. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;
    
    // Destructure with default empty values to prevent errors
    const {
      hibp = [],
      gravatar = {},
      trello = [],
      notion = {},
      adobe = [],
      linkedin = [],
      goodreads = {},
      social_media_checker = {},
      ghunt = {},
      protonmail = {},
      infostealers = {},
    } = results;
    
    const hasHibpData = hibp && Array.isArray(hibp) && hibp.length > 0;
    const hasTrelloData = trello && Array.isArray(trello) && trello.length > 0;
    const hasAdobeData = adobe && Array.isArray(adobe) && adobe.length > 0;
    const hasLinkedInData = linkedin && Array.isArray(linkedin) && linkedin.length > 0;
    
    // Get the first LinkedIn profile if available
    const linkedInProfile = hasLinkedInData ? linkedin[0] : null;
    
    return (
      <div className="mt-8 space-y-6">
        {/* Have I Been Pwned */}
        {hasHibpData && (
          <DataSection title="Have I Been Pwned" icon={<Shield className="text-red-500" />}>
            <div className="text-white mb-4">
              This email appears in {hibp.length} data breach{hibp.length !== 1 ? 'es' : ''}.
            </div>
            {hibp.map((breach, index) => (
              <div key={index} className="mt-3 p-3 bg-gray-900/50 rounded-md">
                <DataItem label="Breach Name" value={breach.Name} />
                <DataItem label="Domain" value={breach.Domain} isLink={true} />
                <DataItem label="Breach Date" value={breach.BreachDate} />
                <DataItem label="Description" value={breach.Description} />
                {breach.DataClasses && (
                  <div className="mt-2">
                    <div className="text-md font-medium text-gray-300 mb-1">Exposed Data</div>
                    <div className="flex flex-wrap gap-2">
                      {breach.DataClasses.map((dataClass, i) => (
                        <span key={i} className="bg-red-900/30 text-red-300 px-2 py-1 rounded-md text-xs">
                          {dataClass}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </DataSection>
        )}
        
        {/* ProtonMail */}
        {protonmail && protonmail.protonmail && (
          <DataSection title="ProtonMail" icon={<Mail className="text-purple-500" />}>
            <DataItem label="Status" value={protonmail.protonmail} />
          </DataSection>
        )}
        
        {/* Trello */}
        {hasTrelloData && (
          <DataSection title="Trello" icon={
            <svg viewBox="0 0 24 24" width="24" height="24" className="text-blue-400 fill-current">
              <path d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 7h3v9H7V7zm7 0h3v5h-3V7z" />
            </svg>
          }>
            {trello.map((profile, index) => (
              <div key={index} className="mt-3">
                <DataItem label="Username" value={profile.username} />
                <DataItem label="ID" value={profile.id} />
                <DataItem label="Full Name" value={profile.fullName} />
              </div>
            ))}
          </DataSection>
        )}
        
        {/* Adobe */}
        {hasAdobeData && (
          <DataSection title="Adobe" icon={
            <svg viewBox="0 0 24 24" width="24" height="24" className="text-red-500 fill-current">
              <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0H15.116L24 22.624Z" />
            </svg>
          }>
            {adobe.map((profile, index) => (
              <div key={index} className="mt-3">
                <DataItem label="Username" value={profile.username} />
                {profile.created && <DataItem label="Created" value={profile.created} />}
              </div>
            ))}
          </DataSection>
        )}
        
        {/* InfoStealers */}
        {infostealers && infostealers.message && (
          <DataSection title="InfoStealers" icon={<Info className="text-yellow-500" />}>
            <DataItem label="Status" value={infostealers.message} />
            {infostealers.total_corporate_services > 0 && (
              <DataItem label="Corporate Services" value={infostealers.total_corporate_services} />
            )}
            {infostealers.total_user_services > 0 && (
              <DataItem label="User Services" value={infostealers.total_user_services} />
            )}
          </DataSection>
        )}
        
        {/* LinkedIn */}
        {hasLinkedInData && linkedInProfile && (
          <DataSection title="LinkedIn" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-[#0077B5]" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          }>
            <>
              <DataItem label="Name" value={linkedInProfile.displayName} />
              <DataItem label="Headline" value={linkedInProfile.headline} />
              <DataItem label="Location" value={linkedInProfile.location} />
              <DataItem label="Company" value={linkedInProfile.companyName} />
              <DataItem label="Connections" value={linkedInProfile.connectionCount} />
              <DataItem label="Profile URL" value={linkedInProfile.linkedInUrl} isLink={true} />
              
              {linkedInProfile.skills && linkedInProfile.skills.length > 0 && (
                <div className="mt-3">
                  <div className="text-md font-medium text-gray-300 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {linkedInProfile.skills.slice(0, 12).map((skill, i) => (
                      <span key={i} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                    {linkedInProfile.skills.length > 12 && (
                      <span className="text-gray-400 text-xs flex items-center">
                        +{linkedInProfile.skills.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {linkedInProfile.positions && linkedInProfile.positions.positionHistory && linkedInProfile.positions.positionHistory.length > 0 && (
                <div className="mt-4">
                  <div className="text-md font-medium text-gray-300 mb-2">Experience</div>
                  {linkedInProfile.positions.positionHistory.map((position, i) => (
                    <div key={i} className="mb-2 pb-2 border-b border-gray-800 last:border-0">
                      <div className="font-medium text-white">{position.title || 'Role'}</div>
                      <div className="text-sm text-gray-300">{position.companyName || ''}</div>
                      {position.timePeriod && (
                        <div className="text-xs text-gray-400">
                          {position.timePeriod.startDate ? `${position.timePeriod.startDate.year}` : ''} 
                          {position.timePeriod.endDate ? ` - ${position.timePeriod.endDate.year}` : ' - Present'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {linkedInProfile.schools && linkedInProfile.schools.educationHistory && linkedInProfile.schools.educationHistory.length > 0 && (
                <div className="mt-4">
                  <div className="text-md font-medium text-gray-300 mb-2">Education</div>
                  {linkedInProfile.schools.educationHistory.map((education, i) => (
                    <div key={i} className="mb-2">
                      <div className="font-medium text-white">{education.schoolName || 'Institution'}</div>
                      <div className="text-sm text-gray-300">{education.degreeName || ''}</div>
                      {education.timePeriod && (
                        <div className="text-xs text-gray-400">
                          {education.timePeriod.startDate ? `${education.timePeriod.startDate.year}` : ''} 
                          {education.timePeriod.endDate ? ` - ${education.timePeriod.endDate.year}` : ' - Present'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          </DataSection>
        )}
        
        {/* Add a summary section */}
        <DataSection title="Search Summary" icon={<Info className="text-blue-500" />}>
          <div className="p-3 bg-gray-900/30 rounded-lg text-white">
            <p className="mb-3">Email: <span className="text-teal-300 font-medium">{input}</span></p>
            <div className="flex flex-wrap gap-2 mt-2">
              {hasHibpData && (
                <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded-md text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-1" /> Found in data breaches
                </span>
              )}
              {hasTrelloData && (
                <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-md text-sm flex items-center">
                  <User className="h-4 w-4 mr-1" /> Trello account found
                </span>
              )}
              {hasAdobeData && (
                <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded-md text-sm flex items-center">
                  <User className="h-4 w-4 mr-1" /> Adobe account found
                </span>
              )}
              {hasLinkedInData && (
                <span className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-md text-sm flex items-center">
                  <User className="h-4 w-4 mr-1" /> LinkedIn profile found
                </span>
              )}
              {!hasHibpData && !hasTrelloData && !hasAdobeData && !hasLinkedInData && (
                <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-md text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-1" /> No significant findings
                </span>
              )}
            </div>
          </div>
        </DataSection>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col items-center overflow-y-auto scrollbar">
      <div className="absolute w-full h-screen bg-black z-[-1] overflow-hidden md:object-cover">
        <video
          className="w-full h-full absolute top-0 left-0 object-cover lg:scale-105 md:scale-150 sm:scale-100"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={background} type="video/mp4" />
        </video>
      </div>

      <div className="flex h-full w-full flex-col items-center overflow-x-hidden">
        <Header />
        <div className="form text-white h-full flex w-full flex-col items-center mt-[6%] gap-4 px-4">
          <div className=" rounded-xl p-6 shadow-lg backdrop-blur-sm max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Basic Search</h2>
            <p className="text-gray-400 text-center mb-6">Search by email to find publicly available information</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button
                className={`px-6 py-2 transition-all duration-300 bg-gradient-to-r from-teal-600 to-teal-700 shadow-[0_0_15px_rgba(34,197,94,0.5)]`}
                onClick={() => {
                  setSearchType("Email");
                  setInput("");
                  setEmailError("");
                  setPhoneError("");
                  setResults(null);
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="px-6 py-2 bg-gray-800 cursor-not-allowed opacity-70 relative overflow-hidden"
                    disabled={true}
                    onClick={() => {}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700/20 to-orange-700/20"></div>
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    Phone
                    <span className="absolute -top-1 right-0 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-sm transform rotate-0 font-bold">SOON</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Phone search coming soon!</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full max-w-lg gap-3 text-base flex-wrap justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-5 text-[#f4f4f4] font-medium grow shrink basis-auto px-5 py-3 rounded-md border border-white/15 bg-[#000000/35] backdrop-blur-sm h-14">
                        <Mail className="h-5 w-5 text-teal-500" />
                        <Input
                          type="text"
                          placeholder="Enter your email"
                          onChange={(e) => {
                            setInput(e.target.value);
                            setEmailError("");
                          }}
                          value={input}
                          className="bg-transparent border-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus:outline-none h-full"
                        />
                        {input && (
                          <button
                            onClick={() => setInput("")}
                            className="text-gray-400 hover:text-white transition-all duration-200 flex items-center"
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
                  className="bg-gradient-to-r from-[#3f4e4f] to-[#212121] border border-gray-700 shadow-[0px_2px_0px_rgba(255,255,255,0.1)] text-white font-normal text-center leading-none px-8 rounded-lg text-lg w-full sm:w-auto mx-2 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300 h-14"
                  onClick={handleSearch}
                  disabled={!input || isLoading || !!emailError}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {emailError}
                </p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errorMessage}
                </p>
              )}
            </div>
            
            {isLoading ? (
              <div className="mt-16 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                <p className="text-gray-300 mt-4">Searching... This may take a moment</p>
              </div>
            ) : (
              renderResults()
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 