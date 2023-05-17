import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import useUpdateItem from 'hooks/use-update-item';
import {
  ProductSpecies,
  Shipper,
  Vendor,
  Vessel,
  WireRequest,
  WireRequestAccountOfSaleItem,
  WireRequestMiscItem,
  WireRequestOceanFreightItem,
  WireRequestShipperAdvanceItem,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  baseLabels,
  getTotalComponents,
  transformChangesOnUpdate,
  validationLabels,
} from './data-utils';
import OceanFreightItemList from './items/ocean-freight-list';
import ShipperAdvanceItemList from './items/shipper-advance-list';
import AccountOfSaleItemList from './items/account-of-sale-list';
import MiscItemList from './items/misc-list';

const breadcrumbs = (id: string) => [
  {
    text: 'Wire Requests',
    to: `/accounting/wires`,
  },
  {
    text: 'Wire Request',
    to: `/accounting/wires/${id}`,
  },
];

export const tabs: (
  itemId: string,
  itemName: string,
  itemCount: number,
  isMisc: boolean,
  miscCount: number,
) => Tab[] = (itemId, itemName, itemCount, isMisc, miscCount) => [
  ...(isMisc
    ? []
    : [
        {
          id: itemId,
          text: `${itemName} (${itemCount})`,
        },
      ]),
  {
    id: 'misc',
    text: `Misc (${miscCount})`,
  },
];

const Details = () => {
  const {
    apiData: { data },
    roles: { isAccounting, isApproveWires, isEditWires },
  } = useActiveUser();
  const userCode = data?.userCode;
  const { id } = useParams<{
    id: string;
  }>();

  const [wireView, setWireView] = useQueryParam('wireView');

  const { data: wireRequest, error, loading } = api.useWireRequest(id);
  const oceanFreightItems = (wireRequest?.wireRequestOceanFreightItems.nodes ||
    []) as WireRequestOceanFreightItem[];
  const shipperAdvanceItems = (wireRequest?.wireRequestShipperAdvanceItems
    .nodes || []) as WireRequestShipperAdvanceItem[];
  const accountOfSaleItems = (wireRequest?.wireRequestAccountOfSaleItems
    .nodes || []) as WireRequestAccountOfSaleItem[];
  const miscItems = (wireRequest?.wireRequestMiscItems.nodes ||
    []) as WireRequestMiscItem[];

  const { data: vesselsData } = api.useExpensesVessels();
  const vessels = vesselsData ? (vesselsData.nodes as Vessel[]) : [];

  const [, setVesselDetails] = useState<{
    [key: string]: Vessel;
  }>({});

  const handleUpdateData = (vesselDetailsData: Vessel) => {
    setVesselDetails((s) => ({
      ...s,
      [vesselDetailsData.vesselCode]: vesselDetailsData,
    }));
  };

  const { data: shipperData } = api.useShippers('ID_ASC');
  const shippers = shipperData ? (shipperData.nodes as Shipper[]) : [];

  const { data: vendorData } = api.useVendors('ID_ASC');
  const vendors = vendorData ? (vendorData.nodes as Vendor[]) : [];

  const { data: productSpeciesData } = api.useProductSpeciesList();
  const speciesList = (productSpeciesData?.nodes || []) as ProductSpecies[];

  const [handleUpdate] = api.useUpdateWireRequest(wireRequest?.id || '');

  const updateFields = [
    'vendorId',
    'wireNumber',
    'wireDate',
    'wireType',
    'requestDate',
    'requestUserCode',
    'approvalDate',
    'approvalUserCode',
    'bankId',
    'isVerified',
    'sentDate',
  ];
  const updateVariables = { id: wireRequest?.id || 0 };

  const initialState = {
    newItemNextId: -1,
    isApprove: false,
  };
  const [{ newItemNextId, isApprove }, setState] = useState(initialState);

  const setNewItemNextId = (newItemNextId: number) => {
    setState((state) => ({
      ...state,
      newItemNextId,
    }));
  };

  const {
    changes,
    editing,
    handleChange,
    handleChanges,
    handleEdit,
    getUpdateActions,
    saveAttempt,
  } = useUpdateItem<WireRequest>({
    data: wireRequest as WireRequest,
    handleUpdate,
    transformChangesOnUpdate: (changes) =>
      transformChangesOnUpdate(
        changes as WireRequest,
        oceanFreightItems,
        shipperAdvanceItems,
        accountOfSaleItems,
        miscItems,
      ),
    updateFields,
    updateVariables,
    validationLabels: validationLabels(
      baseLabels(vendors, false, isApprove),
      vessels,
      shippers,
      speciesList,
    ),
  });

  const toggleApprove = () => {
    setState((state) => ({
      ...state,
      isApprove: true,
    }));
    handleChanges({ approvalUserCode: userCode, approvalDate: new Date() });
    handleEdit();
  };

  const updateActions = getUpdateActions({
    onCancel: () => {
      setState(initialState);
    },
  });

  const isOceanFreight = wireRequest?.wireType === 'ocean-freight';
  const isShipperAdvance = wireRequest?.wireType === 'shipper-advance';
  const isAccountOfSale = wireRequest?.wireType === 'account-of-sale';
  const isMisc = wireRequest?.wireType === 'misc';

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(
      isOceanFreight
        ? 'ocean-freight'
        : isShipperAdvance
        ? 'shipper-advance'
        : 'account-of-sale',
      isOceanFreight
        ? 'Ocean Freight'
        : isShipperAdvance
        ? 'Shipper Advance'
        : 'Account Of Sale',
      editing
        ? isOceanFreight
          ? changes?.wireRequestOceanFreightItems.nodes.length
          : isShipperAdvance
          ? changes?.wireRequestShipperAdvanceItems.nodes.length
          : changes?.wireRequestAccountOfSaleItems.nodes.length
        : isOceanFreight
        ? oceanFreightItems.length
        : isShipperAdvance
        ? shipperAdvanceItems.length
        : accountOfSaleItems.length,
      isMisc,
      editing ? changes?.wireRequestMiscItems.nodes.length : miscItems.length,
    ),
    isRoute: false,
    paramName: 'wireView',
  });

  const totalComponents = getTotalComponents(
    changes,
    isOceanFreight,
    isShipperAdvance,
  );

  const disableAdd = !vendors.find((v) => v.id === changes?.vendorId);

  const handleAddItem = () => {
    if (isMisc || wireView === 'misc') {
      const updatedItems = [
        ...changes.wireRequestMiscItems.nodes,
        {
          id: newItemNextId,
          itemDescription: '',
          itemAmount: '0',
        },
      ];
      handleChange('wireRequestMiscItems', {
        ...changes?.wireRequestMiscItems,
        nodes: updatedItems,
      });
    } else if (isOceanFreight) {
      const updatedItems = [
        ...changes.wireRequestOceanFreightItems.nodes,
        {
          id: newItemNextId,
          shipperId: '',
          vesselCode: '',
          billOfLading: '',
          palletCount: 0,
          palletAmount: '0',
          freightAmount: '0',
          receivedDate: null,
        },
      ];
      handleChange('wireRequestOceanFreightItems', {
        ...changes?.wireRequestOceanFreightItems,
        nodes: updatedItems,
      });
    } else if (isShipperAdvance) {
      const updatedItems = [
        ...changes.wireRequestShipperAdvanceItems.nodes,
        {
          id: newItemNextId,
          billOfLading: '',
          vesselCode: '',
          speciesId: '',
          boxAmount: '0',
        },
      ];
      handleChange('wireRequestShipperAdvanceItems', {
        ...changes?.wireRequestShipperAdvanceItems,
        nodes: updatedItems,
      });
    } else if (isAccountOfSale) {
      const updatedItems = [
        ...changes.wireRequestAccountOfSaleItems.nodes,
        {
          id: newItemNextId,
          billOfLading: '',
          vesselCode: '',
        },
      ];
      handleChange('wireRequestAccountOfSaleItems', {
        ...changes?.wireRequestAccountOfSaleItems,
        nodes: updatedItems,
      });
    }

    setNewItemNextId(newItemNextId - 1);
  };

  const handleChangeOceanFreightItem = (
    updatedItem: WireRequestOceanFreightItem,
  ) => {
    const updatedItems = changes.wireRequestOceanFreightItems.nodes.map(
      (item) => (item?.id === updatedItem.id ? updatedItem : item),
    );
    handleChange('wireRequestOceanFreightItems', {
      ...changes.wireRequestOceanFreightItems,
      nodes: updatedItems,
    });
  };

  const handleChangeShipperAdvanceItem = (
    updatedItem: WireRequestShipperAdvanceItem,
  ) => {
    const updatedItems = changes.wireRequestShipperAdvanceItems.nodes.map(
      (item) => (item?.id === updatedItem.id ? updatedItem : item),
    );
    handleChange('wireRequestShipperAdvanceItems', {
      ...changes.wireRequestShipperAdvanceItems,
      nodes: updatedItems,
    });
  };

  const handleChangeAccountOfSaleItem = (
    updatedItem: WireRequestAccountOfSaleItem,
  ) => {
    const updatedItems = changes.wireRequestAccountOfSaleItems.nodes.map(
      (item) => (item?.id === updatedItem.id ? updatedItem : item),
    );
    handleChange('wireRequestAccountOfSaleItems', {
      ...changes.wireRequestAccountOfSaleItems,
      nodes: updatedItems,
    });
  };

  const handleChangeMiscItem = (updatedItem: WireRequestMiscItem) => {
    const updatedItems = changes.wireRequestMiscItems.nodes.map((item) =>
      item?.id === updatedItem.id ? updatedItem : item,
    );
    handleChange('wireRequestMiscItems', {
      ...changes.wireRequestMiscItems,
      nodes: updatedItems,
    });
  };

  const handleRemoveItem = (itemId: string | number) => {
    if (isOceanFreight) {
      const updatedItems = changes.wireRequestOceanFreightItems.nodes.filter(
        (item) => item?.id !== itemId,
      );
      handleChange('wireRequestOceanFreightItems', {
        ...changes.wireRequestOceanFreightItems,
        nodes: updatedItems,
      });
    } else if (isShipperAdvance) {
      const updatedItems = changes.wireRequestShipperAdvanceItems.nodes.filter(
        (item) => item?.id !== itemId,
      );
      handleChange('wireRequestShipperAdvanceItems', {
        ...changes.wireRequestShipperAdvanceItems,
        nodes: updatedItems,
      });
    } else if (isAccountOfSale) {
      const updatedItems = changes.wireRequestAccountOfSaleItems.nodes.filter(
        (item) => item?.id !== itemId,
      );
      handleChange('wireRequestAccountOfSaleItems', {
        ...changes.wireRequestAccountOfSaleItems,
        nodes: updatedItems,
      });
    } else {
      const updatedItems = changes.wireRequestMiscItems.nodes.filter(
        (item) => item?.id !== itemId,
      );
      handleChange('wireRequestMiscItems', {
        ...changes.wireRequestMiscItems,
        nodes: updatedItems,
      });
    }
  };

  useEffect(() => {
    if (
      !isMisc &&
      wireView !== 'misc' &&
      changes &&
      changes.wireType !== wireView
    ) {
      setWireView(changes.wireType, 'replaceIn');
    }
  }, [changes, isMisc, setWireView, wireView]);

  if (!isAccounting) {
    return <Redirect to="/accounting" />;
  }

  return (
    <Page
      actions={[
        wireRequest && isEditWires
          ? editing
            ? updateActions.defaultActions
            : updateActions.editAction
          : null,
        wireRequest && isApproveWires && !editing && (
          <b.Success ml={th.spacing.lg} onClick={toggleApprove}>
            Approve
          </b.Success>
        ),
      ]}
      breadcrumbs={breadcrumbs(wireRequest?.id)}
      title={wireRequest ? 'Wire Request' : 'Loading...'}
    >
      {wireRequest ? (
        <>
          <BaseData<WireRequest>
            data={wireRequest}
            changes={changes}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(vendors, false, isApprove)}
            showValidation={saveAttempt}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            {totalComponents}
          </l.Flex>
          {isMisc || selectedTabId === 'misc' ? (
            <MiscItemList
              disableAdd={disableAdd}
              editing={editing && !isApprove}
              handleAdd={handleAddItem}
              handleChange={handleChangeMiscItem}
              handleRemove={handleRemoveItem}
              items={miscItems}
              itemChanges={
                changes?.wireRequestMiscItems.nodes as WireRequestMiscItem[]
              }
              saveAttempt={saveAttempt}
            />
          ) : isOceanFreight ? (
            <OceanFreightItemList
              disableAdd={disableAdd}
              editing={editing && !isApprove}
              handleAdd={handleAddItem}
              handleChange={handleChangeOceanFreightItem}
              handleRemove={handleRemoveItem}
              items={oceanFreightItems}
              itemChanges={
                changes?.wireRequestOceanFreightItems
                  .nodes as WireRequestOceanFreightItem[]
              }
              saveAttempt={saveAttempt}
              shippers={shippers}
              vessels={vessels}
            />
          ) : isShipperAdvance ? (
            <ShipperAdvanceItemList
              disableAdd={disableAdd}
              editing={editing && !isApprove}
              handleAdd={handleAddItem}
              handleChange={handleChangeShipperAdvanceItem}
              handleRemove={handleRemoveItem}
              handleUpdateData={handleUpdateData}
              items={shipperAdvanceItems}
              itemChanges={
                changes?.wireRequestShipperAdvanceItems
                  .nodes as WireRequestShipperAdvanceItem[]
              }
              loading={loading}
              saveAttempt={saveAttempt}
              shipper={shippers.find((s) => s.id === changes.vendorId)}
              vessels={vessels.filter((v) =>
                (v.inventoryItems.nodes || []).some(
                  (i) => i?.shipper?.id === changes.vendorId,
                ),
              )}
              speciesList={speciesList}
            />
          ) : isAccountOfSale ? (
            <AccountOfSaleItemList
              disableAdd={disableAdd}
              editing={editing && !isApprove}
              handleAdd={handleAddItem}
              handleChange={handleChangeAccountOfSaleItem}
              handleRemove={handleRemoveItem}
              items={accountOfSaleItems}
              itemChanges={
                changes?.wireRequestAccountOfSaleItems
                  .nodes as WireRequestAccountOfSaleItem[]
              }
              saveAttempt={saveAttempt}
              vessels={vessels.filter((v) =>
                (v.inventoryItems.nodes || []).some(
                  (i) => i?.shipper?.id === changes.vendorId,
                ),
              )}
            />
          ) : null}
          <l.Div height={th.spacing.xxl} />
        </>
      ) : (
        <DataMessage data={wireRequest || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
