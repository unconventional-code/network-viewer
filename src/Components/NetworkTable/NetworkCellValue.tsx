import classNames from "classnames";

import { formatValue } from "../../utils";
import { VIEWER_FIELDS } from "../../constants";
import { Tooltip } from "../Common/Tooltip/Tooltip";

interface NetworkCellValueProps {
  datakey: string;
  onClick?: () => void;
  payload?: Record<string, any>;
  unit?: string | null;
}

export function NetworkCellValue({
  datakey,
  onClick = () => {},
  payload = {},
  unit = null,
}: NetworkCellValueProps) {
  const formattedValue = formatValue(datakey, payload[datakey], unit, payload);
  const shouldDisplayTooltip =
    datakey === VIEWER_FIELDS.file.key || payload.error;

  const getTitle = () => {
    if (datakey === VIEWER_FIELDS.file.key) {
      return payload.url;
    }
    if (payload.error) {
      return payload.error;
    }

    return formattedValue;
  };

  const baseClasses = "text-h5 text-brand-primary-dark-gray truncate";

  if (!shouldDisplayTooltip) {
    return (
      <div
        data-testid={`network-cell-${datakey}`}
        className={classNames(baseClasses, datakey)}
      >
        {formattedValue}
      </div>
    );
  }

  return (
    <Tooltip delay={500} title={getTitle()}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        data-testid={`network-cell-${datakey}`}
        className={classNames(baseClasses, "cursor-pointer", datakey)}
        onClick={onClick}
      >
        {formattedValue}
      </div>
    </Tooltip>
  );
}
