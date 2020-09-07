import * as React from "react";

import AsyncSelect from "react-select/async";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type UserSearchInputProps = {
  onChange: (user: types.ShapeOfUser) => void;
  userFilter?: (user: types.ShapeOfUser) => boolean;
  placeholder?: string;
};

type UserOptions = { value: types.ShapeOfUser; label: string };

const UserSearchInput: React.FunctionComponent<UserSearchInputProps> = (
  props: UserSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const userOptions = async (inputValue: string): Promise<UserOptions[]> => {
    return apiClient.user.search
      .get({ query: { query: inputValue } })
      .then((response) => {
        if (response.status === 200) {
          let users = response.value.value;
          if (props.userFilter) {
            users = users.filter(props.userFilter);
          }
          return users.map((user) => {
            return {
              value: user,
              label: user.username,
            };
          });
        }
      });
  };

  const handleOnChange = (selectedOptions: UserOptions): void =>
    props.onChange(selectedOptions.value);

  return (
    <AsyncSelect
      placeholder={props.placeholder}
      cacheOptions
      defaultOptions
      loadOptions={userOptions}
      onChange={handleOnChange}
    />
  );
};

export default UserSearchInput;
