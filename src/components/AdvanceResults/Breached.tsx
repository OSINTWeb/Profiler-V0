import React, { useState } from "react";
import { Download, Calendar, Globe, Clock, X } from "lucide-react";
import { useImageLoader, getFallbackInitials } from "../Card/imageLoader";
import { cn } from "@/lib/utils";
import { Expand } from "./expand";
import { motion, AnimatePresence } from "framer-motion";

interface SpecFormat {
  picture_url?: {
    value: string;
  };
  name?: {
    value: string;
  };
  website?: {
    value: string;
  };
  creation_date?: {
    value: string;
    proper_key: string;
  };
  registered?: {
    value: boolean;
  };
  module?: string;
  breach?: {
    value: boolean;
  };
  [key: string]: any; // Add index signature
}

interface UserData {
  spec_format?: SpecFormat[];
  pretty_name?: string;
  front_schemas?: Array<{ image: string }>;
  module?: string;
}

interface BreachedAccountProps {
  userData: UserData[];
}

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const imageStatus = useImageLoader(src);
  const fallbackInitials = getFallbackInitials(alt);

  return (
    <>
      {imageStatus === "loaded" ? (
        <img
          src={src}
          alt={alt}
          className={cn(className, "animate-fade-in image-hover object-cover")}
        />
      ) : (
        <div
          className={cn(
            className,
            "flex items-center justify-center bg-surface-light text-white font-medium"
          )}
        >
          {fallbackInitials}
        </div>
      )}
    </>
  );
};

const PlatformCard = ({ spec, module }: { spec: SpecFormat; module: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "relative overflow-hidden cursor-pointer ",
          "backdrop-blur-md backdrop-saturate-150",
          "bg-gradient-to-br from-[#0f0f12] to-[#131315] border border-white/20",
          "rounded-2xl transition-all duration-300"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Glass reflection effect */}
        <div
          className="absolute -inset-[400px] bg-gradient-to-b from-blue-500/20 to-purple-500/20 opacity-[15%] transition-all duration-500"
          style={{
            transform: isHovered
              ? "translate(200px, 200px) rotate(45deg)"
              : "translate(500px, 500px) rotate(45deg)",
          }}
        />

        {/* Content */}
        <div className="relative p-6 flex flex-col items-center">
          <div className="w-20 h-20 overflow-hidden mb-4 ring-2 ring-white/20 ring-offset-2 ring-offset-black/50">
            <ImageWithFallback
              src={spec.picture_url?.value || ""}
              alt={spec.name?.value || "Unknown"}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-base font-medium text-white mb-2">{spec.name?.value || "Unknown"}</h3>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
            <Globe size={12} className="text-blue-400" />
            <span className="text-xs text-gray-300">{module}</span>
          </div>
        </div>
      </motion.div>

      {isDetailsOpen && (
        <Expand
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedItem={{
            module: module,
            pretty_name: spec.name?.value || module,
            query: "",
            spec_format: [spec],
            category: { name: module, description: "" },
          }}
        />
      )}
    </>
  );
};

const ViewMoreModal = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: { spec: SpecFormat; module: string }[];
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl backdrop-saturate-150 border border-white/20" />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                <h2 className="text-2xl font-medium text-white">All Breached Accounts</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <PlatformCard
                    key={`modal-platform-${index}`}
                    spec={item.spec}
                    module={item.module}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BreachedAccount = ({ userData }: BreachedAccountProps) => {
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);

  // Add validation for userData
  if (!userData || !Array.isArray(userData)) {
    return null;
  }

  // Filter data to only include breached accounts
  const breachedAccounts = userData;

  // Create a flat array of all breached items
  const allBreachedItems = breachedAccounts.flatMap((item) =>
    (item?.spec_format || [])
      .filter((spec) => spec?.picture_url?.value && spec?.breach?.value)
      .map((spec) => ({
        spec,
        module: item?.module || "",
      }))
  );

  // Get first 9 items for initial display
  const initialItems = allBreachedItems.slice(0, 9);
  const hasMoreItems = allBreachedItems.length > 9;

  // If no breached accounts, return null
  if (breachedAccounts.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full animate-scale-in p-4">
      <div className="relative rounded-2xl border border-white/50 overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-[#131315] backdrop-blur-2xl backdrop-saturate-150 " />

        {/* Content */}
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
              <h2 className="text-2xl font-medium text-white">Breached Accounts</h2>
            </div>
            {hasMoreItems && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsViewMoreOpen(true)}
                className="px-6 py-2.5 rounded-xl text-white/90 text-sm font-medium
                          backdrop-blur-lg backdrop-saturate-150
                         border border-white/20  
                         transition-all duration-300 hover:bg-white/20"
              >
                View All
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {initialItems.map((item, index) => (
              <PlatformCard key={`platform-${index}`} spec={item.spec} module={item.module} />
            ))}
          </div>
        </div>
      </div>

      <ViewMoreModal
        isOpen={isViewMoreOpen}
        onClose={() => setIsViewMoreOpen(false)}
        items={allBreachedItems}
      />
    </div>
  );
};

export default BreachedAccount;
