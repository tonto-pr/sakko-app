import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";
import * as Cookies from "js-cookie";
import { domain, defaultPath } from "./constants";

import { GlobalContext } from "./lib/useGlobalContext";

import LoggedInRoute from "./routes/LoggedInRoute";
import LoggedOutRoute from "./routes/LoggedOutRoute";

import { useState } from "react";
import { BrowserRouter as Router, Switch, Link } from "react-router-dom";
import useGlobalContext from "./lib/useGlobalContext";
import Button from "react-bootstrap/Button";

import FineModal from "./components/FineModal";
const RootContainer = styled.div`
  display: flex;
`;

export const App: React.FunctionComponent = () => {
  const [
    globalContext,
    setGlobalContext,
    globalContextLoading,
  ] = useGlobalContext();

  const [showFineModal, setShowFineModal] = useState<boolean>(false);

  function handleLogOut(): void {
    Cookies.remove("access-token", {
      domain: domain,
      path: defaultPath,
    });
    setGlobalContext({
      ...globalContext,
      user: {
        username: "",
        email: "",
      },
      loggedIn: false,
    });
  }

  const openFineModal = (): void => setShowFineModal(true);
  const closeFineModal = (): void => setShowFineModal(false);

  return (
    <Router>
      <GlobalContext.Provider value={{ globalContext, setGlobalContext }}>
        {!globalContextLoading && (
          <>
            <FineModal onHide={closeFineModal} show={showFineModal} />
            <Navbar bg="light">
              <Navbar.Brand>Sakko App</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse className="justify-content-center">
                {globalContext.loggedIn && (
                  <>
                    <Nav.Link>
                      <Link to="/home">Home</Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="/" onClick={handleLogOut}>
                        Log Out
                      </Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="/profile">Profile</Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Link to="/usergroups">User Groups</Link>
                    </Nav.Link>
                    <Nav.Link>
                      <Button onClick={openFineModal}>Give Fine</Button>
                    </Nav.Link>
                  </>
                )}
              </Navbar.Collapse>
            </Navbar>
            <RootContainer>
              <Switch>
                {globalContext.loggedIn ? (
                  <LoggedInRoute />
                ) : (
                  <LoggedOutRoute />
                )}
              </Switch>
            </RootContainer>
          </>
        )}
      </GlobalContext.Provider>
    </Router>
  );
};
