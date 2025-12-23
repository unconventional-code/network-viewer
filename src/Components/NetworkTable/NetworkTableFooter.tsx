import { useMemo } from "react";
import {
  formatSize,
  formatTime,
  getEntryTransferredSize,
  getEntryUncompressedSize,
  calculateFinishTime,
} from "../../utils";
import { calculateTimings } from "../../state/network/utils";
import { PaginationControls } from "./PaginationControls";
import { useNetwork } from "../../state/network/Context";
import { useTheme } from "../../state/theme/Context";
import { Entry } from "har-format";

interface NetworkTableFooterProps {
  showAllInfo?: boolean;
}

export function NetworkTableFooter({
  showAllInfo = true,
}: NetworkTableFooterProps) {
  const { state, pagination } = useNetwork();
  const { showPagination } = useTheme();
  const shouldShowPagination = showPagination && pagination;

  // Calculate summary from raw HAR entries
  const dataSummary = useMemo(() => {
    const entries = state.rawData?.log?.entries || [];
    if (!entries.length) {
      return {
        totalRequests: 0,
        totalTransferredSize: 0,
        totalUncompressedSize: 0,
        finishTime: 0,
        timings: {
          DOMContentLoaded: 0,
          onLoad: 0,
        },
        finish: 0,
      };
    }

    const totalRequests = entries.length;
    let totalTransferredSize = 0;
    let totalUncompressedSize = 0;

    entries.forEach((entry: Entry) => {
      totalTransferredSize += getEntryTransferredSize(entry);
      totalUncompressedSize += getEntryUncompressedSize(entry);
    });

    const finishTime = calculateFinishTime(entries);
    const timings = calculateTimings(state.rawData?.log?.pages || []);

    return {
      totalRequests,
      totalTransferredSize,
      totalUncompressedSize,
      finishTime,
      timings,
      finish: finishTime,
    };
  }, [state.rawData]);

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
            <span>{`Load: ${formatTime(dataSummary.timings?.onLoad)}`}</span>
          </>
        ) : (
          <span>{`${dataSummary.totalRequests} requests`}</span>
        )}
      </div>
    </div>
  );
}
