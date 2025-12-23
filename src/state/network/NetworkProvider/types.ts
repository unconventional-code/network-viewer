import { Entry, Timings } from "har-format";

// Prepared entry type (from prepareViewerData)
export interface PreparedEntry extends Entry {
  index: number;
  status: number;
  method: string;
  size: string;
  startedDateTimeMs: number;
  type: string;
  timings: Timings & { startTime?: number };
  body: string | null;
  time: number;
  serverIPAddress: string;
  headers: any;
  transferredSize: number;
  uncompressedSize: number;
  error?: string | null;
  domain: string;
  filename: string;
  url: string;
}
