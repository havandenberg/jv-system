import React, { useEffect, useState } from 'react';
import { add, endOfISOWeek, isAfter, startOfISOWeek } from 'date-fns';
import {
  isEmpty,
  omit,
  pathOr,
  pick,
  pluck,
  sortBy,
  times,
  uniqBy,
} from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import ItemSelector from 'components/item-selector';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import {
  Maybe,
  Shipper,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVessel,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { useUserContext } from 'components/user/context';
import {
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import { coastTabs } from '../use-filters';
import { getAllVessels, getDuplicateProductIds } from './data-utils';
import Products from './products';
import {
  EntryUpdate,
  NewItemNextIds,
  NewProduct,
  NewVessel,
  ProductUpdate,
  ShipperProjectionChanges,
  ShipperProjectionProductWithEntries,
  ShipperProjectionState,
  UpdateType,
  VesselUpdate,
} from './types';
import Vessels from './vessels';

const initialChangesState: ShipperProjectionChanges = {
  vesselUpdates: [],
  productUpdates: [],
  entryUpdates: [],
  newVessels: [],
  newProducts: [],
  newEntries: [],
};

const initialNewItemNextIds: NewItemNextIds = {
  vessel: -1,
  product: -1,
  entry: -1,
};

const initialState: ShipperProjectionState = {
  changes: initialChangesState,
  newItemNextIds: initialNewItemNextIds,
  removedProductIds: [],
  skippedWeeks: [],
};

const ShipperProjections = () => {
  const [startDate] = useQueryValue('startDate');
  const [shipperIdQuery, setShipperId] = useQueryValue('shipperId');
  const shipperId = shipperIdQuery || '';
  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers();
  const shippers = shipperData ? shipperData.nodes : [];
  const selectedShipper = shippers.find(
    (shipper) => shipper && shipper.id === shipperId,
  );

  const { TabBar, selectedTabId: coast } = useTabBar(
    coastTabs,
    false,
    'EC',
    'coast',
    1,
  );
  const { DateRangePicker, ForwardButton, BackwardButton, handleDateChange } =
    useDateRange({
      hideDefinedRanges: true,
      singleSelection: true,
      maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    });

  const {
    data,
    loading: dataLoading,
    error: dataError,
  } = api.useShipperProjectionVessels();
  const vessels = (data ? data.nodes : []) as ShipperProjectionVessel[];

  const [saveAttempt, setSaveAttempt] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpdate] = api.useUpdateShipperProjection();
  const [handleCreateVessel] = api.useCreateShipperProjectionVessel();
  const [handleCreateProducts] = api.useCreateShipperProjectionProducts();
  const [handleCreateEntry] = api.useCreateShipperProjectionEntry();
  const [handleDeleteEntries] = api.useDeleteShipperProjectionEntries();

  const [state, setState] = useState<ShipperProjectionState>(initialState);
  const { changes, newItemNextIds, removedProductIds, skippedWeeks } = state;

  const setChanges = (newChanges: ShipperProjectionChanges) => {
    setState((prevState) => ({ ...prevState, changes: newChanges }));
  };

  const setNewItemNextIds = (newNewItemNextIds: NewItemNextIds) => {
    setState((prevState) => ({
      ...prevState,
      newItemNextIds: newNewItemNextIds,
    }));
  };

  const setRemovedProductIds = (newRemovedProductIds: number[]) => {
    setState((prevState) => ({
      ...prevState,
      removedProductIds: newRemovedProductIds,
    }));
  };

  const setSkippedWeeks = (newSkippedWeeks: string[]) => {
    setState((prevState) => ({
      ...prevState,
      skippedWeeks: newSkippedWeeks,
    }));
  };

  const getValue = <T extends UpdateType>(
    item: any,
    key: keyof T,
    changesKey: keyof ShipperProjectionChanges,
    defaultValue?: string,
  ) => {
    if (!item) {
      return {
        dirty: false,
        value: defaultValue || '',
      };
    }
    const items: any[] = changes[changesKey];
    const changedItem = items.find((i) => i.id === item.id);
    if (changedItem) {
      return {
        dirty: item.id < 0 || changedItem[key] !== item[key],
        value: changedItem[key],
      };
    }
    return { dirty: false, value: item[key] === undefined ? '' : item[key] };
  };

  const getVesselValue = (
    vessel: Maybe<ShipperProjectionVessel> | undefined,
    key: keyof VesselUpdate,
  ) => {
    const changesKey = vessel && vessel.id < 0 ? 'newVessels' : 'vesselUpdates';
    return getValue(vessel, key, changesKey);
  };

  const getProductValue = (
    product: Maybe<ShipperProjectionProduct> | undefined,
    key: keyof ProductUpdate,
  ) => {
    const changesKey =
      product && product.id < 0 ? 'newProducts' : 'productUpdates';
    return getValue(product, key, changesKey);
  };

  const getEntryValue = (
    entry: Maybe<ShipperProjectionEntry> | undefined,
    key: keyof EntryUpdate,
  ) => {
    const changesKey = entry && entry.id < 0 ? 'newEntries' : 'entryUpdates';
    return getValue(entry, key, changesKey);
  };

  const allVessels = getAllVessels(vessels, changes, getVesselValue);

  const toggleSkippedWeeks = (weekToSkip: string) => {
    if (skippedWeeks.includes(weekToSkip)) {
      setSkippedWeeks(skippedWeeks.filter((week) => week !== weekToSkip));
    } else {
      setSkippedWeeks([...skippedWeeks, weekToSkip]);
    }
  };

  const ghostVesselDates = times(
    (idx) =>
      formatDate(
        add(
          startOfISOWeek(
            startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
          ),
          {
            weeks: idx,
          },
        ),
      ),
    5,
  ).filter(
    (date) =>
      !allVessels.find(
        (vessel) =>
          isDateGreaterThanOrEqualTo(
            new Date(
              getVesselValue(
                vessel as ShipperProjectionVessel,
                'departureDate',
              ).value.replace(/-/g, '/'),
            ),
            new Date(date.replace(/-/g, '/')),
          ) &&
          isDateLessThanOrEqualTo(
            new Date(
              getVesselValue(
                vessel as ShipperProjectionVessel,
                'departureDate',
              ).value.replace(/-/g, '/'),
            ),
            endOfISOWeek(new Date(date.replace(/-/g, '/'))),
          ),
      ),
  );

  const allVesselsWithGhostVessels = sortBy(
    (vessel) =>
      vessel.id === 0
        ? vessel.departureDate
        : getVesselValue(vessel, 'departureDate').value,
    [
      ...allVessels,
      ...ghostVesselDates.map((date) => ({
        id: 0,
        departureDate: date,
      })),
    ] as ShipperProjectionVessel[],
  );

  const gridTemplateColumns = `500px repeat(${
    allVesselsWithGhostVessels.length || 1
  }, 140px)`;

  const allEntries = allVessels
    .map((vessel) =>
      pathOr([], ['shipperProjectionEntriesByVesselId', 'nodes'], vessel),
    )
    .flat() as ShipperProjectionEntry[];

  const products = sortBy(
    (product) =>
      ['species', 'variety', 'size', 'packType', 'plu']
        .map(
          (key) =>
            getProductValue(product, key as keyof ProductUpdate).value ||
            'zzzzzz',
        )
        .join(' '),
    uniqBy(
      (product) => product.id,
      pluck('product', allEntries) as ShipperProjectionProduct[],
    )
      .map(
        (product) =>
          ({
            ...product,
            entries: allEntries
              .filter(
                (entry) => entry.product && entry.product.id === product.id,
              )
              .map((entry) => ({
                id: entry.id,
                palletCount: getEntryValue(entry, 'palletCount').value,
                vesselId: entry.vesselId,
              })),
          } as ShipperProjectionProductWithEntries),
      )
      .filter((product) => !removedProductIds.includes(product.id)),
  );

  const updatedProducts = products.map((product) => ({
    id: product.id,
    species: getProductValue(product, 'species').value,
    variety: getProductValue(product, 'variety').value,
    size: getProductValue(product, 'size').value,
    packType: getProductValue(product, 'packType').value,
    plu: getProductValue(product, 'plu').value,
  })) as ShipperProjectionProduct[];

  const hasConfirmedSkippedWeeks = ghostVesselDates.reduce(
    (acc, date) => acc && skippedWeeks.includes(date),
    true,
  );

  const hasValidVesselNames = allVessels.reduce(
    (acc, vessel) =>
      acc &&
      vessel &&
      !['', 'New Vessel'].includes(
        getVesselValue(vessel as ShipperProjectionVessel, 'vesselName').value,
      ),
    true,
  );

  const hasValidVesselDates = allVessels.reduce(
    (acc, vessel) =>
      acc &&
      vessel &&
      isAfter(
        new Date(
          getVesselValue(
            vessel as ShipperProjectionVessel,
            'arrivalDate',
          ).value,
        ),
        new Date(
          getVesselValue(
            vessel as ShipperProjectionVessel,
            'departureDate',
          ).value,
        ),
      ),
    true,
  );

  const hasValidProducts = updatedProducts.reduce(
    (acc, product) =>
      acc &&
      product &&
      !!product.species &&
      !!product.variety &&
      !!product.size &&
      !!product.packType,
    true,
  );

  const duplicateProductIds = getDuplicateProductIds(updatedProducts);

  const validate = () =>
    hasConfirmedSkippedWeeks &&
    hasValidVesselNames &&
    hasValidVesselDates &&
    hasValidProducts &&
    isEmpty(duplicateProductIds);

  const [{ activeUserId }] = useUserContext();
  const [handleCreateUserMessages] = api.useCreateUserMessages();

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
      if (selectedShipper && activeUserId) {
        handleCreateUserMessages({
          variables: {
            messages: [
              {
                actionLink: `/sales/inventory/projections?coast=${coast}&endDate=${formatDate(
                  new Date(),
                )}&shipperId=${selectedShipper.id}&startDate=${formatDate(
                  new Date(),
                )}`,
                actionText: 'View Projection',
                details: `${selectedShipper.shipperName} (${selectedShipper.id})`,
                header: 'Shipper Projection Completed',
                isRead: false,
                messageDate: new Date().toISOString(),
                priority: 3,
                userId: activeUserId,
              },
            ],
          },
        });
      }
      setUpdateLoading((prevLoading) => [...prevLoading, 'existing-items']);
      handleUpdate({
        variables: {
          shipperProjectionVessels: changes.vesselUpdates.map((v) => ({
            vesselName: v.vesselName,
            departureDate: v.departureDate,
            arrivalDate: v.arrivalDate,
            arrivalPort: v.arrivalPort,
            vesselStatus: v.vesselStatus,
            id: parseInt(v.id, 10),
          })),
          shipperProjectionProducts: changes.productUpdates.map((p) => ({
            species: p.species,
            variety: p.variety,
            size: p.size,
            packType: p.packType,
            plu: p.plu,
            id: parseInt(p.id, 10),
          })),
          shipperProjectionEntries: changes.entryUpdates.map((e) => ({
            palletCount: e.palletCount,
            id: parseInt(e.id, 10),
          })),
        },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== 'existing-items'),
        );
      });

      setUpdateLoading((prevLoading) => [...prevLoading, `new-products`]);
      handleCreateProducts({
        variables: {
          shipperProjectionProducts: changes.newProducts.map((p) => ({
            shipperId: p.shipperId,
            species: p.species,
            variety: p.variety,
            size: p.size,
            packType: p.packType,
            plu: p.plu,
          })),
        },
      }).then((res) => {
        const createdProducts =
          res.data?.bulkUpsertShipperProjectionProduct
            ?.shipperProjectionProducts || [];

        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `new-products`),
        );

        changes.newEntries
          .filter((e) => e.vesselId >= 0)
          .map((e) => {
            const newProduct = changes.newProducts.find(
              (p) => p.id === e.productId,
            ) || { id: 0 };

            const createdProduct = createdProducts.find(
              (p) =>
                p?.species === newProduct.species &&
                p?.variety === newProduct.variety &&
                p?.size === newProduct.size &&
                p?.packType === newProduct.packType &&
                p?.plu === newProduct.plu,
            ) || { id: 0 };

            return {
              vesselId: e.vesselId,
              palletCount: e.palletCount,
              productId: e.productId > 0 ? e.productId : createdProduct.id,
            };
          })
          .forEach((e, idx) => {
            if (e.productId > 0) {
              setUpdateLoading((prevLoading) => [
                ...prevLoading,
                `entry-${idx}`,
              ]);

              handleCreateEntry({
                variables: { shipperProjectionEntry: e },
              }).then(() => {
                setUpdateLoading((prevLoading) =>
                  prevLoading.filter((l) => l !== `entry-${idx}`),
                );
              });
            }
          });

        changes.newVessels
          .map((v) => ({
            vesselName: v.vesselName,
            departureDate: v.departureDate,
            arrivalDate: v.arrivalDate,
            arrivalPort: v.arrivalPort,
            vesselStatus: v.vesselStatus,
            shipperId,
            shipperProjectionEntriesUsingId: {
              create: changes.newEntries
                .filter((e) => e.vesselId === v.id)
                .map((e) => {
                  const newProduct = changes.newProducts.find(
                    (p) => p.id === e.productId,
                  ) || { id: 0 };

                  const createdProduct = createdProducts.find(
                    (p) =>
                      p?.species === newProduct.species &&
                      p?.variety === newProduct.variety &&
                      p?.size === newProduct.size &&
                      p?.packType === newProduct.packType &&
                      p?.plu === newProduct.plu,
                  ) || { id: 0 };

                  return {
                    palletCount: e.palletCount,
                    productId:
                      e.productId > 0 ? e.productId : createdProduct.id,
                  };
                }),
            },
          }))
          .forEach((v, idx) => {
            setUpdateLoading((prevLoading) => [
              ...prevLoading,
              `vessel-${idx}`,
            ]);

            handleCreateVessel({
              variables: { shipperProjectionVessel: v },
            }).then(() => {
              setUpdateLoading((prevLoading) =>
                prevLoading.filter((l) => l !== `vessel-${idx}`),
              );
            });
          });
      });

      const idsToDelete = pluck(
        'id',
        allEntries.filter((entry) =>
          removedProductIds.includes(entry.product?.id),
        ),
      );

      setUpdateLoading((prevLoading) => [...prevLoading, 'del-entries']);
      handleDeleteEntries({
        variables: {
          idsToDelete,
        },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-entries`),
        );
      });
    }
  };

  const handleCancel = () => {
    setState(initialState);
    setSaveAttempt(false);
  };

  useEffect(() => {
    if (
      !isEmpty(previousUpdateLoading) &&
      isEmpty(updateLoading) &&
      !dataLoading
    ) {
      handleCancel();
    }
  }, [dataLoading, previousUpdateLoading, updateLoading]);

  const handleChange = <T extends UpdateType>(
    updates: T[],
    changesKey: keyof ShipperProjectionChanges,
  ) => {
    let updatedItems: any[] = changes[changesKey];
    updates.forEach((update) => {
      if (updatedItems.find((u) => u.id === update.id)) {
        updatedItems = updatedItems.map((u) =>
          u.id === update.id ? { ...u, ...omit(['id'], update) } : u,
        );
      } else {
        updatedItems = [...updatedItems, update];
      }
    });
    setChanges({ ...changes, [changesKey]: updatedItems });
  };

  const handleVesselChange = (update: VesselUpdate) => {
    const changesKey = update.id < 0 ? 'newVessels' : 'vesselUpdates';
    handleChange([update], changesKey);
  };

  const handleProductChange = (update: ProductUpdate) => {
    const changesKey = update.id < 0 ? 'newProducts' : 'productUpdates';
    handleChange([update], changesKey);
  };

  const handleEntryChange = (update: EntryUpdate) => {
    const changesKey = update.id < 0 ? 'newEntries' : 'entryUpdates';
    handleChange([update], changesKey);
  };

  const handleNewVessel = (newVessel: NewVessel) => {
    const newEntries = products.map((product, idx) => ({
      palletCount: 0,
      id: newItemNextIds.entry - idx,
      vesselId: newItemNextIds.vessel,
      productId: parseInt(product.id, 10),
      product,
    }));

    setChanges({
      ...changes,
      newVessels: [
        ...changes.newVessels,
        {
          ...newVessel,
          id: newItemNextIds.vessel,
        },
      ] as ShipperProjectionVessel[],
      newEntries: [
        ...changes.newEntries,
        ...newEntries,
      ] as ShipperProjectionEntry[],
    });

    setNewItemNextIds({
      product: newItemNextIds.product,
      vessel: newItemNextIds.vessel - 1,
      entry: newItemNextIds.entry - products.length,
    });
  };

  const handleNewProduct = (newProduct: NewProduct) => {
    const product = {
      ...pick(['species', 'variety', 'size', 'packType', 'plu'], newProduct),
      shipperId,
      id: newItemNextIds.product,
    };

    const newEntries = allVessels.map(({ id: vesselId }, idx) => ({
      palletCount: 0,
      id: newItemNextIds.entry - idx,
      vesselId,
      productId: newItemNextIds.product,
      product,
    }));

    setChanges({
      ...changes,
      newProducts: [
        ...changes.newProducts,
        product,
      ] as ShipperProjectionProduct[],
      newEntries: [
        ...changes.newEntries,
        ...newEntries,
      ] as ShipperProjectionEntry[],
    });

    setNewItemNextIds({
      ...newItemNextIds,
      product: newItemNextIds.product - 1,
      entry: newItemNextIds.entry - allVessels.length,
    });
  };

  const handleRemoveNewVessel = (id: number) => {
    setChanges({
      ...changes,
      newVessels: changes.newVessels.filter((item) => item.id !== id),
      newEntries: changes.newEntries.filter((item) => item.vesselId !== id),
    });
  };

  const handleRemoveProduct = (id: number) => {
    if (id < 0) {
      setChanges({
        ...changes,
        newProducts: changes.newProducts.filter((item) => item.id !== id),
        newEntries: changes.newEntries.filter((item) => item.productId !== id),
      });
    } else {
      setRemovedProductIds([...removedProductIds, id]);
    }
  };

  const changeProps = {
    changeHandlers: {
      handleVesselChange,
      handleEntryChange,
      handleProductChange,
    },
    newItemHandlers: {
      handleNewVessel,
      handleNewProduct,
    },
    removeItemHandlers: {
      handleRemoveNewVessel,
      handleRemoveProduct,
    },
    valueGetters: {
      getVesselValue,
      getProductValue,
      getEntryValue,
    },
  };

  useEffect(() => {
    if (!startDate) {
      handleDateChange({
        selection: {
          startDate: startOfISOWeek(new Date()),
          endDate: startOfISOWeek(new Date()),
          key: 'selection',
        },
      });
    }
  }, [handleDateChange, startDate]);

  return (
    <Page
      actions={[
        <l.Flex alignEnd key={0} relative>
          {selectedShipper && (
            <b.Primary
              disabled={saveAttempt && !validate()}
              onClick={handleSave}
            >
              Submit
            </b.Primary>
          )}
          {saveAttempt && (
            <l.Div position="absolute" right={0} top={36}>
              <l.Div height={th.spacing.sm} />
              {!hasConfirmedSkippedWeeks && (
                <ty.CaptionText
                  color={th.colors.status.error}
                  mb={th.spacing.xs}
                  nowrap
                  textAlign="right"
                >
                  Confirm weeks with no vessels
                </ty.CaptionText>
              )}
              {!hasValidVesselNames && (
                <ty.CaptionText
                  color={th.colors.status.error}
                  mb={th.spacing.xs}
                  nowrap
                  textAlign="right"
                >
                  Fill out all vessel names
                </ty.CaptionText>
              )}
              {!hasValidVesselDates && (
                <ty.CaptionText
                  color={th.colors.status.error}
                  mb={th.spacing.xs}
                  nowrap
                  textAlign="right"
                >
                  Check vessel arrival dates
                </ty.CaptionText>
              )}
              {!hasValidProducts && (
                <ty.CaptionText
                  color={th.colors.status.error}
                  mb={th.spacing.xs}
                  nowrap
                  textAlign="right"
                >
                  Fill out all product details
                </ty.CaptionText>
              )}
              {!isEmpty(duplicateProductIds) && (
                <ty.CaptionText
                  color={th.colors.status.error}
                  nowrap
                  textAlign="right"
                >
                  No duplicate products
                </ty.CaptionText>
              )}
            </l.Div>
          )}
        </l.Flex>,
      ]}
      extraPaddingTop={58}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.md}>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Shipper
              </ty.CaptionText>
              <ItemSelector
                allItems={shippers as Shipper[]}
                closeOnSelect
                error={shipperDataError}
                errorLabel="Shippers"
                excludedItems={[]}
                loading={shipperDataLoading}
                nameKey="shipperName"
                onClear={() => setShipperId(undefined)}
                placeholder="Select a shipper"
                selectItem={(shipper) => {
                  setShipperId(shipper.id);
                }}
                selectedItem={
                  selectedShipper
                    ? `${selectedShipper.shipperName} (${selectedShipper.id})`
                    : undefined
                }
                width={300}
              />
            </l.Div>
            {selectedShipper && (
              <>
                <l.Div mr={th.spacing.lg}>
                  <ty.CaptionText mb={th.spacing.sm} secondary>
                    Coast
                  </ty.CaptionText>
                  <TabBar />
                </l.Div>
                <div>
                  <ty.CaptionText mb={th.spacing.sm} secondary>
                    Week Of
                  </ty.CaptionText>
                  <l.Flex alignCenter>
                    {DateRangePicker}
                    {BackwardButton}
                    {ForwardButton}
                  </l.Flex>
                </div>
              </>
            )}
          </l.Flex>
        </>
      }
      title="Shipper Projections"
    >
      <l.Flex column minHeight="calc(100vh - 289px)">
        <l.Div flex={1} overflowX="auto">
          {!!selectedShipper ? (
            <>
              <Vessels
                {...changeProps}
                ghostVesselDates={ghostVesselDates}
                gridTemplateColumns={gridTemplateColumns}
                showErrors={saveAttempt}
                skippedWeeks={skippedWeeks}
                toggleSkippedWeeks={toggleSkippedWeeks}
                vessels={
                  allVesselsWithGhostVessels as ShipperProjectionVessel[]
                }
              />
              <Products
                {...changeProps}
                duplicateProductIds={duplicateProductIds}
                gridTemplateColumns={gridTemplateColumns}
                hasVessels={allVessels.length > 0}
                products={products}
                showErrors={saveAttempt}
                vessels={
                  allVesselsWithGhostVessels as ShipperProjectionVessel[]
                }
              />
            </>
          ) : (
            <l.Div mt={th.spacing.sm}>
              <DataMessage
                data={allVessels || []}
                emptyProps={{
                  header: 'Select a shipper to view inventory projections',
                }}
                error={dataError}
                loading={dataLoading}
              />
            </l.Div>
          )}
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default ShipperProjections;
