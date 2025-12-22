import { Button } from "../Common/Button";
import { IconImport } from "../../icons/IconImport";
import { Tooltip } from "../Common/Tooltip/Tooltip";

export function ImportHarButton() {
  return (
    <Tooltip title="Import HAR">
      <Button className="p-0 w-8 h-8 min-w-8 h-[26px]">
        <IconImport className="w-4 h-4 fill-brand-primary-dark-gray" />
      </Button>
    </Tooltip>
  );
}
