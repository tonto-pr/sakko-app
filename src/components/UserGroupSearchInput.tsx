import * as React from "react";

import AsyncSelect from "react-select/async";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type UserGroupSearchInputProps = {
  onChange: (userGroup: types.ShapeOfUserGroup) => void;
  userGroupFilter?: (userGroup: types.ShapeOfUserGroup) => boolean;
  placeholder?: string;
};

type UserGroupOptions = { value: types.ShapeOfUserGroup; label: string };

const UserGroupSearchInput: React.FunctionComponent<UserGroupSearchInputProps> = (
  props: UserGroupSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const userGroupOptions = async (
    inputValue: string
  ): Promise<UserGroupOptions[]> => {
    return apiClient.user_group.search
      .get({ query: { query: inputValue } })
      .then((response) => {
        if (response.status === 200) {
          let userGroups = response.value.value;
          if (props.userGroupFilter) {
            userGroups = userGroups.filter(props.userGroupFilter);
          }
          return userGroups.map((userGroup) => {
            return {
              value: userGroup,
              label: userGroup.user_group_name,
            };
          });
        }
      });
  };

  const handleOnChange = (selectedOptions: UserGroupOptions): void =>
    props.onChange(selectedOptions.value);

  return (
    <AsyncSelect
      placeholder={props.placeholder}
      cacheOptions
      defaultOptions
      loadOptions={userGroupOptions}
      onChange={handleOnChange}
    />
  );
};

export default UserGroupSearchInput;
