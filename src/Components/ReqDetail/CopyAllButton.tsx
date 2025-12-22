import React, { useRef, useState, ReactNode } from "react";

import Button from "../Common/Button";
import IconCopy from "../../icons/IconCopy";
import IconCheckMark from "../../icons/IconCheckMark";

interface CopyAllButtonProps {
  text?: string | ReactNode;
}

const CopyAllButton: React.FC<CopyAllButtonProps> = ({ text = "" }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = () => {
    const textToCopy = typeof text === "string" ? text : String(text);
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <Button className="gap-xs" onClick={copy} variant="text">
      {isCopied ? (
        <IconCheckMark className="w-4 h-4 fill-brand-primary-dark-gray" />
      ) : (
        <IconCopy className="w-4 h-4 fill-brand-primary-dark-gray" />
      )}
      <span className="text-h5">{isCopied ? "Copied!" : "Copy All"}</span>
    </Button>
  );
};

export default CopyAllButton;
