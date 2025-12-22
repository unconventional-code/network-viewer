import { Button } from "../Common/Button";
import { IconReset } from "../../icons/IconReset";
import { useNetwork } from "../../state/network/Context";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { useTheme } from "../../state/theme/Context";

export function ResetButton() {
  const { actions, callbacks } = useNetwork();
  const { showImportHar } = useTheme();

  const handleReset = () => {
    actions.resetState();
    if (callbacks.onReset) {
      callbacks.onReset();
    }

    if (showImportHar) {
      window.history.pushState({}, document.title, "/");
    }
  };

  return (
    <Tooltip title="Reset">
      <Button className="p-0 w-8 h-8 min-w-8 h-[26px]" onClick={handleReset}>
        <IconReset className="w-4 h-4 fill-brand-primary-dark-gray" />
      </Button>
    </Tooltip>
  );
}
