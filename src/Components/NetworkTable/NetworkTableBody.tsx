import { useEffect, useRef } from "react";
import { FixedSizeList } from "react-window";

import { useNetwork } from "../../state/network/Context";
import { NetworkTableRow } from "./NetworkTableRow";
import { TABLE_ENTRY_HEIGHT } from "../../constants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useTheme } from "../../state/theme/Context";
import { IconNetworkRequest } from "../../icons/IconNetworkRequest";

/* eslint no-underscore-dangle: 0 */

const virtualizedTableRow = ({ data, index, style }) => {
  const { listData, totalNetworkTime, handleReqSelect, selectedReqIndex } =
    data;
  const item = listData.get(index);

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
  const numberOfNewEntries = state.get("numberOfNewEntries");
  const data = state.get("data");
  const actualData = state.get("actualData");
  const totalNetworkTime = state.get("totalNetworkTime");
  const selectedReqIndex = state.get("selectedReqIndex");

  const listRef = useRef(null);
  const { elementDims } = useResizeObserver(listRef);

  useEffect(() => {
    actions.setTableHeaderWidth(elementDims.width);
  }, [elementDims]);

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
  }, [data, listRef]);

  const handleReqSelect = (payload) => {
    if (selectedReqIndex === payload.index) {
      return;
    }

    actions.updateScrollToIndex(payload.index);
    actions.selectRequest(payload);
    callbacks.onRequestSelect(payload);
  };

  if (actualData.size === 0) {
    return (
      <div
        ref={listRef}
        className="flex flex-col items-center justify-center h-full w-full p-xxl"
      >
        <IconNetworkRequest className="w-16 h-16 fill-brand-primary-gray mb-m" />
        {NoDataPlaceholder && <NoDataPlaceholder />}
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
        itemCount={data.size}
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
