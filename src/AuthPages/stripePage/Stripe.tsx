// import React, { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useLocation } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "../CheckoutForm";

// const stripePromise = loadStripe(
//   "pk_live_51NqCWASAs1eyMT3VnlFf37m7dmiPIor87mcS9Oo98KNMNBgpHD5rSk4DT3f03rNCotJPMISgR2HiyOQEdzAIEQD400DTNN7tBo"
// );

// const SimpleStripePayment = () => {
//   const { user: auth0User } = useAuth0();
//   const location = useLocation();
//   const [clientSecret, setClientSecret] = useState("");
//   const [userData, setUserData] = useState(null);
//   const [amount, setAmount] = useState(0);
//   const [error, setError] = useState("");
//   const [returnAmount, setReturnAmount] = useState(0);
//   const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;
//   const queryEmail = new URLSearchParams(location.search).get("email");
//   const effectiveEmail = queryEmail || auth0User?.email;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!effectiveEmail) {
//         setError("Email not provided");
//         return;
//       }
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/api/auth/findbyemail?email=${encodeURIComponent(effectiveEmail)}`
//         );
//         const data = await res.json();
//         const user = data.data;
//         setUserData({
//           id: user._id,
//           email: user.email,
//           name: user.name || "Customer",
//         });
//       } catch (err) {
//         setError("Failed to load user information");
//       }
//     };

//     fetchUserData();
//   }, [effectiveEmail]);

//   const createPaymentIntent = async () => {
//     if (!userData || amount <= 0) return;

//     const res = await fetch(`${API_BASE_URL}/api/payment/stripe/createPayment`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userData: {
//           userId: userData.id,
//           name: userData.name,
//           email: userData.email,
//         },
//         paymentDetails: {
//           amount: amount, // in rupees (backend should multiply by 100 if required)
//           currency: "INR",
//           description: "Payment for credits",
//         },
//       }),
//     });

//     const data = await res.json();
//     setClientSecret(data.clientSecret);
//     setReturnAmount(data.amount); // assuming backend returns actual amount in paise
//   };

//   useEffect(() => {
//     if (userData && amount > 0) {
//       createPaymentIntent();
//     }
//   }, [userData, amount]);

//   const appearance = { theme: "flat" };
//   const options = { clientSecret, appearance };

//   return (
//     <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
//       <button
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         onClick={() => (window.location.href = "/")}
//       >
//         Home
//       </button>
//       <h2 className="text-2xl font-semibold mb-4 text-center">Add Credits</h2>
//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Amount (INR):</label>
//         <input
//           type="number"
//           min="1"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md"
//         />
//       </div>

//       {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm amount={returnAmount} userId={userData?.id} />
//         </Elements>
//       )}
//     </div>
//   );
// };

// export default SimpleStripePayment;

// src/App.jsx

import React, { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_live_51NqCWASAs1eyMT3VnlFf37m7dmiPIor87mcS9Oo98KNMNBgpHD5rSk4DT3f03rNCotJPMISgR2HiyOQEdzAIEQD400DTNN7tBo"
); // Replace with your publishable key

function CheckoutForm({ clientSecret, userId, amount, address }) {
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required", // So it doesn't auto-redirect and lets you handle result
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      setErrorMessage("Payment successful! return to home page.");
      // ✅ Add credits only on successful payment
      try {
        const res = await fetch(`${API_BASE_URL}/api/credits/add/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, amount, address }),
        });
        const result = await res.json();
        if (result.message === "Credits added successfully.") {
          console.log("✅ Credits added successfully.");
          window.location.href = "/";
        } else {
          console.error("❌ Failed to add credits.");
        }
      } catch (err) {
        console.error("❌ Error adding credits:", err);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          backgroundColor: "#5469d4",
          color: "#fff",
          border: "none",
          padding: "12px 16px",
          fontSize: "16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
      {errorMessage && <div style={{ color: "red", marginTop: "12px" }}>{errorMessage}</div>}
    </form>
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
  const { user: auth0User } = useAuth0();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [returnAmount, setReturnAmount] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;
  const queryEmail = new URLSearchParams(location.search).get("email");
  const effectiveEmail = queryEmail || auth0User?.email;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!effectiveEmail) {
        setError("Email not provided");
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/findbyemail?email=${encodeURIComponent(effectiveEmail)}`
        );
        const data = await res.json();
        const user = data.data;
        setUserData({
          id: user._id,
          email: user.email,
          name: user.name || "Customer",
        });
      } catch (err) {
        setError("Failed to load user information");
      }
    };

    fetchUserData();
  }, [effectiveEmail]);
  const handleStartPayment = async () => {
    const response = await fetch(`${API_BASE_URL}/api/payment/stripe/createPayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userData: {
          userId: userData.id,
          name: userData.name,
          address,
          email: userData.email,
        },
        paymentDetails: {
          amount: parseInt(amount, 10),
          currency: "INR",
          description: "Custom payment",
        },
      }),
    });

    const data = await response.json();
    setClientSecret(data.clientSecret);
    setReturnAmount(data.amount); // assuming backend returns actual amount in paise
  };

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginBottom: "20px",
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "15px",
          width: "100%",
        }}
      >
        Back to Home
      </button>
      <h2>Complete your payment</h2>
      {!clientSecret ? (
        <div>
          <input
            type="text"
            placeholder="Address Line"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={address.postal_code}
            onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Country (e.g. IN)"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
          />
          <input
            type="number"
            placeholder="Amount (INR)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: "block", marginBottom: "20px", width: "100%", padding: "8px" }}
          />
          <button
            onClick={handleStartPayment}
            style={{
              backgroundColor: "#5469d4",
              color: "#fff",
              padding: "12px 16px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Start Payment
          </button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            clientSecret={clientSecret}
            userId={userData.id}
            amount={returnAmount}
            address={address}
          />
        </Elements>
      )}
    </div>
  );
}

export default App;
