import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import FilterContainer from "../../../src/Containers/FilterContainer";
import NetworkProvider from "../../../src/state/network/NetworkProvider";

describe("FilterContainer", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <FilterContainer />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
