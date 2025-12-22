import { forwardRef, ReactNode } from "react";
import { useTooltip } from "@react-aria/tooltip";
import { mergeProps } from "@react-aria/utils";
import classnames from "classnames";

interface TooltipLabelProps {
  state: any;
  className?: string;
  children: ReactNode;
  isOpen?: boolean;
  [key: string]: any;
}

export const TooltipLabel = forwardRef<HTMLDivElement, TooltipLabelProps>(
  ({ state, className = "", children, isOpen = false, ...props }, ref) => {
    const { tooltipProps } = useTooltip(props, state);
    return (
      <div
        ref={ref}
        className={classnames("absolute z-50 pointer-events-none", {
          "opacity-100 visible": isOpen,
          "opacity-0 invisible": !isOpen,
        })}
        {...mergeProps(props, tooltipProps)}
      >
        <span
          className={classnames(
            "inline-block px-s py-xs bg-white-39 text-white-100 text-h6 rounded-base shadow-lg max-w-xs",
            className
          )}
        >
          {children}
        </span>
      </div>
    );
  }
);

TooltipLabel.displayName = "TooltipLabel";
