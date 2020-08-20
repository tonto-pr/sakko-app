import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useAsyncState = (
  callback: () => Promise<{ value: { value: object } }>
): [
  object,
  React.Dispatch<React.SetStateAction<object | object[]>>,
  boolean,
  object
] => {
  const { response, loading, error } = useFetch(callback);
  const [asyncState, setAsyncState] = useState<object>(undefined);
  useEffect(() => {
    if (response) {
      setAsyncState(response);
    }
  }, [response]);

  return [asyncState, setAsyncState, loading, error];
};

export default useAsyncState;
