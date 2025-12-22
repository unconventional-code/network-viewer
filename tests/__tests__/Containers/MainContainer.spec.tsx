import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import MainContainer from "../../../src/Containers/MainContainer";
import NetworkProvider from "../../../src/state/network/NetworkProvider";

describe("MainContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <MainContainer />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
