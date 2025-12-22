import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import FormData from "./FormData";

describe("FormData", () => {
  const props = {
    data: {
      headers: {
        postData: {
          params: [
            {
              name: "foo",
              value: "bar",
            },
          ],
        },
      },
    },
    isPayloadTransformed: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<FormData {...props} />);
    expect(container).toMatchSnapshot();
  });
});
