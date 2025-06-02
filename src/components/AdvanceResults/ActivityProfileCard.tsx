import React, { useState, useRef, useEffect } from "react";
import { Download, Calendar, Globe, Clock, Eye } from "lucide-react";
import { useImageLoader, getFallbackInitials } from "../Card/imageLoader";
import { cn } from "@/lib/utils";
import DateObject from "react-date-object";
import { Expand } from "./expand";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SpecFormatValue {
  value: string | boolean | number;
}

interface SpecFormat {
  [key: string]: SpecFormatValue;
  picture_url?: { value: string };
  name?: { value: string };
  website?: { value: string };
  creation_date?: { value: string };
  registered?: { value: boolean };
  gender?: { value: string };
  language?: { value: string };
  location?: { value: string };
  breach?: { value: boolean };
  id?: { value: string };
  last_seen?: { value: string };
  username?: { value: string };
  phone_number?: { value: string };
}

interface UserData {
  spec_format?: SpecFormat[];
  pretty_name?: string;
  front_schemas?: Array<{ image: string }>;
  module?: string;
  query?: string;
}

interface ActivityProfileCardProps {
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
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </>
  );
};

const ActivityRow = ({
  spec,
  module,
  query,
}: {
  spec: SpecFormat;
  module?: string;
  query?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  return (
    <>
      {spec.creation_date?.value && (
        <tr
          className={cn(
            "transition-all duration-300 cursor-pointer group hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5",
            isHovered ? "bg-white/2 shadow-lg shadow-black/10" : ""
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <td className="px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <ImageWithFallback
                  src={spec.picture_url?.value || ""}
                  alt={spec.name?.value || "Unknown"}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-white text-sm group-hover:text-blue-100 transition-colors">
                  {spec.name?.value || "Unknown"}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-300 transition-colors">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>
                    {module || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="flex justify-end w-full items-center">
              <div className="relative">
                <div className="text-xs px-4 py-2 border border-white/10 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 text-white text-center whitespace-nowrap backdrop-blur-sm group-hover:border-purple-500/30 group-hover:bg-gradient-to-r group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 shadow-sm">
                  {new DateObject(spec.creation_date.value).format("DD MMM, YYYY")}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-lg transition-all duration-300"></div>
              </div>
            </div>
          </td>
        </tr>
      )}
      <Expand
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedItem={{
          module: module || "",
          pretty_name: spec.name?.value || "",
          query: query || "",
          spec_format: [spec],
          category: { name: "", description: "" },
        }}
      />
    </>
  );
};

const ProfileImageCard = ({
  spec,
  module,
  query,
}: {
  spec: SpecFormat;
  module?: string;
  query?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!spec.picture_url?.value) return;

    const link = document.createElement("a");
    link.href = spec.picture_url.value;
    link.download = `${spec.name?.value || "profile"}-image.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  return (
    spec.picture_url?.value && (
      <>
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-lg card-hover transition-all duration-300 cursor-pointer min-w-[320px] sm:min-w-[400px] border border-white/5",
            isHovered ? "bg-surface-light border-white/10" : "bg-surface"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <div className="flex items-center gap-4">
            <div className="sm:w-56 sm:h-56 rounded-lg overflow-hidden border border-white/10 bg-surface-light">
              <ImageWithFallback
                src={spec.picture_url?.value || ""}
                alt={spec.name?.value || "Unknown"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-white text-base sm:text-lg">
                {spec.name?.value || module}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Globe size={14} />
                {module || "Unknown"}
              </span>
              {spec.creation_date?.value && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(spec.creation_date.value).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="download-button p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            aria-label="Download image"
          >
            <Download size={20} />
          </button>
        </div>
        <Expand
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedItem={{
            module: module || "",
            pretty_name: spec.name?.value || "",
            query: query || "",
            spec_format: [spec],
            category: { name: "", description: "" },
          }}
        />
      </>
    )
  );
};

const ActivityProfileCard = ({ userData }: ActivityProfileCardProps) => {
  const profilePicturesRef = useRef<HTMLDivElement>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  useEffect(() => {
    const container = profilePicturesRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 5;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4 text-white w-full h-full animate-scale-in ">
      {/* Left: Platform Activity Table */}
      <div className="flex-1 bg-gradient-to-br from-[#0f0f11] to-[#131315] p-6 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 hover:shadow-3xl h-96 text-sm max-h-[500px] border border-white/5 hover:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-[#000000] rounded-full shadow-lg shadow-blue-500/20"></div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Platform Activity</h2>
          </div>
          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-300">
            {userData.filter(item => 
              item.spec_format?.some(spec => spec?.picture_url?.value)
            ).length} platforms
          </div>
        </div>

        <div className="overflow-auto custom-scrollbar flex-grow bg-[#0a0a0c]/50 rounded-lg border border-white/5">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-gradient-to-r from-[#0f0f11] to-[#131315] z-10 backdrop-blur-sm">
              <tr className="border-b border-gray-700/50">
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm tracking-wide">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    Platform
                  </div>
                </th>
                <th className="py-4 px-4 text-gray-300 font-semibold text-sm text-right tracking-wide">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar size={14} className="text-purple-400" />
                    Creation Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {userData.map((item, index) => (
                <React.Fragment key={index}>
                  {item.spec_format?.map(
                    (spec, specIndex) =>
                      spec?.picture_url?.value && (
                        <ActivityRow
                          key={`activity-${specIndex}`}
                          spec={spec}
                          module={item.module}
                          query={item.query}
                        />
                      )
                  )}
                </React.Fragment>
              ))}
              {userData.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center">
                        <Globe size={20} className="text-gray-500" />
                      </div>
                      <div className="text-gray-400 font-medium">No activity data available</div>
                      <div className="text-gray-500 text-xs">Platform activities will appear here</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Profile Pictures */}
      <div className="flex-1 bg-[#131315] p-4 rounded-md overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl h-[400px] sm:h-[450px] lg:h-96 text-sm max-h-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h2 className="text-lg font-medium">Profile Pictures</h2>
          </div>
          <button
            onClick={() => setIsViewAllOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-light hover:bg-gray-700 rounded-md transition-colors text-sm border border-white/10"
          >
            <Eye size={14} />
            View All
          </button>
        </div>

        <div 
          ref={profilePicturesRef}
          className="overflow-x-auto overflow-y-hidden custom-scrollbar flex-grow flex flex-col"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex h-full">
            {userData.map((item, index) => (
              <React.Fragment key={index}>
                {item.spec_format?.map(
                  (spec, specIndex) =>
                    spec?.picture_url?.value && (
                      <div className="flex flex-col h-full justify-stretch flex-1">
                        <div className="h-full min-w-[380px] sm:min-w-[500px] max-w-full flex-1 flex">
                          <ProfileImageCard
                            key={`profile-${specIndex}`}
                            spec={spec}
                            module={item.module}
                            query={item.query}
                          />
                        </div>
                      </div>
                    )
                )}
              </React.Fragment>
            ))}
            {userData.length === 0 ||
              (!userData.some((item) =>
                item.spec_format?.some((spec) => spec?.picture_url?.value)
              ) && (
                <div className="py-4 text-center text-gray-400 text-sm min-w-[380px] sm:min-w-[500px] flex-1 flex items-center justify-center h-full">
                  No profile pictures available
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* View All Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-[#0a0a0b] border border-white/20 text-white flex flex-col p-6">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              All Profile Pictures
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto  w-full custom-scrollbar py-6 px-2 max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userData.map((item, index) => (
                <React.Fragment key={index}>
                  {item.spec_format?.map(
                    (spec, specIndex) =>
                      spec?.picture_url?.value && (
                        <div 
                          key={`dialog-profile-${specIndex}`} 
                          className="group bg-[#131315] hover:bg-[#1a1a1c] p-4 rounded-lg border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/20"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10 bg-surface-light mb-3 group-hover:border-white/20 transition-colors">
                            <ImageWithFallback
                              src={spec.picture_url?.value || ""}
                              alt={spec.name?.value || "Unknown"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-semibold text-white text-sm truncate">
                              {spec.name?.value || item.module || "Unknown"}
                            </h3>
                            
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Globe size={11} />
                              <span className="truncate">{item.module || "Unknown"}</span>
                            </div>
                            
                            {spec.creation_date?.value && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar size={11} />
                                <span>{new Date(spec.creation_date.value).toLocaleDateString()}</span>
                              </div>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!spec.picture_url?.value) return;
                                const link = document.createElement("a");
                                link.href = spec.picture_url.value;
                                link.download = `${spec.name?.value || "profile"}-image.jpg`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="w-full flex items-center gap-2 justify-center px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-all duration-200 text-xs font-medium text-blue-300 hover:text-blue-200 mt-3"
                            >
                              <Download size={12} />
                              Download
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {userData.length === 0 ||
              (!userData.some((item) =>
                item.spec_format?.some((spec) => spec?.picture_url?.value)
              ) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Globe size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Profile Pictures</h3>
                  <p className="text-sm text-gray-500">No profile pictures are available to display.</p>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add custom scrollbar styles
const scrollbarStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(10, 10, 12, 0.3);
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.3) rgba(10, 10, 12, 0.3);
  }

  /* Custom shadow classes */
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.8);
  }
`;

// Add the styles to the component
const ActivityProfileCardWithStyles = ({ userData }: ActivityProfileCardProps) => {
  return (
    <>
      <style>{scrollbarStyles}</style>
      <ActivityProfileCard userData={userData} />
    </>
  );
};

export default ActivityProfileCardWithStyles;
