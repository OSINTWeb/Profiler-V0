import React from "react";
import DetailField from "./DetailField";

interface EmailCardProps {
  title: string;
  email: string;
}

export const EmailCard: React.FC<EmailCardProps> = ({ title, email }) => {
  return (
    <div className="flex items-start mt-4">
      <div className="bg-[rgba(19,19,21,1)] border flex mr-[-21px] w-fit flex-col items-stretch grow shrink-0 basis-0 mt-[13px] pt-[35px] pb-[17px] px-6 rounded-lg border-[rgba(51,53,54,1)] border-solid max-md:max-w-full max-md:px-5">
        <div className="text-white text-xl font-semibold leading-none ml-[45px] max-md:ml-2.5">
          {title}
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/d9e37ab819a3b2df422031849af396f51f86522b61de058fa868b96753196b07?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full mt-3.5 max-md:max-w-full"
          alt="Divider"
        />
        <DetailField
          label="Email"
          value={email}
          copyable={true}
          copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/ff391e5a42e722da9d04628b071f5afe3bd237ca80455f5df2f9b7e1847b5e7c?placeholderIfAbsent=true"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/cfef5775f12b5cf81d9a36058cfb1163c5c6813f6c519f4f1911c3a7b60bc7ba?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full max-md:max-w-full"
          alt="Divider"
        />
        <button
          className="bg-[rgba(19,19,21,1)] text-xs text-white leading-loose mt-3.5 px-2 py-[9px] rounded-lg border-[rgba(73,73,73,1)]"
          aria-label="Expand Result"
        >
          Expand Result
        </button>
      </div>
      <div className="bg-[rgba(19,19,21,1)] border flex w-8 shrink-0 h-8 rounded-[50%] border-[rgba(51,53,54,1)] border-solid" />
    </div>
  );
};

export default EmailCard;
