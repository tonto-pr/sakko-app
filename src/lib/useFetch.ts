import { useState, useEffect } from "react";

const useFetch = (
  callback: () => Promise<{
    value: {
      value: object;
    };
  }>
): {
  response: object;
  error: object;
  loading: boolean;
} => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const doFetch = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await callback();
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
