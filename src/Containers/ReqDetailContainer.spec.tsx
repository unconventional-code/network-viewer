import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ReqDetailContainer } from "./ReqDetailContainer";
import { NetworkProvider } from "../state/network/NetworkProvider/NetworkProvider";

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
