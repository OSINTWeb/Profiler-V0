import React from "react";
import { motion } from "framer-motion";
import { Copy, X, Download, Calstartar, Globe, Clock, CheckCircle, Circle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CompanyLogo from "../Logo";
import DateObject from "react-date-object";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import JSONPretty from "react-json-pretty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { spec } from "node:test/reporters";
import { Expand, PlatformData, SpecFormat, SpecFormatValue } from "./expand";

interface InfoCardProps {
  userData: PlatformData;
  hidebutton?: boolean;
  PaidSearch?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  enableselect?: boolean;
  onDelete?: () => void;
}

interface SpecFormatItem {
  key: string;
  value: string | number | boolean;
  type: string;
}

interface ProfileSectionProps {
  data: PlatformData[];
  onDelete?: () => void;
}

// Helper function to format titles
const formatTitle = (title: string): string => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

const InfoCard: React.FC<InfoCardProps> = ({
  userData,
  hidebutton,
  PaidSearch,
  isSelected = false,
  onSelect,
  enableselect,
  onDelete,
}) => {
  const { module, pretty_name, query, spec_format, front_schemas } = userData;
  const isBreached = spec_format?.[0]?.breach?.value || false;
  const verified = spec_format?.[0]?.verified?.value || false;
  const premium = spec_format?.[0]?.premium?.value || false;

  const platformName = module;
  const name = (spec_format?.[0]?.name?.value as string) || "";
  const websiteValue = spec_format?.[0]?.website?.value;
  const website = typeof websiteValue === 'string' ? websiteValue : platformName;
  const id = (spec_format?.[0]?.id?.value as string) || "#";
  const bio = (spec_format?.[0]?.bio?.value as string) || "#";
  const creation_date = (spec_format?.[0]?.creation_date?.value as string) || "#";
  const gstarter = (spec_format?.[0]?.gstarter?.value as string) || "";
  const last_seen = (spec_format?.[0]?.last_seen?.value as string) || "";
  const username = (spec_format?.[0]?.username?.value as string) || "";
  const registered = spec_format?.[0]?.registered?.value || false;
  const location = (spec_format?.[0]?.location?.value as string) || "";
  const phone_number = (spec_format?.[0]?.phone_number?.value as string) || "";
  const profileURL = (spec_format?.[0]?.profile_url?.value as string) || "";
  const language = (spec_format?.[0]?.language?.value as string) || "";
  const age = spec_format?.[0]?.age?.value || 0;
  const logo = (spec_format?.[0]?.picture_url?.value as string) || "";
  const [isOpen, setIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  
  const handleCopyField = (fieldKey: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedStates(prev => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [fieldKey]: false }));
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };
  
  const platform_variables = (spec_format?.[0]?.platform_variables || []) as SpecFormatItem[];
  const countryCode = platform_variables.find(
    (item) => item.key === "country_code"
  )?.value as string;

  const city = platform_variables.find((item) => item.key === "city")?.value as string;

  const dob = platform_variables.find((item) => item.key === "dob")?.value as string;

  const CodeBlock = ({ data }) => {
    const [toggle, settoggle] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopy = () => {
      const jsonString = JSON.stringify(data, null, 2);
      navigator.clipboard
        .writeText(jsonString)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy JSON: ", err);
        });
    };

    return toggle === true ? (
      <>
        <button
          onClick={() => settoggle(!toggle)}
          className="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 font-semibold text-white text-sm px-4  transition-all duration-300"
          >
          Show JSON
        </button>
      </>
    ) : (
      <div className="relative p-4 bg-gradient-to-br from-black to-gray-900 text-white rounded-xl overflow-hidden border border-gray-700 mt-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={() => settoggle(!toggle)}
            className="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 font-semibold text-white text-sm px-4  transition-all duration-300"
            >
            Hide JSON
          </button>
          <button
            onClick={handleCopy}
            className={`rounded-lg border border-gray-700 text-white px-4 flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
              isCopied 
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-600" 
                : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
            }`}
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "Copied!" : "Copy JSON"}
          </button>
        </div>
        <div className="overflow-x-auto bg-black rounded-lg p-4 border border-gray-800">
          <JSONPretty id="json-pretty" data={data}></JSONPretty>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-[#0f0f12] to-[#131315] border border-gray-700 flex flex-col w-full rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 hover:border-gray-600 h-[700px] relative">
      {/* Header Section */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-t-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-gray-700 shadow-lg">
          <CompanyLogo companyName={platformName} />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-xl md:text-2xl font-bold capitalize">{platformName}</h3>
          <p className="text-gray-400 text-sm">{pretty_name}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-2 border-gray-700 shadow-lg transition-all duration-300 group-hover:border-gray-600"
                src={
                  (spec_format?.[0]?.picture_url?.value as string) ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                }}
              />
            </div>
            
            {profileURL && (
              <motion.a
                href={profileURL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 text-white px-4  rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl  "
              >
                <Globe size={16} />
                <span className="hidden sm:inline">View Profile</span>
                <span className="sm:hidden">Profile</span>
              </motion.a>
            )}

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              {premium && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                  Premium
                </motion.span>
              )}
              {verified && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Verified
                </motion.span>
              )}
              {isBreached && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                  Breached
                </motion.span>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Website */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 p-4 bg-gradient-to-r from-gray-900/30 to-black/30 rounded-lg border border-gray-800">
              <span className="text-gray-300 text-sm font-semibold min-w-[100px]">Website:</span>
              {website && typeof website === 'string' ? (
                <a
                  href={`https://${website}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors font-medium underline decoration-gray-400/30 hover:decoration-white"
                >
                  {website.toUpperCase()}.com
                </a>
              ) : (
                <a
                  href={`https://${platformName}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors font-medium underline decoration-gray-400/30 hover:decoration-white"
                >
                  {platformName.toUpperCase()}.com
                </a>
              )}
            </div>

            {/* Dynamic Spec Format Data */}
            {spec_format?.map((item, index) =>
              Object.entries(item).map(
                ([key, value]) =>
                  key !== "platform_variables" && !key.includes("url") && (
                    <div
                      key={`${index}-${key}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 p-4 bg-gradient-to-r from-gray-900/30 to-black/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-200"
                    >
                      <span className="text-gray-300 text-sm font-semibold min-w-[100px]">
                        {formatTitle(key)}:
                      </span>
                      <div className="flex items-center gap-3 flex-1 sm:justify-start">
                        {key === "id" ? (
                          <>
                            <span className="text-white font-mono text-sm bg-black border border-gray-700 px-3 py-1 rounded-lg break-all">
                              {(value as SpecFormatValue).value}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCopyField(`${index}-${key}`, (value as SpecFormatValue).value.toString())
                              }
                              className={`rounded-lg transition-colors p-2 border ${
                                copiedStates[`${index}-${key}`] 
                                  ? "bg-green-600/20 border-green-600 hover:bg-green-600/30" 
                                  : "hover:bg-gray-800 border-gray-700"
                              }`}
                            >
                              {copiedStates[`${index}-${key}`] ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </>
                        ) : key === "last_seen" || key === "creation_date" ? (
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 px-3 py-1 rounded-lg">
                              {formatDate((value as SpecFormatValue).value.toString())}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleCopyField(`${index}-${key}`, (value as SpecFormatValue).value.toString())
                              }
                              className={`rounded-lg transition-colors p-2 border ${
                                copiedStates[`${index}-${key}`] 
                                  ? "bg-green-600/20 border-green-600 hover:bg-green-600/30" 
                                  : "hover:bg-gray-800 border-gray-700"
                              }`}
                            >
                              {copiedStates[`${index}-${key}`] ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-300" />
                              )}
                            </motion.button>
                          </div>
                        ) : typeof (value as SpecFormatValue).value === "boolean" ? (
                          <span
                            className={`px-4  rounded-full text-xs font-medium border-2 ${
                              (value as SpecFormatValue).value
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                            }`}
                          >
                            {(value as SpecFormatValue).value ? "Yes" : "No"}
                          </span>
                        ) : (
                          <span className="text-white font-medium bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-800 break-all">
                            {(value as SpecFormatValue).value}
                          </span>
                        )}
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-800 bg-gradient-to-r from-slate-900/50 to-black/50 rounded-b-xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#131315] hover:from-gray-600 hover:to-gray-700 border border-gray-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => setIsOpen(true)}
        >
          Expand
        </motion.button>
        <Expand
          isDetailsOpen={isOpen}
          setIsDetailsOpen={setIsOpen}
          selectedItem={userData}
        />
      </div>
    </Card>
  );
};

export default InfoCard;
