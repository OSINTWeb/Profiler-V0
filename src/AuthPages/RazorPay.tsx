import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom" ;

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

  const payNow = async () => {
    if (!userData) {
      setErrorMessage("User information not loaded");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment service unavailable");

      // Create payment order
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/razorpay/createPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(Number(amount)), // Convert to paise
          currency: "INR",
          receipt: `rcpt_${userData._id.slice(0, 8)}_${Date.now()}`,
          notes: {
            userId: userData._id,
            userEmail: userData.email,
            purpose: "Account credits purchase",
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
        name: "Your App Name",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (res) {
          const paymentResult = {
            order_id: order.id,
            payment_id: res.razorpay_payment_id,
            userId: userData._id,
            amount: order.amount,
            razorpay_signature: res.razorpay_signature,
          };
          console.log("OPTIONS ", options);

          const verifyResponse = await fetch(
            `${API_BASE_URL}/api/payment/razorpay/verifyPayment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...paymentResult, currency: "INR" }),
            }
          );
          console.log(verifyResponse);

          const verify = await verifyResponse.json();
          console.log("VERIFY ", verify);

          if (verify.message === "Payment verified successfully") {
            alert("Payment successful!");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-4 text-white">
            {isLoading ? "Loading user data..." : "Authentication Required"}
          </h2>
          {errorMessage && <p className="text-red-400">{errorMessage}</p>}
          {!isLoading && !isAuthenticated && !queryEmail && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 flex-col">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
      >
        Back to Home
      </button>
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">Add Account Credits</h1>

        {paymentSuccess ? (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-bold text-green-400 mb-1">Payment Successful!</h3>
            <p className="text-green-200">₹{amount} credits added to your account</p>
            <p className="mt-2 text-green-100">New balance: {userData.credits} credits</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-100 rounded-lg border border-red-700">
                {errorMessage}
              </div>
            )}

            {/* Indian Users Only Indicator */}
            <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/40 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-300 font-medium">Razorpay is available for Indian users only</p>
                <p className="text-xs text-blue-400 mt-1">Payments in INR currency only</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (INR):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setErrorMessage("");
                    }}
                    className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="10 - 100000"
                    min="10"
                    max="100000"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimum: ₹10, Maximum: ₹100,000</p>
              </div>

              {/* Razorpay button with tooltip */}
              <div className="relative group">
                <button
                  onClick={payNow}
                  disabled={isLoading || !amount}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                    isLoading || !amount
                      ? "bg-blue-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
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
                      Pay with Razorpay
                      <img 
                        src="https://razorpay.com/favicon.png" 
                        alt="Razorpay"
                        className="ml-2 h-5 w-5"
                      />
                    </>
                  )}
                </button>
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none">
                  Only for Indian users
                  <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 text-sm text-gray-400 text-center">
          Secure payments powered by Razorpay
          <span className="block mt-1 text-xs">Available only for Indian users with INR currency</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
