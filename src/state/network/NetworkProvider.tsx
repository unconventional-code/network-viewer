import { useEffect, useReducer, useMemo, ReactNode } from "react";
import { Map } from "immutable";
import { AxiosRequestConfig } from "axios";

import { reducer, initialState as defaultState } from "./reducer";
import { updateData, fetchFile, updateScrollToIndex } from "./actions";
import { NetworkContext } from "./Context";
import { findRequestIndex } from "../../utils";
import { HarData, ScrollRequestPosition } from "../../types";

interface NetworkProviderProps {
  autoHighlightChange?: boolean;
  data?: HarData | null;
  fetchOptions?: AxiosRequestConfig;
  file?: string | null;
  initialState?: Map<string, any>;
  onDataError?: ((error: string) => void) | null;
  onDataLoaded?: ((data: any) => void) | null;
  onPause?: (() => void) | null;
  onRequestSelect?: ((request: any) => void) | null;
  onReset?: (() => void) | null;
  onResume?: (() => void) | null;
  scrollRequestPosition?: ScrollRequestPosition;
  scrollTimeStamp?: number | null;
  children?: ReactNode;
}

export function NetworkProvider({
  data = null,
  file = null,
  fetchOptions = { withCredentials: true },
  initialState = defaultState,
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const callbacks = {
    onPause,
    onResume,
    onReset,
    onRequestSelect,
  };
  const value = useMemo(() => [state, dispatch, callbacks], [state]);
  const requestData = value[0].get("data");
  const showReqDetail = value[0].get("showReqDetail");
  const actualData = value[0].get("actualData");
  const error = value[0].get("error");

  // Update data onChange of network data
  useEffect(() => {
    if (data && data.log && data.log.entries) {
      updateData(dispatch)(data);
    }
  }, [data]);

  // Fetch HAR file onChange of file prop
  useEffect(() => {
    if (file) {
      fetchFile(dispatch)(file, fetchOptions);
    }
  }, [file]);

  useEffect(() => {
    if (actualData.size && onDataLoaded) {
      onDataLoaded(actualData);
    }
  }, [actualData]);

  useEffect(() => {
    if (error && onDataError) {
      onDataError(error);
    }
  }, [error]);

  // Find nearby request-rowId and update scrollIndex on scrollTimeStamp receive
  useEffect(() => {
    const shouldChangeHighlight = showReqDetail ? autoHighlightChange : true;
    if (scrollTimeStamp && shouldChangeHighlight) {
      const reqIndex = findRequestIndex({
        data: requestData,
        timestamp: scrollTimeStamp,
        position: scrollRequestPosition,
      });
      if (reqIndex || reqIndex === 0) {
        updateScrollToIndex(dispatch)(requestData.get(reqIndex));
      }
    }
  }, [scrollTimeStamp, actualData]);

  return (
    <NetworkContext.Provider value={value} {...props}>
      {children}
    </NetworkContext.Provider>
  );
}
