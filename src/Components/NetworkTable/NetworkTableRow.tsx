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
        id={ROW_ID_PREFIX + entry.index}
        onClick={() => onSelect(entry)}
      >
        {Object.entries(columns).map(([datakey, { key, unit }]) => (
          <div
            key={key}
            className={classNames(
              "flex items-center px-xs min-w-[60px]",
              datakey,
              { "flex-1": showReqDetail },
              { "w-[128px]": showWaterfall && key === "waterfall" }
            )}
          >
            {key === "waterfall" && entry.time ? (
              <TimeChart maxTime={maxTime} timings={entry.timings} />
            ) : (
              <NetworkCellValue
                datakey={key}
                onClick={() => onSelect(entry)}
                payload={entry}
                unit={unit}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
