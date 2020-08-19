import * as React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { GlobalContext } from "../../app";
import { useState, useContext, useEffect } from "react";
import styled from "styled-components";

import * as api from "../../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../../generated/common.types.generated";

const apiClient = api.client(axiosAdapter.bind);

const StyledProfile = styled.div`
  margin: auto;
`;

const placeholderImageUrl =
  "https://image.flaticon.com/icons/png/512/21/21294.png";

type UserFields = {
  [key: string]: {
    edit: boolean;
    value: string;
  };
  username: {
    edit: boolean;
    value: string;
  };
  email: {
    edit: boolean;
    value: string;
  };
};

const ProfilePage: React.FunctionComponent = () => {
  const context = useContext(GlobalContext);
  const [userFields, setUserFields] = useState<UserFields>({
    username: {
      edit: false,
      value: context.globalContext.user.username,
    },
    email: {
      edit: false,
      value: context.globalContext.user.email,
    },
  });

  useEffect(() => {
    setUserFields({
      username: {
        edit: false,
        value: context.globalContext.user.username,
      },
      email: {
        edit: false,
        value: context.globalContext.user.email,
      },
    });
  }, [context.globalContext.user]);

  function handleCheckboxChange({
    target: { id },
    target: { checked },
  }: {
    target: { id: string; checked: boolean };
  }): void {
    const value = !checked
      ? context.globalContext.user[id]
      : userFields[id].value;

    setUserFields({
      ...userFields,
      [id]: {
        value,
        edit: checked,
      } as { value: string; edit: boolean },
    });
  }

  function handleInputChange({
    target: { id },
    target: { value },
  }: {
    target: { id: string; value: string };
  }): void {
    setUserFields({
      ...userFields,
      [id]: {
        ...userFields[id],
        value: value,
      },
    });
  }

  function handleEditClick(): void {
    const userData = Object.keys(userFields).reduce((acc, next) => {
      return {
        ...acc,
        [next]: userFields[next].value,
      };
    }, {});

    apiClient
      .user(context.globalContext.user.user_id.toString())
      .put({
        body: runtime.client.json(userData as types.ShapeOfUser),
      })
      .then((response) => {
        if (response.status === 200) {
          context.setGlobalContext({
            ...context.globalContext,
            user: response.value.value,
          });
        }
      });
  }

  return (
    <StyledProfile>
      <Card>
        <Card.Img variant="top" src={placeholderImageUrl} />
        <Card.Body>
          <Card.Title>{context.globalContext.user.username}</Card.Title>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>ID</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl readOnly value={context.globalContext.user.user_id} />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              readOnly={!userFields.username.edit}
              value={userFields.username.value}
              onChange={handleInputChange}
              id="username"
            />
            <InputGroup.Append>
              {userFields.username.edit && (
                <Button onClick={handleEditClick}>Edit</Button>
              )}
              <InputGroup.Checkbox
                onChange={handleCheckboxChange}
                id="username"
                checked={userFields.username.edit}
              />
            </InputGroup.Append>
          </InputGroup>
          <InputGroup className="mb-2">
            <FormControl
              readOnly={!userFields.email.edit}
              value={userFields.email.value}
              onChange={handleInputChange}
              id="email"
            />
            <InputGroup.Append>
              {userFields.email.edit && (
                <Button onClick={handleEditClick}>Edit</Button>
              )}
              <InputGroup.Checkbox
                checked={userFields.email.edit}
                onChange={handleCheckboxChange}
                id="email"
              />
            </InputGroup.Append>
          </InputGroup>
        </Card.Body>
      </Card>
    </StyledProfile>
  );
};

export default ProfilePage;
