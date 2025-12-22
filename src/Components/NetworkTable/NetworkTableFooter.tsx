import React from "react";
import { Map } from "immutable";

import { formatSize, formatTime } from "../../utils";

interface NetworkTableFooterProps {
  dataSummary: Map<string, any>;
  showAllInfo?: boolean;
}

const NetworkTableFooter: React.FC<NetworkTableFooterProps> = ({
  dataSummary,
  showAllInfo = true,
}) => (
  <div className="flex items-center justify-between px-m py-xs bg-bg-gray-90 border-t border-border-color text-h6 text-brand-primary-gray">
    {showAllInfo ? (
      <>
        <span>{`${dataSummary.get("totalRequests")} requests`}</span>
        <span>{`${formatSize(
          dataSummary.get("totalTransferredSize")
        )} transferred`}</span>
        <span>{`${formatSize(
          dataSummary.get("totalUncompressedSize")
        )} resources`}</span>
        <span>{`Finished: ${formatTime(dataSummary.get("finish"))}`}</span>
        <span>{`DOMContentLoaded: ${formatTime(
          dataSummary.get("timings")?.DOMContentLoaded
        )}`}</span>
        <span>{`Load: ${formatTime(dataSummary.get("timings")?.onLoad)}`}</span>
      </>
    ) : (
      <span>{`${dataSummary.get("totalRequests")} requests`}</span>
    )}
  </div>
);

export default NetworkTableFooter;
