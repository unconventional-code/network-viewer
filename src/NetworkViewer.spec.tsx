import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { NetworkViewer } from "./NetworkViewer";

describe("NetworkViewer", () => {
  it("renders without crashing", () => {
    const { container } = render(<NetworkViewer />);
    expect(container).toMatchSnapshot();
  });
});
