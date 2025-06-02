import React from "react";
import { motion } from "framer-motion";

export function SearchTypeSelector({ selected, setSelected }) {
  // Calculate the position and width of the toggle background
  const getToggleStyle = () => {
    const baseWidth = "calc(33.33% - 8px)";
    const positions = {
      Free: "4px",
      Freemium: "calc(33.33% + 4px)",
      Paid: "calc(66.66% + 4px)",
    };

    return {
      width: baseWidth,
      x: positions[selected],
    };
  };

  return (
    <section className="relative w-full max-w-md rounded-full p-1 shadow-md bg-gradient-to-b from-gray-950 to-black my-6 sm:my-8 mx-auto border-2 hover:shadow-lg  transition-all duration-300  font- ">
      {/* Animated toggle background */}

      <div className="flex justify-between relative z-10 p-0.5">
        {["Free", "Paid", "Freemium"].map((type) => (
          <motion.button
            key={type}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.15 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            className={`flex-1 py-3 px-2  mx-0.5  transition-all duration-200 relative rounded-full ${
              selected === type
                ? "text-teal-300 font-bold bg-[#202024] my-1"
                : "text-white hover:text-gray-200"
            }`}
            onClick={() => setSelected(type)}
          >
            {type === "Freemium" && (
              <span className="text-sm sm:text-base  font-medium relative z-10 block">Premium</span>
            )}
            {type !== "Freemium" && (
              <span className="text-sm sm:text-base  font-medium relative z-10 block">{type}</span>
            )}

            {/* Subtle hover effect */}
            {selected !== type && (
              <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                className="absolute inset-0 bg-white rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
