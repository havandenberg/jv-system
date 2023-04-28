import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { groupBy, mapObjIndexed, pick, pluck, sortBy, values } from 'ramda';
import { Redirect, useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import ResetImg from 'assets/images/reset';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import { BasicModal } from 'components/modal';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import usePrevious from 'hooks/use-previous';
import {
  Container,
  ContainerTreatment,
  Vendor,
  Vessel,
  Warehouse,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  baseLabels as getBaseLabels,
  getCombinedContainer,
  validationLabels,
} from './data-utils';
import { useContainersSelectionContext } from './selection-context';
import ContainerTreatmentList from './treatments/list';

const breadcrumbs = [
  {
    text: 'Container Schedule',
    to: `/inventory/containers/schedule`,
  },
  {
    text: 'Bulk Edit',
    to: `/inventory/containers/bulk-edit`,
  },
];

const tabs: (treatmentsCount: number) => Tab[] = (treatmentsCount) => [
  {
    id: 'treatments',
    text: `Treatments (${treatmentsCount})`,
  },
];

interface State {
  changes: Container;
  saveAttempt: boolean;
  updateFields: string[];
  treatmentUpdateFields: { [key: string]: string[] };
  updateLoading: boolean;
}

const ContainerBulkEdit = () => {
  const {
    roles: { isEditSchedule },
  } = useActiveUser();
  const history = useHistory();
  const [{ selectedContainerIds }, { clearAllSelectedContainers }] =
    useContainersSelectionContext();

  const { data, error, loading } = api.useContainer(selectedContainerIds);
  const previousLoading = usePrevious(loading);

  const containers = sortBy(
    (c) => `${c.vesselCode || 'UNK'} ${c.containerId || 'UNK'}`,
    values(
      mapObjIndexed<Container[], Container>(
        (containers) => containers[0],
        groupBy(
          (c) => c.containerId || 'UNK',
          (data?.nodes || []) as Container[],
        ),
      ),
    ) as Container[],
  );
  const vessels = groupBy((c) => c.vesselCode || 'UNK', containers);
  const combinedContainer = getCombinedContainer(containers);
  const combinedTreatments = (combinedContainer?.containerTreatments.nodes ||
    []) as ContainerTreatment[];

  const { data: vesselsData } = api.useVessels({
    orderByOverride: 'VESSEL_CODE_DESC',
  });
  const allVessels = vesselsData ? (vesselsData as Vessel[]) : [];

  const { data: warehouseData } = api.useWarehouses('ID_ASC');
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const { data: vendorData } = api.useVendors('ID_ASC');
  const vendors = vendorData ? (vendorData.nodes as Vendor[]) : [];

  const [handleUpdate] = api.useUpdateContainer(
    selectedContainerIds,
    true,
    'DISCHARGE_DATE_DESC',
  );

  const initialState: State = useMemo(
    () => ({
      changes: combinedContainer,
      saveAttempt: false,
      treatmentUpdateFields: {},
      updateFields: [],
      updateLoading: false,
    }),
    [combinedContainer],
  );

  const [newItemNextId, setNewItemNextId] = useState(-1);
  const [state, setState] = useState(initialState);

  const {
    changes,
    saveAttempt,
    treatmentUpdateFields,
    updateFields,
    updateLoading,
  } = state;
  const isDirty = updateFields.length > 0;

  const baseLabels = getBaseLabels(
    allVessels,
    warehouses,
    vendors,
    containers,
    updateFields,
  );

  const { TabBar } = useTabBar({
    tabs: tabs(changes?.containerTreatments.nodes.length || 0),
  });

  const handleChange = (
    field: keyof Container,
    value: any,
    treatmentUpdateFields?: { [key: string]: string },
  ) => {
    const treatmentUpdateKey =
      treatmentUpdateFields && Object.keys(treatmentUpdateFields)[0];
    const shouldUpdateTreatmentFields =
      treatmentUpdateKey &&
      !state.treatmentUpdateFields[treatmentUpdateKey]?.includes(
        treatmentUpdateFields[treatmentUpdateKey],
      );
    setState({
      ...state,
      changes: { ...changes, [field]: value },
      updateFields: updateFields.includes(field)
        ? updateFields
        : [...updateFields, field],
      treatmentUpdateFields: shouldUpdateTreatmentFields
        ? {
            ...state.treatmentUpdateFields,
            [treatmentUpdateKey]: [
              ...(state.treatmentUpdateFields[treatmentUpdateKey] || []),
              treatmentUpdateFields[treatmentUpdateKey],
            ],
          }
        : state.treatmentUpdateFields,
    });
  };

  const handleAddTreatment = () => {
    const updatedTreatments = [
      ...changes.containerTreatments.nodes,
      {
        id: newItemNextId,
        treatmentType: '',
        treatmentDate: null,
        treatmentResult: '',
        treatmentConfirmed: false,
        treatmentNotes: '',
      },
    ];
    handleChange('containerTreatments', {
      ...changes?.containerTreatments,
      nodes: updatedTreatments,
    });
    setNewItemNextId(newItemNextId - 1);
  };

  const handleChangeTreatment = (
    updatedTreatment: ContainerTreatment,
    updateKey: keyof ContainerTreatment,
  ) => {
    const updatedTreatments = changes.containerTreatments.nodes.map(
      (treatment) =>
        treatment?.id === updatedTreatment.id ? updatedTreatment : treatment,
    );
    handleChange(
      'containerTreatments',
      {
        ...changes.containerTreatments,
        nodes: updatedTreatments,
      },
      { [updatedTreatment.treatmentType]: updateKey },
    );
  };

  const handleRemoveTreatment = (treatmentId: string | number) => {
    const updatedTreatments = changes.containerTreatments.nodes.filter(
      (treatment) => treatment?.id !== treatmentId,
    );
    handleChange('containerTreatments', {
      ...changes.containerTreatments,
      nodes: updatedTreatments,
    });
  };

  const handleReset = () => {
    setState(initialState);
  };

  const handleCancel = () => {
    clearAllSelectedContainers();
    history.push('/inventory/containers/schedule');
  };

  const updatedTreatments = (changes?.containerTreatments?.nodes ||
    []) as ContainerTreatment[];

  const handleSave = () => {
    setState({ ...state, saveAttempt: true });
    if (
      validateItem(
        {
          ...pick(updateFields, changes),
          containerId: changes.containerId || '',
          vesselCode:
            changes.vesselCode === 'MULTIPLE'
              ? containers[0]?.vesselCode
              : changes.vesselCode,
          vendorId: changes.vendorId === 'MULTIPLE' ? null : changes.vendorId,
          warehouseId:
            changes.warehouseId === 'MULTIPLE' ? null : changes.warehouseId,
        },
        validationLabels(baseLabels),
      )
    ) {
      setState({ ...state, updateLoading: true });
      Promise.all(
        containers.map((container) => {
          const currentTreatments = (container.containerTreatments?.nodes ||
            []) as ContainerTreatment[];
          return new Promise((resolve, reject) =>
            handleUpdate({
              variables: {
                id: container.id,
                updates: pick(
                  updateFields
                    .concat(['isNew'])
                    .map((field) =>
                      field === 'containerTreatments'
                        ? 'containerTreatmentsUsingId'
                        : field,
                    ),
                  {
                    ...changes,
                    isNew: false,
                    containerTreatmentsUsingId: {
                      create: updatedTreatments
                        .filter(({ id }) => id < 0)
                        .map(({ id, ...rest }) => rest),
                      updateById: updatedTreatments
                        .filter(({ treatmentType }) =>
                          currentTreatments.find(
                            (c) => c.treatmentType === treatmentType,
                          ),
                        )
                        .map(({ id, __typename, nodeId, ...rest }) => ({
                          patch: treatmentUpdateFields[rest.treatmentType]
                            ? pick(
                                treatmentUpdateFields[rest.treatmentType],
                                rest,
                              )
                            : [],
                          id:
                            currentTreatments.find(
                              (c) => c.treatmentType === rest.treatmentType,
                            )?.id || '',
                        })),
                      deleteById: combinedTreatments
                        .filter(
                          ({ id }) =>
                            !pluck('id', updatedTreatments).includes(id),
                        )
                        .map(({ treatmentType }) => ({
                          id:
                            currentTreatments.find(
                              (c) => c.treatmentType === treatmentType,
                            )?.id || '',
                        })),
                    },
                  },
                ),
              },
            })
              .then(resolve)
              .catch(reject),
          );
        }),
      ).then(handleCancel);
    }
  };

  useEffect(() => {
    if (previousLoading && !loading) {
      setState(initialState);
    }
  }, [initialState, loading, previousLoading]);

  if (!selectedContainerIds.length || !isEditSchedule) {
    return <Redirect to="/inventory/containers/schedule" />;
  }

  return (
    <Page
      actions={[
        <l.Flex alignCenter key="actions">
          <ResetButton>
            <l.HoverButton dark onClick={handleReset}>
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.HoverButton>
          </ResetButton>
          <BasicModal
            title="Confirm Discard Changes"
            content={
              <ty.BodyText>You will lose all unsaved changes.</ty.BodyText>
            }
            confirmText="Discard"
            handleConfirm={handleCancel}
            triggerProps={{
              ml: th.spacing.lg,
              mr: th.spacing.md,
              status: th.colors.status.error,
            }}
            triggerText="Cancel"
          />

          <b.Success disabled={!isDirty || updateLoading} onClick={handleSave}>
            {updateLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Save'
            )}
          </b.Success>
        </l.Flex>,
      ]}
      breadcrumbs={breadcrumbs}
      title={combinedContainer ? 'Bulk Edit Containers' : 'Loading...'}
    >
      {combinedContainer ? (
        <>
          <l.Flex alignCenter mb={th.spacing.md}>
            <ty.BodyText mr={th.spacing.xs}>
              Editing <ty.Span bold>{containers.length}</ty.Span> containers
              from vessel
              {Object.keys(vessels).length > 1 ? 's' : ''}:{' '}
            </ty.BodyText>
            {Object.keys(vessels)
              .sort()
              .map((vesselCode, idx) => (
                <Fragment key={vesselCode}>
                  {idx > 0 && <ty.BodyText>,&nbsp;</ty.BodyText>}
                  <ty.LinkText
                    hover={false}
                    target="_blank"
                    to={`/inventory/vessels/${vesselCode}?vesselView=containers`}
                  >
                    {vesselCode}
                  </ty.LinkText>
                </Fragment>
              ))}
          </l.Flex>
          <BaseData<Container>
            data={combinedContainer}
            changes={changes}
            editing
            handleChange={handleChange}
            labels={baseLabels}
            showValidation={saveAttempt}
          />
          <l.Div my={th.spacing.lg}>
            <TabBar />
          </l.Div>
          <ContainerTreatmentList
            bulkEditContainers={containers}
            editing
            handleAdd={handleAddTreatment}
            handleChange={handleChangeTreatment}
            handleRemove={handleRemoveTreatment}
            treatments={
              (combinedContainer.containerTreatments.nodes ||
                []) as ContainerTreatment[]
            }
            treatmentChanges={
              (changes?.containerTreatments?.nodes ||
                []) as ContainerTreatment[]
            }
            saveAttempt={saveAttempt}
            treatmentUpdateFields={treatmentUpdateFields}
          />
          <l.Div height={th.spacing.xxl} />
        </>
      ) : (
        <DataMessage
          data={combinedContainer || []}
          error={error}
          loading={loading}
        />
      )}
    </Page>
  );
};

export default ContainerBulkEdit;
