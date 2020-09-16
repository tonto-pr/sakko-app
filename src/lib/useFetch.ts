import { useState, useEffect } from "react";

const useFetch = (
  callback: (
    queryParams?: object
  ) => Promise<{
    value: {
      value: object;
    };
  }>,
  queryParams?: object
): {
  response: object;
  error: object;
  loading: boolean;
} => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const doFetch = async (): Promise<void> => {
      try {
        let res;
        if (queryParams) {
          res = await callback(queryParams);
        } else {
          res = await callback();
        }

        const json = await res.value.value;
        setResponse(json);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, []);
  return { response, error, loading };
};

export default useFetch;
