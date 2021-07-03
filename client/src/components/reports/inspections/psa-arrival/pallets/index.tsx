import React, { useEffect } from 'react';
import { groupBy, isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import { PsaArrivalReport, PsaGrapePallet } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';
import ListItem from './list-item';

export const gridTemplateColumns = 'repeat(2, 2fr) repeat(4, 1fr) 30px';

const PsaArrivalPallets = ({
  inspection,
}: {
  inspection: PsaArrivalReport;
}) => {
  const { search } = useLocation();
  const { data, loading, error } = api.usePsaArrivalPallets(
    `${inspection.arrivalCode} ${inspection.arrivalName}`,
    `${inspection.exporterName}`,
  );
  const previousData = usePrevious(data);
  const grapePalletsByVariety = groupBy(
    (p) => `${p.variety}`,
    data ? (data.nodes as PsaGrapePallet[]) : [],
  );
  const varieties = Object.keys(grapePalletsByVariety).sort();
  const [variety, setVariety] = useQueryValue('variety');
  const selectedPallets =
    variety && grapePalletsByVariety[variety]
      ? grapePalletsByVariety[variety]
      : [];

  const columnLabels = useColumns<PsaGrapePallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_grape_pallet',
  );

  useEffect(() => {
    if (!previousData && data && !variety) {
      setVariety(varieties[0]);
    }
  }, [data, previousData, setVariety, variety, varieties]);

  return (
    <>
      <l.Flex alignCenter mb={th.spacing.lg}>
        <ty.BodyText mr={th.spacing.md}>Variety:</ty.BodyText>
        <Select
          onChange={(e) => {
            setVariety(e.target.value);
          }}
          value={variety || ''}
        >
          {varieties.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
        <ty.SmallText ml={th.spacing.md}>
          Results: {loading ? '-' : selectedPallets.length}
        </ty.SmallText>
      </l.Flex>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(selectedPallets) ? (
        selectedPallets.map((pallet, idx) => (
          <ListItem<PsaGrapePallet>
            data={pallet}
            key={idx}
            listLabels={listLabels}
            slug={`${inspection.id}/pallets/${pallet.id}${search}`}
          />
        ))
      ) : (
        <DataMessage
          data={selectedPallets}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Pallets Found 😔',
          }}
        />
      )}
    </>
  );
};

export default PsaArrivalPallets;
