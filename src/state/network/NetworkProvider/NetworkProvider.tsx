import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AxiosRequestConfig } from "axios";
import axios from "axios";

import { sortBy } from "../../../utils";
import { prepareViewerData } from "./utils";
import { NetworkContext } from "../Context";
import { findRequestIndex } from "./utils";
import {
  ScrollRequestPosition,
  PaginationState,
  PaginationCallbacks,
  FilterCallbacks,
  StreamingCallbacks,
  FilteringMode,
  PartialEntry,
} from "../../../types";
import {
  DEFAULT_STATUS_FILTER,
  EMPTY_NETWORK_HAR,
  FILTER_OPTION,
} from "../../../constants";
import { Har, Entry } from "har-format";
import { PreparedEntry } from "./types";

interface NetworkState {
  rawData: Har;
  data: PreparedEntry[]; // filtered data (what's shown in table)
  actualData: PreparedEntry[]; // sorted but unfiltered (all entries)
  totalNetworkTime: number | null;
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

/**
 * ⚠️ WORKS ON PREPARED ENTRIES - Requires prepareViewerData to run first
 * Helper for filterData - checks if entry matches filter criteria
 */
const applyFilter = (
  filterOption: keyof typeof FILTER_OPTION,
  filter: { value: string },
  entry: PreparedEntry
) => {
  switch (filterOption) {
    case FILTER_OPTION.STATUS:
      return entry.status && entry.status.toString().startsWith(filter.value);
    case FILTER_OPTION.TYPE:
      return entry.type && filter.value.includes(entry.type);
    case FILTER_OPTION.URL:
      return entry.url && entry.url.includes(filter.value);
    case FILTER_OPTION.BODY:
      return entry.body && entry.body.includes(filter.value);
    default:
      return true;
  }
};

/**
 * ⚠️ WORKS ON PREPARED ENTRIES - Requires prepareViewerData to run first
 * Filters prepared entries based on search, status, and type filters
 */
const filterData = ({
  data,
  search,
  statusFilter,
  typeFilter,
}: {
  data: PreparedEntry[];
  search?: { name: string; value: string };
  statusFilter?: { name: string; value: string | null };
  typeFilter?: { name: string | null; value: string[] | null };
}) => {
  const trimmedSearch = search?.value && search?.value.trim();

  if (!trimmedSearch && !statusFilter?.value && !typeFilter?.value) {
    return data;
  }

  const filters = [
    {
      option: FILTER_OPTION.STATUS,
      filter: statusFilter,
    },
    {
      option: FILTER_OPTION.TYPE,
      filter: typeFilter,
    },
    {
      option: search?.name,
      filter: { value: trimmedSearch },
    },
  ];

  return data.filter((entry) =>
    filters.every(
      ({ option, filter }) =>
        !filter?.value ||
        applyFilter(
          option as keyof typeof FILTER_OPTION,
          filter as { value: string },
          entry
        )
    )
  );
};

export interface NetworkProviderRef {
  appendEntries: (entries: Entry[] | PartialEntry[]) => void;
  prependEntries: (entries: Entry[] | PartialEntry[]) => void;
  replaceEntries: (entries: Entry[] | PartialEntry[]) => void;
  clearEntries: () => void;
  updatePartialEntry?: (entryId: string, entry: PartialEntry) => void;
  completePartialEntry?: (entryId: string, entry: Entry) => void;
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
  // New props for pagination, filtering, and streaming
  pagination?: PaginationState | null;
  paginationCallbacks?: PaginationCallbacks | null;
  filterCallbacks?: FilterCallbacks | null;
  streamingCallbacks?: StreamingCallbacks | null;
  filteringMode?: FilteringMode; // "client" (default) or "server"
}

const initialState: NetworkState = {
  rawData: EMPTY_NETWORK_HAR,
  data: [],
  actualData: [],
  totalNetworkTime: null,
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

export const NetworkProvider = forwardRef<
  NetworkProviderRef,
  NetworkProviderProps
>(
  (
    {
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
      pagination = null,
      paginationCallbacks = null,
      filterCallbacks = null,
      streamingCallbacks = null,
      filteringMode = "client",
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<NetworkState>(() => ({
      ...initialState,
      ...customInitialState,
    }));

    // Update data - processes HAR entries and applies filters
    const updateData = useCallback(
      (harData: Har, skipClientFiltering = false) => {
        const { data: preparedData, totalNetworkTime } = prepareViewerData(
          harData.log.entries
        );

        const sortedData = sortBy(
          preparedData,
          state.sort.key,
          state.sort.isAsc
        );

        // Only apply client-side filtering if not in server mode or explicitly skipped
        const shouldFilterClientSide =
          filteringMode === "client" && !skipClientFiltering;
        const filteredData = shouldFilterClientSide
          ? filterData({
              data: sortedData,
              statusFilter: state.statusFilter,
              typeFilter: state.typeFilter,
              search: state.search,
            })
          : sortedData; // In server mode, data is already filtered by parent

        const numberOfNewEntries = filteredData.length - state.data.length;

        setState((prev) => ({
          ...prev,
          error: null,
          rawData: harData,
          data: filteredData,
          actualData: sortedData,
          numberOfNewEntries,
          totalNetworkTime,
        }));
      },
      [
        state.sort,
        state.statusFilter,
        state.typeFilter,
        state.search,
        state.data.length,
        filteringMode,
      ]
    );

    // Update search filter
    const updateSearch = useCallback(
      (search: { name: string; value: string }) => {
        // Always update the search state
        setState((prev) => {
          // In server mode, don't filter client-side - parent will provide filtered data
          if (filteringMode === "server") {
            return {
              ...prev,
              search,
            };
          }

          // Client-side filtering
          const filteredData = filterData({
            data: prev.actualData,
            statusFilter: prev.statusFilter,
            typeFilter: prev.typeFilter,
            search,
          });
          return {
            ...prev,
            search,
            data: filteredData,
          };
        });

        // Notify parent of filter change for server-side filtering
        if (filterCallbacks?.onSearchChange) {
          filterCallbacks.onSearchChange(search);
        }
        if (filterCallbacks?.onFilterChange) {
          setState((prev) => {
            filterCallbacks.onFilterChange?.({
              search,
              statusFilter: prev.statusFilter,
              typeFilter: prev.typeFilter,
              sort: prev.sort,
            });
            return prev;
          });
        }
      },
      [filterCallbacks, filteringMode]
    );

    // Update status filter
    const updateStatusFilter = useCallback(
      (statusFilter: { name: string; value: string | null }) => {
        setState((prev) => {
          // In server mode, don't filter client-side
          if (filteringMode === "server") {
            return {
              ...prev,
              statusFilter,
            };
          }

          // Client-side filtering
          const filteredData = filterData({
            data: prev.actualData,
            statusFilter,
            typeFilter: prev.typeFilter,
            search: prev.search,
          });
          return {
            ...prev,
            statusFilter,
            data: filteredData,
          };
        });
        // Notify parent of filter change for server-side filtering
        if (filterCallbacks?.onStatusFilterChange) {
          filterCallbacks.onStatusFilterChange(statusFilter);
        }
        if (filterCallbacks?.onFilterChange) {
          setState((prev) => {
            filterCallbacks.onFilterChange?.({
              search: prev.search,
              statusFilter,
              typeFilter: prev.typeFilter,
              sort: prev.sort,
            });
            return prev;
          });
        }
      },
      [filterCallbacks, filteringMode]
    );

    // Update type filter
    const updateTypeFilter = useCallback(
      (typeFilter: { name: string | null; value: string[] | null }) => {
        setState((prev) => {
          // In server mode, don't filter client-side
          if (filteringMode === "server") {
            return {
              ...prev,
              typeFilter,
            };
          }

          // Client-side filtering
          const filteredData = filterData({
            data: prev.actualData,
            statusFilter: prev.statusFilter,
            typeFilter,
            search: prev.search,
          });
          return {
            ...prev,
            typeFilter,
            data: filteredData,
          };
        });
        // Notify parent of filter change for server-side filtering
        if (filterCallbacks?.onTypeFilterChange) {
          filterCallbacks.onTypeFilterChange(typeFilter);
        }
        if (filterCallbacks?.onFilterChange) {
          setState((prev) => {
            filterCallbacks.onFilterChange?.({
              search: prev.search,
              statusFilter: prev.statusFilter,
              typeFilter,
              sort: prev.sort,
            });
            return prev;
          });
        }
      },
      [filterCallbacks, filteringMode]
    );

    // Update sort
    const updateSort = useCallback(
      (sort: { key: string; isAsc: boolean }) => {
        setState((prev) => ({
          ...prev,
          sort,
          data: sortBy(prev.data, sort.key, sort.isAsc),
        }));
        // Notify parent of sort change for server-side sorting
        if (filterCallbacks?.onSortChange) {
          filterCallbacks.onSortChange(sort);
        }
        if (filterCallbacks?.onFilterChange) {
          setState((prev) => {
            filterCallbacks.onFilterChange?.({
              search: prev.search,
              statusFilter: prev.statusFilter,
              typeFilter: prev.typeFilter,
              sort,
            });
            return prev;
          });
        }
      },
      [filterCallbacks]
    );

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

    // Streaming methods for real-time entry injection
    // Supports both complete Entry and PartialEntry types
    const appendEntries = useCallback(
      (entries: Entry[] | PartialEntry[]) => {
        setState((prev) => {
          const newHar: Har = {
            ...prev.rawData,
            log: {
              ...prev.rawData.log,
              entries: [...prev.rawData.log.entries, ...(entries as Entry[])],
            },
          };
          updateData(newHar);
          // Notify streaming callback
          if (streamingCallbacks?.onStreamEntry) {
            entries.forEach((entry) => {
              streamingCallbacks.onStreamEntry?.(entry);
            });
          }
          return prev;
        });
      },
      [updateData, streamingCallbacks]
    );

    // Prepend entries (for streaming new requests at the front)
    // Optimized to avoid full re-render when possible
    const prependEntries = useCallback(
      (entries: Entry[] | PartialEntry[]) => {
        setState((prev) => {
          const newHar: Har = {
            ...prev.rawData,
            log: {
              ...prev.rawData.log,
              entries: [...(entries as Entry[]), ...prev.rawData.log.entries],
            },
          };
          // Skip client-side filtering for prepend to improve performance
          // The parent should handle filtering for streaming entries
          updateData(newHar, true);
          // Notify streaming callback
          if (streamingCallbacks?.onStreamEntry) {
            entries.forEach((entry) => {
              streamingCallbacks.onStreamEntry?.(entry);
            });
          }
          return prev;
        });
      },
      [updateData, streamingCallbacks]
    );

    const replaceEntries = useCallback(
      (entries: Entry[] | PartialEntry[]) => {
        setState((prev) => {
          const newHar: Har = {
            ...prev.rawData,
            log: {
              ...prev.rawData.log,
              entries: entries as Entry[],
            },
          };
          updateData(newHar);
          return prev;
        });
      },
      [updateData]
    );

    const clearEntries = useCallback(() => {
      setState((prev) => {
        const newHar: Har = {
          ...prev.rawData,
          log: {
            ...prev.rawData.log,
            entries: [],
          },
        };
        updateData(newHar);
        return prev;
      });
    }, [updateData]);

    // Update a partial entry (e.g., when response arrives for a pending request)
    const updatePartialEntry = useCallback(
      (entryId: string, entry: PartialEntry) => {
        setState((prev) => {
          const entries = prev.rawData.log.entries.map((e: any) => {
            // Match by _id if present, otherwise by index or other identifier
            if (e._id === entryId || (entry._id && e._id === entry._id)) {
              return { ...e, ...entry };
            }
            return e;
          });
          const newHar: Har = {
            ...prev.rawData,
            log: {
              ...prev.rawData.log,
              entries,
            },
          };
          updateData(newHar);
          // Notify streaming callback
          if (streamingCallbacks?.onPartialEntryUpdate) {
            streamingCallbacks.onPartialEntryUpdate(entryId, entry);
          }
          return prev;
        });
      },
      [updateData, streamingCallbacks]
    );

    // Convert a partial entry to a complete entry
    const completePartialEntry = useCallback(
      (entryId: string, entry: Entry) => {
        setState((prev) => {
          const entries = prev.rawData.log.entries.map((e: any) => {
            if (e._id === entryId || (entry as any)._id === entryId) {
              // Remove partial flags and merge with complete entry
              const { _id, _pending, _partial, ...completeEntry } =
                entry as any;
              return completeEntry;
            }
            return e;
          });
          const newHar: Har = {
            ...prev.rawData,
            log: {
              ...prev.rawData.log,
              entries,
            },
          };
          updateData(newHar);
          return prev;
        });
      },
      [updateData]
    );

    // Expose streaming methods via ref
    useImperativeHandle(ref, () => ({
      appendEntries,
      prependEntries,
      replaceEntries,
      clearEntries,
      updatePartialEntry,
      completePartialEntry,
    }));

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
        if (
          reqIndex !== null &&
          reqIndex !== undefined &&
          state.data[reqIndex]
        ) {
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
        pagination,
        paginationCallbacks,
        filteringMode,
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
        pagination,
        paginationCallbacks,
        filteringMode,
      ]
    );

    return (
      <NetworkContext.Provider value={contextValue} {...props}>
        {children}
      </NetworkContext.Provider>
    );
  }
);

NetworkProvider.displayName = "NetworkProvider";
