import { useState } from "react";

import { Button } from "../Common/Button";
import { IconPause } from "../../icons/IconPause";
import { useNetwork } from "../../state/network/Context";
import { IconResume } from "../../icons/IconResume";
import { Tooltip } from "../Common/Tooltip/Tooltip";

export function PauseResumeButton() {
  const { callbacks } = useNetwork();
  const [isPaused, setIsPaused] = useState(false);

  const pause = () => {
    setIsPaused(true);
    if (callbacks.onPause) {
      callbacks.onPause();
    }
  };

  const resume = () => {
    setIsPaused(false);
    if (callbacks.onResume) {
      callbacks.onResume();
    }
  };

  return (
    <Tooltip title={isPaused ? "Resume" : "Pause"}>
      <Button
        id="pause-resume-button"
        data-testid="pause-resume-button"
        data-paused={isPaused}
        className="p-0 w-8 h-8 min-w-8 h-[26px]"
        onClick={isPaused ? resume : pause}
      >
        {isPaused ? (
          <IconResume className="w-4 h-4 fill-brand-primary-dark-gray" />
        ) : (
          <IconPause className="w-4 h-4 fill-brand-primary-dark-gray" />
        )}
      </Button>
    </Tooltip>
  );
}
