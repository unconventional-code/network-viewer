import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NetworkTableHeader } from "./NetworkTableHeader";
import { NetworkProvider } from "../../state/network/NetworkProvider";

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
