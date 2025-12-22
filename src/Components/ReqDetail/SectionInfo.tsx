import { useState, ReactNode } from "react";

import { SectionTitle } from "./SectionTitle";

interface SectionInfoProps {
  component: (props: {
    data: any;
    isPayloadTransformed: boolean;
    onChangeEncode: () => void;
  }) => ReactNode;
  data?: any | null;
  eventKey:
    | "general"
    | "requestHeaders"
    | "responseHeaders"
    | "requestPayload"
    | "queryString"
    | "formData";
  isEncodeEnabled?: boolean;
  isParseEnabled?: boolean;
  isVisible?: boolean;
}

export function SectionInfo({
  eventKey,
  data = null,
  component,
  isEncodeEnabled = false,
  isParseEnabled = false,
  isVisible = false,
}: SectionInfoProps) {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [isPayloadTransformed, updateTransform] = useState(true);

  const handlePayloadTransform = () => updateTransform(!isPayloadTransformed);
  const ChildComponent = () =>
    component({
      data,
      isPayloadTransformed,
      onChangeEncode: handlePayloadTransform,
    });

  return (
    <>
      <SectionTitle
        eventKey={eventKey}
        isEncodeEnabled={isEncodeEnabled}
        isOpen={isOpen}
        isParseEnabled={isParseEnabled}
        isPayloadTransformed={isPayloadTransformed}
        onClick={() => setIsOpen(!isOpen)}
        onPayloadTransform={handlePayloadTransform}
      />
      {isOpen && <ChildComponent />}
    </>
  );
}
