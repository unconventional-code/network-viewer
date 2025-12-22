import FileSaver from "file-saver";

import { Button } from "../Common/Button";
import { IconDownload } from "../../icons/IconDownload";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { EMPTY_NETWORK_HAR } from "../../constants";
import { Har } from "har-format";

interface ExportHarButtonProps {
  rawData?: Har;
}

export function ExportHarButton({
  rawData = EMPTY_NETWORK_HAR,
}: ExportHarButtonProps) {
  const downloadHar = () => {
    const formattedHar = JSON.stringify(rawData, null, 2);

    FileSaver.saveAs(new Blob([formattedHar]), "network.har");
  };

  return (
    <Tooltip title="Export HAR">
      <Button
        id="export-har-button"
        data-testid="export-har-button"
        className="p-0 w-8 h-8 min-w-8 h-[26px]"
        onClick={downloadHar}
      >
        <IconDownload className="w-4 h-4 fill-brand-primary-dark-gray" />
      </Button>
    </Tooltip>
  );
}
