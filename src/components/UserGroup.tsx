import * as React from "react";

import { useState } from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import UserSearchInput from "./UserSearchInput";
import useAsyncState from "../lib/useAsyncState";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

type UserGroupProps = {
  userGroup: types.ShapeOfUserGroup;
  minified: boolean;
};

const UserGroup: React.FunctionComponent<UserGroupProps> = (
  props: UserGroupProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const [showAddUsersModal, setShowAddUsersModal] = useState<boolean>(false);
  const [toAddUsers, setToAddUsers] = useState<types.ShapeOfUser[]>([]);
  const [userGroupUsers, setUserGroupUsers, loading] = useAsyncState(
    apiClient.user_group(props.userGroup.user_group_id.toString()).users.get
  ) as [
    types.ShapeOfUser[],
    React.Dispatch<React.SetStateAction<types.ShapeOfUser[]>>,
    boolean,
    object
  ];

  const openAddUsersModal = (): void => {
    setToAddUsers([]);
    setShowAddUsersModal(true);
  };
  const closeAddUsersModal = (): void => setShowAddUsersModal(false);

  function handleAddUserClick(): void {
    const addUsersPayload = toAddUsers.map((user) => {
      return {
        user_group_id: props.userGroup.user_group_id,
        user_id: user.user_id,
      };
    });
    apiClient.user_group.users.add
      .post({
        body: runtime.client.json(addUsersPayload),
      })
      .then((response) => {
        if (response.status === 200) {
          Promise.all(
            response.value.value.map(async (user) => {
              const userResponse = await apiClient
                .user(user.user_id.toString())
                .get();
              if (userResponse.status === 200) {
                return userResponse.value.value;
              }
              return undefined;
            })
          ).then((response) => {
            setUserGroupUsers([...userGroupUsers, ...response]);
          });
        }
      })
      .finally(() => {
        closeAddUsersModal();
      });
  }

  const handleUserSearchResultClick = (user: types.ShapeOfUser): void => {
    setToAddUsers([...toAddUsers, user] as types.ShapeOfUser[]);
  };

  const noExistingUserGroupUsers = (user: types.ShapeOfUser): boolean => {
    return !userGroupUsers.some((userGroupUser) => {
      return userGroupUser.user_id === user.user_id;
    });
  };

  return (
    <>
      <Modal show={showAddUsersModal} onHide={closeAddUsersModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add users to {props.userGroup.user_group_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserSearchInput
            userFilter={noExistingUserGroupUsers}
            onSearchResultClick={handleUserSearchResultClick}
          />
        </Modal.Body>
        <Modal.Footer>
          <ul
            className="list-unstyled"
            style={{ overflow: "scroll", maxHeight: "100px" }}
          >
            {toAddUsers.map((user) => {
              return <li key={user.user_id}>{user.username}</li>;
            })}
          </ul>
          <Button variant="secondary" onClick={closeAddUsersModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUserClick}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
      {props.minified ? (
        <ListGroup horizontal>
          <ListGroup.Item>{props.userGroup.user_group_name}</ListGroup.Item>
          <ListGroup.Item>
            {!loading &&
              userGroupUsers.map((user) => (
                <div key={user.user_id}>{user.username}</div>
              ))}
          </ListGroup.Item>
          <ListGroup.Item>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Options
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={openAddUsersModal}>
                  Add users
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ListGroup.Item>
        </ListGroup>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserGroup;
