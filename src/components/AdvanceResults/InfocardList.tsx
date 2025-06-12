import React, { useState, useEffect } from "react";
import InfoCard from "./ProfileSection";
import SelectInfo from "./SelectInfo";
import FakeCardList from "./fake";
import CategoryCard from "./categoryCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PlatformVariable {
  key: string;
  value: string | number;
  type: string;
}

interface SpecFormatItem {
  registered?: {
    type?: string;
    proper_key?: string;
    value: boolean;
  };
  platform_variables?: PlatformVariable[];
  verified?: { value: boolean };
  breach?: { value: boolean };
  name?: { value: string };
  picture_url?: { value: string };
  website?: { value: string };
  id?: { value: string };
  bio?: { value: string };
}

interface PlatformData {
  module: string;
  schemaModule: string;
  status: string;
  query: string;
  pretty_name: string;
  category: {
    name: string;
    description: string;
  };
  spec_format: SpecFormatItem[];
}

interface InfoCardListProps {
  users: PlatformData[];
  hidebutton: boolean;
  PaidSearch: string;
  sethidebutton: React.Dispatch<React.SetStateAction<boolean>>;
  fulldata: PlatformData[];
}

const InfoCardList: React.FC<InfoCardListProps> = ({
  users,
  hidebutton,
  PaidSearch,
  sethidebutton,
  fulldata,
}) => {
  const [enableselect, setenableselect] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PlatformData[]>([]);
  const [Cards, setCards] = useState<PlatformData[]>([]);
  // Function to check if spec_format has only registered and platform_variables
  const hasSimpleSpecFormat = (specFormat: SpecFormatItem[]) => {
    return specFormat.every(
      (item) =>
        Object.keys(item).length === 2 && "registered" in item && "platform_variables" in item
    );
  };

  // Filter users when component mounts or users prop changes
  useEffect(() => {
    const filtered = users.filter((user) => hasSimpleSpecFormat(user.spec_format));
    const withoutCard = users.filter((user) => !hasSimpleSpecFormat(user.spec_format));
    setFilteredUsers(withoutCard);
    setCards(filtered);
  }, [users]);

  // Function to handle card selection
  const handleCardSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Function to delete selected cards
  const deleteSelectedCards = () => {
    const updatedUsers = filteredUsers.filter((_, index) => !selectedIndices.includes(index));
    setFilteredUsers(updatedUsers); // Update the local state
    setSelectedIndices([]); // Clear the selection
  };
  const handleDelete = (index: number) => {
    setFilteredUsers(filteredUsers.filter((_, i) => i !== index));
  };
  return (
    <div>
      {/* Button to delete selected cards */}
      <SelectInfo data={fulldata} hidebutton={hidebutton} />
      {/* {enableselect && (
        <div className="text-white w-full  text-xl p-10 text-center">
          Export or Delete Selected Data
        </div>
      )} */}

      {selectedIndices.length > 0 && enableselect && (
        <>
          <div className="px-2">
            <AlertDialog>
              <AlertDialogTrigger className="text-white/80 font-bold bg-red-500 px-4 py-2 rounded-lg text-center w-24 mb-10">
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your Data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteSelectedCards}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>{" "}
          </div>
        </>
      )}

      {/* Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={index}>
              <InfoCard
                userData={user}
                hidebutton={hidebutton}
                PaidSearch={PaidSearch}
                isSelected={selectedIndices.includes(index)}
                onSelect={() => handleCardSelect(index)}
                enableselect={enableselect}
                onDelete={() => handleDelete(index)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">No user data available</p>
        )}
      </div>
      {Cards.length > 0 && <CategoryCard CardData={Cards} />}
    </div>
  );
};

export default InfoCardList;
