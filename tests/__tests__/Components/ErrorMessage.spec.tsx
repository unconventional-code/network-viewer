import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ErrorMessage from "../../../src/Components/ErrorMessage";

describe("ErrorMessage", () => {
  const props = {
    title: "Error message title",
  };

  it("renders without crashing", () => {
    const { container } = render(<ErrorMessage {...props} />);
    expect(container).toMatchSnapshot();
  });
});
