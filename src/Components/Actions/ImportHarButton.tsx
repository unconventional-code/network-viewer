import React from "react";

import Button from "../Common/Button";
import IconUpload from "../../icons/IconImport";
import Tooltip from "../Common/Tooltip/Tooltip";

const ImportHarButton: React.FC = () => (
  <Tooltip title="Import HAR">
    <Button className="p-0 w-8 h-8 min-w-8 h-[26px]">
      <IconUpload className="w-4 h-4 fill-brand-primary-dark-gray" />
    </Button>
  </Tooltip>
);

export default ImportHarButton;
