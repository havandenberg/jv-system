import React from 'react';
import { isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Pallet } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from './list-item';
import { inventoryListLabels } from './data-utils';

const gridTemplateColumns = 'repeat(2, 1.5fr) repeat(4, 1fr) 80px 30px';

const PalletList = ({
  baseUrl,
  pallets,
}: {
  baseUrl?: string;
  pallets: Pallet[];
}) => {
  const { search } = useLocation();

  const columnLabels = useColumns<Pallet>(
    'id',
    SORT_ORDER.ASC,
    inventoryListLabels,
    'product',
    'pallet',
  );

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(pallets) ? (
        pallets.map(
          (pallet, idx) =>
            pallet && (
              <ListItem<Pallet>
                data={pallet}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={inventoryListLabels}
                to={`${baseUrl}/pallets/${pallet.id}${search}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={pallets}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No pallets found',
          }}
        />
      )}
    </>
  );
};

export default PalletList;
