import { useMemo } from "react";
import classNames from "classnames";

import { parseTime, getUrlInfo, parseSize, getContentType } from "../../utils";
import { VIEWER_FIELDS } from "../../constants";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { Entry } from "har-format";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

interface NetworkCellValueProps {
  datakey: string;
  onClick?: () => void;
  preparedEntry: PreparedEntry;
}

// Component-specific utility: formats cell values from raw Entry data
// This is memoized within the component to only compute when rendering
const formatCellValue = (key: string, preparedEntry: PreparedEntry): string => {
  // Handle raw Entry format
  const rawEntry = preparedEntry;
  switch (key) {
    case "filename": {
      const urlInfo = getUrlInfo(rawEntry.request.url);
      return urlInfo.filename;
    }
    case "domain": {
      const urlInfo = getUrlInfo(rawEntry.request.url);
      return urlInfo.domain;
    }
    case "url": {
      const urlInfo = getUrlInfo(rawEntry.request.url);
      return urlInfo.url;
    }
    case "status": {
      const response = rawEntry.response;
      if (response?._error) {
        return "(failed)";
      }
      const status = response?.status ?? 0;
      return status === 0 ? "Pending" : String(status);
    }
    case "method":
      return rawEntry.request.method;
    case "type":
      return getContentType(rawEntry);
    case "size":
      return rawEntry.response ? String(parseSize(rawEntry.response)) : "0 B";
    case "time": {
      const response = rawEntry.response;
      if (response?.status === 0) {
        return "Pending";
      }
      const time = rawEntry.time ?? 0;
      return time === 0 && !response?._error
        ? "-"
        : String(parseTime(Number(time)));
    }
    default:
      return rawEntry[key as keyof Entry] != null
        ? String(rawEntry[key as keyof Entry])
        : "";
  }
};

export function NetworkCellValue({
  datakey,
  onClick = () => {},
  preparedEntry,
}: NetworkCellValueProps) {
  console.log("preparedEntry", preparedEntry);
  const formattedValue = useMemo(
    () => formatCellValue(datakey, preparedEntry),
    [datakey, preparedEntry]
  );

  // Get URL for tooltip (works with both raw and prepared entries)
  const url = useMemo(() => {
    if ("request" in preparedEntry && preparedEntry.request) {
      return getUrlInfo(preparedEntry.request.url).url;
    }
    return (
      preparedEntry.request.url ||
      preparedEntry._url ||
      preparedEntry._full_url ||
      ""
    );
  }, [preparedEntry]);

  const error = useMemo(() => {
    const response = preparedEntry.response;
    return response?._error || null;
  }, [preparedEntry]);
  const shouldDisplayTooltip = datakey === VIEWER_FIELDS.file.key || error;

  const getTitle = () => {
    if (datakey === VIEWER_FIELDS.file.key) {
      return url;
    }
    if (error) {
      return error;
    }

    return formattedValue;
  };

  const baseClasses = "text-h5 text-brand-primary-dark-gray truncate";

  if (!shouldDisplayTooltip) {
    return (
      <div
        data-testid={`network-cell-${datakey}`}
        className={classNames(baseClasses, datakey)}
      >
        {formattedValue}
      </div>
    );
  }

  return (
    <Tooltip delay={500} title={getTitle()}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        data-testid={`network-cell-${datakey}`}
        className={classNames(baseClasses, "cursor-pointer", datakey)}
        onClick={onClick}
      >
        {formattedValue}
      </div>
    </Tooltip>
  );
}
