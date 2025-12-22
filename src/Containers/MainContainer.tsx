import React from "react";

import { useNetwork } from "../state/network/Context";
import FilterContainer from "./FilterContainer";
import NetworkTableContainer from "./NetworkTableContainer";
import LoaderContainer from "./../Components/LoaderContainer";
import { FETCH_FILE_LOAD_TEXT } from "../constants";
import ReqDetailContainer from "./ReqDetailContainer";
import TimelineContainer from "./TimelineContainer";
import { useTheme } from "../state/theme/Context";
import NetworkTableFooter from "./../Components/NetworkTable/NetworkTableFooter";

const MainContainer: React.FC = () => {
  const { state } = useNetwork();
  const { showTimeline } = useTheme();
  const loading = state.get("loading");
  const showReqDetail = state.get("showReqDetail");
  const dataSummary = state.get("dataSummary");
  const actualData = state.get("actualData");

  return (
    <>
      <LoaderContainer show={loading} text={FETCH_FILE_LOAD_TEXT}>
        <div className="flex flex-col h-full justify-between">
          <div>
            {showTimeline && <TimelineContainer />}
            <FilterContainer />
          </div>
          <section className="flex h-full w-full overflow-auto overflow-x-hidden outline-none">
            <NetworkTableContainer />
            {showReqDetail && <ReqDetailContainer />}
          </section>
          {actualData.size ? (
            <NetworkTableFooter dataSummary={dataSummary} />
          ) : null}
        </div>
      </LoaderContainer>
    </>
  );
};

export default MainContainer;
