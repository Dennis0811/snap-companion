import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx"; // Import the XLSX library
import { JsonType, MemberType, SortedMember } from "../Types";

const Table = ({ jsonData }: { jsonData: JsonType }) => {
  const tableCols = ["#", "Player", "Cube Points", "Bounty Points", "Total"];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SortedMember | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [clickCount, setClickCount] = useState(0);

  const data: JsonType = jsonData;
  const players: MemberType[] = data.ServerState.Members;

  const playersWithIdx: SortedMember[] = players
    .map((player) => {
      const playerName = player.PlayerInfo.Name;
      const pointsList = player.TimePeriodState.TimePeriodList;

      // Only working on the latest entry of the leaderboard 
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
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((player, index) => ({
      idx: index + 1,
      ...player,
    }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSort = (column: keyof SortedMember) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }

      setClickCount((prevCount) => prevCount + 1);

      if (clickCount === 2) {
        setSortColumn(null);
        setSortDirection("desc");
        setClickCount(0);
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
      setClickCount(1);
    }
  };

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

  const exportToExcel = () => {
    const wsData = [
      tableCols, // Headers
      ...filteredPlayers.map((player) => [
        player.idx,
        player.name,
        player.cubePoints,
        player.bountyPoints,
        player.totalPoints,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData); // Create sheet from data
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Alliance Leaderboard"); // Append the sheet

    // Export as an Excel file
    XLSX.writeFile(wb, "player_data.xlsx");
  };

  return (
    <>
      <div className="h-auto w-full max-w-4xl my-5 flex flex-row flex-nowrap items-center">
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

        <button onClick={exportToExcel} className="ml-4 btn btn-primary">
          <div
            className="flex flex-col items-center justify-center px-2 py-2"
            title="Download your Excel Leaderboard file."
          >
            <div>Export to Excel</div>
            <Download />
          </div>
        </button>
      </div>

      <div className="overflow-auto">
        <table className="table table-lg table-zebra table-pin-rows">
          <thead>
            <tr>
              {tableCols.map((col, index) => {
                let columnKey: keyof SortedMember | null = null;
                switch (col) {
                  case tableCols[0]:
                    columnKey = null;
                    break;
                  case tableCols[1]:
                    columnKey = "name";
                    break;
                  case tableCols[2]:
                    columnKey = "cubePoints";
                    break;
                  case tableCols[3]:
                    columnKey = "bountyPoints";
                    break;
                  case tableCols[4]:
                    columnKey = "totalPoints";
                    break;
                  default:
                    break;
                }

                return (
                  <th key={index}>
                    <div
                      className="cursor-pointer flex gap-x-5 flex-row justify-center uppercase"
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
                <td>{player.idx}</td>
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
