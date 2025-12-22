import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import NetworkTableContainer from "../../../src/Containers/NetworkTableContainer";
import NetworkProvider from "../../../src/state/network/NetworkProvider";

describe("NetworkTableContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <NetworkTableContainer />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
