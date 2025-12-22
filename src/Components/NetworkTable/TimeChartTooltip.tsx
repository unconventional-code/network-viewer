import React, { useMemo } from "react";
import classNames from "classnames";

import { TIMINGS } from "../../constants";
import { prepareTooltipData } from "../../utils";

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
];

interface TimeChartTooltipProps {
  data: Record<string, number>;
}

const TimeChartTooltip: React.FC<TimeChartTooltipProps> = ({ data }) => {
  const tooltipData = useMemo(
    () => (!data ? null : prepareTooltipData(data)),
    [data]
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
                      "p-0 border-0 bg-transparent font-normal text-left font-bold px-m relative",
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
                            (dataKey) => tooltipData[dataKey]
                          )
                        ]
                      : tooltipData[TIMINGS[key].dataKey]}
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
};

export default TimeChartTooltip;
