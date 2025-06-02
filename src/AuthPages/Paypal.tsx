import React, { useState, FormEvent, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserData {
  userId: string;
  email: string;
  name: string;
  authMethod?: string;
  credits?: number;
  pfpURL?: string;
  _id?: string;
}

const PayPalPaymentForm: React.FC = () => {
  const [amount, setAmount] = useState<string>("10");
  const [currency, setCurrency] = useState<string>("USD");
  const [description, setDescription] = useState<string>("My First Payment");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth0();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(
          `http://localhost:3005/api/auth/getuserData?email=${user.email}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData({
          userId: data.userId,
          email: data.email,
          name: data.name,
          authMethod: data.authMethod,
          credits: data.credits,
          pfpURL: data.pfpURL,
          _id: data._id
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data");
      }
    };

    if (isAuthenticated && user?.email) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!userData?.userId) {
      setErrorMessage("User information not available");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        userId: userData.userId,
        userEmail: userData.email,
        userName: userData.name,
        amount,
        currency,
        description,
      }).toString();

      window.location.href = `http://localhost:3005/api/payment/paypal/createPayment?${queryParams}`;
    } catch (error) {
      setErrorMessage(
        "Error: " + (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
  };

  // if (isLoading) {
  //   return <div className="text-center text-white">Loading authentication...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <div className="text-center text-white">Please login to make payments</div>;
  // }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold">PayPal Payment Gateway</h3>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                Amount
              </label>
              <input
                type="text"
                id="amount"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter Amount"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                Currency
              </label>
              <select
                id="currency"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!userData}
                className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center space-x-2
                  ${!userData ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{userData ? "Pay Now" : "Loading..."}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayPalPaymentForm;