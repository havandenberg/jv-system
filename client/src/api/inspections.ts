import api from 'api';
import { PeruInspectionReport } from 'components/reports/inspections/types';

const useInspections = (id?: string) => {
  const { data, loading } = api.useGet<PeruInspectionReport>(
    '/reports/inspections',
  );
  const single = data.find((report) => report.containerId === id);

  return { data: id && single ? [single] : data, loading };
};

export default useInspections;
