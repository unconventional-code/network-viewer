import React from "react";

interface ResponseHeadersProps {
  data?: any | null;
}

const ResponseHeaders: React.FC<ResponseHeadersProps> = ({ data = null }) => (
  <div className="px-xs-s py-s w-full">
    {data?.headers?.response?.map(
      ({ name, value }: { name: string; value: string }, index: number) => (
        <div
          key={`${name}-${index}`}
          className="m-0 text-small pb-xs last:pb-0"
        >
          <span className="font-bold pr-xs-s">{`${name}:`}</span>
          <span className="break-all">{value}</span>
        </div>
      )
    )}
  </div>
);

export default ResponseHeaders;
