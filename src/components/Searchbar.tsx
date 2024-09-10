import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const Searchbar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <>
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          className="grow"
          placeholder="Search for Player..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search className="w-4" />
      </label>
    </>
  );
};

export default Searchbar;
