import { AllianceType, MemberType, SortedMember } from "../Types";
import PlayerSummaryModalContent from "./PlayerSummaryModalContent";

const PlayerSummaryModal = ({
  tableCols,
  data,
  allianceData,
  currentPlayer,
}: {
  tableCols: string[];
  data: MemberType[];
  allianceData: AllianceType;
  currentPlayer: SortedMember;
}) => {
  const modalId = `${currentPlayer.name}_modal`;

  return (
    <div>
      <button
        className="tooltip tooltip-bottom"
        data-tip="Player Summary"
        onClick={() => {
          const modal = document.getElementById(
            modalId
          ) as HTMLDialogElement | null;

          return modal !== null && modal !== undefined
            ? modal.showModal()
            : console.error("Player Summary not found!");
        }}
      >
        {currentPlayer.name}
      </button>

      <PlayerSummaryModalContent
        modalId={modalId}
        tableCols={tableCols}
        data={data}
        allianceData={allianceData}
        currentPlayer={currentPlayer}
      />
    </div>
  );
};

export default PlayerSummaryModal;
