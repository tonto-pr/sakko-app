import * as React from "react";

import { useContext } from "react";
import { GlobalContext } from "../lib/useGlobalContext";

import * as moment from "moment";

import useAsyncState from "../lib/useAsyncState";

import GivenFine from "./GivenFine";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as types from "../../generated/common.types.generated";

const Feed: React.FunctionComponent = () => {
  const apiClient = api.client(axiosAdapter.bind);
  const context = useContext(GlobalContext);

  const [feed, , loading] = useAsyncState(
    apiClient.user(context.globalContext.user.user_id.toString()).feed.get,
    {
      query: {
        fromUnixTime: moment().subtract(7, "d").unix().toString(),
        toUnixTime: moment().unix().toString(),
      },
    }
  ) as [
    types.ShapeOfGivenFineWithProps[],
    React.Dispatch<React.SetStateAction<types.ShapeOfGivenFineWithProps[]>>,
    boolean,
    object
  ];

  function renderFineRows(): React.ReactElement[] {
    return feed
      .sort((thisFine, nextFine) => {
        return nextFine.created_at - thisFine.created_at;
      })
      .map((givenFine) => {
        return (
          <GivenFine key={givenFine.given_fine_id} givenFine={givenFine} />
        );
      });
  }

  return <>{!loading && renderFineRows()}</>;
};

export default Feed;
