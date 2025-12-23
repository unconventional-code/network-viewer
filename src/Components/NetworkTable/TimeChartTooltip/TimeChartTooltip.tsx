import { useMemo } from "react";
import classNames from "classnames";

import { TIMINGS } from "../../../constants";
import { parseTime } from "../../../utils";
import { PreparedEntry } from "../../../state/network/NetworkProvider/types";

const DETAIL = [
  {
    title: "Resource Scheduling",
    category: ["queueing"],
  },
  {
    title: "Connection Start",
    category: ["blocked", "dns", "ssl", "connect"],
  },
  {
    title: "Request/Response",
    category: ["send", "wait", "receive"],
  },
] as const;

interface TimeChartTooltipProps {
  preparedEntry: PreparedEntry; // Optional raw entry for computing startTime
  firstEntryTime?: number | string; // Optional first entry time for relative timing
}

// Component-specific utility: prepares tooltip data from raw timings
// Computed on-the-fly when tooltip is shown
export const prepareTooltipData = (
  preparedEntry: PreparedEntry,
  firstEntryTime?: number | string
): Record<string, string> | null => {
  if (!preparedEntry.timings) return null;

  // Calculate startTime if we have entry and firstEntryTime
  let startTime = preparedEntry.timings.startTime;
  if (startTime === undefined && preparedEntry && firstEntryTime) {
    startTime =
      new Date(preparedEntry.startedDateTime).getTime() -
      new Date(firstEntryTime).getTime();
  } else if (startTime === undefined) {
    startTime = 0;
  }

  // Calculate total time excluding special fields
  const calcTotalTime = (data: PreparedEntry["timings"]) =>
    Object.keys(data)
      .filter(
        (key) => !["_blocked_queueing", "_queued", "startTime"].includes(key)
      )
      .reduce((acc, key) => {
        const value = data[key as keyof PreparedEntry["timings"]];
        return acc + (typeof value === "number" && value > 0 ? value : 0);
      }, 0);

  const queuedAt: string = String(parseTime(startTime));
  const blockedOrQueued =
    preparedEntry.timings._blocked_queueing ??
    preparedEntry.timings._queued ??
    0;
  const startedAt: string = String(parseTime(startTime + blockedOrQueued));
  const totalTime: string = String(
    parseTime(calcTotalTime(preparedEntry.timings))
  );

  const result: Record<string, string> = {
    queuedAt,
    startedAt,
    totalTime,
  };

  // Add all timing fields
  Object.keys(preparedEntry.timings).forEach((key) => {
    const value = preparedEntry.timings[key as keyof PreparedEntry["timings"]];
    if (typeof value === "number" && value > 0) {
      result[key] = String(parseTime(value));
    }
  });

  return result;
};

export function TimeChartTooltip({
  preparedEntry,
  firstEntryTime,
}: TimeChartTooltipProps) {
  const tooltipData = useMemo(
    () => prepareTooltipData(preparedEntry, firstEntryTime),
    [preparedEntry, firstEntryTime]
  );

  if (!tooltipData) {
    return null;
  }

  const getTimingColor = (key: string) => {
    const colorMap: Record<string, string> = {
      blocked: "text-time-blocked",
      dns: "text-time-dns",
      ssl: "text-time-ssl",
      connect: "text-time-connect",
      send: "text-time-send",
      wait: "text-time-wait",
      receive: "text-time-receive",
      queueing: "text-time-queueing",
    };
    return colorMap[key] || "";
  };

  const getTimingBgColor = (key: string) => {
    const colorMap: Record<string, string> = {
      blocked: "bg-time-blocked",
      dns: "bg-time-dns",
      ssl: "bg-time-ssl",
      connect: "bg-time-connect",
      send: "bg-time-send",
      wait: "bg-time-wait",
      receive: "bg-time-receive",
      queueing: "bg-time-queueing",
    };
    return colorMap[key] || "";
  };

  return (
    <div className="block w-[280px] h-auto bg-white-100 text-white-33 text-small px-xs-s opacity-100">
      <section className="mb-m">
        <p className="m-0">{`Queued at ${tooltipData.queuedAt}`}</p>
        <p className="m-0">{`Started at ${tooltipData.startedAt}`}</p>
      </section>
      {DETAIL.map(({ title, category }) => (
        <section key={title} className="mb-m">
          <table className="border-0 w-full">
            <thead>
              <tr>
                <th className="p-0 border-0 bg-transparent font-normal text-left pb-xs-s text-white-50">
                  {title}
                </th>
                <th className="p-0 border-0 bg-transparent font-normal text-right pb-xs-s text-white-50">
                  DURATION
                </th>
              </tr>
            </thead>
            <tbody>
              {category.map((key) => (
                <tr key={key} className="odd:bg-white-100">
                  <td
                    className={classNames(
                      "p-0 border-0 bg-transparent font-normal text-left px-m relative",
                      getTimingColor(key)
                    )}
                  >
                    <span
                      className={classNames(
                        "absolute left-0 top-xs w-xs-s h-xs-s",
                        getTimingBgColor(key)
                      )}
                    />
                    {TIMINGS[key].name}
                  </td>
                  <td className="p-0 border-0 bg-transparent font-normal text-right">
                    {Array.isArray(TIMINGS[key].dataKey)
                      ? tooltipData[
                          TIMINGS[key].dataKey.find(
                            (dataKey) =>
                              tooltipData[dataKey as keyof typeof tooltipData]
                          ) as keyof typeof tooltipData
                        ]
                      : tooltipData[
                          TIMINGS[key].dataKey as keyof typeof tooltipData
                        ]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <section className="mb-m">
        <p className="m-0">{`Total time ${tooltipData.totalTime}`}</p>
      </section>
    </div>
  );
}
