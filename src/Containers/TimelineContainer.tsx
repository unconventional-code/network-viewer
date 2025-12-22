import React from "react";

import { useNetwork } from "../state/network/Context";
import TimelineChart from "../Components/TimelineChart/TimelineChart";

const TimelineContainer: React.FC = () => {
  const { state } = useNetwork();
  const data = state.get("data");
  const actualData = state.get("actualData");
  const error = state.get("error");
  const totalNetworkTime = state.get("totalNetworkTime");
  if (error || !actualData.size) {
    return null;
  }
  return (
    <section className="w-full border-b border-border-color bg-white-100">
      <TimelineChart
        chartData={data.toArray()}
        totalNetworkTime={totalNetworkTime || 0}
      />
    </section>
  );
};

export default TimelineContainer;
