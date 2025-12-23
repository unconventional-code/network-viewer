// @ts-nocheck
// import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import { initialState as defaultState } from "./reducer";
import { NetworkProvider } from "./NetworkProvider";

describe("NetworkProvider", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <NetworkProvider>
        <div />
      </NetworkProvider>
    );

    expect(container).toMatchSnapshot();
  });

  describe("onDataLoaded", () => {
    it("does not call the callback", () => {
      const props = {
        onDataLoaded: vi.fn(),
      };

      render(
        <NetworkProvider {...props}>
          <div />
        </NetworkProvider>
      );

      expect(props.onDataLoaded).not.toHaveBeenCalled();
    });

    describe("when gets actualData", () => {
      it("calls the callback", () => {
        const actualData = ["entry"];
        const initialState = defaultState.set("actualData", actualData);
        const props = {
          initialState,
          onDataLoaded: vi.fn(),
        };

        render(
          <NetworkProvider {...props}>
            <div />
          </NetworkProvider>
        );

        expect(props.onDataLoaded).toHaveBeenCalledWith(actualData);
      });
    });
  });

  describe("onDataError", () => {
    it("does not call the callback", () => {
      const props = {
        onDataError: vi.fn(),
      };

      render(
        <NetworkProvider {...props}>
          <div />
        </NetworkProvider>
      );

      expect(props.onDataError).not.toHaveBeenCalled();
    });

    describe("when gets error", () => {
      it("calls the callback", () => {
        const error = "Something failed!";
        const initialState = defaultState.set("error", error);
        const props = {
          initialState,
          onDataError: vi.fn(),
        };

        render(
          <NetworkProvider {...props}>
            <div />
          </NetworkProvider>
        );

        expect(props.onDataError).toHaveBeenCalledWith(error);
      });
    });
  });
});
