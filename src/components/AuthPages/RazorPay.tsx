import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom" ;
import '@/style/razorpay-animations.css';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  key: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface UserData {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  credits?: number;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
      };
    };
  }
}

const RazorpayPayment: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const { user: auth0User, isAuthenticated } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [showBonus, setShowBonus] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [usdEquivalent, setUsdEquivalent] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;

  // Get email from query parameters
  const getEmailFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    const encodedEmail = searchParams.get("email");
    return encodedEmail ? decodeURIComponent(encodedEmail) : null;
  };

  const queryEmail = getEmailFromQuery();
  const effectiveEmail = queryEmail || auth0User?.email;

  // Redirect to homepage on successful payment
  useEffect(() => {
    if (paymentSuccess) {
      // Add a short delay before redirecting to allow the user to see the success message
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [paymentSuccess, navigate]);

  useEffect(() => {
    if (!isAuthenticated && !queryEmail) {
      setErrorMessage("Authentication required");
      return;
    }

    const fetchUserData = async () => {
      if (!effectiveEmail) {
        setErrorMessage("Email not provided");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/findbyemail?email=${encodeURIComponent(effectiveEmail)}`
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
          name: data.data.name || "",
          phone: data.data.phone || "",
          credits: data.data.credits || 0,
        });
        // Set initial value for name only, without using email as fallback
        setName(data.data.name || "");
        setEmail(data.data.email);
      } catch (error) {
        console.error("User fetch error:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [effectiveEmail, isAuthenticated, queryEmail]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculateBonusCredits = (amount) => {
    // Convert amount to USD (1 INR = 0.012 USD approximately)
    const usdAmount = amount * 0.012;
    let bonusPercentage = 0;
    
    if (usdAmount >= 10 && usdAmount <= 100) {
      bonusPercentage = 5;
    } else if (usdAmount > 100 && usdAmount <= 1000) {
      bonusPercentage = 10;
    } else if (usdAmount > 1000 && usdAmount <= 10000) {
      bonusPercentage = 15;
    } else if (usdAmount > 10000) {
      bonusPercentage = 20;
    }
    
    const bonusAmount = amount * (bonusPercentage / 100);
    return {
      total: amount + bonusAmount,
      bonusPercentage,
      bonusAmount
    };
  };

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

  // Get bonus message based on USD amount
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

  // Update bonus display when amount changes
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const amountNum = Number(amount);
      // Convert INR to USD (1 INR = 0.012 USD approximately)
      const amountInUsd = amountNum * 0.012;
      setUsdEquivalent(amountInUsd);
      
      const bonusPercentage = getBonusPercentage(amountInUsd);
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
  }, [amount]);

  const payNow = async () => {
    if (!userData) {
      setErrorMessage("User information not loaded");
      return;
    }

    if (!name || !email) {
      setErrorMessage("Please fill in your name and email");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment service unavailable");

      const amountInPaise = Math.round(Number(amount));
      const amountInUsd = (amountInPaise / 100) * 0.012; // Convert to USD
      const bonusPercentage = getBonusPercentage(amountInUsd);
      const totalAmount = amountInPaise * (1 + bonusPercentage / 100);

      // Create payment order
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/razorpay/createPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${userData._id.slice(0, 8)}_${Date.now()}`,
          notes: {
            userId: userData._id,
            userEmail: email,
            userName: name,
            purpose: "Account credits purchase",
            bonusPercentage: bonusPercentage,
            totalCredits: Math.round(totalAmount) / 100 // Convert back from paise to rupees
          },
        }),
      });

      if (!orderResponse.ok) throw new Error("Order creation failed");

      const order: RazorpayOrder = await orderResponse.json();
      if (!order?.id) throw new Error("Invalid order response");

      const options: RazorpayOptions = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: name,
        description: email,
        order_id: order.id,
        handler: async function (res) {
          const paymentResult = {
            order_id: order.id,
            payment_id: res.razorpay_payment_id,
            userId: userData._id,
            amount: order.amount,
            razorpay_signature: res.razorpay_signature,
            userEmail: email,
            userName: name,
          };

          const verifyResponse = await fetch(
            `${API_BASE_URL}/api/payment/razorpay/verifyPayment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...paymentResult, currency: "INR" }),
            }
          );

          const verify = await verifyResponse.json();

          if (verify.message === "Payment verified successfully") {
            setPaymentSuccess(true);
          } else {
            setErrorMessage("Payment verification failed!");
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: userData.phone || "",
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal closed");
          }
        }
      };
      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black">
        <div className="text-center p-8 bg-gray-900 rounded-xl max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-white">
            {isLoading ? "Loading user data..." : "Authentication Required"}
          </h2>
          {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
          {!isLoading && !isAuthenticated && !queryEmail && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-black text-gray-100 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 p-3 sm:p-4 bg-indigo-600/80 backdrop-blur-sm rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="flex items-start sm:items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-full p-1.5 sm:p-2">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-white">Congratulations!</h3>
              <div className="mt-1 text-xs sm:text-sm text-indigo-100">
                You qualify for a {getBonusPercentage(usdEquivalent)}% bonus on your credits!
              </div>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-2 bg-indigo-500/50 rounded-full p-1 hover:bg-indigo-500/80 transition-colors flex-shrink-0"
            >
              <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotating circles */}
        <div className="circle-animation circle-1"></div>
        <div className="circle-animation circle-2"></div>
        <div className="circle-animation circle-3"></div>
        
        {/* Falling particles */}
        <div className="particles">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="particle" style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 15}s`,
              opacity: Math.random() * 0.5 + 0.1,
              transform: `scale(${Math.random() * 0.8 + 0.2})`
            }}></div>
          ))}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-black/80 z-0"></div>
      </div>
      
      <div className="w-full max-w-7xl min-h-screen sm:min-h-0 sm:h-auto sm:max-h-[90vh] flex flex-col lg:flex-row rounded-none sm:rounded-xl overflow-hidden shadow-2xl bg-gray-900/40 backdrop-blur-md z-10 relative glass-card">
        {/* Left Panel: Summary */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-gray-800/80 to-black/80 text-white p-4 sm:p-6 lg:p-8 flex flex-col relative overflow-hidden glass-panel order-2 lg:order-1">
          <div className="mb-6 sm:mb-8 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">OSINT Ambition</h1>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Secure payment processing</p>
            
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold shine-text">₹{amount || "0"}</span>
              <span className="ml-2 opacity-80 text-sm sm:text-base">credits</span>
            </div>
          </div>
          
          <div className="flex-grow bg-gray-800/40 backdrop-blur-md rounded-lg p-4 sm:p-6 relative z-10 glass-card space-y-3">
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
              <span className="text-sm sm:text-base">Credits purchase</span>
              <span className="font-medium text-sm sm:text-base">₹{amount || "0"}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-700/50">
              <span className="text-sm sm:text-base">Subtotal</span>
              <span className="font-medium text-sm sm:text-base">₹{amount || "0"}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 sm:py-3 font-bold">
              <span className="text-sm sm:text-base">Total due today</span>
              <span className="text-sm sm:text-base">₹{amount || "0"}</span>
            </div>
            
            {/* Bonus Card */}
            {showBonus && (
              <div className="bg-indigo-600/30 backdrop-blur-md rounded-lg p-3 sm:p-4 flex items-start sm:items-center border border-indigo-500/50 glass-card pulse-animation">
                <span className="text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0">🎁</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-indigo-300 text-sm sm:text-base">{getBonusPercentage(usdEquivalent)}% Bonus Credits!</h4>
                  <p className="text-xs sm:text-sm text-indigo-200 break-words">{getBonusMessage(usdEquivalent)}</p>
                  <p className="text-xs text-indigo-300 mt-1">Current amount: ${usdEquivalent.toFixed(2)} USD</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm opacity-80 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span className="text-indigo-200 text-xs sm:text-sm">Powered by Razorpay Payment Gateway</span>
            </div>
            <p>© {new Date().getFullYear()} OSINT Ambitions. All rights reserved.</p>
          </div>
          
          {/* Glass Shine Effect */}
          <div className="absolute top-0 right-0 w-full h-full shine-effect"></div>
        </div>
        
        {/* Right Panel: Payment Form */}
        <div className="w-full lg:w-3/5 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto bg-gray-900/60 backdrop-blur-md text-white relative glass-panel order-1 lg:order-2">
          <div className="mb-6 sm:mb-8 flex flex-col">
            <button
              onClick={() => navigate("/")}
              className="self-start flex items-center text-gray-400 hover:text-indigo-300 transition mb-4 sm:mb-6 hover-float text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 shine-text">Complete your payment</h1>
          </div>

          {paymentSuccess ? (
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-green-500/30 glass-card success-pulse">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 success-glow">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-green-400 text-center mb-4">Payment Successful!</h3>
              <div className="space-y-2 text-center mb-6">
                <p className="text-white text-base sm:text-lg">₹{amount} credits added to your account</p>
                <p className="text-gray-400 text-sm sm:text-base">New balance: {userData.credits} credits</p>
                <p className="text-gray-300 mt-4 text-sm sm:text-base">Redirecting to homepage...</p>
                <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mt-4">
                  <svg className="animate-spin text-indigo-400 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 glass-card text-sm sm:text-base">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition hover-glow glass-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-600 text-gray-400 transition hover-glow glass-input cursor-not-allowed pr-10 sm:pr-12"
                      readOnly
                    />
                    <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
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
                      <div className="absolute bottom-full right-0 mb-2 w-48 sm:w-56 p-2 bg-gray-900 rounded-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-gray-300 border border-gray-700">
                        In given Email the payment will be reflected in your given account section
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrorMessage("");
                      }}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition hover-glow glass-input"
                      placeholder="10 - 100000"
                      min="10"
                      max="100000"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₹10, Maximum: ₹100,000</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={payNow}
                    disabled={isLoading || !amount || !name || !email}
                    className={`w-full py-3 sm:py-3.5 px-4 text-sm sm:text-base rounded-lg font-medium flex items-center justify-center transition-all ${
                      isLoading || !amount || !name || !email
                        ? "bg-indigo-700/50 cursor-not-allowed"
                        : "bg-indigo-600/80 hover:bg-indigo-700 text-white hover-glow button-shine"
                    } relative overflow-hidden glass-button`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm sm:text-base">Processing...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Pay ₹{amount || '0'}</span>
                        <img 
                          src="https://cdn.razorpay.com/static/assets/razorpay-favicon.png"
                          alt="Razorpay"
                          className="ml-2 h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full p-0.5 relative z-10"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://razorpay.com/favicon.png";
                          }}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 gap-3 sm:gap-4">
                  <div className="flex items-center hover-float">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center hover-float">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Glass Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full shine-effect-reverse"></div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
