import * as React from "react";

import { useState, useContext } from "react";
import { GlobalContext } from "../lib/useGlobalContext";

import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import * as types from "../../generated/common.types.generated";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";

type UserSearchInputProps = {
  onSearchResultClick: (user: types.ShapeOfUser) => void;
  userFilter?: (user: types.ShapeOfUser) => boolean;
  includeCurrentUser?: boolean;
};

const UserSearchInput: React.FunctionComponent<UserSearchInputProps> = (
  props: UserSearchInputProps
) => {
  const apiClient = api.client(axiosAdapter.bind);
  const { globalContext } = useContext(GlobalContext);

  const [userSearchInputValue, setUserSearchInputValue] = useState<string>("");
  const [searchUsers, setSearchUsers] = useState<types.ShapeOfUser[]>([]);

  function noCurrentUser(user: types.ShapeOfUser): boolean {
    return user.user_id !== globalContext.user.user_id;
  }

  const handleValueChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    setUserSearchInputValue(value);
    apiClient.user.search.get({ query: { query: value } }).then((response) => {
      if (response.status === 200) {
        let eligibleUsers = response.value.value;
        if (props.userFilter) {
          eligibleUsers = eligibleUsers.filter(props.userFilter);
        }
        if (!props.includeCurrentUser) {
          eligibleUsers = eligibleUsers.filter(noCurrentUser);
        }

        setSearchUsers([...eligibleUsers] as types.ShapeOfUser[]);
      } else {
        setSearchUsers([]);
      }
    });
  };

  const handleSearchUserClick = ({
    target: { id },
  }: {
    target: { id: string };
  }): void => {
    const clickedUser = searchUsers.filter(
      (user) => user.user_id.toString() === id
    )[0];

    props.onSearchResultClick(clickedUser);
  };

  return (
    <Dropdown>
      <FormControl
        autoFocus
        className="mx-3 my-2 w-auto"
        placeholder="Username"
        onChange={handleValueChange}
        onFocus={handleValueChange}
        value={userSearchInputValue}
      />
      <ul
        className="list-unstyled"
        style={{ overflow: "scroll", maxHeight: "100px" }}
      >
        {searchUsers.map((user) => (
          <Dropdown.Item
            key={user.user_id}
            id={user.user_id}
            onClick={handleSearchUserClick}
          >
            {user.username}
          </Dropdown.Item>
        ))}
      </ul>
    </Dropdown>
  );
};

export default UserSearchInput;
