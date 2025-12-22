import { formatSize, formatTime } from "../../utils";
import { PaginationControls } from "./PaginationControls";
import { useNetwork } from "../../state/network/Context";
import { useTheme } from "../../state/theme/Context";

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
  const { pagination } = useNetwork();
  const { showPagination } = useTheme();
  const shouldShowPagination = showPagination && pagination;

  return (
    <div
      id="network-table-footer"
      data-testid="network-table-footer"
      className="flex flex-col bg-bg-gray-90 border-t border-border-color"
    >
      {shouldShowPagination && (
        <PaginationControls className="border-b border-border-color" />
      )}
      <div className="flex items-center justify-between px-m py-xs text-h6 text-brand-primary-gray">
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
    </div>
  );
}
