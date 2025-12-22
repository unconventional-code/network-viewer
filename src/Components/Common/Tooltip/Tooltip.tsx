import React, { useState, useRef, useEffect, ReactNode } from "react";
import classnames from "classnames";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactElement;
  className?: string;
  delay?: number;
  placement?: TooltipPlacement;
  title: ReactNode;
}

export function Tooltip({
  children,
  className = "",
  delay = 100,
  placement = "top",
  title,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - offset;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + offset;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - offset;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.right + scrollX + offset;
        break;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Use requestAnimationFrame to ensure the tooltip is rendered before calculating position
      requestAnimationFrame(() => {
        updatePosition();
      });
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const child = React.Children.only(children) as React.ReactElement<any>;
  const childProps = child.props as any;

  const triggerElement = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (typeof childProps.ref === "function") {
        childProps.ref(node);
      } else if (childProps.ref) {
        childProps.ref.current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      if (childProps.onMouseEnter) {
        childProps.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      if (childProps.onMouseLeave) {
        childProps.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      if (childProps.onFocus) {
        childProps.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      if (childProps.onBlur) {
        childProps.onBlur(e);
      }
    },
  } as any);

  return (
    <>
      {triggerElement}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <span
            className={classnames(
              "inline-block px-s py-xs bg-white-39 text-white-100 text-h6 rounded-base shadow-lg max-w-xs",
              className
            )}
          >
            {title}
          </span>
        </div>
      )}
    </>
  );
}
