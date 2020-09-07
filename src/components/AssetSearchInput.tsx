import * as React from "react";

import * as types from "../../generated/common.types.generated";

import UserSearchInput from "./UserSearchInput";
import FineSearchInput from "./FineSearchInput";
import UserGroupSearchInput from "./UserGroupSearchInput";

type AssetSearchInputProps = {
  onChange: (
    asset: types.ShapeOfUser | types.ShapeOfFine | types.ShapeOfUserGroup
  ) => void;
  assetFilter?: (
    asset: types.ShapeOfUser | types.ShapeOfFine | types.ShapeOfUserGroup
  ) => boolean;
  type: string;
  placeholder?: string;
};

const AssetSearchInput: React.FunctionComponent<AssetSearchInputProps> = (
  props: AssetSearchInputProps
) => {
  switch (props.type) {
    case "user":
      return (
        <UserSearchInput
          onChange={props.onChange}
          userFilter={props.assetFilter}
          placeholder={props.placeholder}
        />
      );
    case "fine":
      return (
        <FineSearchInput
          onChange={props.onChange}
          fineFilter={props.assetFilter}
          placeholder={props.placeholder}
        />
      );
    case "usergroup":
      return (
        <UserGroupSearchInput
          onChange={props.onChange}
          userGroupFilter={props.assetFilter}
          placeholder={props.placeholder}
        />
      );
  }
};

export default AssetSearchInput;
