import * as React from "react";

import AsyncSelect from "react-select/async";
import { useState } from "react";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type UserSearchInputProps = {
  onChange: (user: types.ShapeOfUser) => void;
  userFilter?: (user: types.ShapeOfUser) => boolean;
  placeholder?: string;
  userGroup?: types.ShapeOfUserGroup;
  isDisabled?: boolean;
};

type UserOptions = { value: types.ShapeOfUser; label: string };

const UserSearchInput: React.FunctionComponent<UserSearchInputProps> = (
  props: UserSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultOptions, setDefaultOptions] = useState<UserOptions[]>([]);
  const userOptions = async (inputValue: string): Promise<UserOptions[]> => {
    const queryParams: { query: string; user_group_id?: string } = {
      query: inputValue,
    };

    if (props.userGroup) {
      queryParams["user_group_id"] = props.userGroup.user_group_id.toString();
    }

    return apiClient.user.search
      .get({ query: queryParams })
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

  const handleFocus = (): void => {
    setLoading(true);

    const queryParams: { query: string; user_group_id?: string } = {
      query: "",
    };

    if (props.userGroup) {
      queryParams["user_group_id"] = props.userGroup.user_group_id.toString();
    }

    apiClient.user.search.get({ query: queryParams }).then((response) => {
      if (response.status === 200) {
        let users = response.value.value;
        if (props.userFilter) {
          users = users.filter(props.userFilter);
        }
        setDefaultOptions(
          users.map((user) => {
            return {
              value: user,
              label: user.username,
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
    <AsyncSelect
      placeholder={props.placeholder}
      defaultOptions={defaultOptions}
      onFocus={handleFocus}
      isLoading={loading}
      isDisabled={props.isDisabled}
      loadOptions={userOptions}
      onChange={handleOnChange}
    />
  );
};

export default UserSearchInput;
