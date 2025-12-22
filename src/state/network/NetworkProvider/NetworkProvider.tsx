import { useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { AxiosRequestConfig } from "axios";
import axios from "axios";

import {
  filterData,
  sortBy,
  prepareViewerData,
  getSummary,
} from "../../../utils";
import { calculateTimings } from "../utils";
import { NetworkContext } from "../Context";
import { findRequestIndex } from "./utils";
import { ScrollRequestPosition } from "../../../types";
import { DEFAULT_STATUS_FILTER, EMPTY_NETWORK_HAR } from "../../../constants";
import { Har } from "har-format";

// Prepared entry type (from prepareViewerData)
export interface PreparedEntry {
  index: number;
  status: number;
  method: string;
  size: string;
  startedDateTime: number;
  type: string;
  timings: Record<string, number>;
  body: string;
  time: number;
  serverIPAddress: string;
  headers: any;
  transferredSize: number;
  uncompressedSize: number;
  error?: string;
  domain: string;
  filename: string;
  url: string;
  [key: string]: any;
}

interface NetworkState {
  rawData: Har;
  data: PreparedEntry[]; // filtered data (what's shown in table)
  actualData: PreparedEntry[]; // sorted but unfiltered (all entries)
  totalNetworkTime: number | null;
  dataSummary: {
    totalRequests: number;
    totalTransferredSize: number;
    totalUncompressedSize: number;
    finishTime: number;
    timings: any;
    finish: number;
  };
  sort: {
    key: string;
    isAsc: boolean;
  };
  search: {
    name: string;
    value: string;
  };
  statusFilter: {
    name: string;
    value: string | null;
  };
  typeFilter: {
    name: string | null;
    value: string[] | null;
  };
  error: string | { title: string; description: string } | null;
  loading: boolean;
  scrollToIndex: number | null;
  selectedReqIndex: number | null;
  showReqDetail: boolean;
  reqDetail: PreparedEntry | null;
  tableHeaderWidth: string;
  numberOfNewEntries: number;
}

interface NetworkProviderProps {
  autoHighlightChange?: boolean;
  data?: Har | null;
  fetchOptions?: AxiosRequestConfig;
  file?: string | null;
  initialState?: Partial<NetworkState>;
  onDataError?:
    | ((error: string | { title: string; description: string }) => void)
    | null;
  onDataLoaded?: ((data: PreparedEntry[]) => void) | null;
  onPause?: (() => void) | null;
  onRequestSelect?: ((request: PreparedEntry) => void) | null;
  onReset?: (() => void) | null;
  onResume?: (() => void) | null;
  scrollRequestPosition?: ScrollRequestPosition;
  scrollTimeStamp?: number | null;
  children?: ReactNode;
}

const initialState: NetworkState = {
  rawData: EMPTY_NETWORK_HAR,
  data: [],
  actualData: [],
  totalNetworkTime: null,
  dataSummary: {
    totalRequests: 0,
    totalTransferredSize: 0,
    totalUncompressedSize: 0,
    finishTime: 0,
    timings: {},
    finish: 0,
  },
  sort: {
    key: "startedDateTime",
    isAsc: true,
  },
  search: {
    name: "URL",
    value: "",
  },
  statusFilter: DEFAULT_STATUS_FILTER,
  typeFilter: {
    name: null,
    value: null,
  },
  error: null,
  loading: false,
  scrollToIndex: null,
  selectedReqIndex: null,
  showReqDetail: false,
  reqDetail: null,
  tableHeaderWidth: "100%",
  numberOfNewEntries: 0,
};

export function NetworkProvider({
  data = null,
  file = null,
  fetchOptions = { withCredentials: true },
  initialState: customInitialState,
  scrollTimeStamp = null,
  scrollRequestPosition = "near",
  autoHighlightChange = false,
  onDataLoaded = null,
  onDataError = null,
  onPause = null,
  onResume = null,
  onReset = null,
  onRequestSelect = null,
  children,
  ...props
}: NetworkProviderProps) {
  const [state, setState] = useState<NetworkState>(() => ({
    ...initialState,
    ...customInitialState,
  }));

  // Update data - processes HAR entries and applies filters
  const updateData = useCallback(
    (harData: Har) => {
      const {
        data: preparedData,
        totalNetworkTime,
        totalRequests,
        totalTransferredSize,
        totalUncompressedSize,
        finishTime,
      } = prepareViewerData(harData.log.entries as any);

      const sortedData = sortBy(preparedData, state.sort.key, state.sort.isAsc);

      const filteredData = filterData({
        data: sortedData,
        statusFilter: state.statusFilter,
        typeFilter: state.typeFilter,
        search: state.search,
      });

      const numberOfNewEntries = filteredData.length - state.data.length;

      setState((prev) => ({
        ...prev,
        error: null,
        rawData: harData,
        data: filteredData,
        actualData: sortedData,
        numberOfNewEntries,
        totalNetworkTime,
        dataSummary: {
          totalRequests,
          totalTransferredSize,
          totalUncompressedSize,
          finishTime,
          timings: calculateTimings(harData.log.pages as any),
          finish: finishTime,
        },
      }));
    },
    [
      state.sort,
      state.statusFilter,
      state.typeFilter,
      state.search,
      state.data.length,
    ]
  );

  // Update search filter
  const updateSearch = useCallback(
    (search: { name: string; value: string }) => {
      setState((prev) => {
        const filteredData = filterData({
          data: prev.actualData,
          statusFilter: prev.statusFilter,
          typeFilter: prev.typeFilter,
          search,
        });
        const summary = getSummary(filteredData);
        return {
          ...prev,
          search,
          data: filteredData,
          dataSummary: {
            ...prev.dataSummary,
            totalRequests: summary.totalRequests,
            totalTransferredSize: summary.totalTransferredSize,
            totalUncompressedSize: summary.totalUncompressedSize,
          },
        };
      });
    },
    []
  );

  // Update status filter
  const updateStatusFilter = useCallback(
    (statusFilter: { name: string; value: string | null }) => {
      setState((prev) => {
        const filteredData = filterData({
          data: prev.actualData,
          statusFilter,
          typeFilter: prev.typeFilter,
          search: prev.search,
        });
        const summary = getSummary(filteredData);
        return {
          ...prev,
          statusFilter,
          data: filteredData,
          dataSummary: {
            ...prev.dataSummary,
            totalRequests: summary.totalRequests,
            totalTransferredSize: summary.totalTransferredSize,
            totalUncompressedSize: summary.totalUncompressedSize,
          },
        };
      });
    },
    []
  );

  // Update type filter
  const updateTypeFilter = useCallback(
    (typeFilter: { name: string | null; value: string[] | null }) => {
      setState((prev) => {
        const filteredData = filterData({
          data: prev.actualData,
          statusFilter: prev.statusFilter,
          typeFilter,
          search: prev.search,
        });
        const summary = getSummary(filteredData);
        return {
          ...prev,
          typeFilter,
          data: filteredData,
          dataSummary: {
            ...prev.dataSummary,
            totalRequests: summary.totalRequests,
            totalTransferredSize: summary.totalTransferredSize,
            totalUncompressedSize: summary.totalUncompressedSize,
          },
        };
      });
    },
    []
  );

  // Update sort
  const updateSort = useCallback((sort: { key: string; isAsc: boolean }) => {
    setState((prev) => ({
      ...prev,
      sort,
      data: sortBy(prev.data, sort.key, sort.isAsc),
    }));
  }, []);

  // Select request
  const selectRequest = useCallback(
    (payload: PreparedEntry | null) => {
      setState((prev) => ({
        ...prev,
        selectedReqIndex: payload ? payload.index : null,
        reqDetail: payload,
        showReqDetail: !!payload,
      }));
      if (payload && onRequestSelect) {
        onRequestSelect(payload);
      }
    },
    [onRequestSelect]
  );

  // Update scroll to index
  const updateScrollToIndex = useCallback((payload: PreparedEntry | null) => {
    setState((prev) => ({
      ...prev,
      selectedReqIndex: payload ? payload.index : null,
      reqDetail: payload,
    }));
  }, []);

  // Set table header width
  const setTableHeaderWidth = useCallback((width: number) => {
    setState((prev) => ({
      ...prev,
      tableHeaderWidth: `${width}px`,
    }));
  }, []);

  // Set error message
  const updateErrorMessage = useCallback(
    (error: string | { title: string; description: string } | null) => {
      setState((prev) => ({
        ...prev,
        error,
        loading: false,
      }));
    },
    []
  );

  // Fetch file
  const fetchFile = useCallback(
    async (
      fileUrl: string,
      options: AxiosRequestConfig = { withCredentials: true }
    ) => {
      setState((prev) => ({ ...prev, error: null, loading: true }));

      try {
        const { data: harData } = await axios.get(fileUrl, options);
        if (harData && harData.log) {
          updateData(harData);
        }
        setState((prev) => ({ ...prev, loading: false }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: {
            title: "Error while fetching file",
            description: error.message,
          },
          loading: false,
        }));
      }
    },
    [updateData, updateErrorMessage]
  );

  // Reset state
  const resetState = useCallback(() => {
    setState(initialState);
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const callbacks = useMemo(
    () => ({
      onPause,
      onResume,
      onReset,
      onRequestSelect,
    }),
    [onPause, onResume, onReset, onRequestSelect]
  );

  // Update data onChange of network data
  useEffect(() => {
    if (data && data.log && data.log.entries) {
      updateData(data);
    }
  }, [data, updateData]);

  // Fetch HAR file onChange of file prop
  useEffect(() => {
    if (file) {
      fetchFile(file, fetchOptions);
    }
  }, [file, fetchOptions, fetchFile]);

  useEffect(() => {
    if (state.actualData.length && onDataLoaded) {
      onDataLoaded(state.actualData);
    }
  }, [state.actualData, onDataLoaded]);

  useEffect(() => {
    if (state.error && onDataError) {
      if (typeof state.error === "string") {
        onDataError(state.error);
      } else {
        onDataError(state.error);
      }
    }
  }, [state.error, onDataError]);

  // Find nearby request-rowId and update scrollIndex on scrollTimeStamp receive
  useEffect(() => {
    const shouldChangeHighlight = state.showReqDetail
      ? autoHighlightChange
      : true;
    if (scrollTimeStamp && shouldChangeHighlight) {
      const reqIndex = findRequestIndex({
        data: state.data,
        timestamp: scrollTimeStamp,
        position: scrollRequestPosition,
      });
      if (reqIndex !== null && reqIndex !== undefined && state.data[reqIndex]) {
        updateScrollToIndex(state.data[reqIndex]);
      }
    }
  }, [
    scrollTimeStamp,
    state.data,
    state.showReqDetail,
    autoHighlightChange,
    scrollRequestPosition,
    updateScrollToIndex,
  ]);

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        updateData,
        updateSearch,
        updateSort,
        updateStatusFilter,
        updateTypeFilter,
        updateErrorMessage,
        selectRequest,
        setTableHeaderWidth,
        updateScrollToIndex,
        fetchFile,
        resetState,
      },
      callbacks,
    }),
    [
      state,
      updateData,
      updateSearch,
      updateSort,
      updateStatusFilter,
      updateTypeFilter,
      updateErrorMessage,
      selectRequest,
      setTableHeaderWidth,
      updateScrollToIndex,
      fetchFile,
      resetState,
      callbacks,
    ]
  );

  return (
    <NetworkContext.Provider value={contextValue} {...props}>
      {children}
    </NetworkContext.Provider>
  );
}
