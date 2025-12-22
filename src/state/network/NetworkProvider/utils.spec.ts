import { it, describe, expect } from "vitest";
import { preparedMockData } from "../../../preparedData";
import {
  findIndexNearTimestamp,
  findIndexBeforeTimestamp,
  findIndexAfterTimestamp,
} from "./utils";

describe("NetworkProvider utils", () => {
  it("findIndexNearTimestamp", () => {
    expect(
      findIndexNearTimestamp(preparedMockData, 1571042841141)
    ).toMatchSnapshot();
  });

  it("findIndexBeforeTimestamp", () => {
    expect(
      findIndexBeforeTimestamp(preparedMockData, 1571042835643)
    ).toMatchSnapshot();
  });

  it("findIndexAfterTimestamp", () => {
    expect(
      findIndexAfterTimestamp(preparedMockData, 1571042835643)
    ).toMatchSnapshot();
  });
});
