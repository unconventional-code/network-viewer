import classNames from "classnames";

import { NetworkProvider } from "./state/network/NetworkProvider";
import { MainContainer } from "./Containers/MainContainer";
import { ThemeProvider } from "./state/theme/Context";
import { NetworkViewerProps } from "./types";

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
