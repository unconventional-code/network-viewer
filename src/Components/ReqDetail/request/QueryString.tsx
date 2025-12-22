import React from "react";

interface QueryStringProps {
  data?: any | null;
  isPayloadTransformed: boolean;
}

const QueryString: React.FC<QueryStringProps> = ({
  data = null,
  isPayloadTransformed,
}) => (
  <div className="px-xs-s py-s w-full">
    {data?.headers?.queryString?.map(
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

export default QueryString;
