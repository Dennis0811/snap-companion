import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { JsonType, MemberType, SortedMember } from "../Types";

const Table = ({ jsonData }: { jsonData: JsonType }) => {
  const tableCols = ["#", "Player", "Cube Points", "Bounty Points", "Total"];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SortedMember | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [clickCount, setClickCount] = useState(0); // To track the number of clicks

  const data: JsonType = jsonData;
  const players: MemberType[] = data.ServerState.Members;

  // First, assign the default idx based on sorting by totalPoints
  const playersWithIdx: SortedMember[] = players
    .map((player) => {
      const playerName = player.PlayerInfo.Name;
      const pointsList = player.TimePeriodState.TimePeriodList;
      let cubePoints = pointsList[pointsList.length - 1].CubePoints;
      let bountyPoints = pointsList[pointsList.length - 1].BountyPoints;

      if (isNaN(+cubePoints)) cubePoints = 0;
      if (isNaN(+bountyPoints)) bountyPoints = 0;

      const totalPoints = cubePoints + bountyPoints;

      return {
        name: playerName,
        cubePoints,
        bountyPoints,
        totalPoints,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints) // Sort by totalPoints descending initially
    .map((player, index) => ({
      idx: index + 1, // Assign idx based on the initial totalPoints sort
      ...player,
    }));

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle sorting column click
  const handleSort = (column: keyof SortedMember) => {
    if (sortColumn === column) {
      // Toggle sorting direction or reset to default if already sorted ascending
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }

      // Update click count
      setClickCount((prevCount) => prevCount + 1);

      // Reset to default after the third click
      if (clickCount === 2) {
        setSortColumn(null); // Reset column sorting
        setSortDirection("desc"); // Reset sorting direction to default
        setClickCount(0); // Reset click count
      }
    } else {
      // Set new column and sort descending by default
      setSortColumn(column);
      setSortDirection("desc");
      setClickCount(1); // Reset click count for a new column
    }
  };

  // Get the appropriate icon for the sorting column
  const getSortIcon = (column: keyof SortedMember) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  // Filter and sort the players based on the current sort settings
  const filteredPlayers = playersWithIdx
    .filter((player) => player.name.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      const isAscending = sortDirection === "asc";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return isAscending
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

  return (
    <>
      <div className="w-full max-w-4xl my-5 flex flex-row flex-nowrap items-center">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="w-4" />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-lg table-zebra table-pin-rows">
          <thead>
            <tr>
              {tableCols.map((col, index) => {
                let columnKey: keyof SortedMember | null = null;
                switch (col) {
                  case "#":
                    columnKey = null; // No sorting for the idx column
                    break;
                  case "Player":
                    columnKey = "name";
                    break;
                  case "Cube Points":
                    columnKey = "cubePoints";
                    break;
                  case "Bounty Points":
                    columnKey = "bountyPoints";
                    break;
                  case "Total":
                    columnKey = "totalPoints";
                    break;
                  default:
                    break;
                }

                return (
                  <th key={index}>
                    <div
                      className="cursor-pointer flex gap-x-5 flex-row"
                      onClick={() => columnKey && handleSort(columnKey)}
                    >
                      {col} {columnKey && getSortIcon(columnKey)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {filteredPlayers.map((player: SortedMember, index: number) => (
              <tr key={index}>
                <td>{player.idx}</td> {/* Fixed idx based on totalPoints */}
                <td>{player.name}</td>
                <td className="text-right">{player.cubePoints}</td>
                <td className="text-right">{player.bountyPoints}</td>
                <td className="text-right">{player.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
