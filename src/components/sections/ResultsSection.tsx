// import { useState } from "react";
// interface DomainResult {
//   name: string;
//   available: boolean;
// }

// export const ResultsSection = ({ DATA }: { DATA: DomainResult[] }) => {
//   const [available, setavailable] = useState(DATA[0].data);
//   const availableDomains: DomainResult[] = [
//     { name: "username.com", available: true },
//     { name: "username.io", available: true },
//     { name: "username.tech", available: true },
//     { name: "username.org", available: true },
//   ];

//   const unavailableDomains: DomainResult[] = [
//     { name: "username.com", available: false },
//     { name: "username.io", available: false },
//     { name: "username.tech", available: false },
//     { name: "username.org", available: false },
//   ];

//   return (
//     <section className="flex w-full flex-col items-center mt-[100px]">
//       <div className="flex w-full justify-center gap-[100px] text-xl font-semibold whitespace-nowrap leading-[1.4]">
//         <div className="flex items-center gap-6 text-[rgba(66,197,116,1)]">
//           <div className="h-[1px] w-[250px] bg-white" />
//           <span>Available</span>
//           <div className="h-[1px] w-[250px] bg-white" />
//         </div>
//         <div className="flex items-center gap-6 text-[rgba(249,1,63,1)]">
//           <div className="h-[1px] w-[250px] bg-white" />
//           <span>Unavailable</span>
//           <div className="h-[1px] w-[250px] bg-white" />
//         </div>
//       </div>

//       <div className="flex w-full max-w-[1502px] flex-col items-stretch mt-[31px]">
//         <div className="flex w-full items-stretch gap-[40px_100px] flex-wrap">
//           <div className="flex-1">
//             <div className="text-white text-3xl font-medium leading-[70px]">
//               {availableDomains.map((domain) => (
//                 <div
//                   key={domain.name}
//                   className="flex justify-between items-center mb-4"
//                 >
//                   <span>{domain.name}</span>
//                   <button className="bg-[rgba(66,197,116,1)] text-sm text-black font-bold px-6 py-2 rounded-[48px]">
//                     Buy Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-[rgba(66,197,116,1)] text-sm text-black font-bold px-[40px] py-2 rounded-[48px]">
//               More
//             </button>
//           </div>
//           <div className="flex-1">
//             <div className="text-white text-3xl font-medium leading-[70px]">
//               {unavailableDomains.map((domain) => (
//                 <div
//                   key={domain.name}
//                   className="flex justify-between items-center mb-4"
//                 >
//                   <span>{domain.name}</span>
//                   <button className="bg-[rgba(249,1,63,1)] text-sm text-white font-bold px-6 py-2 rounded-[48px]">
//                     Visit Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-[rgba(255,0,60,1)] text-sm text-white font-bold px-[40px] py-2 rounded-[48px]">
//               More
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
//
import { useState, useEffect } from "react";

interface DomainResult {
  name: string;
  available: boolean;
  data: string[][];
}

export const ResultsSection = ({ DATA, Loading }: { DATA: DomainResult[]; Loading: boolean }) => {
  return (
    <section className="flex w-full flex-col items-center mt-[100px]">
      <div className="flex w-full justify-center gap-[100px] text-xl font-semibold whitespace-nowrap leading-[1.4]">
        <div className="flex items-center gap-6 text-[rgba(66,197,116,1)]">
          <div className="h-[1px] w-[250px] bg-white" />
          <span>Available Domains</span>
          <div className="h-[1px] w-[250px] bg-white" />
        </div>
      </div>

      {Loading ? (
        // **Show loading while fetching**
        <div className="text-white text-3xl font-medium leading-[70px] mt-10">Loading...</div>
      ) :  DATA[0]?.data.length ? (
        // **Show data when available**
        <div className="flex w-full max-w-[1502px] flex-col items-stretch mt-[31px]">
          <div className="flex w-full items-stretch gap-[40px_100px] flex-wrap">
            <div className="flex-1">
              <div className="text-white text-3xl font-medium leading-[70px] border border-white/40 my-2 h-[500px] overflow-y-auto p-2 scrollbar-hidden" >
                {DATA[0]?.data.flat().map((username, index) => (
                  <div key={index} className="flex justify-between items-center mb-4">
                    <span>{username+".com"}</span>
                    <button className="bg-[rgba(66,197,116,1)] text-sm text-black font-bold px-6 py-2 rounded-[48px]">
                      Claim Now
                    </button>
                  </div>
                ))}
              </div>
              <button className="bg-[rgba(66,197,116,1)] text-sm text-black font-bold px-[40px] py-2 rounded-[48px]">
                Load More
              </button>
            </div>
          </div>
        </div>
      ) : (
        // **Show "No Data" if the API returns empty data**
        <div className="text-white text-3xl font-medium leading-[70px] mt-10">No Data</div>
      )}
    </section>
  );
};
