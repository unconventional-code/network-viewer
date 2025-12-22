import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { FilterContainer } from "./FilterContainer";
import { NetworkProvider } from "../state/network/NetworkProvider/NetworkProvider";

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
