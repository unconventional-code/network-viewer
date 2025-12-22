interface RequestHeadersProps {
  data?: any | null;
}

export function RequestHeaders({ data = null }: RequestHeadersProps) {
  return (
    <div className="px-xs-s py-s w-full">
      {data?.headers?.request?.map(
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
