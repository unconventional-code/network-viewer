import classNames from "classnames";

import { useNetwork } from "../../state/network/Context";
import { Button } from "../Common/Button";
import { TYPE_FILTERS } from "../../constants";

export function TypeFilter() {
  const { state, actions } = useNetwork();
  const filter = state.typeFilter;

  return TYPE_FILTERS.map(({ name, filterBy }) => {
    const selectedFilter = filterBy.value === filter.value;

    return (
      <Button
        key={name}
        className={classNames({
          "text-white-100 bg-brand-blue": selectedFilter,
        })}
        onClick={() => actions.updateTypeFilter(filterBy)}
        variant="text"
      >
        {name}
      </Button>
    );
  });
}
