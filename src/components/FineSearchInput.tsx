import * as React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

import { useState } from "react";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";

type FineSearchInputProps = {
  onChange: (fine: types.ShapeOfFine) => void;
  fineFilter?: (fine: types.ShapeOfFine) => boolean;
  placeholder?: string;
  userGroup?: types.ShapeOfUserGroup;
  isDisabled?: boolean;
};

type FineOptions = {
  value: types.ShapeOfFine;
  label: string;
  __isNew__?: boolean;
};

const FineSearchInput: React.FunctionComponent<FineSearchInputProps> = (
  props: FineSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultOptions, setDefaultOptions] = useState<FineOptions[]>([]);
  const fineOptions = async (inputValue: string): Promise<FineOptions[]> => {
    const queryParams: { query: string; user_group_id?: string } = {
      query: inputValue,
    };

    if (props.userGroup) {
      queryParams["user_group_id"] = props.userGroup.user_group_id.toString();
    }

    return apiClient.fine.search
      .get({
        query: queryParams,
      })
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

  const handleOnChange = (selectedOptions: FineOptions): void => {
    if (selectedOptions.__isNew__) {
      apiClient.fine
        .post({
          body: runtime.client.json({
            description: selectedOptions.label,
            amount: 100,
          }),
        })
        .then((response) => {
          if (response.status === 200) {
            const fine = response.value.value;
            apiClient.user_group.fines.add
              .post({
                body: runtime.client.json([
                  {
                    user_group_id: props.userGroup.user_group_id,
                    fine_id: fine.fine_id,
                  },
                ]),
              })
              .then((response) => {
                if (response.status === 200) {
                  props.onChange(fine);
                }
              });
          }
        });
    } else {
      props.onChange(selectedOptions.value);
    }
  };

  const handleFocus = (): void => {
    setLoading(true);

    const queryParams: { query: string; user_group_id?: string } = {
      query: "",
    };

    if (props.userGroup) {
      queryParams["user_group_id"] = props.userGroup.user_group_id.toString();
    }

    apiClient.fine.search
      .get({
        query: queryParams,
      })
      .then((response) => {
        if (response.status === 200) {
          let fines = response.value.value;
          if (props.fineFilter) {
            fines = fines.filter(props.fineFilter);
          }
          setDefaultOptions(
            fines.map((fine) => {
              return {
                value: fine,
                label: fine.description,
              };
            })
          );
        } else {
          setDefaultOptions([]);
        }
        setLoading(false);
      });
  };

  return (
    <AsyncCreatableSelect
      placeholder={props.placeholder}
      // cacheOptions
      defaultOptions={defaultOptions}
      onFocus={handleFocus}
      isLoading={loading}
      isDisabled={props.isDisabled}
      loadOptions={fineOptions}
      onChange={handleOnChange}
    />
  );
};

export default FineSearchInput;
