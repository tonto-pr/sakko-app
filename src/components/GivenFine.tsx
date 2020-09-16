import * as React from "react";

import styled from "styled-components";

import * as types from "../../generated/common.types.generated";
import * as moment from "moment";

import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import FlyingFineImage from "../assets/img/flyingfine.png";

type GivenFineProps = {
  givenFine: types.ShapeOfGivenFineWithProps;
};

const GivenFineTitle = styled.h2`
  text-align: center;
`;

const GivenFineSubtitle = styled.h4`
  text-align: center;
`;

const GivenFine: React.FunctionComponent<GivenFineProps> = (
  props: GivenFineProps
) => {
  return (
    <Card>
      <Card.Body>
        <Container>
          <Row xs={3} md={5} lg={5} className="align-items-center">
            <Col>
              <GivenFineTitle>
                {props.givenFine.giver_user.username}
              </GivenFineTitle>
            </Col>
            <Col>
              <Image fluid src={FlyingFineImage} />
              <GivenFineSubtitle>
                {props.givenFine.fine.amount}
              </GivenFineSubtitle>
            </Col>
            <Col>
              <GivenFineTitle>
                {props.givenFine.receiver_user.username}
              </GivenFineTitle>
            </Col>
          </Row>
          <Row xs={3} md={5} lg={5} className="align-items-center">
            <Col md={{ offset: 3 }}></Col>
          </Row>
          <Row>
            <Col>
              {props.givenFine.fine.description}

              <footer className="blockquote-footer">
                In <b>{props.givenFine.user_group.user_group_name}</b> at{" "}
                {moment(props.givenFine.created_at * 1000).format(
                  "DD.MM.YYYY hh:mm:ss"
                )}
              </footer>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default GivenFine;
