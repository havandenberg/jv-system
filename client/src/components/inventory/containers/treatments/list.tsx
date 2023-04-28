import React from 'react';
import { isEmpty } from 'ramda';

import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { Container, ContainerTreatment } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { treatmentListLabels } from '../data-utils';

const gridTemplateColumns = 'repeat(3, 1fr) 2fr 1fr';

const ContainerTreatmentList = ({
  bulkEditContainers,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  treatments,
  treatmentChanges,
  treatmentUpdateFields,
  saveAttempt,
}: {
  bulkEditContainers?: Container[];
  editing: boolean;
  handleAdd: () => void;
  handleChange: (
    updatedTreatment: ContainerTreatment,
    updateKey: keyof ContainerTreatment,
  ) => void;
  handleRemove: (treatmentId: number | string) => void;
  treatments: ContainerTreatment[];
  treatmentChanges: ContainerTreatment[];
  treatmentUpdateFields?: { [key: string]: string[] };
  saveAttempt: boolean;
}) => {
  const [{ sortBy = 'treatmentDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();

  const listLabels = treatmentListLabels(bulkEditContainers);

  const columnLabels = useColumns<ContainerTreatment>(
    'treatmentDate',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'container_treatment',
  );

  const allTreatments = getSortedItems(
    listLabels,
    editing ? treatmentChanges : treatments,
    sortBy,
    sortOrder,
  );

  const handleTreatmentChange =
    (treatmentId: number) => (field: keyof ContainerTreatment, value: any) => {
      const treatmentChange = treatmentChanges?.find(
        ({ id }) => id === treatmentId,
      );
      const updatedTreatment = treatmentChange && {
        ...treatmentChange,
        [field]: value,
      };
      updatedTreatment && handleChange(updatedTreatment, field);
    };

  const handleTreatmentRemove = (id: number) => () => {
    handleRemove(id);
  };

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        ml={editing ? th.sizes.icon : undefined}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(allTreatments)
        ? allTreatments.map((treatment, idx) => {
            const treatmentChange = treatmentChanges?.find(
              ({ id }) => id === treatment.id,
            );
            const currentTreatment = treatments.find(
              ({ id }) => id === treatment.id,
            );
            const updateFields =
              (treatment &&
                treatmentUpdateFields &&
                treatmentUpdateFields[treatment.treatmentType]) ||
              [];

            return (
              treatment && (
                <ListItem<ContainerTreatment>
                  changes={treatmentChange}
                  confirmRemove={treatment.id >= 0}
                  data={currentTreatment || treatment}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  handleChange={handleTreatmentChange(treatment.id)}
                  handleRemove={handleTreatmentRemove(treatment.id)}
                  highlightColor={
                    treatmentChange?.treatmentResult === 'PASS'
                      ? th.colors.status.success
                      : treatmentChange?.treatmentResult === 'FAIL'
                      ? th.colors.status.error
                      : th.colors.brand.primaryAccent
                  }
                  isHalfHighlight={!!treatmentChange?.treatmentConfirmed}
                  key={idx}
                  listLabels={treatmentListLabels(
                    bulkEditContainers,
                    updateFields,
                  )}
                  showValidation={saveAttempt}
                />
              )
            );
          })
        : !editing && (
            <DataMessage
              data={treatments}
              error={null}
              loading={false}
              emptyProps={{
                header: 'No container treatments found',
              }}
            />
          )}
      {editing && (
        <l.Div ml={th.spacing.md} mt={th.spacing.md}>
          <AddItem onClick={handleAdd} text="Add treatment" />
        </l.Div>
      )}
    </>
  );
};

export default ContainerTreatmentList;
