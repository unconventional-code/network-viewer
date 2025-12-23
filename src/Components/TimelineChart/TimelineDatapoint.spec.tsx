import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TimelineDatapoint } from "./TimelineDatapoint";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

describe("TimelineDatapoint", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <svg>
        <TimelineDatapoint
          cx={234}
          index={5}
          maxTime={17000}
          payload={
            {
              timings: {
                _blocked_queueing: 500,
                blocked: 0,
                comment: "",
                startTime: 1200,
                wait: 100,
                receive: 200,
                send: 300,
                ssl: 400,
                _queued: 600,
                dns: 700,
                connect: 800,
              },
            } as PreparedEntry
          }
        />
      </svg>
    );
    expect(container).toMatchSnapshot();
  });
});
