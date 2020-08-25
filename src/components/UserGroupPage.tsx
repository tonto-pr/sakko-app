import * as React from "react";
import { useContext, useState } from "react";

import useAsyncState from "../lib/useAsyncState";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UserGroup from "./UserGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { GlobalContext } from "../lib/useGlobalContext";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

const UserGroupPage: React.FunctionComponent = () => {
  const context = useContext(GlobalContext);
  const apiClient = api.client(axiosAdapter.bind);

  const [userGroups, setUserGroups, loading] = useAsyncState(
    apiClient.user(context.globalContext.user.user_id.toString()).user_groups
      .get
  ) as [
    types.ShapeOfUserGroup[],
    React.Dispatch<React.SetStateAction<types.ShapeOfUserGroup[]>>,
    boolean,
    object
  ];

  const [newUserGroupName, setNewUserGroupName] = useState<string>("");
  const [showUserGroupModal, setShowUserGroupModal] = useState<boolean>(false);

  const handleUserGroupNameChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    setNewUserGroupName(value);
  };

  const openNewUserGroupModal = (): void => setShowUserGroupModal(true);
  const closeNewUserGroupModal = (): void => {
    setShowUserGroupModal(false);
  };

  function handleNewUserGroup(): void {
    apiClient.user_group
      .post({
        body: runtime.client.json({
          user_group_name: newUserGroupName,
        }),
      })
      .then((response) => {
        if (response.status === 200) {
          const userGroupId = response.value.value.user_group_id;
          apiClient.user_group.users.add
            .post({
              body: runtime.client.json([
                {
                  user_group_id: userGroupId,
                  user_id: context.globalContext.user.user_id,
                },
              ]),
            })
            .then((userAddResponse) => {
              if (userAddResponse.status === 200) {
                setUserGroups([...userGroups, response.value.value]);
                setNewUserGroupName("");
              }
            });
        }
      })
      .finally(closeNewUserGroupModal);
  }

  function handleUserGroupDelete(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const userGroupIdToDelete = event.target.getAttribute("usergroupid");
    apiClient
      .user_group(userGroupIdToDelete)
      .delete()
      .then((response) => {
        if (response.status === 200) {
          setUserGroups(
            userGroups.filter(
              (userGroup) =>
                userGroup.user_group_id.toString() !== userGroupIdToDelete
            )
          );
        }
      });
  }

  return (
    <>
      <Modal show={showUserGroupModal} onHide={closeNewUserGroupModal}>
        <Modal.Header closeButton>
          <Modal.Title>New User Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              value={newUserGroupName}
              onChange={handleUserGroupNameChange}
              placeholder="User Group Name"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeNewUserGroupModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNewUserGroup}>
            Add new user group
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>User Group ID</th>
                <th>User Group Name</th>
                <th>User group</th>
              </tr>
            </thead>
            <tbody>
              {userGroups &&
                userGroups.map((userGroup: types.ShapeOfUserGroup) => {
                  return (
                    <tr key={userGroup.user_group_id}>
                      <td>{userGroup.user_group_id}</td>
                      <td>
                        {userGroup.user_group_name}
                        <Button
                          usergroupid={userGroup.user_group_id}
                          onClick={handleUserGroupDelete}
                        >
                          delete me
                        </Button>
                      </td>
                      <td>
                        <UserGroup userGroup={userGroup} minified></UserGroup>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <Button onClick={openNewUserGroupModal}>New User Group</Button>
        </>
      )}
    </>
  );
};

export default UserGroupPage;
