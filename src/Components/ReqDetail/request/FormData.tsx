import React from "react";

interface FormDataProps {
  data?: any | null;
  isPayloadTransformed: boolean;
}

const FormData: React.FC<FormDataProps> = ({
  data = null,
  isPayloadTransformed,
}) => (
  <div className="px-xs-s py-s w-full">
    {data?.headers?.postData?.params?.map(
      ({ name, value }: { name: string; value: string }, index: number) => (
        <div
          key={`${name}-${index}`}
          className="m-0 text-small pb-xs last:pb-0"
        >
          <span className="font-bold pr-xs-s">{`${name}:`}</span>
          <span className="break-all">
            {isPayloadTransformed ? decodeURIComponent(value) : value}
          </span>
        </div>
      )
    )}
  </div>
);

export default FormData;
