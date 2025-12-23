import { useMemo } from "react";

import { calcChartAttributes } from "../../utils";
import { TIMELINE_DATA_POINT_HEIGHT } from "../../constants";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

interface TimelineDatapointProps {
  preparedEntry?: PreparedEntry | null;
  maxTime: number;
  cx?: number;
  cy?: number | null;
  index?: number;
}

export function TimelineDatapoint({
  preparedEntry = null,
  maxTime,
  cx = 0,
  cy = null,
  index = 0,
}: TimelineDatapointProps) {
  if (!preparedEntry) {
    return null;
  }

  const chartAttributes = useMemo(
    () => calcChartAttributes(preparedEntry, maxTime, cx, index, cy),
    [preparedEntry, maxTime, cx, index, cy]
  );

  return (
    <g>
      {chartAttributes.map((chartProps) => (
        <rect
          {...chartProps}
          key={chartProps.key}
          height={TIMELINE_DATA_POINT_HEIGHT}
        />
      ))}
    </g>
  );
}
