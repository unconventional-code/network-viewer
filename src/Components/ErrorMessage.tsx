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
    <div className="flex flex-col items-center justify-center p-xxl text-center">
      {title && (
        <h4 className="text-h4 font-semibold text-brand-primary-dark-gray mb-s">
          {title}
        </h4>
      )}
      {description && (
        <p className="text-base text-brand-primary-gray">{description}</p>
      )}
    </div>
  );
}
