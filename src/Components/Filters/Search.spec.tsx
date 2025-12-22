import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Search } from "./Search";
import { NetworkProvider } from "../../state/network/NetworkProvider";

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
