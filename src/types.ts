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
