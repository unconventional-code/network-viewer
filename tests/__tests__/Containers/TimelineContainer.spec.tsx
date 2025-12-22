import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import TimelineContainer from "../../../src/Containers/TimelineContainer";
import NetworkProvider from "../../../src/state/network/NetworkProvider";

describe("TimelineContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <TimelineContainer />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
