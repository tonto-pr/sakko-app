import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useAsyncState = (
  callback: (query: object) => Promise<{ value: { value: object } }>,
  queryParams?: object
): [
  object,
  React.Dispatch<React.SetStateAction<object | object[]>>,
  boolean,
  object
] => {
  const { response, loading, error } = useFetch(callback, queryParams);
  const [asyncState, setAsyncState] = useState<object>(undefined);
  useEffect(() => {
    if (response) {
      setAsyncState(response);
    }
  }, [response]);

  return [asyncState, setAsyncState, loading, error];
};

export default useAsyncState;
