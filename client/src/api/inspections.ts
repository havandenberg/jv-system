import { useEffect, useState } from 'react';

import api from 'api';
import { PeruInspectionReport } from 'types/inspections';

const fetchInspections = (callback: (data: PeruInspectionReport[]) => void) => {
  api.get('/reports/inspections').then(({ data }) => {
    const inspections: PeruInspectionReport[] = data;
    callback(inspections);
  });
};

interface State {
  data: PeruInspectionReport[];
  errors: string[];
  loading: boolean;
}

const initialState: State = {
  data: [],
  errors: [],
  loading: false,
};

export const useInspections = (id?: string) => {
  const [{ data, loading }, setState] = useState(initialState);
  const single = data.find((report) => report.containerId === id);

  useEffect(() => {
    if (!loading && data.length === 0) {
      setState((prevState) => ({ ...prevState, loading: true }));
      fetchInspections((data) => {
        setState((prevState) => ({ ...prevState, data, loading: false }));
      });
    }
  }, [data, loading]);

  return { data: id ? [single] : data, loading };
};
