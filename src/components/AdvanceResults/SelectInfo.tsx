import React from "react";
import ResultHeader from "../Card/ResultHeader";
import ActionBar from "../Card/ActionBar";

interface PlatformData {
  module: string;
  pretty_name?: string;
  pretty_data?: Record<string, unknown>;
  query: string;
  status: string;
  from: string;
  reliable_source: boolean;
  data?: {
    phone_number?: string;
    qq_id?: string;
    email?: string;
    region?: string;
    league_of_legends_id?: string;
    weibo_link?: string;
    weibo_id?: string;
    profile_pic?: string;
    first_name?: string;
    last_name?: string;
    user?: string;
    avatar?: string;
    active?: boolean;
    private?: boolean;
    objectID?: string;
    friends_with?: unknown[];
    [key: string]: unknown;
  };
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
    phone?: { value: string };
    email?: { value: string };
    birthday?: { value: string };
    language?: { value: string };
    age?: { value: number };
    platform_variables?: Array<{
      key: string;
      proper_key?: string;
      value: string;
      type?: string;
    }>;
  }[];
  front_schemas?: {
    module?: string;
    image?: string;
    body?: Record<string, unknown>;
    tags?: Array<{
      tag: string;
      url?: string;
    }>;
  }[];
}

interface SelectInfoProps {
  data?: PlatformData[];
  selectedData?: PlatformData[];
  hidebutton: boolean;
  sethidebutton: (hidebutton: boolean) => void;
  setenableselect: (enableselect: boolean) => void;
  enableselect: boolean;
  filteredUsers: PlatformData[];
  selectedCount?: number;
  exportMode?: "selected" | "excluding_deleted" | "all";
  exportCount?: number;
}

export const SelectInfo: React.FC<SelectInfoProps> = ({ 
  data, 
  selectedData,
  hidebutton, 
  sethidebutton,
  setenableselect,
  enableselect,
  filteredUsers,
  selectedCount = 0,
  exportMode = "all",
  exportCount = 0
}) => {
  return (
    <div className="w-full max-md:max-w-full">
      <ActionBar 
        data={data || []} 
        selectedData={selectedData}
        hidebutton={hidebutton}
        sethidebutton={sethidebutton}
        setenableselect={setenableselect}
        enableselect={enableselect}
        resultCount={data?.length || 0}
        selectedCount={selectedCount}
        exportMode={exportMode}
        exportCount={exportCount}
      />
    </div>
  );
};

export default SelectInfo;
