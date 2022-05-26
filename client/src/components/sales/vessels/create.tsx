import React, { Fragment, useEffect, useState } from 'react';
import { add } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { useQueryValue } from 'hooks/use-query-params';
import { Country, Vessel, Warehouse } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { baseLabels } from './data-utils';
import usePrevious from 'hooks/use-previous';

export const breadcrumbs = [
  { text: 'Vessels', to: `/sales/vessels` },
  { text: 'Vessel', to: `/sales/vessels/create` },
];

const CreateVessel = () => {
  const history = useHistory();
  const [coast] = useQueryValue('coast');

  const { data: lastPreVesselCode, loading } = api.useLastPreVesselCode();
  const previousLoading = usePrevious(loading);
  const nextPreVesselCode = `${parseInt(lastPreVesselCode || '899', 10) + 1}`;

  const { data: countriesData } = api.useCountries();
  const countries = countriesData ? (countriesData.nodes as Country[]) : [];

  const { data: warehouseData } = api.useWarehouses();
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const initialState = {
    vesselCode: nextPreVesselCode,
    preVesselCode: '',
    vesselName: '',
    arrivalPort: '',
    countryId: '',
    departureDate: new Date(),
    arrivalDate: add(new Date(), { days: 4 }),
    dischargeDate: add(new Date(), { days: 7 }),
    coast: coast || 'EC',
    isPre: true,
  };

  const cancelLink = '/sales/vessels';

  const [handleCreate] = api.useCreateVessel();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<Vessel>(initialState as Vessel);

  const handleChange = (field: keyof Vessel, value: any) => {
    setChanges({ ...changes, [field]: value } as Vessel);
  };

  useEffect(() => {
    if (previousLoading && !loading) {
      setChanges({
        ...changes,
        vesselCode: nextPreVesselCode,
      });
    }
  }, [changes, nextPreVesselCode, loading, previousLoading, setChanges]);

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(countries, warehouses))) {
      setLoading(true);
      handleCreate({
        variables: {
          vessel: {
            ...changes,
            preVesselCode: changes.isPre
              ? changes.vesselCode
              : changes.preVesselCode,
          },
        },
      }).then(() => {
        history.push(cancelLink);
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          <b.Primary ml={th.spacing.md} onClick={handleSave} width={88}>
            {createLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Create'
            )}
          </b.Primary>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs}
      title="Create Vessel"
    >
      <BaseData<Vessel>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(countries, warehouses)}
        showValidation={saveAttempt}
      />
    </Page>
  );
};

export default CreateVessel;
