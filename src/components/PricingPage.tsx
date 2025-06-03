import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useAuth0 } from "@auth0/auth0-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Affordable Pricing Plans
        </h1>
        <p className="text-center text-[#e5e7eb] mb-12 max-w-xl mx-auto">
          Credits will reflect within 10 minutes. Thanks for your patience!
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {/* Free Plan */}
          <PricingCard
            title="Free Plan"
            price="$0"
            description="Free for everyone"
            buttonText="Try Now"
            features={[
              "Find public Gravatar profile associated with any email address",
              "Check if a phone number links to Instagram or Amazon",
              "Discover connected social accounts by username",
              "Identify ProtonMail addresses with creation date",
              "Check if your email or username was compromised by malware",
              "See if your email appeared in data breaches",
            ]}
          />

          {/* Premium Plan */}
          <PricingCard
            title="Premium Plan"
            price="$Custom"
            description="Pay as you go"
            buttonText="Contact Sales"
            paymentOptions={["Stripe", "Razorpay"]}
            features={[
              "Most affordable and accurate phone number lookup",
              "Check line type, carrier, and country for phone numbers",
              "Find LinkedIn profiles with just an email",
              "Reveal where an email is registered (30+ platforms)",
              "Identify Google, Facebook, Instagram, Snapchat, Twitter accounts",
            ]}
          />

          {/* Basic Search */}
          <PricingCard
            title="Basic Search"
            price="$0.05"
            description="Per search"
            buttonText="Get Started"
            paymentOptions={["Stripe", "Razorpay"]}
            features={[
              "Scans over 10+ sources across the internet",
              "Search primary databases for email and username presence",
              "Identify public phone number details and social media profiles",
              "Find public user profiles and code repositories",
              "Check public profiles and recent activity",
              "Cross-check against major known data breaches",
            ]}
          />

          {/* Advanced Search */}
          <PricingCard
            title="Advanced Search"
            price="$0.50"
            description="Per search"
            buttonText="Get Started"
            paymentOptions={["Stripe", "Razorpay"]}
            features={[
              "Scans 1500+ sources using phone, email, and username",
              "Deep search across social platforms and advanced phone enrichment",
              "Leak & data breach check",
              "Advanced repo scanning, contributor analysis, exposure detection",
              "Historical data access and sentiment analysis",
              "Uncover hidden connections and intelligence reports",
            ]}
          />
        </div>

        {/* Early Bird Offer */}
        <section className="mt-20 text-center flex flex-col items-center rounded-xl">
          <div className="w-full max-w-4xl mx-auto border p-4 sm:p-6 md:p-8 px-4 sm:px-12 md:px-24 rounded-xl flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-green-400">
              Early Bird Offer
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Limited Time Offer: First 7 Days Only
            </p>

            <div className="flex items-center justify-center border border-green-400 rounded-lg w-fit">
              <table className="min-w-[400px] md:min-w-[600px] bg-black bg-opacity-60 rounded-2xl border border-green-500 overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-black bg-opacity-80">
                    <th className="py-4 px-6 text-lg md:text-xl font-semibold text-green-400 border-b border-green-500 text-center">
                      Purchase Amount ($)
                    </th>
                    <th className="py-4 px-6 text-lg md:text-xl font-semibold text-green-400 border-b border-green-500 text-center">
                      Additional Credits (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: "$10 - 100", discount: "5%" },
                    { range: "$100 - 1,000", discount: "10%" },
                    { range: "$1,000 - 10,000", discount: "15%" },
                    { range: "Above $10,000", discount: "20%" },
                  ].map((offer, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-green-900 last:border-b-0 hover:bg-green-900/10 transition"
                    >
                      <td className="py-4 px-6 text-white text-lg text-center">{offer.range}</td>
                      <td className="py-4 px-6 text-white text-lg font-bold text-center">
                        {offer.discount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-8 text-gray-300 text-base md:text-lg">
              The more you purchase, the more credits you get!
            </p>

            <button className="mt-6 mx-auto block bg-white text-black font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-green-100 transition-colors text-lg w-48">
              Claim Now
            </button>
          </div>
        </section>
      </section>
    </div>
  );
};

const PricingCard = ({ title, price, description, buttonText, paymentOptions = [], features }) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePaymentClick = (option) => {
    // Prevent multiple clicks
    if (isNavigating) {
      return;
    }

    if (!isAuthenticated) {
      // Store the intended payment destination before login
      const paymentDestination = option.toLowerCase();
      sessionStorage.setItem('paymentDestination', paymentDestination);
      sessionStorage.setItem('intendedAction', 'payment');
      
      loginWithRedirect({
        appState: {
          returnTo: `/pricing`,
          paymentOption: paymentDestination
        }
      });
      return;
    }

    // Ensure we have user data before proceeding
    if (!user?.email) {
      console.error("User email not available");
      return;
    }

    setIsNavigating(true);

    try {
      const email = user.email;
      // Simple URL encoding without double encoding
      const encodedEmail = encodeURIComponent(email);
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        if (option.toLowerCase() === "stripe") {
          // Use window.location.assign for better reliability
          window.location.assign(`/stripe?email=${encodedEmail}`);
        } else if (option.toLowerCase() === "razorpay") {
          // Use window.location.assign for better reliability
          window.location.assign(`/razorpay?email=${encodedEmail}`);
        }
      }, 100);
    } catch (error) {
      console.error("Error navigating to payment page:", error);
      setIsNavigating(false);
      // Fallback to basic navigation without email parameter
      setTimeout(() => {
        if (option.toLowerCase() === "stripe") {
          window.location.assign("/stripe");
        } else if (option.toLowerCase() === "razorpay") {
          window.location.assign("/razorpay");
        }
      }, 100);
    }
  };

  // Handle redirect after authentication
  React.useEffect(() => {
    // Clean up Auth0 callback parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') && urlParams.has('state')) {
      // Remove Auth0 callback parameters from URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (isAuthenticated && user?.email) {
      const paymentDestination = sessionStorage.getItem('paymentDestination');
      const intendedAction = sessionStorage.getItem('intendedAction');
      
      if (intendedAction === 'payment' && paymentDestination) {
        // Clear the stored data
        sessionStorage.removeItem('paymentDestination');
        sessionStorage.removeItem('intendedAction');
        
        // Small delay to ensure user data is loaded
        setTimeout(() => {
          const encodedEmail = encodeURIComponent(user.email);
          if (paymentDestination === 'stripe') {
            window.location.assign(`/stripe?email=${encodedEmail}`);
          } else if (paymentDestination === 'razorpay') {
            window.location.assign(`/razorpay?email=${encodedEmail}`);
          }
        }, 500);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="rounded-2xl p-8 shadow-lg hover:scale-105 hover:shadow-white/10 transition-all border border-white/50 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">{title}</h3>
        <div className="text-5xl md:text-6xl font-extrabold mb-1 text-white">{price}</div>
        <p className="text-lg text-gray-400 mb-6">{description}</p>

        {price === "$0" && (
          <button className="flex-1 w-full bg-[#232428] text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md hover:bg-[#32343a] transition-colors border border-[#32343a]">
            Try Now
          </button>
        )}
        {paymentOptions.length > 0 && (
          <>
            <div className="text-center text-gray-300 mb-4 text-base md:text-lg font-medium">
              Select your Payment Type
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              {paymentOptions.map((option, idx) => (
                <button
                  key={idx}
                  className={`flex-1 min-w-[120px] py-3 px-6 rounded-lg font-semibold text-lg shadow-md transition-colors border ${
                    isNavigating 
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600" 
                      : "bg-[#232428] text-white hover:bg-[#32343a] border-[#32343a]"
                  }`}
                  onClick={() => handlePaymentClick(option)}
                  disabled={isNavigating}
                >
                  {isNavigating ? "Loading..." : option}
                </button>
              ))}
            </div>
            <div className="text-center text-gray-400 text-sm mb-6">
              Deep OSINT Intelligence, Intuitively Presented
            </div>
          </>
        )}
      </div>
      <div className="mt-6 bg-[#111214] rounded-xl p-6 border border-[#232428]">
        <h4 className="font-semibold text-lg mb-4 text-white">What's Included</h4>
        <ul className="space-y-3 text-gray-200 text-base text-left">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 mt-1 text-green-400 text-lg">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
