import classNames from "classnames";

import { NetworkProvider } from "./state/network/NetworkProvider/NetworkProvider";
import { MainContainer } from "./Containers/MainContainer";
import { ThemeProvider } from "./state/theme/Context";
import { NetworkViewerOptions, ScrollRequestPosition } from "./types";
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
}

export function NetworkViewer({
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
}: NetworkViewerProps) {
  return (
    <section
      id="network-viewer"
      data-testid="network-viewer"
      className={classNames("h-full", "*:box-border", containerClassName)}
    >
      <ThemeProvider options={options}>
        <NetworkProvider
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
        >
          <MainContainer />
        </NetworkProvider>
      </ThemeProvider>
    </section>
  );
}
