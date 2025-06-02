import { InputHTMLAttributes, useState } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  activeTab: string;
  DATA: any[];
  setDATA: (data: any[]) => void;
  Loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ activeTab, DATA, setDATA, Loading, setLoading }) => {
  const [username, setUsername] = useState("");

  const fetchData = async () => {
    if (!username.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/username/domain?username=${username}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      const formattedData = Array.isArray(data) ? data : [data];

      console.log(formattedData[0]?.data, "search");
      setDATA(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 w-full max-w-[800px] overflow-hidden text-xl text-gray-500 font-normal rounded-[27px] flex items-center">
      <input
        type="text"
        className="w-full border px-[27px] py-[15px] rounded-[27px] border-gray-200 outline-none bg-transparent"
        placeholder="Search here"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="border-2 rounded-2xl p-2 ml-2" onClick={fetchData} disabled={Loading}>
        {Loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
};
