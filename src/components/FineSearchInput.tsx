import * as React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

import { useState, useContext } from "react";
import { groupBy } from "lodash";
import { GlobalContext } from "../lib/useGlobalContext";

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

type FineOption = {
  value: types.ShapeOfFineWithUserGroup;
  label: string;
  __isNew__?: boolean;
};

type GroupedFineOption = {
  label: string;
  options: FineOption[];
};

function groupFineOptions(fineOptions: FineOption[]): GroupedFineOption[] {
  const groupedFines = groupBy(fineOptions, (fineOption) => {
    return fineOption.value.user_group.user_group_name;
  });

  return Object.keys(groupedFines).map((userGroupName: string) => {
    return {
      label: userGroupName,
      options: groupedFines[userGroupName],
    };
  });
}

function mapFinesToOptions(
  fines: readonly types.FineWithUserGroup[]
): FineOption[] {
  return fines.map((fine) => {
    return {
      value: fine,
      label: fine.description,
    };
  });
}

const FineSearchInput: React.FunctionComponent<FineSearchInputProps> = (
  props: FineSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultOptions, setDefaultOptions] = useState<
    GroupedFineOption[] | FineOption[]
  >([]);

  async function getFines(
    inputValue = "",
    grouped = false
  ): Promise<GroupedFineOption[] | FineOption[]> {
    const queryParams: {
      query: string;
      user_group_id?: string;
      user_id?: string;
    } = {
      query: inputValue,
      user_id: context.globalContext.user.user_id.toString(),
    };

    // if (props.userGroup) {
    //   queryParams["user_group_id"] = props.userGroup.user_group_id.toString();
    // }

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

          const fineOptions = mapFinesToOptions(fines);

          if (grouped) {
            return groupFineOptions(fineOptions);
          }
          return fineOptions;
        } else {
          return [];
        }
      });
  }

  const fineOptions = async (
    inputValue: string
  ): Promise<GroupedFineOption[] | FineOption[]> => getFines(inputValue);

  const handleOnChange = (selectedOption: FineOption): void => {
    if (selectedOption.__isNew__) {
      apiClient.fine
        .post({
          body: runtime.client.json({
            description: selectedOption.label,
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
      props.onChange(selectedOption.value);
    }
  };

  const handleFocus = (): void => {
    setLoading(true);
    const emptySearchInput = "";
    const groupFines = true;
    getFines(emptySearchInput, groupFines).then((groupedFineOptions) => {
      setDefaultOptions(groupedFineOptions);
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
