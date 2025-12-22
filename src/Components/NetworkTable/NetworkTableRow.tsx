import { CSSProperties } from "react";
import classNames from "classnames";

import { ROW_ID_PREFIX } from "../../constants";
import { TimeChart } from "./TimeChart";
import { NetworkCellValue } from "./NetworkCellValue";
import { getStatusClass, getViewerFields } from "../../utils";
import { useTheme } from "../../state/theme/Context";
import { useNetwork } from "../../state/network/Context";
import { Entry } from "har-format";

interface NetworkTableRowProps {
  entry: Entry;
  maxTime: number;
  onSelect: (entry: any) => void;
  scrollHighlight: boolean;
  style?: CSSProperties;
}

export function NetworkTableRow({
  entry,
  maxTime,
  onSelect,
  scrollHighlight,
  style = {},
}: NetworkTableRowProps) {
  const { state } = useNetwork();
  const showReqDetail = state.showReqDetail;
  const { showWaterfall } = useTheme();
  const columns = getViewerFields(showReqDetail, showWaterfall || false);

  const statusClass = getStatusClass(entry);
  const rowClassName = classNames(
    "flex items-center h-6 border-b border-border-color cursor-pointer hover:bg-bg-gray-90",
    {
      "bg-bg-blue-50": scrollHighlight,
      "text-brand-danger": statusClass === "error",
      "text-brand-primary-gray": statusClass === "info",
      "text-brand-warning": statusClass === "pending",
    }
  );

  return (
    <div style={{ ...style }}>
      <div
        className={rowClassName}
        id={ROW_ID_PREFIX + entry._index}
        data-testid={`network-table-row-${entry._index}`}
        data-entry-index={entry._index}
        onClick={() => onSelect(entry)}
      >
        {Object.entries(columns).map(
          ([datakey, { key, unit }], colIdx, arr) => {
            // Mirror header width logic
            let colClasses =
              "flex items-center font-semibold text-h6 text-brand-primary-dark-gray min-w-[60px] pr-xs-s";
            let widthClass = "w-[12%]";
            if (datakey === "domain") widthClass = "w-[15%]";
            if (datakey === "file") {
              widthClass = showReqDetail ? "w-full" : "w-[25%]";
            }
            if (key === "waterfall" && showWaterfall) {
              widthClass = "w-[10%]";
            }
            if (showReqDetail && datakey !== "file") {
              widthClass = "w-[12%] flex-1";
            }
            // Remove right padding on last col
            let isLast = Object.keys(columns).at(-1) === datakey;
            let prClass = isLast ? "" : "pr-xs-s";
            return (
              <div
                key={key}
                className={classNames(
                  "table-column",
                  "flex items-center px-xs min-w-[60px] font-semibold text-h6 text-brand-primary-dark-gray",
                  colClasses,
                  widthClass,
                  datakey,
                  prClass,
                  {
                    "limited-cols": showReqDetail && datakey === "file",
                    "show-waterfall": key === "waterfall" && showWaterfall,
                  }
                )}
              >
                {key === "waterfall" && entry.time ? (
                  <TimeChart maxTime={maxTime} timings={entry.timings as any} />
                ) : (
                  <NetworkCellValue
                    datakey={key}
                    onClick={() => onSelect(entry)}
                    payload={entry}
                    unit={unit}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
