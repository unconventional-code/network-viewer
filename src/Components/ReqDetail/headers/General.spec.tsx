import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import General from "./General";

describe("General", () => {
  const props = {
    data: {},
  };

  it("renders without crashing", () => {
    const { container } = render(<General {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("renders intercept error", () => {
    const { container } = render(<General data={{ error: "ERR_TIMED_OUT" }} />);
    expect(container).toMatchSnapshot();
  });
});
