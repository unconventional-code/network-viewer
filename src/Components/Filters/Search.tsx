import React, { ChangeEventHandler } from "react";

import { useNetwork } from "../../state/network/Context";

interface SearchProps {
  name: string;
  value?: string;
}

const Search: React.FC<SearchProps> = ({ name, value = "" }) => {
  const { actions } = useNetwork();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    actions.updateSearch({
      name,
      value: target.value,
    });
  };

  return (
    <input
      className="w-full px-s py-xs border border-border-color rounded-base text-h5 text-brand-primary-dark-gray outline-none focus:border-brand-blue"
      name="search"
      onChange={handleInputChange}
      placeholder="Search by URL"
      type="text"
      value={value}
    />
  );
};

export default Search;
