import React from "react";
import {
  Linkedin,
  MessageCircle,
  X,
  Youtube,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Heart,
  HeartIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const AppName = import.meta.env.VITE_APP_NAME || "OSINT Ambition";
  return (
    <footer className="bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Top Footer Section with gradient border */}
      <div className="max-w-[2000px] mx-auto p-8 lg:p-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Logo and Contact Section */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center group">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/8b7be49b2687943ef40ce83de105e4f9918e4f114fe8607fd737b4484c1182e4?placeholderIfAbsent=true"
                  className="object-contain w-[140px] lg:w-[175px] transition-transform duration-500 group-hover:scale-105"
                  alt="Logo"
                />
              </Link>
            </div>

            <p className="text-gray-300 mb-6">
              We provide advanced digital intelligence tools for investigators, researchers, and
              security professionals.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hi@profiler.me"
                className="flex items-center text-gray-300 hover:text-white transition-all group"
                target="_blank"
              >
                <Mail className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  hi@profiler.me
                </span>
              </a>

              <a
                href="https://api.whatsapp.com/send/?phone=919991256829&text&type=phone_number&app_absent=0"
                className="flex items-center text-gray-300 hover:text-white transition-all group"
                target="_blank"
              >
                <MessageCircle className="mr-3 h-5 w-5 group-hover:text-blue-400" />
                <span className="group-hover:translate-x-1 transition-transform">
                  +919991256829
                </span>
              </a>

              <div className="flex items-center text-gray-300">
                <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="https://profiler.me/demo"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/blog"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/features"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/pricing"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Try Now
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="https://profiler.me/free"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Free Tools
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/freemium"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Freemium Tools
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/paid"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Paid Tools
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/emailtool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Email Tools
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/phonetool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Phone Tools
                </Link>
              </li>
              <li>
                <Link
                  to="https://profiler.me/usernametool"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Username Tools
                </Link>
              </li>
              <li>
                <Link
                  to="mailto:support@profiler.me"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Report an Error
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Social */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white relative">
              <span className="h-1 w-10 absolute -bottom-2 left-0"></span>
              Company
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link
                  to="https://profiler.me/about"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="https://profiler.me/contact"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="mailto:hi@profiler.me"
                  className="text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block"
                  target="_blank"
                >
                  Join Us
                </Link>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/company/osintambition/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <Linkedin size={25} className="text-white font-bold " />
              </a>
              <a
                href="https://x.com/osintambition"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <X size={25} className="text-white font-bold " />
              </a>
              <a
                href="https://www.youtube.com/channel/UCxi_L9SyoUdtbKd8OrG0V7w"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-2.5 rounded-lg hover:scale-110 transition-all border border-zinc-700/30 hover:border-zinc-600/50 shadow-lg"
              >
                <Youtube size={25} className="text-white font-bold " />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-zinc-800 mt-12">
        <div className="max-w-[2000px] mx-auto py-8 px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 flex gap-2 text-md mb-4 md:mb-0">
            © {currentYear} Made with 🤍 by OSINTAmbition.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
