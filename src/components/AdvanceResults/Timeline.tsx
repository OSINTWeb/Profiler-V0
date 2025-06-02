import { useState } from "react";
import { ChevronDown, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand } from "./expand";

interface SpecFormat {
  creation_date?: { value: string };
  picture_url?: { value: string };
  name?: { value: string };
  gender?: { value: string };
  language?: { value: string };
  location?: { value: string };
  breach?: { value: boolean };
  id?: { value: string };
  last_seen?: { value: string };
  username?: { value: string };
  phone_number?: { value: string };
  query?: string;
}


interface TimelineItem {
  icon: string;
  color: string;
  module: string;
  date: string;
  displayName: string;
  item: PlatformItem;
}

interface PlatformItem {
  spec_format?: SpecFormat[];
  module: string;
  query?: string;
  pretty_name?: string;
}

type PlatformData = PlatformItem[];

export const Timeline = ({ data }: { data: PlatformData }) => {
  const [zoom, setZoom] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlatformItem | null>(null);

  // Extract creation_date and icon from the data
  const creation_date = [
    ...new Set(
      data.flatMap(
        (item) => item.spec_format?.map((spec) => spec?.creation_date?.value).filter(Boolean) || []
      )
    ),
  ];
  const icon = [
    ...new Set(
      data.flatMap(
        (item) => item.spec_format?.map((spec) => spec?.picture_url?.value).filter(Boolean) || []
      )
    ),
  ];

  // Extract data with fallbacks
  const extractItemData = (item: PlatformItem) => {
    const spec = item.spec_format?.[0];
    return {
      website: item.module || '',
      platformName: item.pretty_name || item.module || '',
      gender: spec?.gender?.value || '',
      language: spec?.language?.value || '',
      location: spec?.location?.value || '',
      isBreached: spec?.breach?.value || false,
      query: item.query || '',
      id: spec?.id?.value || '',
      last_seen: spec?.last_seen?.value || '',
      username: spec?.username?.value || '',
      phone_number: spec?.phone_number?.value || ''
    };
  };

  const displayNames = data.map(item => item.spec_format?.[0]?.name?.value || item.module);

  // Function to group items by year
  const groupByYear = (dates: string[], icons: string[], modules: string[], displayNames: string[]) => {
    const grouped: { [key: number]: TimelineItem[] } = {};

    dates.forEach((date, index) => {
      const year = new Date(date).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      // Find the corresponding item from data by module name
      const moduleName = modules[index] || 'Unknown Module';
      const displayName = displayNames[index] || moduleName;
      const item = data.find(item => item.module === moduleName);
      
      grouped[year].push({
        icon: icons[index],
        color: getRandomColor(),
        module: moduleName,
        date: date,
        displayName: displayName,
        item: item || { module: moduleName }
      });
    });

    return grouped;
  };

  // Helper function to generate a random color
  const getRandomColor = () => {
    const colors = [
      "#E1306C",
      "#1DA1F2",
      "#4267B2",
      "#1DB954",
      "#5865F2",
      "#E60023",
      "#25D366",
      "#FF4500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Group the data by year
  const groupedData = groupByYear(creation_date, icon, creation_date, displayNames);

  // Convert grouped data into the timelineData format
  const timelineData = Object.keys(groupedData)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map((year) => ({
      year: parseInt(year),
      items: groupedData[parseInt(year)].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const handleItemClick = (item: PlatformItem) => {
    // Find the complete item data from the original data array
    const completeItem = data.find(d => d.module === item.module);
    if (completeItem) {
      setSelectedItem(completeItem);
      setIsDetailsOpen(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#131315] border border-[#333333]/40 rounded-md w-full shadow-lg overflow-hidden "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333333]/40 bg-[#1A1A1C] ">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h2 className="text-base font-medium text-gray-200">Timeline View</h2>
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Instruction line */}
            <div className="px-4 py-3 border-b border-[#333333]/40 text-xs text-gray-400 bg-[#1A1A1C]/50">
              Click on the icon to view the complete details associated with that account.
            </div>

            {/* Timeline */}
            <div className="h-[400px] w-full relative overflow-x-auto overflow-y-auto border-t border-[#333333]/40 timeline-container">
              <div 
                className="absolute left-0 right-0 bottom-0 top-0 flex overflow-x-auto overflow-y-hidden scrollbar"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              >
                {timelineData.map((period, index) => (
                  <div
                    key={index}
                    className="flex-1 border-r border-[#333333]/40 relative flex flex-col gap-4"
                    style={{ width: "120px", minHeight: "400px" }}
                  >
                    {/* Year marker */}
                    <div className="sticky top-0 bg-[#1A1A1C] text-sm font-medium text-gray-300 text-center py-2 border-b border-[#333333]/40 z-10">
                      {period.year}
                    </div>
                    {/* Timeline Items */}
                    <div className="relative flex flex-col items-center gap-3 overflow-y-auto scrollbar-hidden overflow-x-hidden py-4 px-2">
                      {period.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className="relative w-12 h-12 rounded-full flex items-center justify-center group"
                        >
                          {item.icon && (
                            <>
                              <div 
                                className="h-full w-full cursor-pointer border-2 rounded-full bg-white overflow-hidden transform transition-all duration-200 hover:scale-110 hover:shadow-lg"
                                style={{ borderColor: item.color }}
                              >
                                <img
                                  src={item.icon}
                                  alt={item.module}
                                  className="w-full h-full object-cover rounded-full"
                                  onClick={() => handleItemClick(item.item)}
                                />
                              </div>
                              {/* Enhanced Tooltip */}
                              <div className="absolute top-0 left-1/2 bottom-full transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20">
                                <div className="bg-white text-black text-xs rounded-lg px-3 py-2 shadow-xl border border-[#333333]/40">
                                  <p className="font-medium">{item.displayName || item.module}</p>
                                  {/* <p className="text-black text-[10px] mt-1">
                                    {new Date(item.date).toLocaleDateString()}
                                  </p> */}
                                </div>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand Dialog */}
      {selectedItem && (
        <Expand 
          isDetailsOpen={isDetailsOpen} 
          setIsDetailsOpen={setIsDetailsOpen} 
          selectedItem={{
            module: selectedItem.module,
            pretty_name: selectedItem.spec_format?.[0]?.name?.value || selectedItem.module,
            query: selectedItem.query || "",
            spec_format: selectedItem.spec_format || [],
            category: { name: selectedItem.module, description: "" }
          }} 
        />
      )}

      {/* Custom Scrollbar CSS */}
      <style>
        {`
          .scrollbar::-webkit-scrollbar {
            height: 8px;
            background-color: #1A1A1C;
          }

          .scrollbar::-webkit-scrollbar-thumb {
            background-color: #333333;
            border-radius: 4px;
          }

          .scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #444444;
          }

          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }

          .timeline-container {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </motion.div>
  );
};

export default Timeline;