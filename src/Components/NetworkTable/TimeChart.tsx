import React, { useMemo } from "react";

import { calcChartAttributes } from "../../utils";
import {
  TIME_CHART_DEFAULT_PROPS,
  TIME_CHART_SVG_PROPS,
} from "../../constants";
import TimeChartTooltip from "./TimeChartTooltip";
import Tooltip from "../Common/Tooltip/Tooltip";

interface TimeChartProps {
  maxTime: number;
  timings: Record<string, number>;
}

const TimeChart: React.FC<TimeChartProps> = ({ timings, maxTime }) => {
  const chartAttributes = useMemo(
    () => calcChartAttributes(timings, maxTime),
    [timings, maxTime]
  );

  return (
    <Tooltip
      delay={300}
      placement="left"
      title={<TimeChartTooltip data={timings} />}
    >
      <svg {...TIME_CHART_SVG_PROPS}>
        <g>
          {chartAttributes.map((chartProps) => (
            <rect
              key={chartProps.key}
              {...chartProps}
              {...TIME_CHART_DEFAULT_PROPS}
            />
          ))}
        </g>
      </svg>
    </Tooltip>
  );
};

export default TimeChart;
