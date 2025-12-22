import React from "react";

import Checkbox from "../../../src/Components/Common/Checkbox";

interface CORSCheckboxProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

const CORSCheckbox: React.FC<CORSCheckboxProps> = ({ isEnabled, onChange }) => {
  const handleChange = () => {
    onChange(!isEnabled);
  };

  return (
    <Checkbox
      containerClassName="pr-6 text-right min-w-[110px]"
      isChecked={isEnabled}
      onChange={handleChange}
      title="CORS Enable"
    >
      CORS
    </Checkbox>
  );
};

export default CORSCheckbox;
