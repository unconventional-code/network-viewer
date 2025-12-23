import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SectionInfo } from "./SectionInfo";

describe("SectionInfo", () => {
  const props = {
    eventKey: "general",
    data: {},
    component: () => <div>Test</div>,
  };

  it("renders without crashing", () => {
    const { container } = render(
      <SectionInfo
        eventKey={
          props.eventKey as
            | "general"
            | "requestHeaders"
            | "responseHeaders"
            | "requestPayload"
            | "queryString"
            | "formData"
        }
        data={props.data}
        component={props.component}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
