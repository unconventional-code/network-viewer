import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import RequestHeaders from "./RequestHeaders";

describe("RequestHeaders", () => {
  const props = {
    data: {
      headers: {
        request: [
          {
            name: "foo",
            value: "bar",
          },
        ],
      },
    },
    isPayloadTransformed: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<RequestHeaders {...props} />);
    expect(container).toMatchSnapshot();
  });
});
