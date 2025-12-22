import { formatTime } from "../../utils";

interface TimelineTooltipProps {
  payload?: Array<{
    payload: { filename: string; timings: { startTime: number } };
  }> | null;
}

export function TimelineTooltip({ payload = null }: TimelineTooltipProps) {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white-39 text-white-100 text-small px-xs-s py-xs rounded-base">
      <div className="font-semibold mb-xs">{payload[0].payload.filename}</div>
      <div>
        {`Started at: ${formatTime(payload[0].payload.timings.startTime)}`}
      </div>
    </div>
  );
}
