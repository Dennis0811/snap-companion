import React, { Dispatch, SetStateAction, useState } from "react";
import { JsonType } from "../Types";

const FileInput = ({
  setFile,
  setJsonData,
}: {
  setFile: Dispatch<SetStateAction<File | null>>;
  setJsonData: Dispatch<SetStateAction<JsonType | null>>;
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      validateFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateFile(event.dataTransfer.files[0]);
    }
  };

  // File validation logic
  const validateFile = (file: File) => {
    const maxFileSize = 1024 * 1024; // 1 MB in bytes

    if (file.type !== "application/json") {
      setErrorMessage("Invalid file type. Only .json files are accepted.");
      setFile(null);
      return;
    }

    if (file.name !== "ClanState.json") {
      setErrorMessage(
        "Incorrect file name. Please upload the 'ClanState.json' file."
      );
      setFile(null);
      return;
    }

    if (file.size > maxFileSize) {
      setErrorMessage(
        "File size exceeds the limit. Maximum allowed size is 1MB."
      );
      setFile(null);
      return;
    }

    // If valid, read the file and parse the JSON
    setErrorMessage(null);
    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === "string") {
          const json = JSON.parse(result);
          setJsonData(json); // Save parsed JSON data
        }
      } catch (err) {
        setErrorMessage("Error parsing the JSON file.");
      }
    };

    reader.readAsText(file); // Read the file content
  };

  return (
    <>
      <div className="w-full max-w-md p-4 bg-base-300 rounded-lg shadow-lg text-neutral-content">
        {/* Error message */}
        {errorMessage && (
          <div role="alert" className="alert alert-error mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <h2 className="text-2xl mb-4">
          Upload your <span className="font-mono">ClanState.json</span> file
        </h2>
        <p>You should be able to find it in this directory:</p>
        <p className="font-mono text-sm">
          C:\Users\Your Name\AppData\LocalLow\Second
          Dinner\SNAP\Standalone\States\nvprod
        </p>
        <div
          className={`relative flex flex-col justify-center items-center my-3 p-6 border-2 border-dashed rounded-lg transition-all duration-300 ${
            dragActive ? "border-primary" : "border-neutral-content"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            className="absolute inset-0 opacity-0 cursor-pointer"
            type="file"
            onChange={handleFileChange}
          />
          <div className="text-center">
            <p className="text-lg">Drag & Drop or Click to Upload</p>
            <p className="text-sm">Accepted file: ClanState.json (max 1MB)</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileInput;
