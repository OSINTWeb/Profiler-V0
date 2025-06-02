import { Button } from "@/components/ui/button";
import type { InfoCardProps } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Copy, Info } from "lucide-react";
import CompanyLogo from "../Logo";
import DateObject from "react-date-object";
import { motion } from "framer-motion";
import { Expand } from "./expand";
import JSONPretty from "react-json-pretty";

interface PlatformData {
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format?: {
    registered?: { value: boolean };
    breach?: { value: boolean };
    name?: { value: string };
    picture_url?: { value: string };
    website?: { value: string };
    id?: { value: string };
    bio?: { value: string };
    creation_date?: { value: string };
    last_seen?: { value: string };
    username?: { value: string };
    location?: { value: string };
    gender?: { value: string };
    language?: { value: string };
    age?: { value: string };
    phone_number?: { value: string };
  }[];
  front_schemas?: {
    image?: string;
  }[];
  status?: string;
  module?: string;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Helper function to format titles
const formatTitle = (title: string): string => {
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const CodeBlock = ({ data }) => {
  const [toggle, settoggle] = useState(true);
  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        alert("JSON copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy JSON: ", err);
      });
  };

  return toggle === true ? (
    <>
      <button
        onClick={() => settoggle(!toggle)}
        className="rounded-2xl w-full my-2 border border-white/20 bg-gradient-to-r from-black/95 to-gray-900/95 hover:from-black hover:to-gray-900 font-bold text-sm sm:text-md py-3 px-4 text-white transition-all duration-300 shadow-lg backdrop-blur-sm"
      >
        Show JSON
      </button>
    </>
  ) : (
    <div className="relative p-2 sm:p-4 bg-gradient-to-br from-black/95 to-gray-900/95 text-white rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-2 sm:mb-0">
        <button
          onClick={() => settoggle(!toggle)}
          className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 font-bold text-sm px-3 py-1.5 sm:px-4 sm:py-1 transition-all duration-300 shadow-md"
        >
          Hide JSON
        </button>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="sm:absolute sm:top-2 sm:right-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-3 py-1.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
        >
          <Copy size={14} />
          <span className="sm:hidden">Copy JSON</span>
        </button>
      </div>

      {/* JSON Viewer */}
      <div className="mt-2 overflow-x-auto bg-black/50 rounded-xl p-4 border border-white/10">
        <JSONPretty themeClassName="custom-json-pretty" data={data}></JSONPretty>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  count,
  items,
  data,
}: InfoCardProps & { data: PlatformData[] }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<PlatformData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [curritem, setcurritem] = useState(null);
  useEffect(() => {
    if (count > 0) {
      const duration = 2000;
      const increment = Math.ceil(count / (duration / 16));
      let animationId: number;

      const animate = () => {
        setAnimatedCount((prevCount) => {
          const newCount = prevCount + increment;
          if (newCount >= count) {
            return count;
          }
          animationId = requestAnimationFrame(animate);
          return newCount;
        });
      };

      animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    } else {
      setAnimatedCount(0);
    }
  }, [count]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleImageClick = (item: PlatformData) => {
    setcurritem(item);
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const renderItem = (item: string, index: number) => (
    <div className="flex items-center gap-1 sm:gap-2">
      {title === "creation_date" || title === "Last Seen" ? (
        <span className="text-white font-medium text-xs sm:text-sm bg-gray-800/30 px-2 py-1 rounded-lg border border-white/10">
          {formatDate(item)}
        </span>
      ) : (
        <span className="text-white text-xs sm:text-sm break-all bg-gray-800/30 px-2 py-1 rounded-lg border border-white/10">{item}</span>
      )}
      {index < items.length - 1 && (
        <span className="text-gray-500 mx-1 text-xs">•</span>
      )}
    </div>
  );


  const renderDialogContent = () => {
    let uniqueFoundModules: Set<string>;

    switch (title) {
      case "Sources Found":
        uniqueFoundModules = new Set();

        return (
          <div className="flex w-full justify-between overflow-y-auto scrollbar-hidden h-full">
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <h2 className="text-white text-center text-lg sm:text-xl font-bold mb-4 sticky top-0 bg-black/95 py-3 z-10 border-b border-white/20 backdrop-blur-sm">
                Sources Found
              </h2>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-6">
                {data
                  ?.filter((item) => item.status === "found")
                  .map((item, index) => {
                    if (!uniqueFoundModules.has(item.module)) {
                      uniqueFoundModules.add(item.module);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer hover:bg-white/5 hover:border-white/30 min-h-[100px] sm:min-h-[120px] bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm shadow-lg"
                          onClick={() => handleImageClick(item)}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-2 sm:mb-3 flex items-center justify-center bg-white/5 rounded-xl">
                            <CompanyLogo companyName={item.module} />
                          </div>
                          <div className="text-xs sm:text-sm text-white font-medium text-center line-clamp-2 leading-tight">
                            {item.pretty_name || item.module}
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          </div>
        );
      case "name":
      case "Username":
      case "Location":
      case "creation_date":
      case "Last Seen":
      case "Gender":
      case "Language":
      case "Age":
        return (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 py-2 sm:py-6">
              {data?.map((item, index) =>
                item.spec_format
                  ?.map((spec, specIndex) => {
                    const value = spec[title.toLowerCase().replace(" ", "_")]?.value;
                    if (!value) return null;
                    return (
                      <motion.div
                        key={`${index}-${specIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: specIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className="relative group flex flex-col sm:flex-row w-full border border-white/20 justify-between p-4 rounded-2xl hover:bg-white/5 hover:border-white/30 transition-all duration-300 gap-3 sm:gap-4 bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-sm shadow-lg"
                      >
                        <div className="flex items-start gap-3 flex-1 cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <span className="text-white text-sm sm:text-base break-words block font-medium">
                              {formatDate(value)}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(value, index)}
                            className="p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200 flex-shrink-0 bg-white/5 border border-white/10 shadow-md"
                            title="Copy to clipboard"
                          >
                            {copied === index ? "✓" : <Copy size={16} />}
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleImageClick(item)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300 cursor-pointer bg-white/5 border border-white/10 shadow-md"
                          >
                            <CompanyLogo companyName={item.module} />
                          </motion.div>
                        </div>
                        {/* Tooltip - only show on larger screens */}
                        <div className="absolute -top-12 right-4 px-3 py-2 bg-black/95 border border-white/20 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-20 font-medium hidden lg:block pointer-events-none backdrop-blur-sm">
                          {item.module || "Unknown Source"}
                          <div className="text-gray-300 text-xs mt-1">
                            Click to view profile
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-b border-r border-white/20"></div>
                        </div>
                      </motion.div>
                    );
                  })
                  .filter(Boolean)
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="bg-gradient-to-br from-[#000000] to-[#0a0a0a] border flex gap-2 sm:gap-3 flex-1 grow shrink basis-auto px-4 sm:px-5 py-4 sm:py-5 rounded-2xl border-white/10 overflow-visible hover:border-white/25 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 ease-out group relative backdrop-blur-sm min-h-[90px] sm:min-h-auto">
        {/* Info icon with tooltip - hidden on mobile */}
        <div className="absolute top-3 right-3 group hidden sm:block">
          <Info className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-300" />
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/95 border border-white/20 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-50 backdrop-blur-sm pointer-events-none">
            {title === "creation_date" ? "View First Seen Details" : `View ${title} Details`}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-b border-r border-white/20"></div>
          </div>
        </div>

        <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 group-hover:from-white/10 group-hover:to-white/15 transition-all duration-300 flex-shrink-0 shadow-lg">
          <img src={icon} alt={`${title} icon`} className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter brightness-110" />
        </div>
        <span className="w-px bg-gradient-to-b from-transparent via-white/20 to-transparent h-full" />
        <div className="flex flex-col items-stretch w-full min-w-0 justify-center">
          <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-[16px] text-white font-semibold tracking-wide">
            <div className="grow truncate">
              <span className="block sm:inline text-white">
                {title === "creation_date" ? "FIRST SEEN" : title.toUpperCase()}
              </span>
              {count > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 text-xs sm:text-sm text-blue-300 font-medium bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20"
                >
                  {animatedCount}
                </motion.span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-5 text-xs sm:text-sm justify-between mt-3 sm:mt-2">
            <div className="text-gray-200 font-normal overflow-hidden text-ellipsis max-w-[55%] sm:max-w-[70%] min-w-0">
              {items.length > 0 ? (
                <>
                  <div className="flex items-center flex-wrap gap-1">
                    {items.slice(0, 1).map((item, index) => renderItem(item, index))}
                    {items.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-gray-400 ml-1 text-xs bg-gray-800/50 px-2 py-1 rounded-full"
                      >
                        +{items.length - 1} more
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-gray-500 italic text-xs">No data available</span>
              )}
            </div>
            <div className="flex-shrink-0">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-blue-300 hover:text-blue-200 font-medium hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto min-h-[36px] rounded-xl shadow-md"
                  >
                    <span>Expand</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[98vw] sm:max-w-4xl lg:max-w-5xl flex flex-col bg-black/95 border border-white/20 rounded-2xl shadow-2xl h-[90vh] sm:h-[85vh] scrollbar-hidden backdrop-blur-md mx-1 sm:mx-auto">
                  <DialogHeader className="flex-shrink-0 border-b border-white/10 pb-4">
                    <DialogTitle className="text-white text-center text-lg sm:text-xl lg:text-2xl my-3 sm:my-5 font-bold tracking-wide">
                      {title === "creation_date" ? "First Seen" : title.toUpperCase()}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    {renderDialogContent()}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={curritem}
      />
    </>
  );
};

const InfoCardsContainer = ({ data }: { data: PlatformData[] }): JSX.Element => {
  const [copied, setCopied] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PlatformData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [curritem, setcurritem] = useState(null);
  const [activeTab, setActiveTab] = useState("sources_found");

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleImageClick = (item: PlatformData) => {
    setcurritem(item);
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const extractUniqueValues = (key: string) => {
    const values = data
      .flatMap((item) => item.spec_format?.map((spec) => spec?.[key]?.value) || [])
      .filter((value): value is string => Boolean(value));

    return [...new Set(values)];
  };

  const cardData: InfoCardProps[] = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Sources Found",
      count: data.length,
      items: [],
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Username",
      count: extractUniqueValues("username").length,
      items: extractUniqueValues("username"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/10ef79cabb712c00af4445df4fb142aed074c4d58d5a17d9033b3f06cf7f6cf9?placeholderIfAbsent=true",
      title: "name",
      count: extractUniqueValues("name").length,
      items: extractUniqueValues("name"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/0e2dc1ea6ea900ff1f3370e131b8ac57a062ed591d743e26aa1d90f0a6b0d844?placeholderIfAbsent=true",
      title: "Location",
      count: extractUniqueValues("location").length,
      items: extractUniqueValues("location"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/33925ced5863e73ab901ada4c80ca2bbd72ed9a1b6a75c7d5e85797ec15af165?placeholderIfAbsent=true",
      title: "creation_date",
      count: extractUniqueValues("creation_date").length,
      items: extractUniqueValues("creation_date"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/0165293a4391d2724084855a69a8936490d0ee34f096ac1e7fe6aa38f9bdace2?placeholderIfAbsent=true",
      title: "Last Seen",
      count: extractUniqueValues("last_seen").length,
      items: extractUniqueValues("last_seen"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Gender",
      count: extractUniqueValues("gender").length,
      items: extractUniqueValues("gender"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Language",
      count: extractUniqueValues("language").length,
      items: extractUniqueValues("language"),
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/efa2c28f2a98b2f7926696227c835c5dfdaeb007e36131cb0e360c8b0d71b348?placeholderIfAbsent=true",
      title: "Age",
      count: extractUniqueValues("age").length,
      items: extractUniqueValues("age"),
    },
  ];

  // Filter out cards that have no data
  const filteredCardData = cardData.filter((card) => {
    if (card.title === "Sources Found") return true;
    return card.count > 0;
  });

  const renderTabContent = (card: InfoCardProps) => {
    let uniqueFoundModules: Set<string>;

    switch (card.title) {
      case "Sources Found":
        uniqueFoundModules = new Set();
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[400px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-6">
              {data
                ?.filter((item) => item.status === "found")
                .map((item, index) => {
                  if (!uniqueFoundModules.has(item.module)) {
                    uniqueFoundModules.add(item.module);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer hover:bg-white/10 hover:border-white/40 min-h-[100px] sm:min-h-[120px] bg-gradient-to-br from-[#111113] to-black/80 backdrop-blur-sm shadow-xl"
                        onClick={() => handleImageClick(item)}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-2 sm:mb-3 flex items-center justify-center bg-white/10 rounded-xl border border-white/20 shadow-lg">
                          <CompanyLogo companyName={item.module} />
                        </div>
                        <div className="text-xs sm:text-sm text-white font-semibold text-center line-clamp-2 leading-tight">
                          {item.pretty_name || item.module}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[400px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 gap-2 sm:gap-4 py-2 sm:py-6">
              {data?.map((item, index) =>
                item.spec_format
                  ?.map((spec, specIndex) => {
                    const value = spec[card.title.toLowerCase().replace(" ", "_")]?.value;
                    if (!value) return null;
                    return (
                      <motion.div
                        key={`${index}-${specIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: specIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className="relative group flex flex-row w-full border border-white/20 justify-between p-4 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 gap-3 sm:gap-4 bg-gradient-to-br from-[#171719] to-black/80 backdrop-blur-sm shadow-xl"
                      >
                        <div className="flex items-start gap-3 flex-1 cursor-pointer">
                          <div className="flex-1 min-w-0">
                            <span className="text-white text-sm sm:text-base break-words block font-semibold">
                              {formatDate(value)}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(value, index)}
                            className="p-2 text-gray-200 hover:text-white rounded-xl hover:bg-white/15 transition-all duration-200 flex-shrink-0 bg-white/10 border border-white/20 shadow-lg"
                            title="Copy to clipboard"
                          >
                            {copied === index ? "✓" : <Copy size={16} />}
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleImageClick(item)}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:bg-white/15 transition-colors duration-300 cursor-pointer bg-white/10 border border-white/20 shadow-lg"
                          >
                            <CompanyLogo companyName={item.module} />
                          </motion.div>
                        </div>
                        {/* Tooltip - only show on larger screens */}
                        <div className="absolute -top-14 right-4 px-3 py-2 bg-black/95 border border-white/30 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl z-20 font-semibold hidden lg:block pointer-events-none backdrop-blur-sm">
                          {item.module || "Unknown Source"}
                          <div className="text-gray-200 text-xs mt-1 font-normal">
                            Click to view profile
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-b border-r border-white/30"></div>
                        </div>
                      </motion.div>
                    );
                  })
                  .filter(Boolean)
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="w-full">
        {/* Custom Tabs Implementation */}
        <div className="flex justify-center w-full mb-4 sm:mb-6">
          <div className="bg-gradient-to-r  border border-white/20 px-2 py-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent h-18  w-full flex gap-2 sm:gap-3 backdrop-blur-sm rounded-2xl mx-auto shadow-2xl">
            {filteredCardData.map((card, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(card.title.toLowerCase().replace(" ", "_"))}
                className={`${
                  activeTab === card.title.toLowerCase().replace(" ", "_")
                    ? "bg-white/15 text-white border-white/30 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                } transition-all duration-300 whitespace-nowrap h-10 sm:h-12 flex-shrink-0 px-3 sm:px-5 rounded-xl border border-transparent hover:border-white/20 focus-visible:ring-2 focus-visible:ring-white/20 flex items-center min-w-fit font-medium backdrop-blur-sm`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={card.icon}
                      alt={`${card.title} icon`}
                      className="w-full h-full object-contain filter brightness-110"
                    />
                  </div>
                  <span className="font-medium text-xs sm:text-sm capitalize">
                    {card.title === "creation_date" ? "First Seen" : card.title}
                  </span>
                  {card.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 font-semibold flex-shrink-0 shadow-sm"
                    >
                      {card.count}
                    </motion.span>
                  )}
                </motion.div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-2 sm:mt-4">
          {filteredCardData.map((card, index) => (
            <div
              key={index}
              className={`${
                activeTab === card.title.toLowerCase().replace(" ", "_") ? "block" : "hidden"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-black/95 to-[#111113] border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[450px] sm:max-h-[500px] flex flex-col backdrop-blur-sm"
              >
                <div className="flex flex-row sm:items-center justify-between mb-4 gap-2 sm:gap-0 flex-shrink-0 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20"
                    >
                      <img
                        src={card.icon}
                        alt={`${card.title} icon`}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter brightness-110"
                      />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      {card.title === "creation_date" ? "First Seen" : card.title}
                    </h3>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs sm:text-sm text-gray-300 flex-shrink-0 bg-white/5 px-3 py-1.5 rounded-full border border-white/20 font-medium"
                  >
                    {card.count} {card.count === 1 ? "item" : "items"} found
                  </motion.div>
                </div>
                <div className="flex-1 overflow-hidden">
                  {renderTabContent(card)}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={curritem}
      />
    </div>
  );
};

export default InfoCardsContainer;
