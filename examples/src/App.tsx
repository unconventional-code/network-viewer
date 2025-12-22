import React, { useState } from "react";
import { NetworkViewer } from "../../src";

import { Footer } from "./Components/Footer";
import { parseQueryString } from "./utils";

export function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fileOptions, setFileOptions] = useState(null);

  // read file queryString and load HAR file
  useState(() => {
    const parsedData = parseQueryString();
    if (parsedData) {
      setFileOptions(parsedData);
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
