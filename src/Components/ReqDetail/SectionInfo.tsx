import React, { useState, ReactNode } from "react";

import SectionTitle from "./SectionTitle";

interface SectionInfoProps {
  component: (props: {
    data: any;
    isPayloadTransformed: boolean;
    onChangeEncode: () => void;
  }) => ReactNode;
  data?: any | null;
  eventKey: string;
  isEncodeEnabled?: boolean;
  isParseEnabled?: boolean;
  isVisible?: boolean;
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  eventKey,
  data = null,
  component,
  isEncodeEnabled = false,
  isParseEnabled = false,
  isVisible = false,
}) => {
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
};

export default SectionInfo;
