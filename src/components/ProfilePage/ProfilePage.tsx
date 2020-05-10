import * as React from "react";

import styled from "styled-components";

import variables from "../../css/palette";
import { GlobalContext } from "../../app";

const Profile = styled.div`
  margin: auto;
  font-size: 3em;
  color: ${variables.darkGray};
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;

const StyledProfilePage = styled.div`
  margin: auto;
`;

const ProfilePage: React.FunctionComponent = () => {
  return (
    <GlobalContext.Consumer>
      {(value): React.ReactNode => {
        return (
          <StyledProfilePage>
            <Profile>
              Profile
              <br />
              <br />
              {value.globalContext.user.username}
              <br />
              {value.globalContext.user.email}
            </Profile>
          </StyledProfilePage>
        );
      }}
    </GlobalContext.Consumer>
  );
};

export default ProfilePage;
