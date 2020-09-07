import * as React from "react";

import { useState } from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import useAsyncState from "../lib/useAsyncState";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";
import AssetSearchInput from "./AssetSearchInput";

type UserGroupProps = {
  userGroup: types.ShapeOfUserGroup;
  minified: boolean;
};

const UserGroup: React.FunctionComponent<UserGroupProps> = (
  props: UserGroupProps
) => {
  const apiClient = api.client(axiosAdapter.bind);

  const [showAddUsersModal, setShowAddUsersModal] = useState<boolean>(false);
  const [showDeleteUsersModal, setShowDeleteUsersModal] = useState<boolean>(
    false
  );
  const [toAddUsers, setToAddUsers] = useState<types.ShapeOfUser[]>([]);
  const [toDeleteUsers, setToDeleteUsers] = useState<types.ShapeOfUser[]>([]);
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

  const openDeleteUsersModal = (): void => {
    setToDeleteUsers([]);
    setShowDeleteUsersModal(true);
  };
  const closeDeleteUsersModal = (): void => setShowDeleteUsersModal(false);

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
          const addedUsers = response.value.value.map(
            (userGroupUser) => userGroupUser.user
          );
          setUserGroupUsers([...userGroupUsers, ...addedUsers]);
        }
      })
      .finally(() => {
        closeAddUsersModal();
      });
  }

  function handleDeleteUserClick(): void {
    const deleteUsersPayload = toDeleteUsers.map((user) => {
      return {
        user_group_id: props.userGroup.user_group_id,
        user_id: user.user_id,
      };
    });
    apiClient.user_group.users.delete
      .post({
        body: runtime.client.json(deleteUsersPayload),
      })
      .then((response) => {
        if (response.status === 200) {
          const deletedUsers = response.value.value.map(
            (userGroupUser) => userGroupUser.user
          );

          const newUserGroupUsers = userGroupUsers.filter((userGroupUser) => {
            return !deletedUsers.some((toDeleteUser) => {
              return userGroupUser.user_id === toDeleteUser.user_id;
            });
          });

          setUserGroupUsers(newUserGroupUsers);
        }
      })
      .finally(() => {
        closeDeleteUsersModal();
      });
  }

  const handleUserSearchResultClick = (user: types.ShapeOfUser): void => {
    setToAddUsers([...toAddUsers, user] as types.ShapeOfUser[]);
  };

  const handleUserSearchResultClickDelete = (user: types.ShapeOfUser): void => {
    setToDeleteUsers([...toDeleteUsers, user] as types.ShapeOfUser[]);
  };

  const noExistingUserGroupUsers = (user: types.ShapeOfUser): boolean => {
    return !userGroupUsers.some((userGroupUser) => {
      return userGroupUser.user_id === user.user_id;
    });
  };

  const onlyUserGroupUsers = (user: types.ShapeOfUser): boolean => {
    return userGroupUsers.some((userGroupUser) => {
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
          <AssetSearchInput
            type="user"
            assetFilter={noExistingUserGroupUsers}
            onChange={handleUserSearchResultClick}
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
      <Modal show={showDeleteUsersModal} onHide={closeDeleteUsersModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete users from {props.userGroup.user_group_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AssetSearchInput
            type="user"
            assetFilter={onlyUserGroupUsers}
            onChange={handleUserSearchResultClickDelete}
          />
        </Modal.Body>
        <Modal.Footer>
          <ul
            className="list-unstyled"
            style={{ overflow: "scroll", maxHeight: "100px" }}
          >
            {toDeleteUsers.map((user) => {
              return <li key={user.user_id}>{user.username}</li>;
            })}
          </ul>
          <Button variant="secondary" onClick={closeDeleteUsersModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDeleteUserClick}>
            DeleteUser
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
                <Dropdown.Item onClick={openDeleteUsersModal}>
                  Delete users
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
