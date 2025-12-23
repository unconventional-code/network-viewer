import { useEffect, useRef, useCallback, CSSProperties } from "react";
import { List, ListImperativeAPI } from "react-window";

import { useNetwork } from "../../state/network/Context";
import { NetworkTableRow } from "./NetworkTableRow";
import { TABLE_ENTRY_HEIGHT } from "../../constants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useTheme } from "../../state/theme/Context";
import { IconNetworkRequest } from "../../icons/IconNetworkRequest";
import { PreparedEntry } from "../../state/network/NetworkProvider/types";

/* eslint no-underscore-dangle: 0 */

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

  const listRef = useRef<ListImperativeAPI>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const setTableHeaderWidthRef = useRef(actions.setTableHeaderWidth);

  // Keep ref in sync with latest action
  useEffect(() => {
    setTableHeaderWidthRef.current = actions.setTableHeaderWidth;
  }, [actions.setTableHeaderWidth]);

  // Update elementRef when listRef's element changes
  useEffect(() => {
    const updateElementRef = () => {
      if (listRef.current?.element) {
        elementRef.current = listRef.current.element;
      }
    };

    // Initial update
    updateElementRef();

    // Set up a small delay to catch when the element is mounted
    const timeoutId = setTimeout(updateElementRef, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const { elementDims } = useResizeObserver(elementRef);

  useEffect(() => {
    if (elementDims.width > 0) {
      setTableHeaderWidthRef.current(elementDims.width);
    }
  }, [elementDims.width]);

  useEffect(() => {
    if (enableAutoScroll && listRef?.current?.element) {
      const element = listRef.current.element;
      const { offsetHeight, scrollHeight } = element;
      let { scrollTop } = element;
      const needToScroll =
        scrollTop + offsetHeight + numberOfNewEntries * TABLE_ENTRY_HEIGHT >=
        scrollHeight;
      if (needToScroll) {
        element.scrollTop = scrollHeight;
      }
    }
  }, [data.length, numberOfNewEntries, enableAutoScroll]);

  const handleReqSelect = useCallback(
    (payload: any) => {
      if (selectedReqIndex === payload.index) {
        return;
      }

      actions.updateScrollToIndex(payload);
      actions.selectRequest(payload);
      callbacks.onRequestSelect?.(payload);
    },
    [selectedReqIndex, actions, callbacks]
  );

  const rowComponent = useCallback(
    (props: {
      index: number;
      style: CSSProperties;
      ariaAttributes: React.AriaAttributes;
      data: PreparedEntry[];
    }) => {
      const { index, style, ariaAttributes, data } = props;

      return (
        <NetworkTableRow
          key={index}
          preparedEntry={data[index]}
          maxTime={totalNetworkTime ?? 0}
          onSelect={handleReqSelect}
          scrollHighlight={selectedReqIndex === index}
          style={style}
          {...ariaAttributes}
        />
      );
    },
    [totalNetworkTime, handleReqSelect, selectedReqIndex]
  );

  if (actualData.length === 0) {
    return (
      <div
        id="network-table-body-empty"
        data-testid="network-table-body-empty"
        ref={elementRef}
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

  // Ensure height is a valid positive number
  const listHeight = height > 0 ? height : 0;

  return (
    <List
      id="network-table-body"
      data-testid="network-table-body"
      className="w-full"
      style={{ height: listHeight, width: "100%" }}
      rowCount={data.length}
      rowHeight={TABLE_ENTRY_HEIGHT}
      rowComponent={rowComponent}
      rowProps={{
        data,
      }}
      listRef={listRef}
      onResize={() => {
        // Update elementRef when List resizes
        if (listRef.current?.element) {
          elementRef.current = listRef.current.element;
        }
      }}
    />
  );
}
