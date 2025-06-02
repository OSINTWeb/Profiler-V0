import { TabButton } from "@/components/ui/TabButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState } from "react";

export const SearchSection = ({DATA,setDATA,Loading,setLoading}) => {
  const [activeTab, setActiveTab] = useState("domain");

  return (
    <section className="flex w-full flex-col items-stretch px-20">
      <div className="flex items-stretch gap-[40px_65px] flex-wrap">
        <TabButton active={activeTab === "domain"} onClick={() => setActiveTab("domain")}>
          Domain
        </TabButton>
        <TabButton active={activeTab === "social"} onClick={() => setActiveTab("social")}>
          Social Media
        </TabButton>
        <TabButton active={activeTab === "email"} onClick={() => setActiveTab("email")}>
          Email Check
        </TabButton>
      </div>
      <div className="self-center w-full flex justify-center mt-[52px]">
        <SearchInput activeTab={activeTab} DATA={DATA} setDATA={setDATA} Loading={Loading} setLoading={setLoading} />
      </div>
    </section>
  );
};
