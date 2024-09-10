import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { SortedMember } from "../Types";

const Exporter = ({
  tableCols,
  filteredPlayers,
  activeTab,
}: {
  tableCols: string[];
  filteredPlayers: SortedMember[];
  activeTab: string;
}) => {
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
    XLSX.writeFile(wb, `${activeTab}_player_data.xlsx`);
  };

  return (
    <>
      <button onClick={exportToExcel} className="mx-4 btn btn-primary">
        <div
          className="flex flex-col items-center justify-center px-2 py-2"
          title="Download your Leaderboard file."
        >
          <div>Export to Excel</div>
          <Download />
        </div>
      </button>
    </>
  );
};

export default Exporter;
