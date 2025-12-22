import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NetworkTableHeader from "../../../../src/Components/NetworkTable/NetworkTableHeader";
import NetworkProvider from "../../../../src/state/network/NetworkProvider";

describe("NetworkTableHeader", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <NetworkTableHeader />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
