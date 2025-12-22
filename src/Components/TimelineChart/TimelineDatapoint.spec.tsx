import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import TimelineDatapoint from "./TimelineDatapoint";

describe("TimelineDatapoint", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <svg>
        <TimelineDatapoint
          cx={234}
          index={5}
          maxTime={17000}
          payload={{
            timings: {
              startTime: 1200,
            },
          }}
        />
      </svg>
    );
    expect(container).toMatchSnapshot();
  });
});
