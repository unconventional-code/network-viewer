import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Tabs from "./Tabs";
import Tab from "./Tab";

describe("Tabs", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Tabs>
        <Tab key="foo" name="Foo" eventKey="foo">
          <p>Foo Bar</p>
        </Tab>
      </Tabs>
    );
    expect(container).toMatchSnapshot();
  });
});
