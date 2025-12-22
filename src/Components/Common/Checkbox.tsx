import { ReactNode, ChangeEventHandler } from "react";
import classNames from "classnames";

interface CheckboxProps {
  children: ReactNode;
  containerClassName?: string;
  id?: string;
  "data-testid"?: string;
  isChecked?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  title?: string;
}

export function Checkbox({
  containerClassName = "",
  isChecked = false,
  onChange,
  children,
  title = "",
  id,
  "data-testid": dataTestId,
}: CheckboxProps) {
  return (
    <div
      className={classNames("flex items-center", containerClassName)}
      id={id ? `${id}-container` : undefined}
      data-testid={dataTestId ? `${dataTestId}-container` : undefined}
    >
      <label className="flex items-center cursor-pointer" title={title}>
        <input
          id={id}
          data-testid={dataTestId || "checkbox"}
          checked={isChecked}
          className="mr-s w-4 h-4 cursor-pointer"
          name="checkbox"
          onChange={onChange}
          type="checkbox"
        />
        {children}
      </label>
    </div>
  );
}
