import { Dropdown } from "../Common/Dropdown";
import { useNetwork } from "../../state/network/Context";
import { STATUS_FILTERS } from "../../constants";

export function StatusFilter() {
  const { state, actions } = useNetwork();
  const filter = state.statusFilter;

  return (
    <Dropdown
      items={STATUS_FILTERS}
      onChange={actions.updateStatusFilter}
      selected={filter}
    />
  );
}
