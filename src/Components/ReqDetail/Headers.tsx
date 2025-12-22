import React from "react";

import General from "./headers/General";
import ResponseHeaders from "./headers/ResponseHeaders";
import RequestHeaders from "./headers/RequestHeaders";
import SectionInfo from "./SectionInfo";

interface HeadersProps {
  data?: any | null;
}

const Headers: React.FC<HeadersProps> = ({ data = null }) =>
  !data ? null : (
    <section className="w-full">
      <SectionInfo
        component={General}
        data={data}
        eventKey="general"
        isVisible
      />
      <SectionInfo
        component={RequestHeaders}
        data={data}
        eventKey="requestHeaders"
      />
      <SectionInfo
        component={ResponseHeaders}
        data={data}
        eventKey="responseHeaders"
      />
    </section>
  );

export default Headers;
