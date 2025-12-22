import { Entry } from "har-format";

export const findIndexNearTimestamp = (data: Entry[], exactTimestamp: number) =>
  data.reduce(
    (
      { value, index },
      { startedDateTime: currentValue, index: currentIndex }
    ) =>
      Math.abs(currentValue - exactTimestamp) < Math.abs(value - exactTimestamp)
        ? {
            value: currentValue,
            index: currentIndex,
          }
        : {
            value,
            index,
          },
    {
      value: 0,
      index: 0,
    }
  ).index;

export const findIndexBeforeTimestamp = (
  data: Entry[],
  exactTimestamp: number
) => {
  const resultIndex = data
    .reverse()
    .findIndex(({ startedDateTime }) => startedDateTime <= exactTimestamp);
  return resultIndex < 0 ? 0 : data.size - (resultIndex + 1);
};

export const findIndexAfterTimestamp = (
  data: Entry[],
  exactTimestamp: number
) => data.findIndex(({ startedDateTime }) => startedDateTime >= exactTimestamp);

export const findRequestIndex = ({ data, timestamp, position }) => {
  switch (position) {
    case "before":
      return findIndexBeforeTimestamp(data, timestamp);
    case "after":
      return findIndexAfterTimestamp(data, timestamp);
    case "near":
    default:
      return findIndexNearTimestamp(data, timestamp);
  }
};
