import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Image, ChevronDown, Info } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { link } from "fs";
import { ExternalLink } from "lucide-react";

import { SearchTypesProps, Tool, SearchOption } from "@/type";

export function SearchTypes({ settypeofsearch, selected, typeofsearch }: SearchTypesProps) {
  const [selectedOption, setSelectedOption] = useState<SearchOption | null>(null);
  const [openDrawer, setOpenDrawer] = useState<SearchOption | null>(null);

  const toggleDrawer = (type: SearchOption) => {
    settypeofsearch(type);
    setSelectedOption(type);
    if (selected === "Free") {
      setOpenDrawer(openDrawer === type ? null : type);
    }
  };

  const options = ["Basic", "Advance"];
  
  const FreeTools: Tool[] = [
    // {
    //   title: "UserFindr",
    //   description:
    //     "Check username availability across 70+ popular websites and platforms.",
    //   link: "https://userfindr.profiler.me/",
    // },
    {
      title: "Gravaton",
      description: "Find public Gravatar profile associated with any email address",
      link: "https://gravaton.profiler.me/",
    },
    {
      title: "Ignorant",
      description: "Find if that phone number has an instagram or Amazon Account.",
      link: "https://ignorant.profiler.me/",
    },

    {
      title: "Linkook",
      description: "Discover connected social accounts just by a username.",
      link: "https://linkook.profiler.me/",
    },
    {
      title: "Proton Intelligence",
      description: "Identify ProtonMail Mail Addresses Along with its Creation date and Time.",
      link: "https://protonintel.profiler.me/",
    },
    {
      title: "Breach Guard",
      description: "Enter your email to see if it has appeared in any data breaches",
      link: "https://breachguard.profiler.me/",
    },
    {
      title: "Info-Stealer Lookup",
      description: "Check if your email or username has been compromised by info-stealing malware",
      link: "https://infostealer.profiler.me/",
    },
    {
      title: "TiktokerFinder",
      description: "Quickly identify whether a TikTok account exists for a given username.",
      link: "https://tiktokerfinder.profiler.me/",
    },
  ];

  const FreemiumTools: Tool[] = [
    // Phone/Email/LinkedIn tools
    {
      title: "CallSpy",
      description: "Most affordable Phone Number lookup tool",
      link: "https://callspy.profiler.me/",
    },
    {
      title: "SimSpy",
      description: "Check phone number details such as line type, carrier, and country information",
      link: "https://simspy.profiler.me/",
    },
    {
      title: "Mail2Linked",
      description: "Find LinkedIn with Just an Email",
      link: "https://mail2linkedin.profiler.me/",
    },
    {
      title: "XScan",
      description:
        "Enter any Twitter username and instantly access a detailed, structured profile view with insights even Twitter doesn't reveal",
      link: "https://xscan.profiler.me/",
    },
    {
      title: "EmailIntel",
      description:
        "Reveal where an email is registered. We check for presence of an account linked to that email on 30+ popular platforms.",
      link: "https://emailintel.profiler.me/",
    },
    // {
    //   title: "SocialMediaChecker",
    //   description:
    //     "Quickly identify whether an account exists on platforms such as Google, Facebook, Instagram, Snapchat, and Twitter.",
    //   link: "https://socialmediachecker.profiler.me/",
    // } ,
  ];
  const drawerOptions = {
    "Phone Number Search": [
      "Ignorent",
      "Phomber",
      "Hudson rock intelligence",
      "Phoneinfoga",
      "Phone number to line type (twilio API)",
      "Phone number to UPI IDs (UPI INT Github Repo)",
      "Phone number to names",
    ],
    "Email Search": [
      "Holehe",
      "Mailcat",
      "Postle",
      "Mosint",
      "H8mail",
      "Hudson rock intelligence",
      "Check if email exists (by reacher)",
      "Email reputation check by emailrep.io (initially free plain)",
      "Gitshield",
      "Email to username, username to email",
    ],
    "Reverse Image Search": ["Google Lens", "Yandex Image", "Bing Visual Search", "TinEye"],
  };

  // Icon mapping
  const iconMap = {
    "Phone Number Search": <Phone size={18} />,
    "Email Search": <Mail size={18} />,
    "Reverse Image Search": <Image size={18} />,
  };
  return (
    <div className={`flex flex-col items-center justify-center gap-4 px-2 ${selected !== "Paid" ? "pb-56" : ""}`} >
      <div className="flex gap-4 max-w-full w-full px-10 relative justify-center">
        {selected === "Paid" &&
          options.map((type, index) => (
            <div className="relative" key={index}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDrawer(type as SearchOption)}
                className={`flex justify-center  text-md font-semibold leading-none bg-gradient-to-b from-[#677272] to-[#212121] rounded-lg border-b text-gray-300 border-white/15 h-[40px] 
                shadow-[0px_2px_0px_rgba(255,255,255,0.3)] w-[120px]  sm:w-[220px] px-4 items-center 
                transition-all duration-300 ease-in-out group border-2 border-white
                
                ${
                  typeofsearch === type
                    ? "bg-none shadow-inner shadow-teal-200 "
                    : "hover:bg-none hover:shadow-inner hover:shadow-teal-200 "
                }`}
              >
                <div className="flex items-center  w-full justify-center">
                  {iconMap[type as SearchOption]}

                  <span className="text-lg whitespace-nowrap">{type}</span>
                </div>
              </motion.button>
            </div>
          ))}
        {selected === "Free" && (
          <div className="flex flex-wrap gap-4  justify-center items-center w-full">
            {FreeTools.map((tool, index) => {
              const isUserFindr = tool.title.toLowerCase() === "userfindr";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-[#131315] rounded-lg w-64 p-4 border border-white/10 hover:border-gray-500 transition-colors relative ${isUserFindr ? "border-2 border-teal-400 shadow-lg shadow-teal-200/40" : ""}`}
                >
                  {isUserFindr && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-teal-400 to-teal-600 text-white text-sm font-bold px-1 py-1 rounded shadow-md  z-10">
                      NEW
                    </span>
                  )}
                  <h3 className="font-bold text-lg flex items-center justify-start">
                    {tool.title}
                    {/* <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <ExternalLink size={16} />
                    </a> */}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">{tool.description}</p>
                  <button
                    onClick={() => {
                      window.open(tool.link, "_blank");
                    }}
                    className="mt-4 w-full border border-white/10 text-teal-300  py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Search Now
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
        {selected === "Freemium" && (
          <div className="flex flex-wrap gap-4  justify-center items-center w-full">
            {FreemiumTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#131315] rounded-lg w-64 p-4 border border-white/10 hover:border-gray-500 transition-colors"
              >
                <h3 className="font-bold text-lg flex items-center justify-between">
                  {tool.title}
                  {/* <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <ExternalLink size={16} />
                  </a> */}
                </h3>
                <p className="text-gray-400 text-sm mt-2">{tool.description}</p>
                <button
                  onClick={() => {
                    window.open(tool.link, "_blank");
                  }}
                  className="mt-4 w-full border border-white/10 text-teal-300  py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Search Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
