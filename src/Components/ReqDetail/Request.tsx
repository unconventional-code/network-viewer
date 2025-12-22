import React from "react";

import QueryString from "./request/QueryString";
import FormData from "./request/FormData";
import SectionInfo from "./SectionInfo";
import RequestPayload from "./request/RequestPayload";

interface RequestProps {
  data?: any | null;
}

const Request: React.FC<RequestProps> = ({ data = null }) => {
  if (
    !data ||
    (!data.headers.postData?.text &&
      !data.headers.postData?.params &&
      !data.headers.queryString?.length)
  ) {
    return (
      <h4 className="flex items-center justify-center text-h4 w-full text-brand-primary-dark-gray">
        This request has no request data available.
      </h4>
    );
  }

  return (
    <section className="w-full">
      {data.headers.postData && data.headers.postData.text && (
        <SectionInfo
          component={RequestPayload}
          data={data}
          eventKey="requestPayload"
          isParseEnabled
          isVisible
        />
      )}
      {data.headers.queryString && !!data.headers.queryString.length && (
        <SectionInfo
          component={QueryString}
          data={data}
          eventKey="queryString"
          isEncodeEnabled
        />
      )}
      {data.headers.postData && data.headers.postData.params && (
        <SectionInfo
          component={FormData}
          data={data}
          eventKey="formData"
          isEncodeEnabled
        />
      )}
    </section>
  );
};

export default Request;
