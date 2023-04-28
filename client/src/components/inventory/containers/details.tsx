import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import PalletList from 'components/inventory/inventory/pallets/list';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import useUpdateItem from 'hooks/use-update-item';
import {
  Container,
  ContainerTreatment,
  Pallet,
  Vendor,
  Vessel,
  Warehouse,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  baseLabels,
  transformChangesOnUpdate,
  validationLabels,
} from './data-utils';
import ContainerTreatmentList from './treatments/list';

const breadcrumbs = (id: string) => [
  {
    text: 'Containers',
    to: `/inventory/containers`,
  },
  {
    text: 'Container',
    to: `/inventory/containers/${id}`,
  },
];

const tabs: (treatmentsCount: number, palletsCount: number) => Tab[] = (
  treatmentsCount,
  palletsCount,
) => [
  {
    id: 'treatments',
    text: `Treatments (${treatmentsCount})`,
  },
  {
    id: 'pallets',
    text: `Pallets (${palletsCount})`,
  },
];

const Details = () => {
  const {
    roles: { isEditSchedule },
  } = useActiveUser();
  const { containerId } = useParams<{
    containerId: string;
  }>();

  const { data, error, loading } = api.useContainer([containerId]);
  const container = ((data?.nodes || []) as Container[])[0] || null;
  const treatments = (container?.containerTreatments.nodes ||
    []) as ContainerTreatment[];
  const pallets = (container?.pallets.nodes || []) as Pallet[];

  const { data: vesselsData } = api.useVessels({
    orderByOverride: 'VESSEL_CODE_DESC',
  });
  const vessels = vesselsData ? (vesselsData as Vessel[]) : [];

  const { data: warehouseData } = api.useWarehouses('ID_ASC');
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const { data: vendorData } = api.useVendors('ID_ASC');
  const vendors = vendorData ? (vendorData.nodes as Vendor[]) : [];

  const [handleUpdate] = api.useUpdateContainer(
    [containerId],
    false,
    'DISCHARGE_DATE_DESC',
  );

  const updateFields = [
    'vesselCode',
    'containerId',
    'vendorId',
    'warehouseId',
    'containerDescription',
    'releaseDate',
    'releaseConfirmed',
    'arrivalDate',
    'arrivalConfirmed',
    'dischargeDate',
    'dischargeConfirmed',
    'sentConfirmed',
    'isAvailable',
    'isNew',
    'isSchedule',
    'notes1',
    'notes2',
    'notes3',
  ];
  const updateVariables = { id: container?.id || 0 };

  const [newItemNextId, setNewItemNextId] = useState(-1);

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<Container>({
      data: container as Container,
      handleUpdate,
      transformChangesOnUpdate: (changes) =>
        transformChangesOnUpdate(changes as Container, treatments),
      updateFields,
      updateVariables,
      validationLabels: validationLabels(
        baseLabels(vessels, warehouses, vendors),
      ),
    });

  const updateActions = getUpdateActions({
    onCancel: () => {
      setNewItemNextId(-1);
    },
  });

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(
      editing ? changes?.containerTreatments.nodes.length : treatments.length,
      pallets.length,
    ),
    isRoute: false,
    paramName: 'containerView',
  });
  const isTreatments = selectedTabId === 'treatments';

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

  const handleChangeTreatment = (updatedTreatment: ContainerTreatment) => {
    const updatedTreatments = changes.containerTreatments.nodes.map(
      (treatment) =>
        treatment?.id === updatedTreatment.id ? updatedTreatment : treatment,
    );
    handleChange('containerTreatments', {
      ...changes.containerTreatments,
      nodes: updatedTreatments,
    });
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

  return (
    <Page
      actions={[
        container && isEditSchedule
          ? editing
            ? updateActions.defaultActions
            : updateActions.editAction
          : null,
        !editing && (
          <l.Div key="inspections" ml={th.spacing.lg}>
            {container?.containerId ? (
              <l.AreaLink
                to={`/reports/inspections/arrival?search=${container.containerId}`}
              >
                <b.Primary>Inspections</b.Primary>
              </l.AreaLink>
            ) : (
              <b.Primary disabled>Inspections</b.Primary>
            )}
          </l.Div>
        ),
      ]}
      breadcrumbs={breadcrumbs(containerId)}
      title={container ? 'Container' : 'Loading...'}
    >
      {container ? (
        <>
          <BaseData<Container>
            data={container}
            changes={changes}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(vessels, warehouses, vendors)}
            showValidation={saveAttempt}
          />
          <l.Div my={th.spacing.lg}>
            <TabBar />
          </l.Div>
          {isTreatments ? (
            <ContainerTreatmentList
              editing={editing}
              handleAdd={handleAddTreatment}
              handleChange={handleChangeTreatment}
              handleRemove={handleRemoveTreatment}
              treatments={treatments}
              treatmentChanges={
                changes?.containerTreatments.nodes as ContainerTreatment[]
              }
              saveAttempt={saveAttempt}
            />
          ) : (
            <PalletList pallets={pallets} />
          )}
          <l.Div height={th.spacing.xxl} />
        </>
      ) : (
        <DataMessage data={container || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
