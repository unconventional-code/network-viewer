import React, { forwardRef, ReactNode } from "react";
import classNames from "classnames";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string | null;
  type?: "submit" | "reset" | "button" | "menu";
  variant?: "default" | "text";
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      disabled = false,
      href = null,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "flex items-center justify-center px-xs py-xs-s text-h5 font-semibold no-underline cursor-pointer outline-none rounded-base";
    const defaultClasses =
      "border border-border-color bg-white-100 text-brand-primary-gray hover:bg-bg-blue-50";
    const textVariantClasses =
      variant === "text" ? "border-0 bg-transparent hover:bg-bg-blue-50" : "";
    const disabledClasses = disabled
      ? "cursor-not-allowed text-gray-lighter border-gray-lighter hover:border-gray-lighter [&_svg]:fill-gray-lighter"
      : "";
    const activeClasses =
      variant === "text"
        ? "[&.active]:text-white-100 [&.active]:bg-brand-blue"
        : "";

    const combinedClasses = classNames(
      baseClasses,
      variant === "text" ? textVariantClasses : defaultClasses,
      disabledClasses,
      activeClasses,
      className
    );

    if (href && !disabled) {
      return (
        // @ts-ignore
        <a ref={ref as any} className={combinedClasses} href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as any}
        className={combinedClasses}
        disabled={disabled}
        type={type as React.ButtonHTMLAttributes<HTMLButtonElement>["type"]}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
