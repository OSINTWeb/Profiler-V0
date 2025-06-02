import React from "react";
import DetailField from "./DetailField";
import Badge from "./Badge";

interface ProfileCardProps {
  lastSeen: string;
  id: string;
  phoneNumber?: string;
  bio?: string;
  isPublic?: boolean;
  isVerified?: boolean;
  PaidSearch: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  lastSeen,
  id,
  phoneNumber,
  bio,
  isPublic = false,
  isVerified = true,
  PaidSearch,
  icon
}) => {
  return (
    <div className="flex items-start">
      <div className="bg-[rgba(19,19,21,1)] border flex mr-[-21px] w-fit flex-col items-stretch grow shrink-0 basis-0 mt-[13px] pt-[29px] pb-4 px-[21px] rounded-lg border-[rgba(51,53,54,1)] border-solid max-md:max-w-full max-md:px-5">
        <div className="flex gap-[7px] text-[10px] text-[rgba(152,153,153,1)] font-medium text-center leading-[23px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/df091991ab97d3583262ca5aa46bdaf4cb8766290f18d7524edec87bdc26baf3?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[35px] shadow-[0px_0px_0px_rgba(0,0,0,0.3)] min-h-[35px] shrink-0 gap-2.5 rounded-[9px]"
            alt="Profile icon"
          />
          <div className="flex items-stretch gap-[3px] mt-[19px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/65f7fe1e6353c3154727b9c0dd6282d606a387d6a797dd65e707e55d97cf1b7b?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3 shrink-0 my-auto"
              alt="Clock icon"
            />
            <div>{lastSeen}</div>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/d9e37ab819a3b2df422031849af396f51f86522b61de058fa868b96753196b07?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full max-md:max-w-full max-md:mr-[3px]"
          alt="Divider"
        />
        <div className="mt-[25px] max-md:max-w-full max-md:mr-1">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[26%] max-md:w-full max-md:ml-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/20f68bf379cddc2e0405db5055beece609fe78a343c1f86e0c85891aa5020057?placeholderIfAbsent=true"
                className="aspect-[0.99] object-contain w-[117px] shrink-0 max-w-full grow mt-[9px] rounded-[7px] max-md:mt-[31px]"
                alt="Profile picture"
              />
            </div>
            <div className="w-[74%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex w-full flex-col items-stretch text-[15px] font-medium text-center leading-loose max-md:mt-[22px]">
                <DetailField
                  label="Id"
                  value={id}
                  copyable={true}
                  copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/5f9badee47b6a6487617b7684c861d78320cbd49b5e5f5f526be297352463123?placeholderIfAbsent=true"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e3cdd008306db5559882aa4581407040fa527d1ebb652c768d9881641cd13648?placeholderIfAbsent=true"
                  className="aspect-[333.33] object-contain w-full"
                  alt="Divider"
                />
                {phoneNumber && (
                  <>
                    <DetailField
                      label={PaidSearch}
                      value={phoneNumber}
                      copyable={true}
                      copyIcon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/f4f3b1eb9b109b2fba35de8236570c3c49633fe383a055098452174cb28d032c?placeholderIfAbsent=true"
                    />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e3cdd008306db5559882aa4581407040fa527d1ebb652c768d9881641cd13648?placeholderIfAbsent=true"
                      className="aspect-[333.33] object-contain w-full"
                      alt="Divider"
                    />
                  </>
                )}
                {bio && (
                  <div className="flex items-stretch gap-5 justify-between mt-[13px] max-md:mr-1">
                    <div className="text-white">Bio</div>
                    <div className="text-white">{bio}</div>
                  </div>
                )}
                <div className="flex items-stretch gap-1.5 text-[10px] text-white font-normal leading-[23px] mt-[9px]">
                  {isPublic && (
                    <Badge
                      icon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/64ebd674b895f158ad1626ddbe5c014fcfc6862a89db1b73a6d4540c0a4c711f?placeholderIfAbsent=true"
                      text="Public Account"
                    />
                  )}
                  {isVerified && (
                    <Badge
                      icon="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e5d9846d91e757a2feb222d8dbfb53d2679bd17a76f082bd5c8119bb4e27c81d?placeholderIfAbsent=true"
                      text="Verified Account"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/26b83a5cd8cde2b2d1737b32994218e0b02e24e36befb0b5c8b484e13802f547?placeholderIfAbsent=true"
          className="aspect-[500] object-contain w-full mt-[33px] max-md:max-w-full"
          alt="Divider"
        />
        <div className="flex w-full items-stretch gap-5 text-xs font-medium text-center justify-between mt-3 max-md:max-w-full">
          <a
            href="#"
            className="flex items-stretch gap-1.5 text-[rgba(207,207,207,1)] leading-[23px] my-auto"
          >
            <span>View Account</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/ed3a14ba228727f834985fb861a531e97ed43b198ea2034ad358cafe687e6b45?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-3 shrink-0 my-auto"
              alt="External link icon"
            />
          </a>
          <button
            className="bg-[rgba(19,19,21,1)] text-white leading-loose px-2 py-[9px] rounded-lg border-[rgba(73,73,73,1)]"
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

export default ProfileCard;
