import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  const props = {
    eventKey: "general",
    onClick: () => {},
    onPayloadTransform: () => {},
  };

  it("renders without crashing", () => {
    const { container } = render(<SectionTitle {...props} />);
    expect(container).toMatchSnapshot();
  });
});
