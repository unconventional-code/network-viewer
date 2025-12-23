import { useMemo } from "react";

import { calcChartAttributes } from "../../utils";
import {
  TIME_CHART_DEFAULT_PROPS,
  TIME_CHART_SVG_PROPS,
} from "../../constants";
import { TimeChartTooltip } from "./TimeChartTooltip/TimeChartTooltip";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { Timings } from "har-format";

interface TimeChartProps {
  maxTime: number;
  timings: Timings;
}

export function TimeChart({ timings, maxTime }: TimeChartProps) {
  const chartAttributes = useMemo(
    () => calcChartAttributes(timings, maxTime, 0, 0, 0),
    [timings, maxTime]
  );

  return (
    <Tooltip
      delay={300}
      placement="left"
      title={<TimeChartTooltip timings={timings} />}
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
