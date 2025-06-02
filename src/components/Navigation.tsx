import React from 'react';
import { ChevronDown } from 'lucide-react';
export const Navigation = () => {
  const navItems = [
    { name: 'Industries', hasDropdown: true },
    { name: 'Products', hasDropdown: true },
    { name: 'Insights', hasDropdown: true },
    { name: 'Training', hasDropdown: false },
    { name: 'Pricing', hasDropdown: false },
  ];
  return (
    // <nav className="hidden md:flex space-x-8">
    //   {navItems.map((item) => (
    //     <div key={item.name} className="relative group">
    //       <button className="text-gray-300 hover:text-white flex items-center space-x-1 py-2">
    //         <span>{item.name}</span>
    //         {item.hasDropdown && (
    //           <ChevronDown className="w-4 h-4 group-hover:text-primary transition-colors" />
    //         )}
    //       </button>
    //     </div>
    //   ))}
    // </nav>
    <>
     <div className="flex gap-10 items-center my-auto text-base font-medium  max-md:max-w-full text-white">
            <div className="flex gap-6 self-stretch">
              <div className="leading-relaxed rounded-xl bg-neutral-900">
                <button className="px-7 py-4 rounded-xl border border-gray-200/20 border-zinc-900 max-md:px-5">
                  Home
                </button>
              </div>
              <button className="my-auto leading-loose">Pricing</button>
            </div>
            <div className="flex gap-10 self-stretch my-auto">
              <button className="leading-loose">Contact</button>
              <button className="leading-relaxed">More</button>
            </div>
          </div>
          <div className="flex gap-2.5 font-semibold text-center text-black">
            <button className="px-7 py-3 my-auto text-lg rounded-xl bg-stone-300 max-md:px-5">
              0
            </button>
            <button className="px-8 py-4 text-lg leading-relaxed rounded-xl bg-stone-300 max-md:px-5">
              Account
            </button>
          </div>
        
    </>
  );
};

