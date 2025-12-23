import classNames from "classnames";

import { useNetwork } from "../../state/network/Context";
import { useTheme } from "../../state/theme/Context";
import { getViewerFields } from "../../utils";

export function NetworkTableHeader() {
  const { state } = useNetwork();
  const showReqDetail = state.showReqDetail;
  const tableHeaderWidth = state.tableHeaderWidth;
  const { showWaterfall } = useTheme();

  const columns = getViewerFields(showReqDetail, showWaterfall || false);

  return (
    <div
      id="network-table-header"
      data-testid="network-table-header"
      className="flex items-center w-full h-8 border-b border-border-color bg-bg-gray-90 sticky top-0 z-10"
      style={{ width: tableHeaderWidth }}
    >
      {Object.entries(columns).map(([datakey, { key, name }]) => {
        // Tailwind class recipes based on col type
        // Default to 12% width, min-w-[60px]
        let colClasses =
          "flex items-center font-semibold text-h6 text-brand-primary-dark-gray min-w-[60px] pr-xs-s";
        let widthClass = "w-[12%]";
        // Domain column: 15%
        if (datakey === "domain") widthClass = "w-[15%]";
        // File column: 25% or 100% if limited (showReqDetail)
        if (datakey === "file") {
          widthClass = showReqDetail ? "w-full" : "w-[25%]";
        }
        // Waterfall column: 10%
        if (key === ("waterfall" as any) && showWaterfall) {
          widthClass = "w-[10%]";
        }
        // If showReqDetail, stretch all except file
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
                "show-waterfall": key === ("waterfall" as any) && showWaterfall,
              }
            )}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}
