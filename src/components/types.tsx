export interface SearchResult {
    id: string;
    type: string;
    value: string;
    count?: number;
    items?: string[];
  }
  export interface TimelineItem {
    date: string;
    type: string;
    details: string;
  }
  export interface InfoCardProps {
    icon: string;
    title: string;
    count?: number;
    items: string[];
    onExpand?: () => void;
  }
  export interface PlatformData {
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
    }[];
    front_schemas?: {
      image?: string;
    }[];
  }