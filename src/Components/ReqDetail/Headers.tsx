import { General } from "./headers/General";
import { ResponseHeaders } from "./headers/ResponseHeaders";
import { RequestHeaders } from "./headers/RequestHeaders";
import { SectionInfo } from "./SectionInfo";

interface HeadersProps {
  data?: any | null;
}

export function Headers({ data = null }: HeadersProps) {
  if (!data) {
    return null;
  }
  return (
    <section
      id="headers-detail"
      data-testid="headers-detail"
      className="w-full"
    >
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
}
