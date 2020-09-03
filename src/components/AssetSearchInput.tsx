import * as React from "react";

import * as types from "../../generated/common.types.generated";

import UserSearchInput from "./UserSearchInput";
import FineSearchInput from "./FineSearchInput";
import UserGroupSearchInput from "./UserGroupSearchInput";

type AssetSearchInputProps = {
  onSearchResultClick: (
    asset: types.ShapeOfUser | types.ShapeOfFine | types.ShapeOfUserGroup
  ) => void;
  assetFilter?: (
    asset: types.ShapeOfUser | types.ShapeOfFine | types.ShapeOfUserGroup
  ) => boolean;
  type: string;
};

const AssetSearchInput: React.FunctionComponent<AssetSearchInputProps> = (
  props: AssetSearchInputProps
) => {
  switch (props.type) {
    case "user":
      return (
        <UserSearchInput
          onSearchResultClick={props.onSearchResultClick}
          userFilter={props.assetFilter}
        />
      );
    case "fine":
      return (
        <FineSearchInput
          onSearchResultClick={props.onSearchResultClick}
          fineFilter={props.assetFilter}
        />
      );
    case "usergroup":
      return (
        <UserGroupSearchInput
          onSearchResultClick={props.onSearchResultClick}
          userGroupFilter={props.assetFilter}
        />
      );
  }
};

export default AssetSearchInput;
