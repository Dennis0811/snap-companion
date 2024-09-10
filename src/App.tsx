import moment from "moment";
import { useEffect, useState } from "react";
import KoFiLogo from "./assets/Ko-fi_Logo_white_stroke@2x.png";
import PatreonLogo from "./assets/PATREON_SYMBOL_1_WHITE_RGB.svg";
import FileInput from "./components/FileInput";
import Table from "./components/Table";
import { JsonType, MemberType, TimePeriod } from "./Types";

function App() {
  const supportMeArray = [
    { name: "Ko-Fi", link: "https://ko-fi.com/dennis811", image: KoFiLogo },
    {
      name: "Patreon",
      link: "https://patreon.com/Dennis811",
      image: PatreonLogo,
    },
  ];

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
        let timePeriodKeys = longestTimePeriodList
          .map((tp: TimePeriod) => tp.Key)
          .reverse();

        //   Limit the tabs to the latest 5
        if (timePeriodKeys.length > 5) {
          timePeriodKeys = timePeriodKeys.slice(0, 5);
        }

        setTabs(timePeriodKeys);

        // Set the latest time period as the active tab by default
        if (timePeriodKeys.length > 0) {
          setActiveTab(timePeriodKeys[0]);
        }
      }
    }
  }, [jsonData]);

  return (
    <div className="flex flex-col h-screen">
      <main className="h-screen m-auto">
        {!file ? (
          <div className="flex flex-col h-full w-full justify-center items-center">
            <FileInput setFile={setFile} setJsonData={setJsonData} />
            <div className="flex flex-row py-5 gap-x-5">
              {supportMeArray.map((el, id) => (
                <a
                  key={id}
                  title={`Support me on ${el.name}`}
                  href={el.link}
                  target="_blank"
                >
                  <img src={el.image} className="w-12" />
                </a>
              ))}
            </div>
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
                    <span className="text-lg">{`${moment(tabKey).format(
                      "DD. MMM YY"
                    )}`}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Pass the JSON data to the Table component */}
            {jsonData !== null && activeTab !== null && (
              <Table
                jsonData={jsonData as JsonType}
                activeTab={activeTab}
                supportMeArray={supportMeArray}
              />
            )}
          </div>
        )}
      </main>

      <footer className="footer footer-center bg-base-300 text-base-content p-4 mt-10 flex flex-row justify-between">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
          <p>
            Snap Companion is not affiliated or associated with any other
            company.
          </p>
          <p>
            All logos, trademarks, and trade names used herein are the property
            of their respective owners.
          </p>
        </aside>
        <aside>
          <p>If you have any suggestions or just want to tell me something,</p>
          <a href="mailto:marvelsnapcompanion@gmail.com" className="link">
            contact here me via E-Mail.
          </a>
        </aside>
      </footer>
    </div>
  );
}

export default App;
