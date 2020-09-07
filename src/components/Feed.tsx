import * as React from "react";

import { useContext } from "react";
import { GlobalContext } from "../lib/useGlobalContext";

import useAsyncState from "../lib/useAsyncState";

import Table from "react-bootstrap/Table";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as types from "../../generated/common.types.generated";

const Feed: React.FunctionComponent = () => {
  const apiClient = api.client(axiosAdapter.bind);
  const context = useContext(GlobalContext);

  const [feed, , loading] = useAsyncState(
    apiClient.user(context.globalContext.user.user_id.toString()).feed.get
  ) as [
    types.ShapeOfGivenFineWithProps[],
    React.Dispatch<React.SetStateAction<types.ShapeOfGivenFineWithProps[]>>,
    boolean,
    object
  ];

  function renderFineRows(): React.ReactElement[] {
    return feed.map((givenFine) => {
      return (
        <tr key={givenFine.given_fine_id}>
          <td>{givenFine.fine.fine_id}</td>
          <td>{givenFine.receiver_user.username}</td>
          <td>{givenFine.giver_user.username}</td>
          <td>{givenFine.fine.amount}</td>
          <td>{givenFine.fine.description}</td>
          <td>{givenFine.user_group.user_group_name}</td>
        </tr>
      );
    });
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Fine id</th>
          <th>Receiver user</th>
          <th>Giver user</th>
          <th>Fine amount</th>
          <th>Fine description</th>
          <th>User Group</th>
        </tr>
      </thead>
      <tbody>{!loading && renderFineRows()}</tbody>
    </Table>
  );
};

export default Feed;
