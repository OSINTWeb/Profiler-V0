import React from "react";
import ResultHeader from "../Card/ResultHeader";
import ActionBar from "../Card/ActionBar";

interface PlatformData {
  module: string;
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format: {
    registered?: { value: boolean };
    breach?: { value: boolean };
    name?: { value: string };
    picture_url?: { value: string };
    website?: { value: string };
    id?: { value: string };
    bio?: { value: string };
    creation_date?: { value: string };
    gender?: { value: string };
    last_seen?: { value: string };
    username?: { value: string };
    location?: { value: string };
    phone_number?: { value: string };
    birthday?: { value: string };
    language?: { value: string };
    age?: { value: number };
    platform_variables?: {
      key: string;
      value: string | number;
      type: string;
    }[];
  }[];
  front_schemas?: {
    image?: string;
  }[];
}

interface SelectInfoProps {
  data?: PlatformData; // Specify a proper type if `data` has a defined structure
  hidebutton: boolean;
}

export const SelectInfo: React.FC<SelectInfoProps> = ({ data, hidebutton }) => {
  return (
    <div className="w-full  max-md:max-w-full">
      <ActionBar data={data} hidebutton={hidebutton} resultCount={data?.length} />
    </div>
  );
};

export default SelectInfo;
