interface EntryWithIndex {
  startedDateTime: number;
  index: number;
}

export const findIndexNearTimestamp = (
  data: EntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  return data.reduce(
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
      value: data[0].startedDateTime,
      index: data[0].index,
    }
  ).index;
};

export const findIndexBeforeTimestamp = (
  data: EntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  const reversed = [...data].reverse();
  const resultIndex = reversed.findIndex(
    ({ startedDateTime }) => startedDateTime <= exactTimestamp
  );
  return resultIndex < 0 ? null : data.length - (resultIndex + 1);
};

export const findIndexAfterTimestamp = (
  data: EntryWithIndex[],
  exactTimestamp: number
): number | null => {
  if (data.length === 0) return null;

  const index = data.findIndex(
    ({ startedDateTime }) => startedDateTime >= exactTimestamp
  );
  return index < 0 ? null : index;
};

export const findRequestIndex = ({
  data,
  timestamp,
  position,
}: {
  data: EntryWithIndex[];
  timestamp: number;
  position: "before" | "after" | "near";
}): number | null => {
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
