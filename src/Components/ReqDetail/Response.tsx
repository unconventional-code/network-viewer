import { CopyAllButton } from "./CopyAllButton";

export function NoResponseText() {
  return (
    <h4 className="flex items-center justify-center text-h4 w-full text-brand-primary-dark-gray">
      This request has no response data available.
    </h4>
  );
}

interface ResponseProps {
  data?: any | null;
}

export function Response({ data = null }: ResponseProps) {
  const content = data && data.body ? data.body : null;

  if (!content) {
    return <NoResponseText />;
  }

  return (
    <div
      id="response-detail"
      data-testid="response-detail"
      className="px-xs-s py-s w-full"
    >
      <div className="text-small w-full flex flex-col">
        <div className="flex justify-end w-full -mt-xs-s bg-white-100 sticky top-0">
          <CopyAllButton text={content} />
        </div>
        <span
          id="response-content"
          data-testid="response-content"
          className="font-mono whitespace-pre-wrap break-all"
        >
          {content}
        </span>
      </div>
    </div>
  );
}
