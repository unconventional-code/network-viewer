import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { TimelineDatapoint } from "./TimelineDatapoint";
import { formatTime } from "../../utils";
import { TimelineTooltip } from "./TimelineTooltip";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

interface TimelineChartProps {
  chartData: PreparedEntry[];
  totalNetworkTime: number;
}

export function TimelineChart({
  chartData,
  totalNetworkTime,
}: TimelineChartProps) {
  return (
    <div
      id="timeline-chart"
      data-testid="timeline-chart"
      className="w-full h-[100px] p-m"
    >
      <ResponsiveContainer height={100} width="100%">
        <ScatterChart>
          <XAxis
            axisLine={false}
            dataKey="timings.startTime"
            domain={[0, totalNetworkTime]}
            interval="preserveStartEnd"
            orientation="top"
            tickCount={10}
            tickFormatter={formatTime}
            tickLine={false}
            type="number"
          />
          <YAxis dataKey="index" domain={["min", "max"]} hide reversed />
          <Tooltip content={<TimelineTooltip />} />
          <Scatter
            data={chartData}
            shape={<TimelineDatapoint maxTime={totalNetworkTime} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
