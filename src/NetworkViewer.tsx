import classNames from "classnames";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { NetworkProvider } from "./state/network/NetworkProvider/NetworkProvider";
import { MainContainer } from "./Containers/MainContainer";
import { ThemeProvider } from "./state/theme/Context";
import {
  NetworkViewerOptions,
  ScrollRequestPosition,
  PaginationState,
  PaginationCallbacks,
  FilterCallbacks,
  StreamingCallbacks,
  NetworkViewerRef,
  FilteringMode,
} from "./types";
import { Har } from "har-format";
import { AxiosRequestConfig } from "axios";

interface NetworkViewerProps {
  autoHighlightChange?: boolean;
  containerClassName?: string | null;
  data?: Har | null;
  fetchOptions?: AxiosRequestConfig;
  file?: string | null;
  onDataError?:
    | ((error: string | { title: string; description: string }) => void)
    | null;
  onDataLoaded?: ((data: any[]) => void) | null;
  onPause?: () => void;
  onRequestSelect?: ((request: any) => void) | null;
  onReset?: () => void;
  onResume?: () => void;
  options?: NetworkViewerOptions | null;
  scrollRequestPosition?: ScrollRequestPosition;
  scrollTimeStamp?: number | null;
  // Pagination props
  pagination?: PaginationState | null;
  paginationCallbacks?: PaginationCallbacks | null;
  // Filter callbacks for server-side filtering
  filterCallbacks?: FilterCallbacks | null;
  // Streaming callbacks
  streamingCallbacks?: StreamingCallbacks | null;
  // Filtering mode: "client" (default) or "server"
  filteringMode?: FilteringMode;
}

export const NetworkViewer = forwardRef<NetworkViewerRef, NetworkViewerProps>(
  (
    {
      file = null,
      data = null,
      fetchOptions = { withCredentials: true },
      scrollTimeStamp = null,
      options = null,
      onPause = () => {},
      onRequestSelect = () => {},
      onResume = () => {},
      onReset = () => {},
      scrollRequestPosition = "near",
      autoHighlightChange = false,
      onDataLoaded = null,
      onDataError = null,
      containerClassName = null,
      pagination = null,
      paginationCallbacks = null,
      filterCallbacks = null,
      streamingCallbacks = null,
      filteringMode = "client",
    },
    ref
  ) => {
    const networkProviderRef = useRef<{
      appendEntries: (entries: any[]) => void;
      prependEntries: (entries: any[]) => void;
      replaceEntries: (entries: any[]) => void;
      clearEntries: () => void;
      updatePartialEntry?: (entryId: string, entry: any) => void;
      completePartialEntry?: (entryId: string, entry: any) => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      appendEntries: (entries: any[]) => {
        networkProviderRef.current?.appendEntries(entries);
      },
      prependEntries: (entries: any[]) => {
        networkProviderRef.current?.prependEntries(entries);
      },
      replaceEntries: (entries: any[]) => {
        networkProviderRef.current?.replaceEntries(entries);
      },
      clearEntries: () => {
        networkProviderRef.current?.clearEntries();
      },
      updatePartialEntry: (entryId: string, entry: any) => {
        networkProviderRef.current?.updatePartialEntry?.(entryId, entry);
      },
      completePartialEntry: (entryId: string, entry: any) => {
        networkProviderRef.current?.completePartialEntry?.(entryId, entry);
      },
    }));

    return (
      <section
        id="network-viewer"
        data-testid="network-viewer"
        className={classNames("h-full", "*:box-border", containerClassName)}
      >
        <ThemeProvider options={options}>
          <NetworkProvider
            ref={networkProviderRef}
            autoHighlightChange={autoHighlightChange}
            data={data}
            fetchOptions={fetchOptions}
            file={file}
            onDataError={onDataError}
            onDataLoaded={onDataLoaded}
            onPause={onPause}
            onRequestSelect={onRequestSelect}
            onReset={onReset}
            onResume={onResume}
            scrollRequestPosition={scrollRequestPosition}
            scrollTimeStamp={scrollTimeStamp}
            pagination={pagination}
            paginationCallbacks={paginationCallbacks}
            filterCallbacks={filterCallbacks}
            streamingCallbacks={streamingCallbacks}
            filteringMode={filteringMode}
          >
            <MainContainer />
          </NetworkProvider>
        </ThemeProvider>
      </section>
    );
  }
);

NetworkViewer.displayName = "NetworkViewer";
