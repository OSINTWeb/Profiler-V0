import React, { useState, FormEvent, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import '@/style/paypal-animations.css';

interface UserData {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  credits?: number;
}

const PayPalPaymentForm: React.FC = () => {
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

  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;

  // Get email from query parameters
  const getEmailFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("email");
  };

  const queryEmail = getEmailFromQuery();
  const effectiveEmail = queryEmail || auth0User?.email;

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
          name: data.data.name || "Customer",
          phone: data.data.phone || "",
          credits: data.data.credits || 0,
        });
        // Set initial values for name and email
        setName(data.data.name || "");
        setEmail(data.data.email || "");
      } catch (error) {
        console.error("User fetch error:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [effectiveEmail, isAuthenticated, queryEmail]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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
      const queryParams = new URLSearchParams({
        userId: userData._id,
        userEmail: email,
        userName: name,
        amount,
        currency: "USD",
        description: "Account credits purchase",
      }).toString();

      window.location.href = `${API_BASE_URL}/api/payment/paypal/createPayment?${queryParams}`;
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-xl max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-white">
            {isLoading ? "Loading user data..." : "Authentication Required"}
          </h2>
          {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
          {!isLoading && !isAuthenticated && !queryEmail && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-3 bg-[#0070ba] text-white rounded-lg hover:bg-[#005ea6] transition-colors shadow-md"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center p-0 m-0 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden gradient-background">
        {/* Animated shapes */}
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        
        {/* Particles */}
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
      </div>
      
      <div className="w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl bg-gray-900/40 backdrop-blur-md z-10 relative glass-card">
        {/* Left Panel: Summary */}
        <div className="w-full md:w-2/5 bg-gray-900/80 backdrop-blur-md text-white p-8 flex flex-col relative overflow-hidden glass-panel">
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold mb-2">PayPal Checkout</h1>
            <p className="text-gray-400 mb-6">Secure payment processing</p>
            
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-gradient">${amount || "0"}</span>
              <span className="ml-2 opacity-80">credits</span>
            </div>
          </div>
          
          <div className="flex-grow bg-gray-800/40 backdrop-blur-md rounded-lg p-6 relative z-10 glass-card">
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span>Credits purchase</span>
              <span className="font-medium">${amount || "0"}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
              <span>Subtotal</span>
              <span className="font-medium">${amount || "0"}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 font-bold">
              <span>Total due today</span>
              <span>${amount || "0"}</span>
            </div>
            
            {Number(amount) >= 10 && Number(amount) <= 100 && (
              <div className="mt-4 bg-[#0070ba]/20 backdrop-blur-md rounded-lg p-4 flex items-center border border-[#0070ba]/40 glass-card hover-float">
                <span className="text-xl mr-3">🎁</span>
                <div>
                  <h4 className="font-bold text-[#0070ba]">5% Bonus Credits!</h4>
                  <p className="text-sm text-gray-300">Your payment qualifies for bonus credits!</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-sm opacity-80 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-[#0070ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span className="text-gray-300">Powered by PayPal Payment Gateway</span>
            </div>
            <p>© {new Date().getFullYear()} OSINT Ambitions. All rights reserved.</p>
          </div>
        </div>
        
        {/* Right Panel: Payment Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto bg-gray-900/60 backdrop-blur-md text-white relative glass-panel">
          <div className="mb-8 flex flex-col">
            <button
              onClick={() => navigate("/")}
              className="self-start flex items-center text-gray-400 hover:text-[#0070ba] transition mb-6 hover-float"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white text-gradient">Complete your payment</h1>
              <div className="flex items-center">
                <img 
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal"
                  className="h-10 logo-pulsate"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg";
                  }}
                />
              </div>
            </div>
          </div>

          {paymentSuccess ? (
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-8 border border-green-500/30 glass-card">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 success-checkmark">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-green-400 text-center mb-4">Payment Successful!</h3>
              <div className="space-y-2 text-center">
                <p className="text-white text-lg">${amount} credits added to your account</p>
                <p className="text-gray-400">New balance: {userData.credits} credits</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors glow-effect hover-float"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 glass-card">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white focus:ring-2 focus:ring-[#0070ba] focus:border-[#0070ba] transition glow-effect glass-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white focus:ring-2 focus:ring-[#0070ba] focus:border-[#0070ba] transition glow-effect glass-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrorMessage("");
                      }}
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white focus:ring-2 focus:ring-[#0070ba] focus:border-[#0070ba] transition glow-effect glass-input"
                      placeholder="10 - 1000"
                      min="10"
                      max="1000"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum: $10, Maximum: $1,000</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !amount || !name || !email}
                    className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                      isLoading || !amount || !name || !email
                        ? "bg-[#0070ba]/50 cursor-not-allowed"
                        : "bg-[#0070ba]/90 hover:bg-[#0070ba] text-white button-glow"
                    } relative overflow-hidden glass-card hover-float`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Pay ${amount || '0'}</span>
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                          alt="PayPal"
                          className="ml-2 h-6 w-6 relative z-10"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg";
                          }}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-400 gap-4">
                  <div className="flex items-center hover-float">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center hover-float">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Multiple payment options</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayPalPaymentForm;