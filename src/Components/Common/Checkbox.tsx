import { ReactNode, ChangeEventHandler } from "react";
import classNames from "classnames";

interface CheckboxProps {
  children: ReactNode;
  containerClassName?: string;
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
}: CheckboxProps) {
  return (
    <div className={classNames("flex items-center", containerClassName)}>
      <label className="flex items-center cursor-pointer" title={title}>
        <input
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
