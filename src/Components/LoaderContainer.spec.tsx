import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { LoaderContainer } from "./LoaderContainer";

describe("LoaderContainer", () => {
  const props = {
    show: true,
    text: "Loader text",
  };

  it("renders without crashing", () => {
    const { container } = render(
      <LoaderContainer {...props}>
        <p>Loaded</p>
      </LoaderContainer>
    );
    expect(container).toBeTruthy();
  });
});
