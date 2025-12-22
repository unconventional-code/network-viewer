export interface NetworkViewerOptions {
  NoDataPlaceholder?: React.ReactNode;
  enableAutoScroll?: boolean;
  showExportHar?: boolean;
  showImportHar?: boolean;
  showPauseResume?: boolean;
  showReset?: boolean;
  showTimeline?: boolean;
  showWaterfall?: boolean;
  showPagination?: boolean;
}

export type ScrollRequestPosition = "before" | "after" | "near";

/**
 * Mode for filtering operations
 * - "client": Filters are applied client-side to the current dataset (default)
 * - "server": Filters trigger callbacks but parent handles filtering server-side
 */
export type FilteringMode = "client" | "server";

/**
 * Partial entry for streaming support - represents a request that hasn't completed yet
 */
export interface PartialEntry {
  _id?: string; // Unique identifier for tracking partial entries
  _pending?: boolean; // True if this entry is still waiting for response
  _partial?: boolean; // True if this is a partial/incomplete entry
  request: {
    method: string;
    url: string;
    headers: any[];
    postData?: any;
  };
  response?: {
    status?: number;
    statusText?: string;
    headers?: any[];
    content?: any;
  };
  startedDateTime: string;
  time?: number;
  timings?: any;
  [key: string]: any;
}

// Pagination support
export interface PaginationState {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isLoading?: boolean; // Loading state for pagination operations
}

export interface PaginationCallbacks {
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onPageSizeChange?: (pageSize: number) => void; // Optional: for dynamic page size
}

// Filter change callbacks for server-side filtering
export interface FilterState {
  search?: { name: string; value: string };
  statusFilter?: { name: string; value: string | null };
  typeFilter?: { name: string | null; value: string[] | null };
  sort?: { key: string; isAsc: boolean };
}

export interface FilterCallbacks {
  onFilterChange?: (filters: FilterState) => void;
  onSearchChange?: (search: { name: string; value: string }) => void;
  onStatusFilterChange?: (statusFilter: {
    name: string;
    value: string | null;
  }) => void;
  onTypeFilterChange?: (typeFilter: {
    name: string | null;
    value: string[] | null;
  }) => void;
  onSortChange?: (sort: { key: string; isAsc: boolean }) => void;
}

// Streaming support
export interface StreamingCallbacks {
  onStreamEntry?: (entry: any) => void;
  onStreamComplete?: () => void;
  onPartialEntryUpdate?: (entryId: string, entry: PartialEntry) => void; // Update a partial entry
}

// Ref methods for imperative API
export interface NetworkViewerRef {
  appendEntries: (entries: any[]) => void;
  prependEntries: (entries: any[]) => void;
  replaceEntries: (entries: any[]) => void;
  clearEntries: () => void;
  updatePartialEntry?: (entryId: string, entry: PartialEntry) => void; // Update a partial entry (e.g., when response arrives)
  completePartialEntry?: (entryId: string, entry: any) => void; // Convert partial entry to complete entry
}
