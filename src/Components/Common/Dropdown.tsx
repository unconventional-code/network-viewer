import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import Button from "./Button";
import IconChevronDown from "../../icons/IconChevronDown";
import IconChevronUp from "../../icons/IconChevronUp";

interface DropdownItem {
  name: string;
  value: string | number;
}

interface DropdownProps {
  className?: string | null;
  items: DropdownItem[];
  onChange: (item: DropdownItem) => void;
  selected?: DropdownItem | null;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  selected = null,
  onChange,
  className = null,
}) => {
  const [isExpand, setExpand] = useState(false);
  const [selectedKey, setSelection] = useState<DropdownItem>(
    selected !== null ? selected : items[0]
  );
  const dropdownItemsRef = useRef<HTMLSpanElement>(null);
  const isExpandRef = useRef(isExpand);

  const updateToggle = (toggleState: boolean) => {
    setExpand(toggleState);
    isExpandRef.current = toggleState;
  };

  const handleItemSelection = (key: DropdownItem) => {
    setSelection(key);
    onChange(key);
    updateToggle(false);
  };

  const removeFocus = ({ target }: MouseEvent) => {
    if (
      isExpandRef.current &&
      dropdownItemsRef.current &&
      !dropdownItemsRef.current.contains(target as Node)
    ) {
      updateToggle(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", removeFocus);

    return () => {
      window.removeEventListener("click", removeFocus);
    };
  }, []);

  useEffect(() => {
    if (selected !== null) {
      setSelection(selected);
    }
  }, [selected]);

  return (
    <span ref={dropdownItemsRef} className={classNames("relative", className)}>
      <Button
        className={classNames(
          "flex justify-between w-[8.5rem] font-medium text-h5 text-brand-primary-dark-gray",
          {
            "hover:bg-white-100": true,
            "active:bg-white-100": isExpand,
            "rounded-base rounded-b-none": isExpand,
          }
        )}
        onClick={() => updateToggle(!isExpand)}
      >
        <>
          {`Status: ${selectedKey.name}`}
          {isExpand ? (
            <IconChevronDown className="h-s w-s pointer-events-none" />
          ) : (
            <IconChevronUp className="h-s w-s pointer-events-none" />
          )}
        </>
      </Button>
      {isExpand && (
        <ul className="absolute z-[1000] top-0 left-px mt-0.5 p-0 border border-border-color rounded-none rounded-b-xs w-[7.5rem] text-left list-none bg-white-100 bg-clip-padding transform translate-x-[-1px] translate-y-[23px]">
          {items.map((item, index) => (
            <li
              key={item.value}
              className={classNames(
                "block w-full p-0 clear-both text-inherit whitespace-nowrap bg-transparent border-0 font-medium text-h5 text-brand-primary-dark-gray",
                {
                  "bg-bg-blue-50 text-brand-primary-dark-gray":
                    item.value === selectedKey.value,
                  "hover:bg-bg-gray-90": item.value !== selectedKey.value,
                }
              )}
            >
              <span
                className="block cursor-pointer py-1 px-6"
                onClick={() => handleItemSelection(item)}
                role="button"
                tabIndex={index}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
};

export default Dropdown;
