import React from "react";

import { GENERAL_HEADERS } from "../../../constants";

interface GeneralProps {
  data?: any | null;
}

const General: React.FC<GeneralProps> = ({ data = null }) => (
  <div className="px-xs-s py-s w-full">
    {Object.entries(GENERAL_HEADERS).map(([dataKey, { key, name }]) => (
      <div key={dataKey} className="m-0 text-small pb-xs last:pb-0">
        <span className="font-bold pr-xs-s">{`${name}:`}</span>
        <span className="break-all">
          {key === "status" && data?.error ? data.error : data?.[key]}
        </span>
      </div>
    ))}
  </div>
);

export default General;
