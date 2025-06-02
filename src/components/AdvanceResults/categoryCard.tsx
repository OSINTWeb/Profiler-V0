import React, { useState, useMemo, memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserRoundCheck, ChevronRight, TrendingUp } from "lucide-react";
import CompanyLogo from "../Logo";
import { Expand } from "./expand";

interface SpecFormatValue {
  value: string | boolean | number;
}

interface SpecFormat {
  [key: string]: SpecFormatValue;
}

interface PlatformData {
  module: string;
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format: SpecFormat[];
  front_schemas?: {
    image?: string;
  }[];
}

interface CategoryCardProps {
  CardData: Array<{
    module: string;
    pretty_name: string;
    category: {
      name: string;
      description: string;
    };
    status: string;
  }>;
}

const CategoryCard: React.FC<CategoryCardProps> = memo(({ CardData }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CategoryCardProps['CardData'][0] | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const groupedByCategory = useMemo(() => {
    return CardData.reduce((acc, item) => {
      const categoryName = item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          description: item.category.description,
          items: [],
        };
      }
      acc[categoryName].items.push(item);
      return acc;
    }, {} as Record<string, { description: string; items: typeof CardData }>);
  }, [CardData]);

  const handleItemClick = (item: CategoryCardProps['CardData'][0]) => {
    if (selectedItem?.module !== item.module) {
      setSelectedItem(item);
      setIsDetailsOpen(true);
    }
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.4);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.4) rgba(31, 41, 55, 0.1);
        }
      `}</style>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-slate-900/20 to-zinc-900/20 blur-3xl" />
        
        <div className="relative text-white py-16 px-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full blur-lg opacity-30 animate-pulse" />
              <UserRoundCheck className="relative w-16 h-16 text-slate-300" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center bg-gradient-to-r from-white via-gray-200 to-slate-300 bg-clip-text text-transparent leading-tight tracking-tight">
            Account Checkers & Data Aggregators
          </h1>

          <p className="text-center text-gray-400 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover powerful tools and services to verify accounts and aggregate data across platforms
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <TrendingUp className="w
-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400 font-medium">
              {Object.keys(groupedByCategory).length} Categories • {CardData.length} Tools Available
            </span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 py-12 px-4 bg-black">
        {Object.entries(groupedByCategory).map(([category, data]) => (
          <Card
            key={category}
            className={`group relative bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#0f0f0f] text-white h-[520px] overflow-hidden border transition-all duration-700 ease-out rounded-2xl ${
              hoveredCard === category
                ? "border-slate-500/50 shadow-2xl shadow-slate-500/20 scale-[1.02] -translate-y-2"
                : "border-gray-800/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-500/10"
            }`}
            onMouseEnter={() => setHoveredCard(category)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Animated Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 via-slate-800/5 to-zinc-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 via-gray-600 to-zinc-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            
            {/* Card Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-[#050505]/95 via-[#0a0a0a]/95 to-[#0f0f0f]/95 border-b border-gray-800/50 backdrop-blur-xl">
              <CardHeader className="pb-6 pt-8 space-y-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-slate-300 bg-clip-text text-transparent leading-tight">
                    {category}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/30 px-3 py-1 rounded-full border border-slate-700/30">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    {data.items.length} tools
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {data.description}
                </CardDescription>
              </CardHeader>
            </div>

            {/* Card Content with Custom Scrollbar */}
            <CardContent className="pt-6 h-[calc(100%-160px)] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.items.map((item, index) => (
                  <div
                    key={`${item.module}-${item.pretty_name}`}
                    className="group/item relative flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gradient-to-br hover:from-white/[0.04] hover:to-slate-500/[0.03] transition-all duration-500 border border-transparent hover:border-slate-600/30 hover:shadow-lg hover:shadow-slate-500/10 cursor-pointer transform hover:scale-105"
                    onClick={() => handleItemClick(item)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 blur-sm" />
                    
                    {/* Logo Container */}
                    <div className="relative transform transition-all duration-500 ease-out group-hover/item:scale-110 group-hover/item:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-gray-600/20 rounded-lg blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                      <div className="relative bg-white/[0.02] p-3 rounded-lg border border-gray-800/50 group-hover/item:border-slate-600/40 transition-colors duration-300">
                        <CompanyLogo companyName={item.module || item.pretty_name} />
                      </div>
                    </div>

                    {/* Item Label */}
                    <div className="relative mt-4 text-center">
                      <div className="text-sm font-medium text-gray-300 group-hover/item:text-white transition-colors duration-300 line-clamp-2">
                        {item.pretty_name || item.module}
                      </div>
                      <div className="flex items-center justify-center mt-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expand Modal */}
      {isDetailsOpen && selectedItem && (
        <Expand
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          selectedItem={{
            module: selectedItem.module,
            pretty_name: selectedItem.pretty_name,
            query: "",
            spec_format: [],
            category: {
              name: selectedItem.category.name,
              description: selectedItem.category.description
            }
          } as PlatformData}
        />
      )}
    </>
  );
});

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
