import classNames from "classnames";

import { useNetwork } from "../../state/network/Context";
import { useTheme } from "../../state/theme/Context";
import { getViewerFields } from "../../utils";

export function NetworkTableHeader() {
  const { state } = useNetwork();
  const showReqDetail = state.get("showReqDetail");
  const tableHeaderWidth = state.get("tableHeaderWidth");
  const { showWaterfall } = useTheme();

  const columns = getViewerFields(showReqDetail, showWaterfall || false);

  return (
    <div
      className="flex items-center h-8 border-b border-border-color bg-bg-gray-90 sticky top-0 z-10"
      style={{ width: tableHeaderWidth }}
    >
      {Object.entries(columns).map(([datakey, { key, name }]) => (
        <div
          key={key}
          className={classNames(
            "flex items-center px-xs min-w-[60px] font-semibold text-h6 text-brand-primary-dark-gray",
            datakey,
            { "flex-1": showReqDetail },
            // @ts-ignore
            { "w-[128px]": showWaterfall && key === "waterfall" }
          )}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
