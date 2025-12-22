import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TimelineChart } from "./TimelineChart";

describe("TimelineChart", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TimelineChart chartData={[]} totalNetworkTime={17000} />
    );
    expect(container).toMatchSnapshot();
  });
});
