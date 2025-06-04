import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SearchOptionsProps {
  setInput: React.Dispatch<React.SetStateAction<{ datatype: string; value: string }>>;
  input: { datatype: string; value: string };
  setPaidSearch: (val: string) => void;
  PaidSearch: string;
  typeofsearch: "Basic" | "Advance";
}

export const SearchOptions: React.FC<SearchOptionsProps> = ({
  setInput,
  input,
  setPaidSearch,
  PaidSearch,
  typeofsearch,
}) => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(PaidSearch);

  useEffect(() => {
    if (typeofsearch === "Basic" && (PaidSearch === "Phone" || PaidSearch === "Username")) {
      setPaidSearch("Email");
      setInput((prev) => ({ ...prev, datatype: "Email", value: "" }));
      setSelectedOption("Email");
    }
  }, [typeofsearch]);

  useEffect(() => {
    setSelectedOption(PaidSearch);
  }, [PaidSearch]);

  const handleMouseEnter = (message: string, type: string) => {
    setTooltip(message);
    setHoveredButton(type);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredButton(null);
  };

  const handleUpdate = (newDatatype: string) => {
    setPaidSearch(newDatatype.toLowerCase());
    setInput((prev) => ({ ...prev, datatype: newDatatype, value: "" }));
    setSelectedOption(newDatatype.toLowerCase());
    // console.log("newDatatype", PaidSearch.toLowerCase(), newDatatype.toLowerCase());
  };

  const options = [
    {
      type: "Phone",
      message:
        typeofsearch === "Basic"
          ? "Coming Soon"
          : "Phone Number: Please enter the phone number in international format",
    },
    {
      type: "Username",
      message: "Username: Please enter the username",
    },
    { type: "Email", message: "Email: Provide a valid email address" },
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center sm:justify-center gap-4 py-4 px-12">
      {options.map(({ type, message }) => {
        const isDisabled = type === "Phone" && typeofsearch === "Basic";
        // con = type === "Username" && typeofsearch === "Advance";
        const isSelected = selectedOption === type.toLowerCase();
        const showTooltip = hoveredButton === type;

        if (type === "Username" && typeofsearch !== "Advance") return null;

        return (
          <div key={type} className="relative flex flex-col items-center w-full sm:w-auto">
            {showTooltip && (
              <div className="absolute -top-12 z-10 bg-white/90 text-black text-sm px-3 py-1 rounded-lg shadow-md whitespace-nowrap">
                {tooltip}
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: isDisabled ? 1 : 1.05 }}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              onClick={() => handleUpdate(type)}
              onMouseEnter={() => handleMouseEnter(message, type)}
              onMouseLeave={handleMouseLeave}
              disabled={isDisabled}
              title={message} // Added tooltip
              className={`w-full sm:w-[180px] h-[40px] flex items-center justify-center text-lg font-semibold rounded-lg border-b border-white/15 
                transition-all duration-300 ease-in-out shadow-[0px_2px_0px_rgba(255,255,255,0.3)] 
                bg-gradient-to-b from-[#677272] to-[#212121]
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  isSelected
                    ? "bg-none shadow-inner shadow-teal-200 border-transparent"
                    : "hover:bg-none hover:shadow-inner hover:shadow-teal-200 hover:border-transparent"
                }`}
            >
              {type}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};
