import React, { Fragment, useEffect, useState } from 'react';
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
import ErrorPanel from 'components/error-panel';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
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
import { getProductIdentifier } from '../utils';
import Products from './products';
import ShipperProjectionsReviewModal from './review-modal';
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
import Vessels from './vessels';

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
  matchAllCommonProducts: true,
  showOnlyCommonNames: false,
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
  const [isPortal, setIsPortal] = useState(false);
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
      error: shipperDataError,
      errorLabel: 'Shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => {
        setShipperId(undefined);
        setProjectionId('all', 'replaceIn');
      },
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
      currentProjections
    ) {
      if (currentProjection) {
        setState((prevState) => ({
          ...prevState,
          showOnlyCommonNames: false,
        }));
      } else {
        setProjectionId('all', 'replaceIn');
      }
    }
  }, [
    currentProjection,
    currentProjections,
    previousSelectedShipper,
    projectionId,
    selectedShipper,
    setProjectionId,
  ]);

  useEffect(() => {
    if (
      !equals(previousStartDate, startDate) &&
      selectedShipper &&
      !projectionId
    ) {
      setProjectionId(currentProjections?.[0]?.id || 'all', 'replaceIn');
    }
  }, [
    currentProjections,
    previousStartDate,
    projectionId,
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
        selectedShipper && projectionId !== 'all'
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
  const {
    changes,
    matchAllCommonProducts,
    showOnlyCommonNames,
    newItemNextIds,
    removedProductIds,
    skippedWeeks,
  } = state;

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

  const toggleMatchAllCommonProducts = () => {
    setState((prevState) => ({
      ...prevState,
      matchAllCommonProducts: !matchAllCommonProducts,
    }));
  };

  const toggleShowOnlyCommonNames = () => {
    setState((prevState) => ({
      ...prevState,
      showOnlyCommonNames: !showOnlyCommonNames,
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
            weeks: idx - 1,
          },
        ),
      ),
    6,
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
      (product) => getProductIdentifier(product, !!selectedShipper),
      pluck('product', allEntries) as ShipperProjectionProduct[],
    )
      .map(
        (product) =>
          ({
            ...product,
            entries: allEntries
              .filter(
                (entry) =>
                  entry.product &&
                  getProductIdentifier(entry.product, !!selectedShipper) ===
                    getProductIdentifier(product, !!selectedShipper),
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

  const hasConfirmedSkippedWeeks = ghostVesselDates
    .filter((ghostDate) =>
      isDateGreaterThanOrEqualTo(
        new Date(ghostDate.replace(/-/g, '/')),
        new Date(startDate ? startDate.replace(/-/g, '/') : new Date()),
      ),
    )
    .reduce((acc, date) => acc && skippedWeeks.includes(date), true);

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

  const hasValidVesselStatuses = allVessels.reduce(
    (acc, vessel) =>
      acc &&
      vessel &&
      (getWeekNumber(
        new Date(
          getVesselValue(
            vessel as ShipperProjectionVesselInfo,
            'departureDate',
          ).value.replace(/-/g, '/'),
        ),
      ) >=
        getWeekNumber(
          startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
        ) ||
        ['executed', 'cancelled'].includes(
          getVesselValue(vessel as ShipperProjectionVesselInfo, 'vesselStatus')
            .value,
        )),
    true,
  );

  const validate = () =>
    hasConfirmedSkippedWeeks &&
    hasValidVesselNames &&
    hasValidVesselDates &&
    hasValidProducts &&
    isEmpty(duplicateProductIds) &&
    hasValidVesselStatuses;

  const [{ activeUserId }] = useUserContext();
  const [handleCreateUserMessages] = api.useCreateUserMessages();

  const handleReview = (jvComments: string, reviewStatus: number) => {
    if (currentProjection) {
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
              commonSpeciesId: p.commonSpeciesId,
              commonVarietyId: p.commonVarietyId,
              commonSizeId: p.commonSizeId,
              commonPackTypeId: p.commonPackTypeId,
            })),
          ],
        },
      }).then(() => {
        setUpdateLoading((prevLoading) => [...prevLoading, 'review']);
        const isApproved = reviewStatus === 2;
        handleUpsertProjection({
          variables: {
            shipperProjection: {
              id: currentProjection.id,
              submittedAt: currentProjection.submittedAt,
              shipperId: selectedShipper?.id,
              approvedAt: isApproved ? new Date().toLocaleString() : undefined,
              rejectedAt: isApproved ? undefined : new Date().toLocaleString(),
              jvComments,
              reviewStatus:
                reviewStatus === 1
                  ? currentProjection.reviewStatus
                  : reviewStatus,
              shipperComments: currentProjection.shipperComments,
            },
          },
        }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== 'review'),
          );
        });

        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== 'products'),
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
                commonSpeciesId: p.commonSpeciesId,
                commonVarietyId: p.commonVarietyId,
                commonSizeId: p.commonSizeId,
                commonPackTypeId: p.commonPackTypeId,
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

  useEffect(() => {
    if (
      !isEmpty(previousUpdateLoading) &&
      isEmpty(updateLoading) &&
      !dataLoading
    ) {
      setState(initialState);
      setSaveAttempt(false);
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

  const handleProductChange = (
    update: ProductUpdate,
    updateKey?: keyof ProductUpdate,
  ) => {
    if (
      updateKey &&
      [
        'commonSpeciesId',
        'commonVarietyId',
        'commonSizeId',
        'commonPackTypeId',
      ].includes(updateKey) &&
      matchAllCommonProducts
    ) {
      handleChange(
        products
          .map((product) => {
            const productUpdates = changes.productUpdates.find(
              (u) => u.id === product.id,
            );
            switch (updateKey) {
              case 'commonSpeciesId':
                return product.species === update.species
                  ? {
                      ...product,
                      ...productUpdates,
                      commonSpeciesId: update.commonSpeciesId,
                    }
                  : undefined;
              case 'commonVarietyId':
                return product.variety === update.variety
                  ? {
                      ...product,
                      ...productUpdates,
                      commonVarietyId: update.commonVarietyId,
                    }
                  : undefined;
              case 'commonSizeId':
                return product.size === update.size
                  ? {
                      ...product,
                      ...productUpdates,
                      commonSizeId: update.commonSizeId,
                    }
                  : undefined;
              case 'commonPackTypeId':
                return product.packType === update.packType
                  ? {
                      ...product,
                      ...productUpdates,
                      commonPackTypeId: update.commonPackTypeId,
                    }
                  : undefined;
              default:
                return undefined;
            }
          })
          .filter((p) => !!p) as ProductUpdate[],
        'productUpdates',
      );
    } else {
      const changesKey = update.id < 0 ? 'newProducts' : 'productUpdates';
      handleChange([update], changesKey);
    }
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

    const newEntries = allVessels
      .filter(
        ({ departureDate }) =>
          getWeekNumber(new Date(departureDate.replace(/-/g, '/'))) >=
          getWeekNumber(
            startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
          ),
      )
      .map(({ id: vesselInfoId }, idx) => ({
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
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      });
    } else if (!equals(startDate, endDate)) {
      handleDateChange({
        selection: {
          startDate: new Date(startDate.replace(/-/g, '/')),
          endDate: new Date(startDate.replace(/-/g, '/')),
          key: 'selection',
        },
      });
    }
  }, [endDate, handleDateChange, startDate]);

  return (
    <Page
      actions={[
        selectedShipper && (
          <Fragment key="a">
            <l.HoverButton
              active={!isPortal}
              mr={th.spacing.sm}
              mt="4px"
              onClick={() => setIsPortal(!isPortal)}
            >
              <ty.SmallText bold center width={90}>
                JV view
              </ty.SmallText>
            </l.HoverButton>
            <l.HoverButton
              active={isPortal}
              mr={th.spacing.lg}
              mt="4px"
              onClick={() => setIsPortal(!isPortal)}
            >
              <ty.SmallText bold center width={90}>
                Shipper view
              </ty.SmallText>
            </l.HoverButton>
          </Fragment>
        ),
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
        <l.Flex alignCenter key={1}>
          {saveAttempt && !validate() && (
            <l.Div cursor="pointer" height={20} mr={th.spacing.md}>
              <ErrorPanel
                customStyles={{
                  border: th.borders.error,
                  right: -200,
                  left: 'auto',
                  top: 30,
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
                  {
                    text: 'Vessels from last week may only be "Executed" or "Cancelled"',
                    value: !hasValidVesselStatuses,
                  },
                ]}
              />
            </l.Div>
          )}
          {selectedShipper &&
            (isPortal ? (
              <ShipperProjectionsReviewModal
                handleConfirm={handleSave}
                isPortal={isPortal}
                triggerDisabled={
                  projectionId !== 'all' || (saveAttempt && !validate())
                }
                confirmLoading={!isEmpty(updateLoading)}
              />
            ) : (
              <ShipperProjectionsReviewModal
                handleConfirm={(comments, reviewStatus?: number) =>
                  handleReview(comments, reviewStatus || 1)
                }
                isPortal={isPortal}
                triggerDisabled={!currentProjection}
                confirmLoading={!isEmpty(updateLoading)}
              />
            ))}
        </l.Flex>,
        <l.Div key={2} ml={th.spacing.md}>
          <ProjectionSettings />
        </l.Div>,
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
              isAllProjections={projectionId === 'all'}
              isPortal={isPortal}
              loading={loading}
              matchAllCommonProducts={matchAllCommonProducts}
              productCount={products.length}
              showOnlyCommonNames={showOnlyCommonNames}
              toggleShowOnlyCommonNames={toggleShowOnlyCommonNames}
              selectedShipper={selectedShipper}
              toggleMatchAllCommonProducts={toggleMatchAllCommonProducts}
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
              isAllProjections={projectionId === 'all'}
              isPortal={isPortal}
              loading={loading}
              products={products}
              selectedShipper={selectedShipper}
              showErrors={saveAttempt}
              showOnlyCommonNames={showOnlyCommonNames}
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
