import { useMemo } from "react";

import { CopyAllButton } from "../CopyAllButton";

interface RequestPayloadProps {
  data?: any | null;
  isPayloadTransformed: boolean;
}

// Component-specific utility: parses request payload JSON
const parseRequestPayload = (text: string) => {
  if (!text) return text;
  let parsedJson;
  try {
    parsedJson = JSON.stringify(JSON.parse(text), null, 2);
  } catch (err) {
    parsedJson = text;
  }
  return parsedJson;
};

export function RequestPayload({
  data = null,
  isPayloadTransformed,
}: RequestPayloadProps) {
  const payloadData = data?.headers?.postData?.text;
  const parsedData = useMemo(
    () => parseRequestPayload(payloadData),
    [payloadData]
  );
  const payload = isPayloadTransformed ? parsedData : payloadData;

  return (
    <div className="px-xs-s py-s w-full">
      <div className="text-small w-full flex flex-col">
        <div className="flex justify-end w-full -mt-xs-s bg-white-100 sticky top-0">
          <CopyAllButton text={payload} />
        </div>
        <div className="font-mono whitespace-pre-wrap break-all">{payload}</div>
      </div>
    </div>
  );
}
