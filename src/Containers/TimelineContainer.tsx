import { useNetwork } from "../state/network/Context";
import { TimelineChart } from "../Components/TimelineChart/TimelineChart";

export function TimelineContainer() {
  const { state } = useNetwork();
  const data = state.data;
  const actualData = state.actualData;
  const error = state.error;
  const totalNetworkTime = state.totalNetworkTime;
  if (error || !actualData.length) {
    return null;
  }
  return (
    <section
      id="timeline-container"
      data-testid="timeline-container"
      className="w-full border-b border-border-color bg-white-100"
    >
      <TimelineChart
        chartData={data}
        totalNetworkTime={totalNetworkTime || 0}
      />
    </section>
  );
}
