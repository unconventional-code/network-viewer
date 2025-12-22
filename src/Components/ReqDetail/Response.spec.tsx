import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Response } from "./Response";

describe("Response", () => {
  it("renders without crashing for no content", () => {
    const { container } = render(<Response data={{}} />);
    expect(container).toMatchSnapshot();
  });

  it("renders without crashing for content", () => {
    const { container } = render(
      <Response data={{ body: '{"foo": "bar"}' }} />
    );
    expect(container).toMatchSnapshot();
  });
});
