import React, { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { currencyMapping } from "./mapcurrency";
import { exchangeRates } from "./exchangesRates";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

const stripePromise = loadStripe(
  "pk_live_51NqCWASAs1eyMT3VnlFf37m7dmiPIor87mcS9Oo98KNMNBgpHD5rSk4DT3f03rNCotJPMISgR2HiyOQEdzAIEQD400DTNN7tBo"
);

function CheckoutForm({ clientSecret, userId, amount, address, currency, customerInfo }) {
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (!stripe || !elements || loading || processing) {
      return;
    }

    setLoading(true);
    setProcessing(true);
    setErrorMessage("");

    try {
      const confirmParams: any = {
        return_url: window.location.href,
        // Add required fields for international payments
        payment_method_data: {
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: address.line1,
              city: address.city,
              state: address.state,
              postal_code: address.postal_code,
              country: address.country,
            }
          }
        }
      };

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setErrorMessage("Payment successful! Redirecting to home page...");
        
        try {
          // Calculate bonus based on amount tiers
          let creditsToAdd = amount;
          let bonusPercentage = 0;

          // Convert amount to USD if not in USD
          const usdAmount = currency.code === "USD" ? amount : amount * exchangeRates[currency.code];

          if (usdAmount >= 10 && usdAmount <= 100) {
            bonusPercentage = 5;
          } else if (usdAmount > 100 && usdAmount <= 1000) {
            bonusPercentage = 10;
          } else if (usdAmount > 1000 && usdAmount <= 10000) {
            bonusPercentage = 15;
          } else if (usdAmount > 10000) {
            bonusPercentage = 20;
          }

          // Calculate total credits including bonus
          creditsToAdd = amount * (1 + bonusPercentage / 100);

          const res = await fetch(`${API_BASE_URL}/api/credits/add/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              userId, 
              amount: Math.round(creditsToAdd * 100) / 100,  // Round to 2 decimal places
              address,
              bonusApplied: bonusPercentage
            }),
          });
          
          const result = await res.json();
          if (result.message === "Credits added successfully.") {
            console.log("✅ Credits added successfully.");
            // Add delay before redirect to show success message
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            console.error("❌ Failed to add credits.");
            setErrorMessage("Payment successful, but failed to add credits. Please contact support.");
          }
        } catch (err) {
          console.error("❌ Error adding credits:", err);
          setErrorMessage("Payment successful, but failed to add credits. Please contact support.");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <PaymentElement />
        <button 
          type="submit" 
          disabled={!stripe || loading || processing} 
          className={`w-full font-medium py-3 px-4 rounded-lg transition-colors shadow-md mt-4 shine-button relative overflow-hidden ${
            !stripe || loading || processing
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <span className="relative z-10">
            {loading || processing 
              ? "Processing..." 
              : "Pay now"}
          </span>
        </button>
        {errorMessage && (
          <div className={`mt-4 p-3 rounded-lg border ${
            errorMessage.includes("successful") 
              ? "bg-green-900/20 text-green-400 border-green-900/30"
              : "bg-red-900/20 text-red-400 border-red-900/30"
          }`}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}

function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { user: auth0User } = useAuth0();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [returnAmount, setReturnAmount] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;
  const [currency, setCurrency] = useState({ code: "INR", symbol: "₹" });
  const [isLoading, setIsLoading] = useState(true);
  const [showBonus, setShowBonus] = useState(false);
  const [usdEquivalent, setUsdEquivalent] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Calculate bonus percentage based on USD amount
  const getBonusPercentage = (usdAmount) => {
    if (usdAmount >= 10 && usdAmount <= 100) {
      return 5;
    } else if (usdAmount > 100 && usdAmount <= 1000) {
      return 10;
    } else if (usdAmount > 1000 && usdAmount <= 10000) {
      return 15;
    } else if (usdAmount > 10000) {
      return 20;
    }
    return 0;
  };

  // Effect to update bonus and USD equivalent when amount changes
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const amountNum = Number(amount);
      const rate = exchangeRates[currency.code] || 1;
      const amountInUsd = amountNum * rate;
      
      setUsdEquivalent(amountInUsd);
      const bonusPercentage = getBonusPercentage(amountInUsd);
      
      // Only show bonus for valid amounts
      if (bonusPercentage > 0) {
        setShowBonus(true);
        if (!showNotification) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      } else {
        setShowBonus(false);
        setShowNotification(false);
      }
    } else {
      setUsdEquivalent(0);
      setShowBonus(false);
      setShowNotification(false);
    }
  }, [amount, currency.code]);

  // Update the bonus display section
  const getBonusMessage = (usdAmount) => {
    if (usdAmount >= 10 && usdAmount <= 100) {
      return "5% bonus on purchases between $10-$100";
    } else if (usdAmount > 100 && usdAmount <= 1000) {
      return "10% bonus on purchases between $100-$1,000";
    } else if (usdAmount > 1000 && usdAmount <= 10000) {
      return "15% bonus on purchases between $1,000-$10,000";
    } else if (usdAmount > 10000) {
      return "20% bonus on purchases above $10,000";
    }
    return "";
  };

  // Fetch user IP and location data
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        // Get the country code from the response
        const countryCode = data.country_code;
        
        // Map the country code to currency using the currencyMapping
        if (countryCode && currencyMapping[countryCode]) {
          setCurrency(currencyMapping[countryCode]);
          console.log(`Currency set based on location: ${currencyMapping[countryCode].code}`);
        } else {
          // Default to INR if country code not found
          console.log("Country code not found, defaulting to INR");
        }
      } catch (err) {
        console.error("Error fetching location data:", err);
        // Default to INR in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  // Get email from query parameters with better error handling
  const getEmailFromQuery = () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const encodedEmail = searchParams.get("email");
      if (encodedEmail) {
        const decodedEmail = decodeURIComponent(encodedEmail);
        // Validate email format
        if (decodedEmail.includes('@') && decodedEmail.includes('.')) {
          return decodedEmail;
        }
      }
    } catch (error) {
      console.error("Error decoding email from URL:", error);
    }
    return null;
  };

  const queryEmail = getEmailFromQuery();
  const effectiveEmail = queryEmail || auth0User?.email;

  // Better error handling for authentication
  useEffect(() => {
    // Don't show error immediately, give time for auth to load
    if (!auth0User && !queryEmail) {
      const timer = setTimeout(() => {
        if (!auth0User && !queryEmail) {
          setError("Authentication required");
        }
      }, 1000); 
      
      return () => clearTimeout(timer);
    }
  }, [auth0User, queryEmail]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!effectiveEmail) {

        if (auth0User || queryEmail) {
          setError("Email not provided");
        }
        return;
      }

      setIsLoading(true);
      setError(""); 

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/findbyemail?email=${encodeURIComponent(effectiveEmail)}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const data = await res.json();
        const user = data.data;
        
        if (!user?._id) {
          throw new Error("User data incomplete");
        }

        setUserData({
          id: user._id,
          email: user.email,
          name: user.name || "",
        });
        // Set initial value for name only, without using email as fallback
        setName(user.name || "");
        setEmail(user.email);
        
        // Clear any error messages on successful load
        setError("");
      } catch (err) {
        console.error("User fetch error:", err);
        setError("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have an email and we're not already loading
    if (effectiveEmail && !isLoading) {
      fetchUserData();
    }
  }, [effectiveEmail, auth0User, queryEmail, API_BASE_URL]);



  // Improved loading state check
  if (!userData && (isLoading || (!effectiveEmail && auth0User))) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black">
        <div className="text-center p-8 bg-gray-900 rounded-xl max-w-md shadow-2xl border border-gray-800">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4 text-white">Loading...</h2>
          <p className="text-gray-400">Please wait while we load your information.</p>
        </div>
      </div>
    );
  }

  // Show error only if we're sure there's an issue
  if (!userData && error && !isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black">
        <div className="text-center p-8 bg-gray-900 rounded-xl max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-white">Unable to Load</h2>
          <p className="text-red-400 mt-2 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="block w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartPayment = async () => {
    // Prevent multiple clicks
    if (paymentProcessing || isLoading) {
      return;
    }

    // Validate required fields for international payments
    if (!name || !email || !amount || !address.line1 || !address.city || !address.country) {
      setError("Please fill in all required fields for international payments");
      return;
    }

    setPaymentProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/stripe/createPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            userId: userData.id,
            name: name,
            email: email,
            address,
          },
          paymentDetails: {
            amount: parseInt(amount, 10),
            currency: currency.code,
            description: "Software development services", // Fixed service description
            // Add metadata for export transactions
            metadata: {
              export_transaction: "true",
              transaction_type: "services",
              customer_country: address.country,
            }
          },
        }),
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setReturnAmount(data.amount);
    } catch (error) {
      console.error("Payment initialization error:", error);
      setError("Failed to initialize payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#4F46E5",
        colorBackground: "#1F2937",
        colorText: "#F9FAFB",
        colorDanger: "#EF4444",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        spacingUnit: "4px",
        borderRadius: "4px",
      },
    },
  };

  countries.registerLocale(enLocale);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl bg-gray-900 shine-card relative">
        {/* Left: Summary Panel */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-black text-white p-8 flex flex-col relative shine-panel overflow-hidden">
          {/* Bonus Notification */}
          {showNotification && (
            <div className="absolute top-4 left-4 right-4 p-4 bg-indigo-600/80 backdrop-blur-sm rounded-lg shadow-lg z-50 animate-fadeIn">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full p-2">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Congratulations!</h3>
                  <div className="mt-1 text-sm text-indigo-100">
                    You qualify for a {getBonusPercentage(usdEquivalent)}% bonus on your credits!
                  </div>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="ml-auto bg-indigo-500/50 rounded-full p-1 hover:bg-indigo-500/80 transition-colors"
                >
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="mb-8 relative z-10">
            <img
              src="https://res.cloudinary.com/dc05saeek/image/upload/v1747128047/favicon_512x512_ewoo3q.png"
              alt="OSINT Ambitions"
              className="w-16 h-16 mb-6"
            />
            <h2 className="text-2xl font-bold mb-2">Intermediate Subscription</h2>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold">{currency.symbol}{amount || "0"}</span>
              <span className="ml-2 opacity-80">per payment</span>
            </div>
          </div>
          
          <div className="flex-grow bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shine-card relative z-10">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span>Intermediate Subscription</span>
              <span className="font-medium">{currency.symbol}{amount || "0"}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">{currency.symbol}{amount || "0"}</span>
            </div>
            {/* <div className="py-3 border-b border-gray-700">
              <span className="text-blue-400 cursor-pointer hover:text-white transition">Add promotion code</span>
            </div> */}
            <div className="flex justify-between items-center py-3 font-bold">
              <span>Total due today</span>
              <span>{currency.symbol}{amount || "0"}</span>
            </div>
            
            {showBonus && (
              <div className="mt-4 bg-indigo-600/30 backdrop-blur-sm rounded-lg p-4 flex items-center shine-card border border-indigo-500/50">
                <span className="text-xl mr-3">🎁</span>
                <div>
                  <h4 className="font-bold text-indigo-300">
                    {getBonusPercentage(usdEquivalent)}% Bonus Credits!
                  </h4>
                  <p className="text-sm text-indigo-200">
                    {getBonusMessage(usdEquivalent)}
                  </p>
                  <p className="text-xs text-indigo-300 mt-1">
                    Current amount: ${usdEquivalent.toFixed(2)} USD
                  </p>
                </div>
              </div>
            )}
            
            {returnAmount != 0 && (
              <div className="mt-4 bg-gray-700/50 rounded-lg p-3 shine-card">
                <span>Total Credits you will get: {(Number(returnAmount) * (showBonus ? 1.05 : 1)).toFixed(3)}$</span>
              </div>
            )}
            
            <div className="mt-4 p-3 rounded-lg bg-gray-700/30">
              <div className="flex justify-between items-center">
                <span>Currency</span>
                <span className="font-medium">{currency.code} ({currency.symbol})</span>
              </div>
              {isLoading && (
                <div className="text-sm text-blue-400 mt-1">Detecting your currency...</div>
              )}
              {usdEquivalent > 0 && (
                <div className="text-xs text-gray-400 mt-1">≈ ${usdEquivalent.toFixed(2)} USD</div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-sm opacity-80 relative z-10">
            <p>Secure payment processed by Stripe</p>
            <p className="mt-1">© {new Date().getFullYear()} OSINT Ambitions. All rights reserved.</p>
          </div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 to-purple-600/5 shine-glow"></div>
        </div>
        
        {/* Right: Payment Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto bg-gray-900 text-white relative">
          <div className="mb-8 flex flex-col relative z-20">
            <button 
              onClick={() => (window.location.href = "/")} 
              className="self-start flex items-center text-gray-400 hover:text-gray-200 transition mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-white">Complete your payment</h1>
            <p className="text-gray-400 mt-2">Payment will be processed in {currency.code}</p>
          </div>
          
          {!clientSecret ? (
            <div className="space-y-6 relative z-20">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500 hover:border-indigo-400"
                  required
                />
                <p className="text-xs text-gray-400">Required for international payment compliance</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/30 border border-gray-600 text-gray-400 focus:ring-0 transition placeholder-gray-500 cursor-not-allowed"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-gray-300 border border-gray-700">
                      In given Email the payment will be reflected in your given account section
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Amount ({currency.code})</label>
                <input
                  type="number"
                  placeholder={`Enter amount in ${currency.code}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500 hover:border-indigo-400"
                  required
                />
              </div>

              {/* Billing Address - Required for international payments */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Billing Address *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={address.line1}
                      onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State/Province"
                      value={address.state}
                      onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={address.postal_code}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setAddress(prev => ({ ...prev, postal_code: numericValue }))
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    >
                      <option value="">Select Country</option>
                      {Object.entries(countries.getNames("en")).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Required for international payment compliance and fraud prevention</p>
              </div>
               
              <button
                onClick={handleStartPayment}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-colors shadow-md shine-button relative overflow-hidden ${
                  !name ||
                  !email ||
                  !amount ||
                  !address.line1 ||
                  !address.city ||
                  !address.country ||
                  isLoading ||
                  paymentProcessing
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                disabled={
                  !name ||
                  !email ||
                  !amount ||
                  !address.line1 ||
                  !address.city ||
                  !address.country ||
                  isLoading ||
                  paymentProcessing
                }
              >
                <span className="relative z-10">
                  {isLoading || paymentProcessing
                    ? "Processing..."
                    : `Continue to payment (${currency.code})`}
                </span>
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl shine-card relative z-20">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  userId={userData.id}
                  amount={returnAmount} 
                  address={address}
                  currency={currency}
                  customerInfo={{ name, email }}
                />
              </Elements>
            </div>
          )}
           
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/5 to-purple-900/5 opacity-50 pointer-events-none z-10"></div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes shine {
            0% {
              transform: translateX(-100%) translateY(-100%) rotate(25deg);
            }
            100% {
              transform: translateX(100%) translateY(100%) rotate(25deg);
            }
          }
          
          @keyframes pulse-glow {
            0% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              opacity: 0.5;
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .shine-card {
            position: relative;
            overflow: hidden;
          }
          
          .shine-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 100%
            );
            transform: translateX(-100%) translateY(-100%) rotate(25deg);
            animation: shine 6s ease-in-out infinite;
            pointer-events: none;
            z-index: 5;
          }
          
          .shine-panel::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.07) 50%,
              transparent 100%
            );
            transform: translateX(-100%) translateY(0%) rotate(25deg);
            animation: shine 8s ease-in-out infinite;
            pointer-events: none;
            z-index: 5;
          }
          
          .shine-button {
            position: relative;
            overflow: hidden;
          }
          
          .shine-button::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 300%;
            height: 100%;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(255, 255, 255, 0.2) 50%,
              transparent 100%
            );
            transform: translateX(-100%) rotate(25deg);
            animation: shine 3s ease-in-out infinite;
            z-index: 1;
            pointer-events: none;
          }
          
          .shine-glow {
            animation: pulse-glow 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 5;
          }
          
          input:focus {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
            border-color: #6366f1;
            position: relative;
            z-index: 30;
          }
          
          /* Add a subtle shimmer to the background */
          @keyframes background-shimmer {
            0% {
              background-position: -100% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          /* Floating animation for cards */
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          .shine-card {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default App;
