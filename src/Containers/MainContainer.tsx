import { useNetwork } from "../state/network/Context";
import { FilterContainer } from "./FilterContainer";
import { NetworkTableContainer } from "./NetworkTableContainer";
import { LoaderContainer } from "./../Components/LoaderContainer";
import { FETCH_FILE_LOAD_TEXT } from "../constants";
import { ReqDetailContainer } from "./ReqDetailContainer";
import { TimelineContainer } from "./TimelineContainer";
import { useTheme } from "../state/theme/Context";
import { NetworkTableFooter } from "./../Components/NetworkTable/NetworkTableFooter";

export function MainContainer() {
  const { state } = useNetwork();
  const { showTimeline } = useTheme();
  const loading = state.loading;
  const showReqDetail = state.showReqDetail;
  const actualData = state.actualData;

  return (
    <>
      <LoaderContainer show={loading} text={FETCH_FILE_LOAD_TEXT}>
        <div
          id="main-container"
          data-testid="main-container"
          className="flex flex-col h-full justify-between"
        >
          <div>
            {showTimeline && <TimelineContainer />}
            <FilterContainer />
          </div>
          <section
            id="main-content-section"
            data-testid="main-content-section"
            className="flex h-full w-full overflow-auto overflow-x-hidden outline-none"
          >
            <NetworkTableContainer />
            {showReqDetail && <ReqDetailContainer />}
          </section>
          {actualData.length ? <NetworkTableFooter /> : null}
        </div>
      </LoaderContainer>
    </>
  );
}
