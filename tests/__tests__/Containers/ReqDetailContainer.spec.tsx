import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ReqDetailContainer from "../../../src/Containers/ReqDetailContainer";
import NetworkProvider from "../../../src/state/network/NetworkProvider";

describe("ReqDetailContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <ReqDetailContainer />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
