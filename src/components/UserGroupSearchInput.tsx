import * as React from "react";

import { useState } from "react";

import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import * as types from "../../generated/common.types.generated";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type UserGroupSearchInputProps = {
  onSearchResultClick: (userGroup: types.ShapeOfUserGroup) => void;
  userGroupFilter?: (userGroup: types.ShapeOfUserGroup) => boolean;
};

const UserGroupSearchInput: React.FunctionComponent<UserGroupSearchInputProps> = (
  props: UserGroupSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const [userGroupSearchInputValue, setUserGroupSearchInputValue] = useState<
    string
  >("");
  const [searchUserGroups, setSearchUserGroups] = useState<
    types.ShapeOfUserGroup[]
  >([]);

  const handleValueChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    setUserGroupSearchInputValue(value);
    apiClient.user_group.search
      .get({ query: { query: value } })
      .then((response) => {
        if (response.status === 200) {
          let eligibleUserGroups = response.value.value;
          if (props.userGroupFilter) {
            eligibleUserGroups = eligibleUserGroups.filter(
              props.userGroupFilter
            );
          }

          setSearchUserGroups([
            ...eligibleUserGroups,
          ] as types.ShapeOfUserGroup[]);
        } else {
          setSearchUserGroups([]);
        }
      });
  };

  const handleSearchUserGroupClick = ({
    target: { id },
  }: {
    target: { id: string };
  }): void => {
    const clickedUserGroup = searchUserGroups.filter(
      (userGroup) => userGroup.user_group_id.toString() === id
    )[0];

    props.onSearchResultClick(clickedUserGroup);
  };

  return (
    <Dropdown>
      <FormControl
        autoFocus
        className="mx-3 my-2 w-auto"
        placeholder="UserGroup name"
        onChange={handleValueChange}
        onFocus={handleValueChange}
        value={userGroupSearchInputValue}
      />
      <ul
        className="list-unstyled"
        style={{ overflow: "scroll", maxHeight: "100px" }}
      >
        {searchUserGroups.map((userGroup) => (
          <Dropdown.Item
            key={userGroup.user_group_id}
            id={userGroup.user_group_id}
            onClick={handleSearchUserGroupClick}
          >
            {userGroup.user_group_name}
          </Dropdown.Item>
        ))}
      </ul>
    </Dropdown>
  );
};

export default UserGroupSearchInput;
