import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ResponseHeaders from "../../../../../src/Components/ReqDetail/headers/ResponseHeaders";

describe("ResponseHeaders", () => {
  const props = {
    data: {
      headers: {
        response: [
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
    const { container } = render(<ResponseHeaders {...props} />);
    expect(container).toMatchSnapshot();
  });
});
