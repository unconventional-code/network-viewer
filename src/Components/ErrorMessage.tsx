import { ReactNode } from "react";

interface ErrorMessageProps {
  description?: ReactNode | null;
  title?: ReactNode | null;
}

export function ErrorMessage({
  title = null,
  description = null,
}: ErrorMessageProps) {
  return (
    <div
      id="error-message"
      data-testid="error-message"
      className="flex flex-col items-center justify-center p-xxl text-center"
    >
      {title && (
        <h4
          id="error-message-title"
          data-testid="error-message-title"
          className="text-h4 font-semibold text-brand-primary-dark-gray mb-s"
        >
          {title}
        </h4>
      )}
      {description && (
        <p
          id="error-message-description"
          data-testid="error-message-description"
          className="text-base text-brand-primary-gray"
        >
          {description}
        </p>
      )}
    </div>
  );
}
