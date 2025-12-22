import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TimelineContainer } from "./TimelineContainer";
import { NetworkProvider } from "../state/network/NetworkProvider/NetworkProvider";

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
