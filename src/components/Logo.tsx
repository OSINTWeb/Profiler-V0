import { useState } from "react";

const CompanyLogo = ({ companyName }) => {
  const [imageError, setImageError] = useState(false);
  const formattedName = companyName.toLowerCase().replace(/\s+/g, "");
  const logoUrl = `https://logo.clearbit.com/${formattedName}.com`;

  const getFallbackInitials = () => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (imageError) {
    return (
      <div className="my-2 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center bg-gray-800 w-fit" style={{ width: 50, height: 50 }}>
        <span className="text-white text-lg font-semibold">
          {getFallbackInitials()}
        </span>
      </div>
    );
  }

  return (
    <div className="object-contain w-fit">
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        style={{ width: 50, height: 50, objectFit: "contain" }}
        className=""
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default CompanyLogo;
