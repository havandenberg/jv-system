import { useCallback, useEffect, useState } from 'react';
import api from 'api';

interface State<T> {
  data: T[];
  errors: string[];
  loading: boolean;
}

const useGet = <T extends {}>(endpoint: string) => {
  const initialState: State<T> = {
    data: [],
    errors: [],
    loading: false,
  };
  const [{ data, errors, loading }, setState] = useState<State<T>>(
    initialState,
  );

  const fetchData = useCallback(
    (callback: (result: T[]) => void) => {
      api.client.get(endpoint).then(({ data: d }) => {
        const result: T[] = d;
        callback(result);
      });
    },
    [endpoint],
  );

  useEffect(() => {
    if (!loading && data.length === 0) {
      setState((prevState) => ({ ...prevState, loading: true }));
      fetchData((data) => {
        setState((prevState) => ({ ...prevState, data, loading: false }));
      });
    }
  }, [data, fetchData, loading]);

  return { data, errors, loading };
};

export default useGet;
