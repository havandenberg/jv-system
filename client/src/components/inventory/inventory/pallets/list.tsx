import React from 'react';
import { isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Pallet, TruckLoad } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { inventoryListLabels } from './data-utils';

const gridTemplateColumns = 'repeat(2, 1.5fr) repeat(3, 1fr) 80px 30px';

const PalletList = ({
  baseUrl,
  pallets,
  originalLoad,
}: {
  baseUrl?: string;
  pallets: Pallet[];
  originalLoad?: TruckLoad;
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
      {originalLoad && (
        <l.Flex alignCenter my={th.spacing.md}>
          <ty.CaptionText bold color={th.colors.status.errorAlt}>
            !! Rejected From:
          </ty.CaptionText>
          <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
            Load:
          </ty.CaptionText>
          <ty.LinkText
            hover="false"
            to={`/inventory/truck-loads/${originalLoad?.loadId}`}
          >
            {originalLoad?.loadId}
          </ty.LinkText>
          <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
            Invoice(s):
          </ty.CaptionText>
          {(originalLoad?.invoiceHeaders?.nodes || []).map(
            (originalInvoice) => (
              <ty.LinkText
                hover="false"
                key={originalInvoice?.orderId}
                mr={th.spacing.sm}
                to={`/accounting/invoices/${originalInvoice?.orderId}`}
              >
                {originalInvoice?.orderId}
              </ty.LinkText>
            ),
          )}
        </l.Flex>
      )}
      {!isEmpty(pallets) ? (
        pallets.map(
          (pallet, idx) =>
            pallet && (
              <ListItem<Pallet>
                data={pallet}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={inventoryListLabels}
                to={`${baseUrl}/pallets/${pallet.palletId}${search}`}
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
