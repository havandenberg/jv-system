import api from 'api';
import { PeruInspectionReport } from 'components/reports/inspections/departure/peru/types';

const useInspections = (id?: string) => {
  const { data, ...rest } = api.useGet<PeruInspectionReport>(
    '/reports/inspections',
  );
  const single = data.find((report) => report.containerId === id);

  return { data: id && single ? [single] : data, ...rest };
};

export default useInspections;
