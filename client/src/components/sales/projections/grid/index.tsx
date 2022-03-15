import React, { useEffect, useState } from 'react';
import { add, endOfISOWeek, isAfter, startOfISOWeek } from 'date-fns';
import {
  equals,
  isEmpty,
  last,
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
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import StatusIndicator from 'components/status-indicator';
import { useUserContext } from 'components/user/context';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
import {
  Maybe,
  Shipper,
  ShipperProjection,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import {
  getWeekNumber,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import { ShipperProjectionProps } from '../';
import { getAllVessels, getDuplicateProductIds } from '../data-utils';
import ProjectionSettings from '../settings';
import Products from './products';
import Vessels from './vessels';
import {
  EntryUpdate,
  NewItemNextIds,
  NewProduct,
  NewVessel,
  ProductUpdate,
  ShipperProjectionGridChanges,
  ShipperProjectionProductWithEntries,
  ShipperProjectionGridState,
  UpdateType,
  VesselUpdate,
} from './types';
import ShipperProjectionsReviewModal from './review-modal';
import ErrorPanel from 'components/error-panel';

const initialChangesState: ShipperProjectionGridChanges = {
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

const initialState: ShipperProjectionGridState = {
  changes: initialChangesState,
  newItemNextIds: initialNewItemNextIds,
  removedProductIds: [],
  skippedWeeks: [],
};

const ShipperProjectionGrid = ({
  coast,
  CoastTabBar,
  ViewTabBar,
  Reset,
  DateRangePicker,
  ForwardButton,
  BackwardButton,
  handleDateChange,
  selectedShipper,
  setShipperId,
  shipperDataError,
  shipperDataLoading,
  shipperId,
  shippers,
}: ShipperProjectionProps) => {
  const [startDate] = useQueryValue('startDate');
  const previousStartDate = usePrevious(startDate);
  const [endDate] = useQueryValue('endDate');
  const [projectionId, setProjectionId] = useQueryValue('projectionId');

  const { ItemSelector: ShipperItemSelector, clearSearch } =
    useItemSelector<Shipper>({
      selectItem: (shipper) => {
        setShipperId(shipper.id);
      },
      allItems: shippers as Shipper[],
      closeOnSelect: true,
      clearSearchOnBlur: true,
      excludedItems: [],
      error: shipperDataError,
      errorLabel: 'Shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => setShipperId(undefined),
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      width: 300,
    });

  const currentProjections = selectedShipper?.shipperProjections?.nodes
    .filter(
      (projection) =>
        getWeekNumber(new Date(projection?.submittedAt)) ===
        getWeekNumber(
          startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
        ),
    )
    .reverse();
  const currentProjection = currentProjections?.find(
    (projection) => projection?.id === projectionId,
  );

  const previousSelectedShipper = usePrevious(selectedShipper);

  useEffect(() => {
    if (
      !equals(previousSelectedShipper, selectedShipper) &&
      selectedShipper &&
      !projectionId
    ) {
      setProjectionId(currentProjections?.[0]?.id);
    }
  }, [
    currentProjections,
    previousSelectedShipper,
    projectionId,
    selectedShipper,
    setProjectionId,
  ]);

  useEffect(() => {
    if (!equals(previousStartDate, startDate) && selectedShipper) {
      setProjectionId(currentProjections?.[0]?.id);
    }
  }, [
    currentProjections,
    previousStartDate,
    startDate,
    selectedShipper,
    setProjectionId,
  ]);

  const {
    data,
    loading: dataLoading,
    error,
  } = api.useShipperProjectionVesselInfos();
  const loading = dataLoading || shipperDataLoading;

  const vessels = sortBy(
    (vesselInfo) =>
      vesselInfo?.vessel?.shipper?.shipperName || 'Unknown shipper',
    (((data ? data.nodes : []) as ShipperProjectionVesselInfo[]).filter(
      (vesselInfo) =>
        selectedShipper
          ? currentProjection
            ? currentProjection?.id === vesselInfo?.projection?.id
            : last(
                (
                  (vesselInfo.shipper?.shipperProjections.nodes ||
                    []) as ShipperProjection[]
                ).filter(
                  (projection) =>
                    isDateGreaterThanOrEqualTo(
                      new Date(projection.submittedAt),
                      startOfISOWeek(
                        new Date((startDate || '').replace(/-/g, '/')),
                      ),
                    ) &&
                    isDateLessThanOrEqualTo(
                      new Date(projection.submittedAt),
                      endOfISOWeek(
                        new Date((startDate || '').replace(/-/g, '/')),
                      ),
                    ),
                ),
              )?.id === vesselInfo?.projection?.id
          : vesselInfo?.id ===
            last(
              (vesselInfo.vessel?.shipperProjectionVesselInfosByVesselId
                .nodes || []) as ShipperProjectionVesselInfo[],
            )?.id,
    ) as ShipperProjectionVesselInfo[]) || [],
  );

  const [saveAttempt, setSaveAttempt] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpsertProjection] = api.useUpsertShipperProjection();
  const [handleBulkCreateVessels] = api.useBulkCreateShipperProjectionVessels();
  const [handleCreateVesselInfo] = api.useCreateShipperProjectionVesselInfo();
  const [handleUpsertProducts] = api.useUpsertShipperProjectionProducts();
  const [handleDeleteEntries] = api.useDeleteShipperProjectionEntries();

  const [state, setState] = useState<ShipperProjectionGridState>(initialState);
  const { changes, newItemNextIds, removedProductIds, skippedWeeks } = state;

  const setChanges = (newChanges: ShipperProjectionGridChanges) => {
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
    changesKey: keyof ShipperProjectionGridChanges,
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
    vessel: Maybe<ShipperProjectionVesselInfo> | undefined,
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
                vessel as ShipperProjectionVesselInfo,
                'departureDate',
              ).value.replace(/-/g, '/'),
            ),
            new Date(date.replace(/-/g, '/')),
          ) &&
          isDateLessThanOrEqualTo(
            new Date(
              getVesselValue(
                vessel as ShipperProjectionVesselInfo,
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
    ] as ShipperProjectionVesselInfo[],
  );

  const gridTemplateColumns = `500px repeat(${
    allVesselsWithGhostVessels.length || 1
  }, 140px)`;

  const allEntries = [
    ...allVessels
      .map((vessel) =>
        pathOr([], ['shipperProjectionEntriesByVesselInfoId', 'nodes'], vessel),
      )
      .flat(),
  ] as ShipperProjectionEntry[];

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
                (entry) =>
                  parseInt(entry.productId, 10) === parseInt(product.id, 10),
              )
              .map((entry) => ({
                id: entry.id,
                palletCount: getEntryValue(entry, 'palletCount').value,
                productId: entry.productId,
                vesselInfoId: entry.vesselInfoId,
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
      !['', 'Unknown'].includes(
        getVesselValue(vessel as ShipperProjectionVesselInfo, 'vesselName')
          .value,
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
            vessel as ShipperProjectionVesselInfo,
            'arrivalDate',
          ).value,
        ),
        new Date(
          getVesselValue(
            vessel as ShipperProjectionVesselInfo,
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

  const handleReview = (isApproved: boolean, jvComments: string) => {
    if (currentProjection) {
      setUpdateLoading((prevLoading) => [...prevLoading, 'review']);
      handleUpsertProjection({
        variables: {
          shipperProjection: {
            id: currentProjection.id,
            submittedAt: currentProjection.submittedAt,
            shipperId: selectedShipper?.id,
            approvedAt: isApproved ? new Date().toLocaleString() : undefined,
            rejectedAt: isApproved ? undefined : new Date().toLocaleString(),
            jvComments,
            reviewStatus: isApproved ? 2 : 0,
            shipperComments: currentProjection.shipperComments,
          },
        },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== 'review'),
        );
      });
    }
  };

  const handleSave = (shipperComments: string) => {
    setSaveAttempt(true);
    if (validate()) {
      setUpdateLoading((prevLoading) => [...prevLoading, 'projection']);
      handleUpsertProjection({
        variables: {
          shipperProjection: {
            shipperId,
            shipperComments,
            submittedAt: new Date().toLocaleString(),
            reviewStatus: 1,
            jvComments: '',
          },
        },
      }).then(({ data }) => {
        const projectionId =
          parseInt(data?.upsertShipperProjection?.shipperProjection?.id, 10) ||
          undefined;

        if (selectedShipper && activeUserId) {
          handleCreateUserMessages({
            variables: {
              messages: [
                {
                  actionLink: `/sales/projections?coast=${coast}&endDate=${formatDate(
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

        setUpdateLoading((prevLoading) => [...prevLoading, 'products']);
        handleUpsertProducts({
          variables: {
            shipperProjectionProducts: [
              ...changes.productUpdates.map((p) => ({
                species: p.species,
                variety: p.variety,
                size: p.size,
                packType: p.packType,
                plu: p.plu,
                id: parseInt(p.id, 10),
              })),
              ...changes.newProducts.map((p) => ({
                shipperId: p.shipperId,
                species: p.species,
                variety: p.variety,
                size: p.size,
                packType: p.packType,
                plu: p.plu,
              })),
            ],
          },
        }).then((res) => {
          const updatedProducts =
            res.data?.bulkUpsertShipperProjectionProduct
              ?.shipperProjectionProducts || [];

          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `products`),
          );

          setUpdateLoading((prevLoading) => [...prevLoading, 'new-vessels']);
          handleBulkCreateVessels({
            variables: {
              shipperProjectionVessels: changes.newVessels.map(() => ({
                shipperId: selectedShipper?.id,
              })),
            },
          }).then((res2) => {
            const createdVessels =
              res2.data?.bulkCreateShipperProjectionVessel
                ?.shipperProjectionVessels || [];

            setUpdateLoading((prevLoading) =>
              prevLoading.filter((l) => l !== `new-vessels`),
            );

            [
              ...vessels.filter(
                (v) => v && !pluck('id', changes.vesselUpdates).includes(v.id),
              ),
              ...changes.vesselUpdates,
              ...changes.newVessels.map((v, idx) => ({
                ...v,
                vesselId: createdVessels[idx]?.id,
              })),
            ]
              .map((v) => ({
                vesselName: v.vesselName,
                departureDate: v.departureDate,
                arrivalDate: v.arrivalDate,
                arrivalPort: v.arrivalPort,
                vesselStatus: v.vesselStatus,
                shipperId: selectedShipper?.id,
                vesselId: v.vesselId,
                projectionId,
                shipperProjectionEntriesUsingId: {
                  create: [
                    ...vessels
                      .map((v) =>
                        v.shipperProjectionEntriesByVesselInfoId.nodes
                          .filter(
                            (e) =>
                              e &&
                              !pluck('id', changes.entryUpdates).includes(e.id),
                          )
                          .map((e) => ({
                            id: e?.id,
                            palletCount: e?.palletCount,
                            vesselInfoId: e?.vesselInfoId,
                            productId: e?.productId,
                          })),
                      )
                      .flat(),
                    ...changes.entryUpdates,
                    ...changes.newEntries,
                  ]
                    .filter((e) => e.vesselInfoId === v.id)
                    .map((e) => {
                      const newProduct = changes.newProducts.find(
                        (p) => p.id === e.productId,
                      ) || { id: 0 };

                      const updatedProduct = updatedProducts.find(
                        (p) =>
                          p?.species === newProduct.species &&
                          p?.variety === newProduct.variety &&
                          p?.size === newProduct.size &&
                          p?.packType === newProduct.packType &&
                          p?.plu === newProduct.plu,
                      ) || { id: 0 };

                      return {
                        palletCount: e.palletCount || 0,
                        productId:
                          e.productId > 0 ? e.productId : updatedProduct.id,
                      };
                    }),
                },
              }))
              .forEach((v, idx) => {
                setUpdateLoading((prevLoading) => [
                  ...prevLoading,
                  `vessel-${idx}`,
                ]);

                handleCreateVesselInfo({
                  variables: { shipperProjectionVesselInfo: v },
                }).then(() => {
                  setUpdateLoading((prevLoading) =>
                    prevLoading.filter((l) => l !== `vessel-${idx}`),
                  );
                });
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

        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== 'projection'),
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
    changesKey: keyof ShipperProjectionGridChanges,
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
      vesselInfoId: newItemNextIds.vessel,
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
      ] as ShipperProjectionVesselInfo[],
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

    const newEntries = allVessels.map(({ id: vesselInfoId }, idx) => ({
      palletCount: 0,
      id: newItemNextIds.entry - idx,
      vesselInfoId,
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
      newEntries: changes.newEntries.filter((item) => item.vesselInfoId !== id),
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
    } else if (!equals(startDate, endDate)) {
      handleDateChange({
        selection: {
          startDate: startOfISOWeek(new Date()),
          endDate: startOfISOWeek(new Date()),
          key: 'selection',
        },
      });
    }
  }, [endDate, handleDateChange, startDate]);

  return (
    <Page
      actions={[
        selectedShipper ? (
          <l.AreaLink
            key={0}
            mr={th.spacing.md}
            to={`/directory/shippers/${shipperId}`}
          >
            <b.Primary>View Shipper</b.Primary>
          </l.AreaLink>
        ) : (
          <div key={0} />
        ),
        <l.Div key={1} mr={th.spacing.md}>
          <ProjectionSettings />
        </l.Div>,
        <l.Flex alignEnd key={2} relative>
          {currentProjection && !!selectedShipper && (
            <l.Flex
              alignCenter
              height={th.sizes.fill}
              justifyCenter
              mr={th.spacing.md}
            >
              <StatusIndicator
                status={
                  currentProjection.approvedAt
                    ? 'success'
                    : currentProjection.rejectedAt
                    ? 'error'
                    : 'warning'
                }
              />
            </l.Flex>
          )}
          {selectedShipper && (
            <>
              <l.Div mr={th.spacing.md}>
                <ShipperProjectionsReviewModal
                  handleApprove={(message) => handleReview(true, message)}
                  handleReject={(message) => handleReview(false, message)}
                  triggerDisabled={!currentProjection}
                  confirmLoading={!isEmpty(updateLoading)}
                />
              </l.Div>
              <ShipperProjectionsReviewModal
                handleApprove={(message) => handleSave(message)}
                triggerDisabled={saveAttempt && !validate()}
                confirmLoading={!isEmpty(updateLoading)}
              />
            </>
          )}
          {saveAttempt && (
            <l.Div cursor="pointer" position="absolute" right={0} top={42}>
              <ErrorPanel
                customStyles={{
                  border: th.borders.error,
                  right: 0,
                  left: 'auto',
                  width: 'auto',
                  zIndex: 20,
                }}
                errors={[
                  {
                    text: 'Confirm weeks with no vessels',
                    value: !hasConfirmedSkippedWeeks,
                  },
                  {
                    text: 'Fill out all vessel names',
                    value: !hasValidVesselNames,
                  },
                  {
                    text: 'Check vessel arrival dates',
                    value: !hasValidVesselDates,
                  },
                  {
                    text: 'Fill out all product details',
                    value: !hasValidProducts,
                  },
                  {
                    text: 'No duplicate products',
                    value: !isEmpty(duplicateProductIds),
                  },
                ]}
              />
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
                View
              </ty.CaptionText>
              {ViewTabBar}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Shipper
              </ty.CaptionText>
              {ShipperItemSelector}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Coast
              </ty.CaptionText>
              {CoastTabBar}
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
            <l.Div ml={th.spacing.lg}>
              <l.Div height={32} />
              <l.Div onClick={clearSearch}>{Reset}</l.Div>
            </l.Div>
          </l.Flex>
        </>
      }
      title="Shipper Projections"
    >
      <l.Flex column minHeight="calc(100vh - 289px)">
        <l.Div flex={1} overflowX="auto">
          <>
            <Vessels
              {...changeProps}
              currentProjection={currentProjection}
              currentProjections={currentProjections}
              error={error}
              ghostVesselDates={ghostVesselDates}
              gridTemplateColumns={gridTemplateColumns}
              loading={loading}
              selectedShipper={selectedShipper}
              setProjectionId={setProjectionId}
              showErrors={saveAttempt}
              skippedWeeks={skippedWeeks}
              toggleSkippedWeeks={toggleSkippedWeeks}
              vessels={
                allVesselsWithGhostVessels as ShipperProjectionVesselInfo[]
              }
            />
            <Products
              {...changeProps}
              currentProjection={currentProjection}
              duplicateProductIds={duplicateProductIds}
              gridTemplateColumns={gridTemplateColumns}
              hasVessels={allVessels.length > 0}
              loading={loading}
              products={products}
              selectedShipper={selectedShipper}
              showErrors={saveAttempt}
              vessels={
                allVesselsWithGhostVessels as ShipperProjectionVesselInfo[]
              }
            />
          </>
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default ShipperProjectionGrid;
