import { useMemo } from "react";

import {
  TIME_CHART_DEFAULT_PROPS,
  TIME_CHART_SVG_PROPS,
} from "../../constants";
import { TimeChartTooltip } from "./TimeChartTooltip/TimeChartTooltip";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { calcChartAttributes } from "../../utils";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

interface TimeChartProps {
  maxTime: number;
  preparedEntry: PreparedEntry; // Timings may have startTime if from prepared entry
  firstEntryTime?: number | string; // Optional first entry time for relative timing
}

export function TimeChart({
  maxTime,
  preparedEntry,
  firstEntryTime,
}: TimeChartProps) {
  const chartAttributes = useMemo(
    () => calcChartAttributes(preparedEntry, maxTime, 0, 0, 0, firstEntryTime),
    [preparedEntry, maxTime, firstEntryTime]
  );

  return (
    <Tooltip
      delay={300}
      placement="left"
      title={
        <TimeChartTooltip
          preparedEntry={preparedEntry}
          firstEntryTime={firstEntryTime}
        />
      }
    >
      <svg {...TIME_CHART_SVG_PROPS}>
        <g>
          {chartAttributes.map((chartProps) => (
            <rect
              {...chartProps}
              key={chartProps.key}
              {...TIME_CHART_DEFAULT_PROPS}
            />
          ))}
        </g>
      </svg>
    </Tooltip>
  );
}
