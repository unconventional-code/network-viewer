interface ResponseHeadersProps {
  data?: any | null;
}

export function ResponseHeaders({ data = null }: ResponseHeadersProps) {
  return (
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
}
