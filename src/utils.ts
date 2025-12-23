import { Content, Entry, Header, Response, Timings } from "har-format";
import {
  TIMELINE_DATA_POINT_HEIGHT,
  TIMINGS,
  VIEWER_FIELD_FILE,
  VIEWER_FIELDS,
  VIEWER_FIELDS_HIDE_WATERFALL,
} from "./constants";
import { PreparedEntry } from "./state/network/NetworkProvider/types";

/* eslint no-underscore-dangle: 0 */

/**
 * Pure utility functions - can be used anywhere
 */

export const roundOff = (value: number, decimal = 1) => {
  const base = 10 ** decimal;
  return Math.round(value * base) / base;
};

/**
 * Pure formatting utility - works on raw numbers
 */
export const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${roundOff(bytes)} B`;
  }
  if (bytes < 1024 ** 2) {
    return `${roundOff(bytes / 1024)} KB`;
  }
  return `${roundOff(bytes / 1024 ** 2)} MB`;
};

/**
 * Pure formatting utility - works on raw numbers
 */
export const formatTime = (time: number) => {
  if (time < 1000) {
    return `${Math.round(time)}ms`;
  }
  if (time < 60000) {
    return `${Math.ceil(time / 10) / 100}s`;
  }
  return `${(Math.ceil(time / 60000) * 100) / 100}m`;
};

/**
 * Works on raw URL string - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getUrlInfo = (url: string) => {
  // If there's an invalid URL (resource identifier, etc.) the constructor would throw an exception.
  // Return a 'placeholder' object with default values in the event the passed value cannot be
  // parsed.
  try {
    const urlInfo = new URL(url);
    const pathSplit = urlInfo.pathname.split("/");
    const fileName =
      (pathSplit[pathSplit.length - 1].trim()
        ? pathSplit[pathSplit.length - 1]
        : pathSplit[pathSplit.length - 2]) + urlInfo.search;

    return {
      domain: urlInfo.host,
      filename: fileName || urlInfo.href,
      url: urlInfo.href,
    };
  } catch (er) {
    return {
      domain: "N/A",
      filename: url ?? "N/A",
      url,
    };
  }
};

/**
 * Works on raw Entry.response - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const parseSize = ({
  bodySize,
  _transferSize,
  headers,
  content,
}: Response) => {
  if (content && content.size) {
    return formatSize(content.size);
  }
  if (_transferSize && _transferSize > -1) {
    return formatSize(_transferSize);
  }
  if (bodySize > -1) {
    return formatSize(bodySize);
  }
  const contentInfo = headers.find(({ name }) =>
    ["content-length", "Content-Length"].includes(name)
  );
  if (!contentInfo) {
    return formatSize(0);
  }

  return formatSize(Number(contentInfo.value));
};

/**
 * Works on raw Entry - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getContentType = (entry: Entry | PreparedEntry) => {
  if (entry._resourceType) {
    return entry._resourceType.toLowerCase();
  }

  if ("response" in entry && entry.response) {
    const headers: Header[] = entry.response.headers;
    const contentInfo = headers.find(({ name }) =>
      ["content-type", "Content-Type"].includes(name)
    );
    if (!contentInfo) {
      return "";
    }
    const type = contentInfo.value.split(";")[0].split("/");
    return type.length > 1 ? type[1] : type[0];
  }
  return "text/plain";
};

/**
 * Works on raw Entry - transforms timings for prepared data
 * NOTE: This is used in prepareViewerData for upfront calculation
 * Consider moving to component if timings are only needed for display
 */
export const getTimings = (
  { startedDateTime, timings }: Entry,
  firstEntryTime: number | string
) => ({
  ...timings,
  startTime:
    new Date(startedDateTime).getTime() - new Date(firstEntryTime).getTime(),
});

/**
 * Works on raw Entry.response.content - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getContent = ({ mimeType, text }: Content) => {
  if (mimeType === "application/json") {
    let parsedJson: string | null = null;
    try {
      parsedJson = JSON.stringify(JSON.parse(text || ""), null, 2);
    } catch (err) {
      parsedJson = text || null;
    }
    return parsedJson;
  }

  if (text) {
    return text;
  }
  return null;
};

/**
 * Works on raw Entry.response - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getEntryTransferredSize = ({ response }: Entry) => {
  const { bodySize, _transferSize } = response;
  if (_transferSize && _transferSize > -1) {
    return _transferSize;
  }

  if (bodySize > -1) {
    return bodySize;
  }
  return -1;
};

/**
 * Works on raw Entry.response - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getEntryUncompressedSize = ({ response }: Entry) => {
  const {
    bodySize,
    _transferSize,
    content: { size },
  } = response;
  if (size > 0) {
    return size;
  }
  if (_transferSize && _transferSize > -1) {
    return _transferSize;
  }
  if (bodySize > -1) {
    return bodySize;
  }
  return -1;
};

/**
 * Works on raw Entry[] - can be called on-demand
 * Used for summary calculations (e.g., in NetworkTableFooter)
 */
export const calculateFinishTime = (data: PreparedEntry[]) => {
  const finishTimes = data.map(({ timings }) =>
    Object.values(timings).reduce(
      (acc, durationInMS) => acc + (durationInMS > -1 ? durationInMS : 0),
      0
    )
  );
  return Math.max(...finishTimes);
};

/**
 * Pure utility function for sorting headers
 */
export const sortHeaders = (current: Header, next: Header) => {
  if (current.name < next.name) {
    return -1;
  }
  return current.name > next.name ? 1 : 0;
};

/**
 * Works on raw Entry - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getHeaders = (entry: Entry) => {
  const requestHeaders = [...entry.request.headers];
  const responseHeaders = [...entry.response.headers];
  return {
    request: requestHeaders.sort(sortHeaders),
    response: responseHeaders.sort(sortHeaders),
    queryString: entry.request.queryString,
    postData: entry.request.postData,
  };
};

/**
 * Works on raw Entry - can be called on-demand
 * Used for summary calculations
 */
export const getTotalTimeOfEntry = ({
  startedDateTime,
  time,
  timings,
}: Entry) =>
  new Date(startedDateTime).getTime() +
  time +
  (timings?._blocked_queueing || timings?._queued || 0);

/**
 * Works on raw Entry.response - can be called on-demand
 * Used by components for on-the-fly computation
 */
export const getInterceptError = ({ response }: Entry) =>
  response && response._error ? response._error : null;

/**
 * ⚠️ WORKS ON PREPARED ENTRIES - Requires prepareViewerData to run first
 * Sorts prepared entries for table display
 */
export const sortBy = (data: any[], key: string, isAsc = true) => {
  const direction = isAsc ? 1 : -1;
  return [...data].sort((prev, next) => {
    const entryA = prev[key];
    const entryB = next[key];

    if (entryA < entryB) return -direction;
    if (entryA > entryB) return direction;
    return 0;
  });
};

/**
 * Pure formatting utility - works on raw numbers
 * Used by components for on-the-fly formatting
 */
export const parseTime = (time: number) => {
  if (!time) {
    return time;
  }

  if (time > 1000) {
    return `${(time / 1000).toFixed(2)} s`;
  }

  return `${time.toFixed(2)} ms`;
};

/**
 * Pure utility function - returns field configuration based on view mode
 */
export const getViewerFields = (
  showReqDetail: boolean,
  showWaterfall: boolean
) => {
  if (showReqDetail) {
    return VIEWER_FIELD_FILE;
  }

  return showWaterfall ? VIEWER_FIELDS : VIEWER_FIELDS_HIDE_WATERFALL;
};

// Component-specific utility: calculates chart attributes from raw timings
// Computed on-the-fly when chart is rendered
export const calcChartAttributes = (
  preparedEntry: PreparedEntry,
  maxTime: number,
  _cx: number,
  index: number,
  cy: number | null = null,
  firstEntryTime?: number | string
) => {
  // Calculate startTime if we have entry and firstEntryTime
  let startTime = preparedEntry.timings.startTime;
  if (startTime === undefined && preparedEntry && firstEntryTime) {
    startTime =
      new Date(preparedEntry.startedDateTime).getTime() -
      new Date(firstEntryTime).getTime();
  } else if (startTime === undefined) {
    startTime = 0;
  }

  const startTimePercent = (startTime / maxTime) * 100;
  let previousX = 0;
  let previousWidth = 0;
  const chartAttributes: {
    width: string;
    y: number;
    x: string;
    fill: string;
    key: string;
  }[] = [];

  (Object.keys(TIMINGS) as Array<keyof typeof TIMINGS>).forEach((key) => {
    const timingInfo = TIMINGS[key];
    const dataKey = Array.isArray(timingInfo.dataKey)
      ? timingInfo.dataKey.find(
          (dKey) => preparedEntry.timings[dKey as keyof Timings]
        )
      : timingInfo.dataKey;
    const value = preparedEntry.timings[dataKey as keyof Timings] as number;
    if (!value || value <= 0) {
      return;
    }

    previousX += !previousWidth ? startTimePercent : previousWidth;
    previousWidth = value > 0 ? (value / maxTime) * 100 : 0;

    chartAttributes.push({
      width: `${previousWidth}%`,
      y: index ? (index % 10) * (TIMELINE_DATA_POINT_HEIGHT + 1) + 40 : cy || 0,
      x: `${previousX}%`,
      fill: timingInfo.fill,
      key,
    });
  });

  return chartAttributes;
};
