export interface SearchTypesProps {
    settypeofsearch: (type: string) => void;
    typeofsearch: string;
    selected: string;
}

export interface Tool {
  title: string;
  description: string;
  link: string;
}

export type SearchOption =
  | "Phone Number Search"
  | "Email Search"
  | "Reverse Image Search"
  | "Basic"
  | "Web3"
  | "Advance";
