import React from "react";

import Search from "../Components/Filters/Search";
import ResetButton from "../Components/Actions/ResetButton";
import StatusFilter from "../Components/Filters/StatusFilter";
import ExportHarButton from "../Components/Actions/ExportHarButton";
import PauseResumeButton from "../Components/Actions/PauseResumeButton";
import TypeFilter from "../Components/Filters/TypeFilter";
import ImportHAR from "../Components/Import/ImportHAR";
import { useTheme } from "../state/theme/Context";
import { useNetwork } from "../state/network/Context";

const FilterContainer: React.FC = () => {
  const { state } = useNetwork();
  const { showExportHar, showImportHar, showReset, showPauseResume } =
    useTheme();

  return (
    <section className="bg-bg-gray-90 flex flex-col">
      <div className="flex w-full border-b border-border-color px-xs-s py-xs-s [&>*:not(:last-child)]:mr-xs-s">
        <StatusFilter />
        <Search {...state.get("search")} />
        {showPauseResume && <PauseResumeButton />}
        {showReset && <ResetButton />}
        {showExportHar && <ExportHarButton rawData={state.get("rawData")} />}
        {showImportHar && <ImportHAR />}
      </div>

      <div className="flex w-full border-b border-border-color px-xs-s py-xs-s overflow-x-auto [&>*:not(:last-child)]:mr-xs">
        <TypeFilter />
      </div>
    </section>
  );
};

export default FilterContainer;
