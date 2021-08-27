import React, { useEffect, useState } from 'react';
import { add, endOfISOWeek, isAfter, startOfISOWeek } from 'date-fns';
import { isEmpty, omit, pathOr, pick, pluck, sortBy, uniqBy } from 'ramda';

import api from 'api';
import ItemSelector from 'components/item-selector';
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
import { DataMessage } from 'components/page/message';

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

  const { TabBar } = useTabBar(coastTabs, false, 'EC', 'coast', 1);
  const { DateRangePicker, handleDateChange } = useDateRange({
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
  const { changes, newItemNextIds, removedProductIds } = state;

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
  const gridTemplateColumns = `500px repeat(${allVessels.length || 1}, 140px)`;

  const allEntries = allVessels
    .map((vessel) =>
      pathOr([], ['shipperProjectionEntriesByVesselId', 'nodes'], vessel),
    )
    .flat() as ShipperProjectionEntry[];

  const products = sortBy(
    (product) => getProductValue(product, 'species').value || 'zzzzzz',
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
    hasValidVesselNames &&
    hasValidVesselDates &&
    hasValidProducts &&
    isEmpty(duplicateProductIds);

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
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

  useEffect(() => {
    if (
      !isEmpty(previousUpdateLoading) &&
      isEmpty(updateLoading) &&
      !dataLoading
    ) {
      handleCancel();
    }
  }, [dataLoading, previousUpdateLoading, updateLoading]);

  const handleCancel = () => {
    setState(initialState);
  };

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
        <l.Flex alignEnd key={0} position="relative">
          <b.Primary disabled={saveAttempt && !validate()} onClick={handleSave}>
            Submit
          </b.Primary>
          {saveAttempt && (
            <l.Div position="absolute" right={0} top={42}>
              <l.Div height={th.spacing.sm} />
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
              <ty.CaptionText secondary>Shipper</ty.CaptionText>
              <ItemSelector
                allItems={shippers as Shipper[]}
                closeOnSelect
                currentItems={[]}
                error={shipperDataError}
                errorLabel="Shippers"
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
                width={350}
              />
            </l.Div>
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
              {DateRangePicker}
            </div>
          </l.Flex>
        </>
      }
      title="Shipper Projections"
    >
      <l.Flex column minHeight="calc(100vh - 289px)">
        <l.Div flex={1} overflowX="auto">
          <Vessels
            {...changeProps}
            gridTemplateColumns={gridTemplateColumns}
            showErrors={saveAttempt}
            vessels={allVessels as ShipperProjectionVessel[]}
          />
          <Products
            {...changeProps}
            duplicateProductIds={duplicateProductIds}
            gridTemplateColumns={gridTemplateColumns}
            products={products}
            showErrors={saveAttempt}
            vessels={allVessels as ShipperProjectionVessel[]}
          />
          {isEmpty(allVessels) && (
            <DataMessage
              data={allVessels}
              emptyProps={{
                header: 'No Vessels Found',
              }}
              error={dataError}
              loading={dataLoading}
            />
          )}
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default ShipperProjections;
