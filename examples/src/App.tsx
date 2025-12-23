import React, { useEffect, useState } from "react";
import { NetworkViewer } from "../../src";

import { Footer } from "./Components/Footer";
import { parseQueryString } from "./utils";

export function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fileOptions, setFileOptions] = useState<{
    file: string;
    fetchOptions: { withCredentials: boolean };
  } | null>(null);

  // read file queryString and load HAR file
  useEffect(() => {
    const parsedData = parseQueryString();
    if (
      parsedData &&
      "file" in parsedData &&
      typeof parsedData.file === "string"
    ) {
      setFileOptions({
        file: parsedData.file,
        fetchOptions: { withCredentials: false },
      });
    }
  }, []);

  return (
    <section className="flex flex-col h-full">
      <div
        className={`
          flex-1
          ${isDataLoaded ? "h-full" : ""}
        `}
      >
        <NetworkViewer
          options={{
            enableAutoScroll: true,
            showTimeline: true,
            showWaterfall: true,
            showExportHar: true,
            showImportHar: true,
            showPauseResume: true,
            showPagination: true,
            showReset: true,
          }}
          onDataLoaded={() => setIsDataLoaded(true)}
          onReset={() => setIsDataLoaded(false)}
          {...fileOptions}
        />
      </div>
      {!isDataLoaded && (
        <div className="w-full">
          <Footer />
        </div>
      )}
    </section>
  );
}
