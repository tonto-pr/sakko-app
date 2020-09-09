import * as React from "react";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useContext } from "react";

import { GlobalContext } from "../lib/useGlobalContext";

import UserSearchInput from "./UserSearchInput";
import FineSearchInput from "./FineSearchInput";
import UserGroupSearchInput from "./UserGroupSearchInput";
type FineModalProps = {
  show: boolean;
  onHide: () => void;
};

const FineModal: React.FunctionComponent<FineModalProps> = (
  props: FineModalProps
) => {
  const context = useContext(GlobalContext);
  const apiClient = api.client(axiosAdapter.bind);

  const [receiverUser, setReceiverUser] = useState<types.ShapeOfUser>();
  const [userGroup, setUserGroup] = useState<types.ShapeOfUserGroup>();
  const [fine, setFine] = useState<types.ShapeOfFine>();

  const handleUserSearchResultClick = (user: types.ShapeOfUser): void => {
    setReceiverUser(user);
  };

  const handleUserGroupSearchResultClick = (
    userGroup: types.ShapeOfUserGroup
  ): void => {
    setUserGroup(userGroup);
  };

  const handleFineSearchResultClick = (fine: types.ShapeOfFine): void => {
    setFine(fine);
  };

  const handleGiveFineClick = (): void => {
    apiClient.fine.give.post({
      body: runtime.client.json({
        giver_user_id: context.globalContext.user.user_id,
        receiver_user_id: receiverUser.user_id,
        fine_id: fine.fine_id,
        user_group_id: userGroup.user_group_id,
      }),
    });

    props.onHide();
    setReceiverUser(undefined);
    setUserGroup(undefined);
    setFine(undefined);
  };

  return (
    <Modal centered show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>Give Fine</Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <UserGroupSearchInput
                onChange={handleUserGroupSearchResultClick}
                placeholder="Select User Group"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <UserSearchInput
                onChange={handleUserSearchResultClick}
                placeholder="Select User"
                userGroup={userGroup}
                isDisabled={!userGroup}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FineSearchInput
                onChange={handleFineSearchResultClick}
                placeholder="Reason for fine"
                userGroup={userGroup}
                isDisabled={!userGroup}
              />
            </Col>
          </Row>
        </Container>
        <Button onClick={handleGiveFineClick}>Give fine!</Button>
        {receiverUser && receiverUser.username}{" "}
        {userGroup && userGroup.user_group_name} {fine && fine.description}
      </Modal.Body>
    </Modal>
  );
};

export default FineModal;
