import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { omit } from 'ramda';
import { Redirect, useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
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

import { baseLabels, getTotalComponents, validationLabels } from './data-utils';
import { tabs } from './details';
import AccountOfSaleItemList from './items/account-of-sale-list';
import MiscItemList from './items/misc-list';
import OceanFreightItemList from './items/ocean-freight-list';
import ShipperAdvanceItemList from './items/shipper-advance-list';

export const breadcrumbs = [
  { text: 'Wires', to: `/accounting/wires` },
  { text: 'Create', to: `/accounting/wires/create` },
];

const CreateWireRequest = () => {
  const history = useHistory();

  const {
    apiData: { data, loading: userDataLoading },
    roles: { isEditWires },
  } = useActiveUser();
  const previousLoading = usePrevious(userDataLoading);
  const userCode = data?.userCode;

  const [, setWireView] = useQueryValue('wireView');

  const { data: vesselsData, loading: vesselsLoading } =
    api.useExpensesVessels();
  const vessels = vesselsData ? (vesselsData.nodes as Vessel[]) : [];

  const loading = userDataLoading || vesselsLoading;

  const [vesselDetailsData, setVesselDetails] = useState<{
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

  const initialState = useMemo(() => {
    const itemBaseState = {
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges: [],
    };
    return {
      id: -1,
      nodeId: '',
      wireNumber: '',
      wireDate: null,
      vendorId: '',
      wireType: 'ocean-freight',
      requestDate: formatDate(new Date()),
      requestUserCode: userCode,
      approvalDate: null,
      approvalUserCode: null,
      bankId: 'JM',
      isVerified: false,
      sentDate: null,
      wireRequestOceanFreightItems: {
        ...itemBaseState,
        nodes: [] as WireRequestOceanFreightItem[],
      },
      wireRequestShipperAdvanceItems: {
        ...itemBaseState,
        nodes: [] as WireRequestShipperAdvanceItem[],
      },
      wireRequestAccountOfSaleItems: {
        ...itemBaseState,
        nodes: [] as WireRequestAccountOfSaleItem[],
      },
      wireRequestMiscItems: {
        ...itemBaseState,
        nodes: [] as WireRequestMiscItem[],
      },
    } as WireRequest;
  }, [userCode]);

  const cancelLink = '/accounting/wires';

  const [handleCreate] = api.useCreateWireRequest();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);
  const [newItemNextId, setNewItemNextId] = useState(-2);

  const [changes, setChanges] = useState<WireRequest>(
    initialState as WireRequest,
  );

  const handleChange = (field: keyof WireRequest, value: any) => {
    setChanges({ ...changes, [field]: value } as WireRequest);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (
      validateItem(
        changes,
        validationLabels(
          baseLabels(vendors, true, false),
          vessels,
          shippers,
          speciesList,
        ),
      )
    ) {
      setLoading(true);
      handleCreate({
        variables: {
          wireRequest: {
            ...omit(
              [
                'id',
                'nodeId',
                'wireRequestOceanFreightItems',
                'wireRequestShipperAdvanceItems',
                'wireRequestAccountOfSaleItems',
                'wireRequestMiscItems',
              ],
              changes,
            ),
            wireRequestOceanFreightItemsUsingId: {
              create: changes.wireRequestOceanFreightItems.nodes.map((item) =>
                omit(['id', 'nodeId'], item),
              ),
            },
            wireRequestShipperAdvanceItemsUsingId: {
              create: changes.wireRequestShipperAdvanceItems.nodes.map((item) =>
                omit(['id', 'nodeId'], item),
              ),
            },
            wireRequestAccountOfSaleItemsUsingId: {
              create: changes.wireRequestAccountOfSaleItems.nodes.map((item) =>
                omit(['id', 'nodeId'], item),
              ),
            },
            wireRequestMiscItemsUsingId: {
              create: changes.wireRequestMiscItems.nodes.map((item) =>
                omit(['id', 'nodeId'], item),
              ),
            },
          },
        },
      }).then(() => {
        history.push(cancelLink);
      });
    }
  };

  const isOceanFreight = changes.wireType === 'ocean-freight';
  const isShipperAdvance = changes.wireType === 'shipper-advance';
  const isAccountOfSale = changes.wireType === 'account-of-sale';
  const isMisc = changes.wireType === 'misc';

  const itemsCount = isOceanFreight
    ? changes?.wireRequestOceanFreightItems.nodes.length
    : isShipperAdvance
    ? changes?.wireRequestShipperAdvanceItems.nodes.length
    : changes?.wireRequestAccountOfSaleItems.nodes.length;

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
      itemsCount,
      isMisc,
      changes?.wireRequestMiscItems.nodes.length,
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

  useEffect(() => {
    if (changes.wireType !== selectedTabId && selectedTabId !== 'misc') {
      setWireView(changes.wireType, 'replaceIn');
    }
  }, [changes.wireType, isMisc, selectedTabId, setWireView]);

  useEffect(() => {
    if (!userDataLoading && previousLoading) {
      setChanges(initialState);
    }
  }, [userDataLoading, initialState, previousLoading]);

  const handleAddItem = () => {
    if (isMisc || selectedTabId === 'misc') {
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

  if (!isEditWires) {
    return <Redirect to="/accounting/wires" />;
  }

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Error width={88}>Cancel</b.Error>
          </l.AreaLink>
          <b.Success ml={th.spacing.md} onClick={handleSave} width={88}>
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
          </b.Success>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs}
      title="Create Wire Request"
    >
      <BaseData<WireRequest>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(vendors, true, false, !!itemsCount)}
        showValidation={saveAttempt}
      />
      <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
        <TabBar />
        {totalComponents}
      </l.Flex>
      {isMisc || selectedTabId === 'misc' ? (
        <MiscItemList
          disableAdd={disableAdd}
          editing={true}
          handleAdd={handleAddItem}
          handleChange={handleChangeMiscItem}
          handleRemove={handleRemoveItem}
          itemChanges={
            changes?.wireRequestMiscItems.nodes as WireRequestMiscItem[]
          }
          saveAttempt={saveAttempt}
        />
      ) : isOceanFreight ? (
        <OceanFreightItemList
          disableAdd={disableAdd}
          editing={true}
          handleAdd={handleAddItem}
          handleChange={handleChangeOceanFreightItem}
          handleRemove={handleRemoveItem}
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
          editing={true}
          handleAdd={handleAddItem}
          handleChange={handleChangeShipperAdvanceItem}
          handleRemove={handleRemoveItem}
          handleUpdateData={handleUpdateData}
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
          editing={true}
          handleAdd={handleAddItem}
          handleChange={handleChangeAccountOfSaleItem}
          handleRemove={handleRemoveItem}
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
    </Page>
  );
};

export default CreateWireRequest;
