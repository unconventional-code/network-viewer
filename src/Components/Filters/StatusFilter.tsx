import { Dropdown } from "../Common/Dropdown";
import { useNetwork } from "../../state/network/Context";
import { STATUS_FILTERS } from "../../constants";

export function StatusFilter() {
  const { state, actions } = useNetwork();
  const filter = state.statusFilter;

  return (
    <Dropdown
      id="status-filter"
      data-testid="status-filter"
      items={STATUS_FILTERS}
      onChange={(item) =>
        actions.updateStatusFilter({
          name: item.name,
          value: item.value as string | null,
        })
      }
      selected={filter}
    />
  );
}
