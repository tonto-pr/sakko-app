import * as React from "react";

import AsyncSelect from "react-select/async";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type FineSearchInputProps = {
  onChange: (fine: types.ShapeOfFine) => void;
  fineFilter?: (fine: types.ShapeOfFine) => boolean;
  placeholder?: string;
};

type FineOptions = { value: types.ShapeOfFine; label: string };

const FineSearchInput: React.FunctionComponent<FineSearchInputProps> = (
  props: FineSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const fineOptions = async (inputValue: string): Promise<FineOptions[]> => {
    return apiClient.fine.search
      .get({ query: { query: inputValue } })
      .then((response) => {
        if (response.status === 200) {
          let fines = response.value.value;
          if (props.fineFilter) {
            fines = fines.filter(props.fineFilter);
          }
          return fines.map((fine) => {
            return {
              value: fine,
              label: fine.description,
            };
          });
        }
      });
  };

  const handleOnChange = (selectedOptions: FineOptions): void =>
    props.onChange(selectedOptions.value);

  return (
    <AsyncSelect
      placeholder={props.placeholder}
      cacheOptions
      defaultOptions
      loadOptions={fineOptions}
      onChange={handleOnChange}
    />
  );
};

export default FineSearchInput;
