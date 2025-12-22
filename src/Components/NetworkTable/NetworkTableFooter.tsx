import { formatSize, formatTime } from "../../utils";

interface NetworkTableFooterProps {
  dataSummary: {
    totalRequests: number;
    totalTransferredSize: number;
    totalUncompressedSize: number;
    finishTime: number;
    timings: {
      DOMContentLoaded: number;
      onLoad: number;
    };
    finish: number;
  };
  showAllInfo?: boolean;
}

export function NetworkTableFooter({
  dataSummary,
  showAllInfo = true,
}: NetworkTableFooterProps) {
  return (
    <div className="flex items-center justify-between px-m py-xs bg-bg-gray-90 border-t border-border-color text-h6 text-brand-primary-gray">
      {showAllInfo ? (
        <>
          <span>{`${dataSummary.totalRequests} requests`}</span>
          <span>{`${formatSize(
            dataSummary.totalTransferredSize
          )} transferred`}</span>
          <span>{`${formatSize(
            dataSummary.totalUncompressedSize
          )} resources`}</span>
          <span>{`Finished: ${formatTime(dataSummary.finish)}`}</span>
          <span>{`DOMContentLoaded: ${formatTime(
            dataSummary.timings?.DOMContentLoaded
          )}`}</span>
          <span>{`Load: ${formatTime(
            dataSummary.timings?.onLoad
          )}`}</span>
        </>
      ) : (
        <span>{`${dataSummary.totalRequests} requests`}</span>
      )}
    </div>
  );
}
