import { SECTION_TITLES, PAYLOAD_CAPTIONS } from "../../constants";
import { IconCaretDown } from "../../icons/IconCaretDown";
import { IconCaretRight } from "../../icons/IconCaretRight";

interface SectionTitleProps {
  eventKey: string;
  isEncodeEnabled?: boolean;
  isOpen?: boolean;
  isParseEnabled?: boolean;
  isPayloadTransformed?: boolean;
  onClick: (key: string) => void;
  onPayloadTransform: () => void;
}

export function SectionTitle({
  onClick,
  eventKey,
  isEncodeEnabled = false,
  isOpen = false,
  onPayloadTransform,
  isPayloadTransformed = true,
  isParseEnabled = false,
}: SectionTitleProps) {
  const payloadStatus =
    PAYLOAD_CAPTIONS[isParseEnabled ? "parse" : "encode"][
      String(isPayloadTransformed)
    ];

  return (
    <div className="flex items-center justify-between py-xs border-b border-border-color">
      <span
        className="flex items-center gap-xs text-h5 font-medium text-brand-primary-dark-gray cursor-pointer hover:text-brand-blue"
        onClick={() => onClick(SECTION_TITLES[eventKey].key)}
        role="button"
        tabIndex={0}
      >
        {isOpen ? (
          <IconCaretDown className="w-3 h-3 fill-brand-primary-dark-gray" />
        ) : (
          <IconCaretRight className="w-3 h-3 fill-brand-primary-dark-gray" />
        )}
        {SECTION_TITLES[eventKey].name}
      </span>
      {(isEncodeEnabled || isParseEnabled) && (
        <span
          className="text-h6 text-brand-primary-gray cursor-pointer hover:text-brand-blue"
          onClick={onPayloadTransform}
          role="button"
          tabIndex={0}
        >
          {`view ${payloadStatus}`}
        </span>
      )}
    </div>
  );
}
