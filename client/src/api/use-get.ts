import { useCallback, useEffect, useState } from 'react';
import api from 'api';
import { isEmpty } from 'ramda';

export interface UseGetState<T> {
  data: T[];
  error: string;
  loading: boolean;
}

const useGet = <T extends {}>(endpoint: string) => {
  const initialState: UseGetState<T> = {
    data: [],
    error: '',
    loading: false,
  };
  const [{ data, error, loading }, setState] = useState<UseGetState<T>>(
    initialState,
  );

  const fetchData = useCallback(
    (callback: (result: T[]) => void) => {
      api.client.get(endpoint).then(
        ({ data: d }) => {
          const result: T[] = d;
          callback(result);
        },
        (error) => {
          setState((prevState) => ({ ...prevState, error, loading: false }));
        },
      );
    },
    [endpoint],
  );

  useEffect(() => {
    if (!error && !loading && data.length === 0) {
      setState((prevState) => ({ ...prevState, loading: true }));
      fetchData((data) => {
        setState((prevState) => ({ ...prevState, data, loading: false }));
      });
    }
  }, [data, error, fetchData, loading]);

  return {
    data,
    error,
    hasData: !error && !loading && !isEmpty(data),
    loading,
  };
};

export default useGet;
