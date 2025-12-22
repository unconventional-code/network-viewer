import { useEffect, useRef } from "react";
// @ts-ignore - react-window types issue
import { FixedSizeList } from "react-window";

import { useNetwork } from "../../state/network/Context";
import { NetworkTableRow } from "./NetworkTableRow";
import { TABLE_ENTRY_HEIGHT } from "../../constants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useTheme } from "../../state/theme/Context";
import { IconNetworkRequest } from "../../icons/IconNetworkRequest";

/* eslint no-underscore-dangle: 0 */

const virtualizedTableRow = ({ data, index, style }: any) => {
  const { listData, totalNetworkTime, handleReqSelect, selectedReqIndex } =
    data;
  const item = listData[index];

  return (
    <NetworkTableRow
      key={index}
      entry={item}
      maxTime={totalNetworkTime}
      onSelect={handleReqSelect}
      scrollHighlight={selectedReqIndex === item.index}
      style={style}
    />
  );
};

interface NetworkTableBodyProps {
  height: number;
}

export function NetworkTableBody({ height }: NetworkTableBodyProps) {
  const { state, actions, callbacks } = useNetwork();
  const { enableAutoScroll, NoDataPlaceholder } = useTheme();
  const numberOfNewEntries = state.numberOfNewEntries;
  const data = state.data;
  const actualData = state.actualData;
  const totalNetworkTime = state.totalNetworkTime;
  const selectedReqIndex = state.selectedReqIndex;

  const listRef = useRef(null);
  const { elementDims } = useResizeObserver(listRef);

  useEffect(() => {
    actions.setTableHeaderWidth(elementDims.width);
  }, [elementDims, actions]);

  useEffect(() => {
    if (enableAutoScroll && listRef?.current) {
      const { offsetHeight, scrollHeight } = listRef.current;
      let { scrollTop } = listRef.current;
      const needToScroll =
        scrollTop + offsetHeight + numberOfNewEntries * TABLE_ENTRY_HEIGHT >=
        scrollHeight;
      if (needToScroll) {
        scrollTop = scrollHeight;
      }
    }
  }, [data, listRef, numberOfNewEntries]);

  const handleReqSelect = (payload: any) => {
    if (selectedReqIndex === payload.index) {
      return;
    }

    actions.updateScrollToIndex(payload);
    actions.selectRequest(payload);
    callbacks.onRequestSelect?.(payload);
  };

  if (actualData.length === 0) {
    return (
      <div
        ref={listRef}
        className="flex flex-col items-center justify-center h-full w-full p-xxl"
      >
        <IconNetworkRequest className="w-16 h-16 fill-brand-primary-gray mb-m" />
        {NoDataPlaceholder}
        {!NoDataPlaceholder && (
          <>
            <span className="text-h4 font-semibold text-brand-primary-dark-gray mb-s">
              Recording network activity
            </span>
            <span className="text-base text-brand-primary-gray">
              Perform a request to see the network activity
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <FixedSizeList
        className="w-full"
        height={height}
        itemCount={data.length}
        itemData={{
          listData: data,
          totalNetworkTime,
          handleReqSelect,
          selectedReqIndex,
        }}
        itemSize={TABLE_ENTRY_HEIGHT}
        outerRef={listRef}
      >
        {virtualizedTableRow}
      </FixedSizeList>
    </>
  );
}
