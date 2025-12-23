import { Entry } from "har-format";
import { getTotalTimeOfEntry } from "../../../utils";
import { getUrlInfo } from "../../../utils";
import { getEntryTransferredSize } from "../../../utils";
import { getEntryUncompressedSize } from "../../../utils";
import { getContentType } from "../../../utils";
import { getTimings } from "../../../utils";
import { getContent } from "../../../utils";
import { getHeaders } from "../../../utils";
import { getInterceptError } from "../../../utils";
import { calculateFinishTime } from "../../../utils";
import { parseSize } from "../../../utils";
import { PreparedEntry } from "./types";

interface PreparedEntryWithIndex {
  startedDateTimeMs: number;
  index: number;
}

export const findIndexNearTimestamp = (
  data: PreparedEntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  return data.reduce(
    (
      { value, index },
      { startedDateTimeMs: currentValue, index: currentIndex }
    ) =>
      Math.abs(currentValue - exactTimestamp) < Math.abs(value - exactTimestamp)
        ? {
            value: currentValue,
            index: currentIndex,
          }
        : {
            value,
            index,
          },
    {
      value: data[0].startedDateTimeMs,
      index: data[0].index,
    }
  ).index;
};

export const findIndexBeforeTimestamp = (
  data: PreparedEntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  const reversed = [...data].reverse();
  const resultIndex = reversed.findIndex(
    ({ startedDateTimeMs }) => startedDateTimeMs <= exactTimestamp
  );
  return resultIndex < 0 ? null : data.length - (resultIndex + 1);
};

export const findIndexAfterTimestamp = (
  data: PreparedEntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  const index = data.findIndex(
    ({ startedDateTimeMs }) => startedDateTimeMs >= exactTimestamp
  );
  return index < 0 ? null : index;
};

export const findRequestIndex = ({
  data,
  timestamp,
  position,
}: {
  data: PreparedEntryWithIndex[];
  timestamp: number;
  position: "before" | "after" | "near";
}): number | null => {
  switch (position) {
    case "before":
      return findIndexBeforeTimestamp(data, timestamp);
    case "after":
      return findIndexAfterTimestamp(data, timestamp);
    case "near":
    default:
      return findIndexNearTimestamp(data, timestamp);
  }
};

/**
 * ⚠️ CALCULATED UPFRONT - Processes all entries at once
 * This function transforms raw HAR entries into prepared entries with enriched data.
 * Used for filtering and sorting operations.
 *
 * NOTE: For large datasets (100k+ rows), consider computing presentation values
 * on-the-fly in components instead of here to improve performance.
 */
export const prepareViewerData = (entries: Entry[]) => {
  if (!entries.length) {
    return {
      totalNetworkTime: 0,
      data: [],
      totalRequests: 0,
      totalTransferredSize: 0,
      totalUncompressedSize: 0,
      finishTime: 0,
    };
  }

  const firstEntryTime = entries[0].startedDateTime;
  let endTime = getTotalTimeOfEntry(entries[entries.length - 1]);
  let totalTransferredSize = 0;
  let totalUncompressedSize = 0;
  const data = entries
    .filter((entry) => entry.response && getUrlInfo(entry.request.url).domain)
    .map((entry, index): PreparedEntry => {
      totalTransferredSize += getEntryTransferredSize(entry);
      totalUncompressedSize += getEntryUncompressedSize(entry);
      const lastTimeOfEntry = getTotalTimeOfEntry(entry);
      endTime = endTime < lastTimeOfEntry ? lastTimeOfEntry : endTime;
      return {
        ...entry,
        index,
        status: entry.response.status,
        method: entry.request.method,
        size: parseSize(entry.response),
        startedDateTimeMs: new Date(entry.startedDateTime).getTime(),
        type: getContentType(entry),
        timings: getTimings(entry, firstEntryTime),
        body: getContent(entry.response.content),
        time: entry.time,
        serverIPAddress: entry.serverIPAddress || ":80",
        headers: getHeaders(entry),
        transferredSize: getEntryTransferredSize(entry),
        uncompressedSize: getEntryUncompressedSize(entry),
        error: getInterceptError(entry),
        ...getUrlInfo(entry.request.url),
      };
    });

  const totalRequests = data.length;
  const totalNetworkTime = endTime - new Date(firstEntryTime).getTime();
  const finishTime = calculateFinishTime(data);
  return {
    totalNetworkTime,
    data,
    totalRequests,
    totalTransferredSize,
    totalUncompressedSize,
    finishTime,
  };
};
