import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ImportHAR from "../../../../src/Components/Import/ImportHAR";
import NetworkProvider from "../../../../src/state/network/NetworkProvider";

describe("ImportHAR", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <ImportHAR />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
