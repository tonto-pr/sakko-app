import * as React from "react";

import { useState } from "react";

import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import * as types from "../../generated/common.types.generated";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type FineSearchInputProps = {
  onSearchResultClick: (fine: types.ShapeOfFine) => void;
  fineFilter?: (fine: types.ShapeOfFine) => boolean;
};

const FineSearchInput: React.FunctionComponent<FineSearchInputProps> = (
  props: FineSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const [fineSearchInputValue, setFineSearchInputValue] = useState<string>("");
  const [searchFines, setSearchFines] = useState<types.ShapeOfFine[]>([]);

  const handleValueChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    setFineSearchInputValue(value);
    apiClient.fine.search.get({ query: { query: value } }).then((response) => {
      if (response.status === 200) {
        let eligibleFines = response.value.value;
        if (props.fineFilter) {
          eligibleFines = eligibleFines.filter(props.fineFilter);
        }

        setSearchFines([...eligibleFines] as types.ShapeOfFine[]);
      } else {
        setSearchFines([]);
      }
    });
  };

  const handleSearchFineClick = ({
    target: { id },
  }: {
    target: { id: string };
  }): void => {
    const clickedFine = searchFines.filter(
      (fine) => fine.fine_id.toString() === id
    )[0];

    props.onSearchResultClick(clickedFine);
  };

  return (
    <Dropdown>
      <FormControl
        autoFocus
        className="mx-3 my-2 w-auto"
        placeholder="Fine description"
        onChange={handleValueChange}
        onFocus={handleValueChange}
        value={fineSearchInputValue}
      />
      <ul
        className="list-unstyled"
        style={{ overflow: "scroll", maxHeight: "100px" }}
      >
        {searchFines.map((fine) => (
          <Dropdown.Item
            key={fine.fine_id}
            id={fine.fine_id}
            onClick={handleSearchFineClick}
          >
            {fine.description}
          </Dropdown.Item>
        ))}
      </ul>
    </Dropdown>
  );
};

export default FineSearchInput;
