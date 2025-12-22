import { Checkbox } from "../../../src/Components/Common/Checkbox";

interface CORSCheckboxProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function CORSCheckbox({ isEnabled, onChange }: CORSCheckboxProps) {
  const handleChange = () => {
    onChange(!isEnabled);
  };

  return (
    <Checkbox
      id="cors-checkbox"
      data-testid="cors-checkbox"
      containerClassName="pr-6 text-right min-w-[110px]"
      isChecked={isEnabled}
      onChange={handleChange}
      title="CORS Enable"
    >
      CORS
    </Checkbox>
  );
}
