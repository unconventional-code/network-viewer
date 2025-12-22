import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SectionTitle
        eventKey="general"
        onClick={() => {}}
        onPayloadTransform={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
