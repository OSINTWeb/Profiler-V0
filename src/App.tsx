import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ProfilerPage from "./pages/ProfilerPage";
import Profilepage from "./hooks/Profile_aut0";
import UI from "@/components/AdvanceResults/UI";
import BasicUI from "@/components/BasicResults/BasicUi";
import PayPalPaymentForm from "./AuthPages/Paypal";
import RazorpayPayment from "./AuthPages/RazorPay";
import StripePayment from "./AuthPages/stripePage/Stripe";
import PhoneResultUI from "@/components/BasicResults/PhoneResult/BasicUi";
import Pricing from "./components/PricingPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfilerPage />} />
          <Route path="/result/Advance" element={<UI />} />
          <Route path="/result/Basic" element={<BasicUI />} />
          <Route path="/result/phone" element={<PhoneResultUI />} /> {/* */}
          <Route path="/result/Basic" element={<BasicUI />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Profile" element={<Profilepage />} />
          <Route path="/paypal" element={<PayPalPaymentForm />} />
          <Route path="/razorpay" element={<RazorpayPayment />} />
          <Route path="/stripe" element={<StripePayment />} />
          <Route path="/Pricing" element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
