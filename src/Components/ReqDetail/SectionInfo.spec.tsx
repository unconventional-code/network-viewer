import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import SectionInfo from "./SectionInfo";

describe("SectionInfo", () => {
  const props = {
    eventKey: "general",
    data: {},
    component: () => <div>Test</div>,
  };

  it("renders without crashing", () => {
    const { container } = render(<SectionInfo {...props} />);
    expect(container).toMatchSnapshot();
  });
});
