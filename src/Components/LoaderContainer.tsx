import React, { ReactNode } from 'react';

interface LoaderContainerProps {
  children?: ReactNode | null;
  show?: boolean;
  text?: string | ReactNode | null;
}

const LoaderContainer: React.FC<LoaderContainerProps> = ({
  children = null,
  show = true,
  text = null,
}) => {
  const colorBrandBlue = '#0E75DD';
  const uniqueId = `Gradient-${Math.round(Math.random() * 10000000)}`;

  return !show ? <>{children}</> : (
    <section className="flex flex-col items-center justify-center h-full w-full absolute inset-0 bg-white-100 bg-opacity-90 z-50">
      <div className="animate-spin-slow">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16"
        >
          <defs>
            <linearGradient id={uniqueId}>
              <stop
                offset="0%"
                stopColor={colorBrandBlue}
              />
              <stop
                offset="75%"
                stopColor={colorBrandBlue}
                stopOpacity="0"
              />
              <stop
                offset="100%"
                stopColor={colorBrandBlue}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            fill="transparent"
            r="43"
            stroke={`url(#${uniqueId})`}
            strokeWidth="14"
          />
        </svg>
      </div>
      { text && <p className="mt-m text-base text-brand-primary-gray">{text}</p> }
    </section>
  );
};

export default LoaderContainer;
