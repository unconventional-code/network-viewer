import React, { useContext } from "react";
import { PreparedEntry } from "./NetworkProvider/NetworkProvider";
import {
  PaginationState,
  PaginationCallbacks,
  FilteringMode,
} from "../../types";

export interface NetworkCallbacks {
  onPause?: (() => void) | null;
  onResume?: (() => void) | null;
  onReset?: (() => void) | null;
  onRequestSelect?: ((request: PreparedEntry) => void) | null;
}

export interface NetworkState {
  rawData: any;
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

export interface NetworkActions {
  updateData: (harData: any) => void;
  updateSearch: (search: { name: string; value: string }) => void;
  updateSort: (sort: { key: string; isAsc: boolean }) => void;
  updateStatusFilter: (statusFilter: {
    name: string;
    value: string | null;
  }) => void;
  updateTypeFilter: (typeFilter: {
    name: string | null;
    value: string[] | null;
  }) => void;
  updateErrorMessage: (
    error: string | { title: string; description: string } | null
  ) => void;
  selectRequest: (payload: PreparedEntry | null) => void;
  setTableHeaderWidth: (width: number) => void;
  updateScrollToIndex: (payload: PreparedEntry | null) => void;
  fetchFile: (file: string, options?: any) => Promise<void>;
  resetState: () => void;
}

export interface NetworkContextValue {
  state: NetworkState;
  actions: NetworkActions;
  callbacks: NetworkCallbacks;
  pagination?: PaginationState | null;
  paginationCallbacks?: PaginationCallbacks | null;
  filteringMode?: FilteringMode;
}

export const NetworkContext = React.createContext<
  NetworkContextValue | undefined
>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
