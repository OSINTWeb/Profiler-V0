import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export const SearchBar = () => {
  return (
    <div className="self-center flex w-[529px] max-w-full gap-[5px] text-base flex-wrap mt-[43px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2.5 text-[#f4f4f4] font-medium grow shrink basis-auto px-[15px] py-0.5 rounded-md border border-white/15">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e1475eaccef9e8334c103455bdb787dfcc73cf7345b08a67c0e9c8cd596b13cd?placeholderIfAbsent=true"
                alt="Search icon"
                className="aspect-[1.03] object-contain w-[31px]"
              />
              <span className="w-px bg-gray-600 h-full" />
              <Input
                type="text"
                placeholder="Enter phone, email, username, name or wallet"
                className="bg-transparent border-none text-white placeholder:text-[#f4f4f4] focus-visible:ring-0"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enter your search query</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button className="bg-gradient-to-b from-[#677272] to-[#212121] border border-gray-700 shadow-[0px_2px_0px_rgba(255,255,255,0.3)] text-white font-normal text-center leading-none px-[17px] py-[13px] rounded-lg">
        
        Search
      </Button>
    </div>
  );
};