import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import RequestPayload from "../../../../../src/Components/ReqDetail/request/RequestPayload";

describe("RequestPayload", () => {
  const props = {
    data: {
      headers: {
        postData: {
          text: "{ 'name': 'foo' }",
        },
      },
    },
    isPayloadTransformed: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<RequestPayload {...props} />);
    expect(container).toMatchSnapshot();
  });
});
