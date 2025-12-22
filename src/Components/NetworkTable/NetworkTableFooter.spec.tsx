import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NetworkTableFooter } from "./NetworkTableFooter";

describe("NetworkTableFooter", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <div>
        <NetworkTableFooter
          dataSummary={{
            totalRequests: 20,
            totalTransferredSize: 2034,
            totalUncompressedSize: 1035,
            timings: {
              onLoad: 999,
              DOMContentLoaded: 2000,
            },
          }}
          showAllInfo
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
