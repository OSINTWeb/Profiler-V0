import React from "react";

interface BadgeProps {
  icon: string;
  text: string;
}

export const Badge: React.FC<BadgeProps> = ({ icon, text }) => {
  return (
    <div className="bg-[rgba(19,19,21,1)] border flex items-stretch gap-[5px] px-[7px] py-0.5 rounded-xl border-[rgba(51,53,54,1)] border-solid">
      <img
        src={icon}
        className="aspect-[1] object-contain w-2 shrink-0 my-auto"
      />
      <div>{text}</div>
    </div>
  );
};

export default Badge;