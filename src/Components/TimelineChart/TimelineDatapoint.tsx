import React, { useMemo } from "react";

import { calcChartAttributes } from "../../utils";
import { TIMELINE_DATA_POINT_HEIGHT } from "../../constants";

interface TimelineDatapointProps {
  payload?: any | null;
  maxTime: number;
  cx?: number;
  cy?: number | null;
  index?: number;
}

const TimelineDatapoint: React.FC<TimelineDatapointProps> = ({
  payload = null,
  maxTime,
  cx = 0,
  cy = null,
  index = 0,
}) => {
  if (!payload) {
    return null;
  }

  const { timings } = payload;
  const chartAttributes = useMemo(
    () => calcChartAttributes(timings, maxTime, cx, index, cy),
    [timings, maxTime, cx, index, cy]
  );

  return (
    <g>
      {chartAttributes.map((chartProps) => (
        <rect
          key={chartProps.key}
          {...chartProps}
          height={TIMELINE_DATA_POINT_HEIGHT}
        />
      ))}
    </g>
  );
};

export default TimelineDatapoint;
