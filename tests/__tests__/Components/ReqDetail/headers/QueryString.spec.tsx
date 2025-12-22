import React from "react";
import { render } from "@testing-library/react";

import QueryString from "../../../../../src/Components/ReqDetail/request/QueryString";

describe("QueryString", () => {
  const props = {
    data: {
      headers: {
        queryString: [{
          name: "foo",
          value: "bar",
        }],
      },
    },
    isPayloadTransformed: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<QueryString {...props} />);
    expect(container).toMatchSnapshot();
  });
});
