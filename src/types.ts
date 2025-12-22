import { List, Map } from "immutable";
import { AxiosRequestConfig } from "axios";

export interface HarLog {
  version: string;
  creator: {
    name: string;
    version: string;
  };
  entries: HarEntry[];
  pages: HarPage[];
}

export interface HarEntry {
  startedDateTime: string;
  time: number;
  request: {
    method: string;
    url: string;
    headers: Array<{ name: string; value: string }>;
    queryString: Array<{ name: string; value: string }>;
    postData?: {
      mimeType?: string;
      text?: string;
    };
  };
  response: {
    status: number;
    statusText?: string;
    headers: Array<{ name: string; value: string }>;
    content: {
      size: number;
      mimeType?: string;
      text?: string;
    };
    bodySize: number;
    _transferSize?: number;
    _error?: string;
  };
  serverIPAddress?: string;
  _resourceType?: string;
  timings: {
    blocked?: number;
    dns?: number;
    connect?: number;
    send?: number;
    wait?: number;
    receive?: number;
    ssl?: number;
    _blocked_queueing?: number;
    _queued?: number;
  };
}

export interface HarPage {
  startedDateTime: string;
  id: string;
  title: string;
  pageTimings: {
    onContentLoad: number;
    onLoad: number;
  };
}

export interface HarData {
  log: HarLog;
}

export interface NetworkViewerOptions {
  NoDataPlaceholder?: React.ReactNode;
  enableAutoScroll?: boolean;
  showExportHar?: boolean;
  showImportHar?: boolean;
  showPauseResume?: boolean;
  showReset?: boolean;
  showTimeline?: boolean;
  showWaterfall?: boolean;
}

export type ScrollRequestPosition = "before" | "after" | "near";

export interface NetworkViewerProps {
  autoHighlightChange?: boolean;
  containerClassName?: string | null;
  data?: HarData | null;
  fetchOptions?: AxiosRequestConfig;
  file?: string | null;
  onDataError?: ((error: string) => void) | null;
  onDataLoaded?: ((data: List<any>) => void) | null;
  onPause?: () => void;
  onRequestSelect?: ((request: any) => void) | null;
  onReset?: () => void;
  onResume?: () => void;
  options?: NetworkViewerOptions | null;
  scrollRequestPosition?: ScrollRequestPosition;
  scrollTimeStamp?: number | null;
}

export interface NetworkState {
  rawData: HarData;
  data: List<any>;
  actualData: List<any>;
  totalNetworkTime: number | null;
  dataSummary: Map<string, any>;
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
  error: string | null;
  loading: boolean;
  scrollToIndex: number | null;
  selectedReqIndex: number | null;
  showReqDetail: boolean;
  reqDetail: any | null;
  tableHeaderWidth: string;
  numberOfNewEntries: number;
}
