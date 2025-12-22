import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImportHAR } from "./ImportHAR";
import { NetworkProvider } from "../../state/network/NetworkProvider/NetworkProvider";

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
