import { CSSProperties, useMemo } from "react";
import classNames from "classnames";

import { ROW_ID_PREFIX } from "../../constants";
import { TimeChart } from "./TimeChart";
import { NetworkCellValue } from "./NetworkCellValue";
import { getViewerFields } from "../../utils";
import { useTheme } from "../../state/theme/Context";
import { useNetwork } from "../../state/network/Context";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

interface NetworkTableRowProps {
  preparedEntry: PreparedEntry;
  maxTime: number;
  onSelect: (entry: any) => void;
  scrollHighlight: boolean;
  style?: CSSProperties;
}

export function NetworkTableRow({
  preparedEntry,
  maxTime,
  onSelect,
  scrollHighlight,
  style = {},
  ...ariaAttributes
}: NetworkTableRowProps) {
  const { state } = useNetwork();
  const showReqDetail = state.showReqDetail;
  const { showWaterfall } = useTheme();
  const columns = getViewerFields(showReqDetail, showWaterfall || false);

  // Handle Entry format
  const statusClass = useMemo(() => {
    const response = preparedEntry.response;
    const status = response?.status ?? 0;
    const error = response?._error ?? null;

    if (status === 0 && !error) {
      return "pending";
    }
    if (status >= 400 || error) {
      return "error";
    }
    return "info";
  }, [preparedEntry]);

  const rowClassName = classNames(
    "flex items-center h-6 border-b border-border-color cursor-pointer hover:bg-bg-gray-90",
    {
      "bg-bg-blue-50": scrollHighlight,
      "text-brand-danger": statusClass === "error",
      "text-brand-primary-gray": statusClass === "info",
      "text-brand-warning": statusClass === "pending",
    }
  );

  if (!preparedEntry) {
    // Return a placeholder div if item is missing
    return (
      <div style={style} {...ariaAttributes}>
        {/* Empty row */}
      </div>
    );
  }

  return (
    <div style={{ ...style }}>
      <div
        className={rowClassName}
        id={ROW_ID_PREFIX + (preparedEntry._index ?? preparedEntry.index ?? 0)}
        data-testid={`network-table-row-${
          preparedEntry._index ?? preparedEntry.index ?? 0
        }`}
        onClick={() => onSelect(preparedEntry)}
      >
        {Object.entries(columns).map(([datakey, { key }]) => {
          // Mirror header width logic
          let colClasses =
            "flex items-center font-semibold text-h6 text-brand-primary-dark-gray min-w-[60px] pr-xs-s";
          let widthClass = "w-[12%]";
          if (datakey === "domain") widthClass = "w-[15%]";
          if (datakey === "file") {
            widthClass = showReqDetail ? "w-full" : "w-[25%]";
          }
          if (key === ("waterfall" as any) && showWaterfall) {
            widthClass = "w-[10%]";
          }
          if (showReqDetail && datakey !== "file") {
            widthClass = "w-[12%] flex-1";
          }
          // Remove right padding on last col
          let isLast =
            Object.keys(columns)[Object.keys(columns).length - 1] === datakey;
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
                  "show-waterfall":
                    key === ("waterfall" as any) && showWaterfall,
                }
              )}
            >
              {key === ("waterfall" as any) &&
              (preparedEntry.time || preparedEntry.time) ? (
                <TimeChart
                  maxTime={maxTime}
                  preparedEntry={preparedEntry}
                  firstEntryTime={
                    state.rawData?.log?.entries?.[0]?.startedDateTime
                  }
                />
              ) : (
                <NetworkCellValue
                  datakey={key}
                  onClick={() => onSelect(preparedEntry)}
                  preparedEntry={preparedEntry}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
