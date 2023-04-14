import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { InvoiceHeader } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = 'repeat(5, 0.8fr) 2.5fr 1fr 30px';

const InvoiceList = ({
  invoices,
  palletId,
}: {
  invoices: InvoiceHeader[];
  palletId?: string;
}) => {
  const columnLabels = useColumns<InvoiceHeader>(
    'invoiceDate',
    SORT_ORDER.DESC,
    listLabels,
    'accounting',
    'invoice-header',
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
      {!isEmpty(invoices) ? (
        invoices.map(
          (invoice, idx) =>
            invoice && (
              <ListItem<InvoiceHeader>
                data={invoice}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                to={`/accounting/invoices/${invoice.orderId}${
                  palletId ? '?palletId=' + palletId : ''
                }`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={invoices}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No invoices found',
          }}
        />
      )}
    </>
  );
};

export default InvoiceList;
