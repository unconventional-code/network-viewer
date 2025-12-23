import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NetworkTableFooter } from "./NetworkTableFooter";
import { NetworkProvider } from "../../state/network/NetworkProvider/NetworkProvider";
import { EMPTY_NETWORK_HAR } from "../../constants";

describe("NetworkTableFooter", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider data={EMPTY_NETWORK_HAR}>
        <NetworkTableFooter showAllInfo />
      </NetworkProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
