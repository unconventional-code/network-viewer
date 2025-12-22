import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Search from "../../../../src/Components/Filters/Search";
import NetworkProvider from "../../../../src/state/network/NetworkProvider";

describe("Search", () => {
  const params = {
    name: "url",
    value: "test",
  };

  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <Search {...params} />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
