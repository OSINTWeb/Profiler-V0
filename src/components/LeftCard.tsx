import React from "react";
import { Download } from "lucide-react";

const LeftCard = ({ userData }) => {
  // Extract relevant data from spec_format
  const activityData =
    userData?.spec_format?.map((item) => ({
      platform: userData.pretty_name || "Unknown",
      icon: item.picture_url?.value || "",
      description: item.registered?.value ? "Registered Account" : "No Activity",
      timestamp: item.registered?.proper_key || "N/A",
    })) || [];

  const profilePictures =
    userData?.spec_format?.map((item) => ({
      platform: userData.pretty_name || "Unknown",
      image: userData.front_schemas?.[0]?.image || item.picture_url?.value || "",
    })) || [];

  return (
    <div className="flex flex-col md:flex-row  gap-2 text-white rounded-lg text-sm w-full h-96 ">
      {/* Left: Platform Activity Table */}
      <div className="flex-1 bg-[#131315] p-4 rounded-lg w-1/2 h-full overflow-auto scrollbar-hidden">
        <h2 className="text-lg font-semibold mb-2">Platform Activity</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Platform</th>
              <th className="py-2">Description</th>
              <th className="py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item, index) => (
              <React.Fragment key={index}>
                {item.spec_format?.map((spec, specIndex) => (
                    <>
                      {spec?.picture_url?.value && (
                          <tr key={specIndex} className="border-b border-gray-700">
                    <td className="flex items-center gap-2 py-2">
                        <img src={spec.picture_url.value} alt="img" className="w-6 h-6" />
                        {spec.name?.value || "Unknown"}
                        </td>
                        <td className="py-2">{spec?.creation_date?.proper_key || "N/A"}</td>
                        
                        <td className="py-2">{spec?.creation_date?.value || "N/A"}</td>
                        </tr>
                    )}
                    </>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Profile Pictures */}
      <div className="flex-1 bg-[#131315]  p-4 rounded-lg h-full overflow-auto scrollbar-hidden">
        <h2 className="text-lg font-semibold mb-2">Profile Pictures</h2>
        <div>
          {userData.map((item, index) => (
            <React.Fragment key={index}>
              {item.spec_format?.map((spec, specIndex) => (
                <>
                  {spec?.picture_url?.value && spec?.website?.value && (
                    <div
                      key={specIndex}
                      className="flex items-center justify-between py-2 border-b border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={spec?.picture_url?.value}
                          alt={`img`}
                          className="w-10 h-10 rounded-full"
                        />
                        <span>{item?.module}</span>
                      </div>
                      <Download className="cursor-pointer" />
                    </div>
                  )}
                </>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftCard;


