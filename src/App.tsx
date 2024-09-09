import { useState } from "react";
import FileInput from "./components/FileInput";
import Table from "./components/Table";
import { JsonType } from "./Types";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<JsonType | null>(null);

  return (
    <main className="h-screen">
      {!file ? (
        <div className="flex h-full w-full justify-center items-center">
          <FileInput setFile={setFile} setJsonData={setJsonData} />
        </div>
      ) : (
        // Pass the JSON data to the Table component
        <div className="flex flex-col flex-nowrap h-full w-full max-w-4xl m-auto">
          {jsonData !== null && <Table jsonData={jsonData as JsonType} />}
        </div>
      )}
    </main>
  );
}

export default App;
