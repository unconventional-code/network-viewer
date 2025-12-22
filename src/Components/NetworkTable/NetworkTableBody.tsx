import { useEffect, useRef } from "react";
import { List, ListImperativeAPI } from "react-window";

import { useNetwork } from "../../state/network/Context";
import { NetworkTableRow } from "./NetworkTableRow";
import { TABLE_ENTRY_HEIGHT } from "../../constants";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useTheme } from "../../state/theme/Context";
import { IconNetworkRequest } from "../../icons/IconNetworkRequest";

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

  // Update elementRef when listRef's element changes
  useEffect(() => {
    if (listRef.current) {
      elementRef.current = listRef.current.element;
    }
  }, [listRef]);

  const { elementDims } = useResizeObserver(elementRef);

  useEffect(() => {
    actions.setTableHeaderWidth(elementDims.width);
  }, [elementDims, actions]);

  useEffect(() => {
    if (enableAutoScroll && listRef?.current) {
      const element = listRef.current.element;
      if (element) {
        const { offsetHeight, scrollHeight } = element;
        let { scrollTop } = element;
        const needToScroll =
          scrollTop + offsetHeight + numberOfNewEntries * TABLE_ENTRY_HEIGHT >=
          scrollHeight;
        if (needToScroll) {
          element.scrollTop = scrollHeight;
        }
      }
    }
  }, [data, listRef, numberOfNewEntries, enableAutoScroll]);

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

  const rowComponent = ({
    index,
    style,
    ariaAttributes,
  }: {
    index: number;
    style: React.CSSProperties;
    ariaAttributes: {
      "aria-posinset": number;
      "aria-setsize": number;
      role: "listitem";
    };
  }) => {
    const item = data[index];
    if (!item) {
      // Return a placeholder div if item is missing
      return (
        <div style={style} {...ariaAttributes}>
          {/* Empty row */}
        </div>
      );
    }
    return (
      <NetworkTableRow
        key={index}
        entry={item as any}
        maxTime={totalNetworkTime ?? 0}
        onSelect={handleReqSelect}
        scrollHighlight={selectedReqIndex === item.index}
        style={style}
      />
    );
  };

  return (
    <>
      <List
        id="network-table-body"
        data-testid="network-table-body"
        className="w-full"
        style={{ height }}
        rowCount={data.length}
        rowHeight={TABLE_ENTRY_HEIGHT}
        rowComponent={rowComponent}
        rowProps={{}}
        listRef={listRef}
        onResize={() => {
          // Update elementRef when List resizes
          if (listRef.current?.element) {
            elementRef.current = listRef.current.element;
          }
        }}
      />
    </>
  );
}
