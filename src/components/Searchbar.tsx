import { Search, X } from "lucide-react";
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
        {searchQuery === "" ? (
          <Search className="w-4" />
        ) : (
          <X
            className="w-4 hover:cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        )}
      </label>
    </>
  );
};

export default Searchbar;
