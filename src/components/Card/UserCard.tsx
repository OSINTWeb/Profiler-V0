import React from "react";
import DetailField from "./DetailField";
import Badge from "./Badge";

interface UserCardProps {
  lastSeen: string;
  id: string;
  email: string;
  firstName?: string;
  location?: string;
  isVerified?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  lastSeen,
  id,
  email,
  firstName,
  location,
  isVerified = true,
}) => {
  return (
    <div className="flex items-start text-[15px] font-medium text-center leading-loose mt-4">
      <div className="bg-[rgba(19,19,21,1)] border flex mr-[-21px] w-fit flex-col items-stretch grow shrink-0 basis-0 mt-[13px] pt-[29px] px-6 rounded-lg border-[rgba(51,53,54,1)] border-solid max-md:max-w-full max-md:px-5">
        <div className="flex gap-[7px] text-[10px] text-[rgba(152,153,153,1)] leading-[23px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/153f229c007b48c15658aa6d7cb59a983996393d84942d33feff96acb7299522?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[35px] shrink-0 rounded-[9px]"
            alt="User icon"
          />
          <div className="flex items-stretch gap-[3px] mt-[18px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/66d2dac80fff8602c2ebe716300acf7f55394ae5131ce99b8697d282b8076211?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3 shrink-0 my-auto"
              alt="Clock icon"
            />
            <div>{lastSeen}</div>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/d9e37ab819a3b2df422031849af396f51f86522b61de058fa868b96753196b07?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full max-md:max-w-full"
          alt="Divider"
        />
        <DetailField
          label="Id"
          value={id}
          copyable={true}
          copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/78af9f4b56b45645f4f156943eed589648c8afa8a3ccb243f1e278135a626599?placeholderIfAbsent=true"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/cfef5775f12b5cf81d9a36058cfb1163c5c6813f6c519f4f1911c3a7b60bc7ba?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full max-md:max-w-full"
          alt="Divider"
        />
        <DetailField
          label="Email"
          value={email}
          copyable={true}
          copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/9447e781b59c0dbe5170f3dc6df70ff70b852631d5b98aa254d95fdbc18956ee?placeholderIfAbsent=true"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/cfef5775f12b5cf81d9a36058cfb1163c5c6813f6c519f4f1911c3a7b60bc7ba?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full max-md:max-w-full"
          alt="Divider"
        />
        {firstName && (
          <>
            <DetailField
              label="First Name"
              value={firstName}
              copyable={true}
              copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/28c27fdb064373b66fde393a5b2fb3b2a742b66d913cb4ad77f71a481a29a8f8?placeholderIfAbsent=true"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/cfef5775f12b5cf81d9a36058cfb1163c5c6813f6c519f4f1911c3a7b60bc7ba?placeholderIfAbsent=true"
              className="aspect-[500] object-contain w-full max-md:max-w-full"
              alt="Divider"
            />
          </>
        )}
        {location && (
          <>
            <div className="flex items-stretch gap-5 whitespace-nowrap justify-between mt-3.5 max-md:max-w-full max-md:mr-2.5">
              <div className="text-white">Location</div>
              <div className="text-white">{location}</div>
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/cfef5775f12b5cf81d9a36058cfb1163c5c6813f6c519f4f1911c3a7b60bc7ba?placeholderIfAbsent=true"
              className="aspect-[500] object-contain w-full max-md:max-w-full"
              alt="Divider"
            />
          </>
        )}
        {isVerified && (
          <div className="bg-[rgba(19,19,21,1)] border flex items-stretch gap-[5px] text-[10px] text-white font-normal leading-[23px] mt-[17px] px-[7px] py-0.5 rounded-xl border-[rgba(51,53,54,1)] border-solid">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/b51b2b4da93bcbb0e5de14203ee3287f8769e9c31c73ec0191051d0662cd243c?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-2 shrink-0 my-auto"
              alt="Verified icon"
            />
            <div>Verified Account</div>
          </div>
        )}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/26b83a5cd8cde2b2d1737b32994218e0b02e24e36befb0b5c8b484e13802f547?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full mt-[9px] max-md:max-w-full"
          alt="Divider"
        />
        <div className="flex w-full items-stretch gap-5 text-xs leading-loose justify-between mt-3 max-md:max-w-full">
          <a
            href="#"
            className="flex items-stretch gap-1.5 text-[rgba(207,207,207,1)]"
          >
            <span>View Account</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/2ee3d8ebb280fe7255664d29f7a7c6122d486c2a83fc6c60fe8bd3b709e228e6?placeholderIfAbsent=true"
              className="aspect-[1.72] object-contain w-3 shrink-0 mt-1.5"
              alt="External link icon"
            />
          </a>
          <button
            className="bg-[rgba(19,19,21,1)] text-white pt-2.5 px-2 rounded-lg border-[rgba(73,73,73,1)]"
            aria-label="Expand Result"
          >
            Expand Result
          </button>
        </div>
      </div>
      <div className="bg-[rgba(19,19,21,1)] border flex w-8 shrink-0 h-8 rounded-[50%] border-[rgba(51,53,54,1)] border-solid" />
    </div>
  );
};

export default UserCard;
