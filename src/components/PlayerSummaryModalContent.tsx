import { X } from "lucide-react";
import moment from "moment";
import { AllianceType, MemberType, SortedMember } from "../Types";

const PlayerSummaryModalContent = ({
  modalId,
  tableCols,
  data,
  allianceData,
  currentPlayer,
}: {
  modalId: string;
  tableCols: string[];
  data: MemberType[];
  allianceData: AllianceType;
  currentPlayer: SortedMember;
}) => {
  const filteredData = data.filter(
    (entry) => entry.PlayerInfo.Name === currentPlayer.name
  )[0];

  const playerInfo = filteredData.PlayerInfo;
  const timePeriodInfo = filteredData.TimePeriodState.TimePeriodList;

  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box relative w-full max-w-5xl">
          {/* X button to close */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              const modal = document.getElementById(
                modalId
              ) as HTMLDialogElement;
              modal.close();
            }}
          >
            <X />
          </button>
          <h3 className="font-bold text-lg">{`${currentPlayer.name} • Player Summary`}</h3>
          <p>{`Joined [${allianceData.Tag}] ${allianceData.Name} ${moment(
            playerInfo.TimeCreated.toString()
          ).format("DD. MMM YY")}`}</p>

          <table className="table text-center">
            <thead>
              <tr>
                <th></th>
                {tableCols
                  .filter((col) => tableCols.indexOf(col) > 1)
                  .map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {timePeriodInfo
                .filter((tp) => tp.BountyPoints + tp.CubePoints > 0)
                .map((tp, idx) => {
                  const cubePoints = tp.CubePoints ?? 0;
                  const bountyPoints = tp.BountyPoints ?? 0;
                  const totalPoints = cubePoints + bountyPoints;

                  return (
                    <tr key={idx}>
                      <td className="flex flex-col">
                        <div className="min-w-20">{`Week ${idx + 1}`}</div>
                        <div className="text-sm">{`${moment(tp.Key).format(
                          "DD. MMM YY"
                        )}`}</div>
                      </td>
                      <td>{Intl.NumberFormat().format(cubePoints)}</td>
                      <td>{Intl.NumberFormat().format(bountyPoints)}</td>
                      <td>{Intl.NumberFormat().format(totalPoints)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default PlayerSummaryModalContent;
