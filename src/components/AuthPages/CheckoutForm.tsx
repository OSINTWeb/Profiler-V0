import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ amount, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const API_BASE_URL = import.meta.env.VITE_AUTH_BACKEND;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      const res = await fetch(`${API_BASE_URL}/api/credits/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, address }),
      });
      const result = await res.json();
      if (result.message === "Credits added successfully.") {
        setMessage("✅ Payment successful! Credits added. return to home page .");
      } else {
        setMessage("⚠️ Payment succeeded but credit update failed.");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          rows={3}
          required
        />
      </div>

      <PaymentElement />

      <button
        disabled={loading || !stripe || !elements}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && <p className="text-center text-sm text-red-500">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
