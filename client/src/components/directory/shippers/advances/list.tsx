import React from 'react';
import { isEmpty } from 'ramda';

import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { ProductSpecies, ShipperAdvance } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { advanceListLabels } from '../data-utils';

const gridTemplateColumns = '150px 150px';

const ShipperAdvanceList = ({
  advances,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  saveAttempt,
  speciesList,
}: {
  advances: ShipperAdvance[];
  editing: boolean;
  handleAdd: () => void;
  handleChange: (updatedItem: ShipperAdvance) => void;
  handleRemove: (itemId: number) => void;
  saveAttempt: boolean;
  speciesList: ProductSpecies[];
}) => {
  const [{ sortBy = 'speciesId', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const listLabels = advanceListLabels(editing, speciesList);

  const columnLabels = useColumns<ShipperAdvance>(
    'speciesId',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'shipper_advance',
  );

  const sortedAdvances = getSortedItems(
    listLabels,
    advances,
    sortBy,
    sortOrder,
  );

  return (
    <l.Div width="342px">
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        ml={editing ? th.sizes.icon : undefined}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(sortedAdvances)
        ? sortedAdvances.map(
            (advance, idx) =>
              advance && (
                <ListItem<ShipperAdvance>
                  confirmRemove={advance.id >= 0}
                  confirmRemoveText="Are you sure you want to remove this advance rate?"
                  confirmRemoveTitle="Confirm Remove Advance Rate"
                  data={advance}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  handleChange={(field: keyof ShipperAdvance, value: any) => {
                    handleChange({ ...advance, [field]: value });
                  }}
                  handleRemove={() => {
                    handleRemove(advance.id);
                  }}
                  key={idx}
                  listLabels={listLabels}
                  showValidation={saveAttempt}
                />
              ),
          )
        : !editing && (
            <DataMessage
              data={sortedAdvances}
              error={null}
              loading={false}
              emptyProps={{
                header: 'No advance rates found',
              }}
            />
          )}
      {editing && (
        <l.Div ml={th.spacing.md} mt={th.spacing.md}>
          <AddItem onClick={handleAdd} text="Add advance rate" />
        </l.Div>
      )}
    </l.Div>
  );
};

export default ShipperAdvanceList;
