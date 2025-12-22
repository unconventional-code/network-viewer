import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import NetworkTableHeader from "../Components/NetworkTable/NetworkTableHeader";
import { useNetwork } from "../state/network/Context";
import ImportHar from "../Components/Import/ImportHAR";
import ErrorMessage from "../Components/ErrorMessage";
import { useTheme } from "../state/theme/Context";
import InputHAR from "../Components/Import/InputHAR";
import NetworkTableBody from "../Components/NetworkTable/NetworkTableBody";
import { TABLE_HEADER_HEIGHT } from "../constants";
import { useResizeObserver } from "../hooks/useResizeObserver";

const NetworkTableContainer: React.FC = () => {
  const { state } = useNetwork();
  const { showImportHar, showWaterfall } = useTheme();
  const actualData = state.get("actualData");
  const error = state.get("error");
  const showReqDetail = state.get("showReqDetail");

  const [tableBodyHeight, setTableBodyHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { elementDims } = useResizeObserver(ref);

  useEffect(() => {
    if (ref?.current && elementDims.height) {
      setTableBodyHeight(ref.current.clientHeight - TABLE_HEADER_HEIGHT);
    }
  }, [ref?.current, actualData, elementDims]);

  if (error) {
    return <ErrorMessage {...error} />;
  }

  if (!actualData.size && showImportHar) {
    return (
      <section className="flex flex-col items-center justify-center h-full w-full">
        <ImportHar showButton={false} />
        <InputHAR />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={classNames(
        "flex flex-col h-full w-full overflow-hidden",
        { "hide-waterfall": !showWaterfall },
        { "limited-cols": showReqDetail }
      )}
    >
      <NetworkTableHeader />
      <NetworkTableBody height={tableBodyHeight} />
    </section>
  );
};

export default NetworkTableContainer;
