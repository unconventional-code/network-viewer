import { useState, ChangeEventHandler } from "react";
import { stringify } from "qs";

import { Button } from "../../../src/Components/Common/Button";
import { CORSCheckbox } from "./CORSCheckbox";

export function URLInput() {
  const [url, setURL] = useState("");
  const [isCORSEnabled, setCORS] = useState(false);
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    setURL(target.value);
  };

  const handleSubmit = () => {
    const { origin, pathname } = document.location;
    const newURL = `${origin}${pathname}?${stringify({
      file: url,
      isCORSEnabled,
    })}`;
    document.location.href = newURL;
  };

  return (
    <div
      id="url-input-container"
      data-testid="url-input-container"
      className="flex items-center gap-s w-full max-w-2xl"
    >
      <CORSCheckbox isEnabled={isCORSEnabled} onChange={setCORS} />
      <input
        id="url-input"
        data-testid="url-input"
        className="flex-1 px-s py-xs border border-border-color rounded-base text-h5 text-brand-primary-dark-gray outline-none focus:border-brand-blue"
        name="har-url"
        onChange={handleInputChange}
        placeholder="HAR file URL"
        type="text"
        value={url}
      />
      <Button
        id="url-input-submit-button"
        data-testid="url-input-submit-button"
        className="ml-s"
        onClick={handleSubmit}
      >
        GO
      </Button>
    </div>
  );
}
