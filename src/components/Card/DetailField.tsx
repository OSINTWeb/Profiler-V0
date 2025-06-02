import React from "react";

interface DetailFieldProps {
  label: string;
  value: string;
  copyable?: boolean;
  copyIcon?: string;
}

export const DetailField: React.FC<DetailFieldProps> = ({
  label,
  value,
  copyable = false,
  copyIcon,
}) => {
  const handleCopy = () => {
    if (copyable) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="flex w-full items-stretch gap-5 justify-between">
      <div className="text-white">{label}</div>
      <div className="flex items-stretch gap-[5px] text-white">
        <div className="grow">{value}</div>
        {copyable && copyIcon && (
          <button onClick={handleCopy} aria-label={`Copy ${label}`}>
            <img
              src={copyIcon}
              className="aspect-[1] object-contain w-[15px] shrink-0 my-auto"
              alt="Copy icon"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailField;
