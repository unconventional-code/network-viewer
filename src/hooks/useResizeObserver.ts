import { useEffect, useState } from "react";

/* eslint no-underscore-dangle: 0 */

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export function useResizeObserver(
  elementRef: React.RefObject<HTMLDivElement | null>
) {
  const [elementDims, setElementDims] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const ref = elementRef?.current;
    if (!ref) return;

    const onResize = debounce(() => {
      const currentRef = elementRef?.current;
      if (currentRef) {
        setElementDims({
          width: currentRef.clientWidth,
          height: currentRef.clientHeight,
        });
      }
    }, 50);

    const resizeObserver = new ResizeObserver(() => onResize());

    resizeObserver.observe(ref);

    return () => {
      resizeObserver.unobserve(ref);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { elementDims };
}
