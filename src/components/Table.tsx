import { ArrowUpDown, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { useState } from "react";
import { JsonType, MemberType, SortedMember, SupportMe } from "../Types";
import Exporter from "./Exporter";
import Searchbar from "./Searchbar";

const Table = ({
  jsonData,
  activeTab,
  supportMeArray,
}: {
  jsonData: JsonType;
  activeTab: string;
  supportMeArray: SupportMe[];
}) => {
  const tableCols = ["#", "Player", "Cube Points", "Bounty Points", "Total"];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof SortedMember | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [clickCount, setClickCount] = useState(0);

  const data: JsonType = jsonData;
  const players: MemberType[] = data.ServerState.Members;

  const playersWithIdx: SortedMember[] = players
    .filter((player) =>
      player.TimePeriodState.TimePeriodList.find(
        (timePeriod) => timePeriod.Key === activeTab
      )
    )
    .map((player) => {
      const playerName = player.PlayerInfo.Name;
      const pointsList = player.TimePeriodState.TimePeriodList;

      // Find the TimePeriod that matches the activeTab
      const matchedTimePeriod = pointsList.find(
        (timePeriod) => timePeriod.Key === activeTab
      );

      // If there's no matching time period, default to 0 points (0 point players won't be included anyway, due to the filter applied earlier)
      const cubePoints = matchedTimePeriod?.CubePoints ?? 0;
      const bountyPoints = matchedTimePeriod?.BountyPoints ?? 0;
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

  const handleSort = (column: keyof SortedMember) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      setClickCount((prevCount) => prevCount + 1);

      if (clickCount === 2) {
        // Reset to default sorting
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

  return (
    <>
      <div className="h-auto w-full max-w-4xl my-5 flex flex-row flex-nowrap items-center">
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Exporter
          tableCols={tableCols}
          filteredPlayers={filteredPlayers}
          activeTab={activeTab}
        />
        <div className="flex flex-col flex-nowrap gap-y-2">
          {supportMeArray.map((el, id) => (
            <a
              key={id}
              title={`Support me on ${el.name}`}
              href={el.link}
              target="_blank"
            >
              <img src={el.image} className="w-14" />
            </a>
          ))}
        </div>
        <button
          className="btn btn-primary ml-4"
          title="Load another ClanState.json file."
          onClick={() => location.reload()}
        >
          <div
            className="flex flex-col items-center justify-center px-2 py-2"
            title="Load another ClanState.json file."
          >
            <div>Load ClanState.json</div>
            <Upload className="w-5" />
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
                      className={`flex gap-x-5 flex-row justify-center uppercase ${
                        columnKey !== null ? "cursor-pointer" : "cursor-default"
                      }`}
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
