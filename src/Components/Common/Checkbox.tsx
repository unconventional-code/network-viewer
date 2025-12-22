import React, { ReactNode, ChangeEventHandler } from 'react';
import classNames from 'classnames';

interface CheckboxProps {
  children: ReactNode;
  containerClassName?: string;
  isChecked?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  title?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  containerClassName = '',
  isChecked = false,
  onChange,
  children,
  title = '',
}) => (
  <div className={classNames('flex items-center', containerClassName)}>
    <label
      className="flex items-center cursor-pointer"
      title={title}
    >
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

export default Checkbox;
