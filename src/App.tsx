import { useEffect, useState } from "react";
import FileInput from "./components/FileInput";
import Table from "./components/Table";
import { JsonType, MemberType, TimePeriod } from "./Types";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<JsonType | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabs, setTabs] = useState<string[]>([]);

  // Function to get the member with the longest TimePeriodList
  const getLongestTimePeriodList = (members: MemberType[]): TimePeriod[] => {
    const longestMember = members.reduce((prev, current) => {
      return current.TimePeriodState.TimePeriodList.length >
        prev.TimePeriodState.TimePeriodList.length
        ? current
        : prev;
    });
    return longestMember.TimePeriodState.TimePeriodList;
  };

  // Update tabs whenever jsonData changes
  useEffect(() => {
    if (jsonData) {
      const members = jsonData.ServerState.Members;
      if (members.length > 0) {
        const longestTimePeriodList = getLongestTimePeriodList(members);
        const timePeriodKeys = longestTimePeriodList
          .map((tp: TimePeriod) => tp.Key);
        setTabs(timePeriodKeys.reverse());

        // Set the latest time period as the active tab by default
        if (timePeriodKeys.length > 0) {
          setActiveTab(timePeriodKeys[0]);
        }
      }
    }
  }, [jsonData]);

  return (
    <main className="h-screen">
      {!file ? (
        <div className="flex h-full w-full justify-center items-center">
          <FileInput setFile={setFile} setJsonData={setJsonData} />
        </div>
      ) : (
        <div className="flex flex-col flex-nowrap h-full w-full max-w-4xl mx-auto pt-3">
          {/* Tabs */}
          <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box items-center justify-evenly">
            {tabs.map((tabKey, index) => (
              <li key={tabKey}>
                <a
                  className={`flex flex-col flex-nowrap ${
                    activeTab === tabKey ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tabKey)}
                >
                  <span>{`Week ${index + 1}`}</span>
                  <span className="text-lg">{tabKey}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Pass the JSON data to the Table component */}
          {jsonData !== null && activeTab !== null && (
            <Table jsonData={jsonData as JsonType} activeTab={activeTab} />
          )}
        </div>
      )}
    </main>
  );
}

export default App;
