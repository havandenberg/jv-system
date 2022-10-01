import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import {
  equals,
  groupBy,
  isEmpty,
  last,
  mapObjIndexed,
  omit,
  pluck,
  reduce,
  sum,
  values,
} from 'ramda';
import { useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import ErrorPanel from 'components/error-panel';
import useItemSelector from 'components/item-selector';
import { BasicModal } from 'components/modal';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { useTabBar } from 'components/tab-bar';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import useDateRange from 'hooks/use-date-range';
import useKeyboardWeekChange from 'hooks/use-keyboard-week-change';
import usePrevious from 'hooks/use-previous';
import {
  useDateRangeQueryParams,
  useProgramsQueryParams,
} from 'hooks/use-query-params';
import {
  CommonPackTypeTag,
  CommonSizeTag,
  CommonSpecies,
  CommonSpeciesTag,
  CommonVarietyTag,
  Customer,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  Shipper,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProjectionVesselInfo,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isDateGreaterThanOrEqualTo } from 'utils/date';

import { ResetButton } from '../../inventory/inventory/use-filters';
import Header from './header';
import { NewProgramRow, ProgramTotalRow } from './row';
import ProgramSet from './set';
import {
  CustomerProgramEntryUpdate,
  CustomerProgramUpdate,
  NewCustomerProgram,
  NewCustomerProgramEntry,
  NewItemNextIds,
  NewShipperProgram,
  NewShipperProgramEntry,
  ProgramChanges,
  ProgramState,
  ProgramTotal,
  RemovedItems,
  ShipperProgramEntryUpdate,
  ShipperProgramUpdate,
  UpdateType,
} from './types';
import {
  getAllCustomerPrograms,
  getAllShipperPrograms,
  getDuplicateProgramIds,
  getGridProps,
  getProgramTotals,
  groupProgramsByProduct,
} from './utils';

const initialChangesState: ProgramChanges = {
  shipperProgramUpdates: [],
  customerProgramUpdates: [],
  shipperProgramEntryUpdates: [],
  customerProgramEntryUpdates: [],
  newShipperPrograms: [],
  newCustomerPrograms: [],
  newShipperProgramEntries: [],
  newCustomerProgramEntries: [],
};

const initialRemovedItemsState: RemovedItems = {
  shipperPrograms: [],
  customerPrograms: [],
};

const initialNewItemNextIds: NewItemNextIds = {
  shipperProgram: -1,
  customerProgram: -1,
  shipperProgramEntry: -1,
  customerProgramEntry: -1,
};

const initialState: ProgramState = {
  changes: initialChangesState,
  editing: false,
  newItemNextIds: initialNewItemNextIds,
  removedItems: initialRemovedItemsState,
  showAllocated: false,
};

export const viewTabs = [
  {
    id: 'customers',
    text: 'Customers',
  },
  {
    id: 'shippers',
    text: 'Shippers',
  },
];

const Programs = () => {
  const { pathname, search } = useLocation();
  const [
    {
      commonSpeciesId,
      commonVarietyId,
      commonSizeId,
      commonPackTypeId,
      plu,
      shipperId,
      coast,
      customerId,
      customerIdFilter,
    },
    setProgramsQueryParams,
  ] = useProgramsQueryParams();

  const [
    { startDate = formatDate(new Date()), endDate = formatDate(new Date()) },
  ] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );

  const { TabBar: CoastTabBar } = useCoastTabBar();

  const { DateRangePicker, ForwardButton, BackwardButton, handleDateChange } =
    useDateRange({
      hideDefinedRanges: true,
      singleSelection: true,
      offsetLeft: `-${th.spacing.md}`,
    });

  useKeyboardWeekChange(handleDateChange);

  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers('SHIPPER_NAME_ASC', '');
  const shippers = shipperData ? shipperData.nodes : [];
  const selectedShipper = shippers.find(
    (shipper) => shipper && shipper.id === shipperId,
  );

  const { ItemSelector: ShipperItemSelector, clearSearch: clearShipperSearch } =
    useItemSelector<Shipper>({
      selectItem: (shipper) => {
        setProgramsQueryParams({ shipperId: shipper.id });
      },
      allItems: () => shippers as Shipper[],
      closeOnSelect: true,
      clearSearchOnBlur: true,
      error: shipperDataError,
      errorLabel: 'Shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => {
        setProgramsQueryParams({ shipperId: undefined });
        handleCancel();
      },
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      searchParamName: 'shipperSearch',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      searchWidth: 300,
      width: 350,
    });

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');
  const customers = (customerData ? customerData.nodes : []) as Customer[];
  const selectedCustomer = customers.find(
    (customer) => customer && customer.id === customerId,
  );

  const {
    ItemSelector: CustomerItemSelector,
    clearSearch: clearCustomerSearch,
  } = useItemSelector<Customer>({
    selectItem: (customer) => {
      setProgramsQueryParams({ customerId: customer.id });
    },
    allItems: () => customers as Customer[],
    closeOnSelect: true,
    error: customerDataError,
    errorLabel: 'Customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    onClear: () => {
      setProgramsQueryParams({ customerId: undefined });
      handleCancel();
    },
    onlyClearSearch: true,
    placeholder: 'Select customer',
    searchParamName: 'customerSearch',
    selectedItem: selectedCustomer
      ? `${selectedCustomer.customerName} (${selectedCustomer.id})`
      : undefined,
    searchWidth: 300,
    width: 350,
  });

  const [weekCount, setWeekCount] = useState(16);

  const increaseWeekCount = () => {
    setWeekCount(weekCount + 4);
  };

  const [state, setState] = useState<ProgramState>(initialState);
  const { changes, editing, newItemNextIds, removedItems, showAllocated } =
    state;
  const hasChanges = reduce(
    (acc, key) => acc || changes[key].length > 0,
    false,
    Object.keys(changes) as (keyof ProgramChanges)[],
  );

  const handleCancel = useCallback(() => {
    setState({ ...initialState, showAllocated });
    setSaveAttempt(false);
  }, [showAllocated]);

  const { TabBar: ViewTabBar, selectedTabId: view } = useTabBar({
    tabs: viewTabs,
    isRoute: false,
    defaultTabId: 'customers',
    paramName: 'programsView',
    defaultTabIndex: 0,
    onSelectTab: handleCancel,
  });
  const isCustomers = view === 'customers';

  const getValue = <T extends UpdateType>(
    item: any,
    key: keyof T,
    changesKey: keyof ProgramChanges,
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

  const getShipperProgramValue = (
    shipperProgram: Maybe<ShipperProgram> | undefined,
    key: keyof ShipperProgramUpdate,
  ) => {
    const changesKey =
      shipperProgram && shipperProgram.id < 0
        ? 'newShipperPrograms'
        : 'shipperProgramUpdates';
    return getValue(shipperProgram, key, changesKey);
  };

  const getCustomerProgramValue = (
    customerProgram: Maybe<CustomerProgram> | undefined,
    key: keyof CustomerProgramUpdate,
  ) => {
    const changesKey =
      customerProgram && customerProgram.id < 0
        ? 'newCustomerPrograms'
        : 'customerProgramUpdates';
    return getValue(customerProgram, key, changesKey);
  };

  const getProgramValue = (
    isCustomers ? getCustomerProgramValue : getShipperProgramValue
  ) as (
    program: Maybe<CustomerProgram | ShipperProgram> | undefined,
    key: keyof CustomerProgramUpdate | ShipperProgramUpdate,
  ) => { dirty: boolean; value: string };

  const getShipperProgramEntryValue = (
    shipperProgramEntry: Maybe<ShipperProgramEntry> | undefined,
    key: keyof ShipperProgramEntryUpdate,
  ) => {
    const changesKey =
      shipperProgramEntry && shipperProgramEntry.id < 0
        ? 'newShipperProgramEntries'
        : 'shipperProgramEntryUpdates';
    return getValue(shipperProgramEntry, key, changesKey);
  };

  const getCustomerProgramEntryValue = (
    customerProgramEntry: Maybe<CustomerProgramEntry> | undefined,
    key: keyof CustomerProgramEntryUpdate,
  ) => {
    const changesKey =
      customerProgramEntry && customerProgramEntry.id < 0
        ? 'newCustomerProgramEntries'
        : 'customerProgramEntryUpdates';
    return getValue(customerProgramEntry, key, changesKey);
  };

  const toggleShowAllocated = () => {
    setState((prevState) => ({
      ...prevState,
      showAllocated: !showAllocated,
    }));
  };

  const [{ startWeeks, endWeeks, referenceDate }, setWeekRange] = useState({
    startWeeks: 2,
    endWeeks: 0,
    referenceDate: new Date(startDate),
  });
  const allocatedStartDate = startOfISOWeek(
    add(referenceDate, { weeks: -startWeeks }),
  );
  const allocatedEndDate = endOfISOWeek(
    add(referenceDate, { weeks: endWeeks }),
  );

  const handleWeekRangeChange = (
    key: 'start' | 'end',
    value: string,
    referenceDate: Date,
  ) => {
    setWeekRange({
      startWeeks: key === 'start' ? parseInt(value, 10) : startWeeks,
      endWeeks: key === 'end' ? parseInt(value, 10) : endWeeks,
      referenceDate,
    });
  };

  const filterProgram = useMemo(
    () => (program: ShipperProgram | CustomerProgram) =>
      editing ||
      ((!commonSpeciesId ||
        commonSpeciesId.some((id: string) =>
          [
            program.commonSpecies?.speciesName,
            ...pluck(
              'tagText',
              (program.commonSpecies?.commonSpeciesTags?.nodes ||
                []) as CommonSpeciesTag[],
            ).map((tagText) => `${tagText} (tag)`),
          ].includes(id),
        )) &&
        (!commonVarietyId ||
          commonVarietyId.some((id: string) =>
            [
              program.commonVariety?.varietyName,
              ...pluck(
                'tagText',
                (program.commonVariety?.commonVarietyTags?.nodes ||
                  []) as CommonVarietyTag[],
              ).map((tagText) => `${tagText} (tag)`),
            ].includes(id),
          )) &&
        (!commonSizeId ||
          commonSizeId.some((id: string) =>
            [
              program.commonSize?.sizeName,
              ...pluck(
                'tagText',
                (program.commonSize?.commonSizeTags?.nodes ||
                  []) as CommonSizeTag[],
              ).map((tagText) => `${tagText} (tag)`),
            ].includes(id),
          )) &&
        (!commonPackTypeId ||
          commonPackTypeId.some((id: string) =>
            [
              program.commonPackType?.packTypeName,
              ...pluck(
                'tagText',
                (program.commonPackType?.commonPackTypeTags?.nodes ||
                  []) as CommonPackTypeTag[],
              ).map((tagText) => `${tagText} (tag)`),
            ].includes(id),
          )) &&
        (!plu || plu.includes(program.plu)) &&
        (isCustomers ||
          !customerIdFilter ||
          customerIdFilter.includes(program.customer?.customerName))),
    [
      commonPackTypeId,
      commonSizeId,
      commonSpeciesId,
      commonVarietyId,
      customerIdFilter,
      editing,
      isCustomers,
      plu,
    ],
  );

  const {
    data: shipperProgramData,
    loading: shipperProgramDataLoading,
    error: shipperProgramDataError,
  } = api.useShipperPrograms(weekCount, allocatedStartDate, allocatedEndDate);
  const shipperPrograms = useMemo(
    () =>
      (shipperProgramData ? shipperProgramData.nodes : []) as ShipperProgram[],
    [shipperProgramData],
  );
  const allShipperPrograms = useMemo(
    () =>
      (
        getAllShipperPrograms(
          shipperPrograms,
          changes,
          removedItems,
        ) as ShipperProgram[]
      ).filter(filterProgram),
    [changes, filterProgram, removedItems, shipperPrograms],
  );

  const {
    data: customerProgramData,
    loading: customerProgramDataLoading,
    error: customerProgramDataError,
  } = api.useCustomerPrograms(weekCount, allocatedStartDate, allocatedEndDate);
  const customerPrograms = useMemo(
    () =>
      (customerProgramData
        ? customerProgramData.nodes
        : []) as CustomerProgram[],
    [customerProgramData],
  );
  const allCustomerPrograms = useMemo(
    () =>
      (
        getAllCustomerPrograms(
          customerPrograms,
          changes,
          removedItems,
        ) as CustomerProgram[]
      ).filter(filterProgram),
    [changes, filterProgram, removedItems, customerPrograms],
  );

  const shipperProgramEntries = allShipperPrograms
    .map((p) => (p.shipperProgramEntries.nodes || []) as ShipperProgramEntry[])
    .flat();

  const getFilteredShipperPrograms = (progs: ShipperProgram[]) =>
    progs.filter(
      (p) =>
        p.id < 0 ||
        ((p.shipperProgramEntries.nodes || []) as ShipperProgramEntry[]).some(
          (e) =>
            isDateGreaterThanOrEqualTo(
              new Date(e.programDate.replace(/-/g, '/')),
              startOfISOWeek(new Date(startDate.replace(/-/g, '/'))),
            ),
        ),
    );
  const filteredShipperPrograms =
    getFilteredShipperPrograms(allShipperPrograms);
  const duplicateShipperProgramIds = getDuplicateProgramIds(
    filteredShipperPrograms,
    false,
  );

  const customerProgramEntries = allCustomerPrograms
    .map(
      (p) => (p.customerProgramEntries.nodes || []) as CustomerProgramEntry[],
    )
    .flat();

  const getFilteredCustomerPrograms = (progs: CustomerProgram[]) =>
    progs.filter(
      (p) =>
        p.id < 0 ||
        ((p.customerProgramEntries.nodes || []) as CustomerProgramEntry[]).some(
          (e) =>
            isDateGreaterThanOrEqualTo(
              new Date(e.programDate.replace(/-/g, '/')),
              startOfISOWeek(new Date(startDate.replace(/-/g, '/'))),
            ),
        ),
    );
  const filteredCustomerPrograms =
    getFilteredCustomerPrograms(allCustomerPrograms);
  const duplicateCustomerProgramIds = getDuplicateProgramIds(
    filteredCustomerPrograms,
    true,
  );

  const { gridTemplateColumns, gridWidth } = getGridProps(
    weekCount,
    isCustomers,
  );

  const hasPrograms = isCustomers
    ? customerPrograms.length > 0
    : shipperPrograms.length > 0;

  const { data: speciesData } = api.useCommonSpecieses();
  const specieses = useMemo(
    () => (speciesData ? speciesData.nodes : []) as CommonSpecies[],
    [speciesData],
  );

  const {
    data: projectionsData,
    loading: projectionsLoading,
    error: projectionsError,
  } = api.useShipperProjectionVesselInfos();
  const vesselInfos = (
    (projectionsData
      ? projectionsData.nodes
      : []) as ShipperProjectionVesselInfo[]
  ).filter(
    (vesselInfo) =>
      vesselInfo.vessel?.vesselId &&
      vesselInfo.projection?.reviewStatus === 2 &&
      vesselInfo.id ===
        last(
          vesselInfo.vessel?.shipperProjectionVesselInfosByVesselId?.nodes ||
            [],
        )?.id,
  );

  const loading =
    shipperProgramDataLoading ||
    shipperDataLoading ||
    customerProgramDataLoading ||
    customerDataLoading ||
    projectionsLoading;
  const error =
    shipperDataError ||
    customerDataError ||
    shipperProgramDataError ||
    customerProgramDataError ||
    projectionsError;

  const [saveAttempt, setSaveAttempt] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpsertShipperPrograms] = api.useUpsertShipperPrograms(
    weekCount,
    allocatedStartDate,
    allocatedEndDate,
  );
  const [handleUpsertShipperProgramEntries] =
    api.useUpsertShipperProgramEntries(
      weekCount,
      allocatedStartDate,
      allocatedEndDate,
    );
  const [handleUpsertCustomerPrograms] = api.useUpsertCustomerPrograms(
    weekCount,
    allocatedStartDate,
    allocatedEndDate,
  );
  const [handleUpsertCustomerProgramEntries] =
    api.useUpsertCustomerProgramEntries(
      weekCount,
      allocatedStartDate,
      allocatedEndDate,
    );
  const [handleDeleteShipperPrograms] = api.useDeleteShipperPrograms();
  const [handleDeleteCustomerPrograms] = api.useDeleteCustomerPrograms();

  const setChanges = (newChanges: ProgramChanges) => {
    setState((prevState) => ({ ...prevState, changes: newChanges }));
  };

  const setEditing = (newEditing: boolean) => {
    setState((prevState) => ({ ...prevState, editing: newEditing }));
  };

  const setNewItemNextIds = (newNewItemNextIds: NewItemNextIds) => {
    setState((prevState) => ({
      ...prevState,
      newItemNextIds: newNewItemNextIds,
    }));
  };

  const setRemovedItems = (newRemovedItems: RemovedItems) => {
    setState((prevState) => ({ ...prevState, removedItems: newRemovedItems }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const hasDuplicatePrograms = isCustomers
    ? !isEmpty(duplicateCustomerProgramIds)
    : !isEmpty(duplicateShipperProgramIds);

  const isProgramValid = (
    program: ShipperProgramUpdate | CustomerProgramUpdate,
  ) => {
    const commonSpecies = specieses.find(
      (s) => s.id === program.commonSpeciesId,
    );
    return (
      commonSpecies &&
      (!program.commonVarietyId ||
        commonSpecies.commonVarieties.nodes.find(
          (v) => v && v.id === program.commonVarietyId,
        )) &&
      (!program.commonSizeId ||
        commonSpecies.commonSizes.nodes.find(
          (s) => s && s.id === program.commonSizeId,
        )) &&
      (!program.commonPackTypeId ||
        commonSpecies.commonPackTypes.nodes.find(
          (s) => s && s.id === program.commonPackTypeId,
        ))
    );
  };

  const hasInvalidPrograms = isCustomers
    ? [...changes.customerProgramUpdates, ...changes.newCustomerPrograms].some(
        (p) => !isProgramValid(p),
      )
    : [...changes.shipperProgramUpdates, ...changes.newShipperPrograms].some(
        (p) => !isProgramValid(p),
      );

  const validate = () => !hasDuplicatePrograms && !hasInvalidPrograms;

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
      if (!isCustomers) {
        setUpdateLoading((prevLoading) => [
          ...prevLoading,
          `del-shipper-programs`,
        ]);
        handleDeleteShipperPrograms({
          variables: { idsToDelete: pluck('id', removedItems.shipperPrograms) },
        }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `del-shipper-programs`),
          );
        });

        setUpdateLoading((prevLoading) => [...prevLoading, 'shipper-programs']);
        handleUpsertShipperPrograms({
          variables: {
            shipperPrograms: [
              ...changes.shipperProgramUpdates,
              ...changes.newShipperPrograms,
            ].map((p) => ({
              arrivalPort: coast,
              commonSpeciesId: p.commonSpeciesId || null,
              commonVarietyId: p.commonVarietyId || null,
              commonSizeId: p.commonSizeId || null,
              commonPackTypeId: p.commonPackTypeId || null,
              plu: p.plu,
              shipperId: p.shipperId,
              customerId: p.customerId || null,
              id: parseInt(p.id, 10) > 0 ? parseInt(p.id, 10) : undefined,
            })),
          },
        }).then((res) => {
          const updatedPrograms =
            res.data?.bulkUpsertShipperProgram?.shipperPrograms || [];

          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== 'shipper-programs'),
          );

          setUpdateLoading((prevLoading) => [
            ...prevLoading,
            'shipper-programs-entries',
          ]);

          handleUpsertShipperProgramEntries({
            variables: {
              shipperProgramEntries: [
                ...changes.shipperProgramEntryUpdates,
                ...changes.newShipperProgramEntries,
              ].map((e) => {
                const speciesValue = getShipperProgramValue(
                  e.shipperProgram,
                  'commonSpeciesId',
                ).value;
                const varietyValue = getShipperProgramValue(
                  e.shipperProgram,
                  'commonVarietyId',
                ).value;
                const sizeValue = getShipperProgramValue(
                  e.shipperProgram,
                  'commonSizeId',
                ).value;
                const packTypeValue = getShipperProgramValue(
                  e.shipperProgram,
                  'commonPackTypeId',
                ).value;
                const pluValue = getShipperProgramValue(
                  e.shipperProgram,
                  'plu',
                ).value;
                const customerIdValue = getShipperProgramValue(
                  e.shipperProgram,
                  'customerId',
                ).value;

                const updatedProgram = updatedPrograms.find(
                  (p) =>
                    p?.commonSpeciesId === (speciesValue || null) &&
                    p?.commonVarietyId === (varietyValue || null) &&
                    p?.commonSizeId === (sizeValue || null) &&
                    p?.commonPackTypeId === (packTypeValue || null) &&
                    p?.plu === (pluValue || '') &&
                    p?.customerId === (customerIdValue || null),
                ) || { id: 0 };

                return {
                  id: parseInt(e.id, 10) > 0 ? parseInt(e.id, 10) : undefined,
                  notes: e.notes,
                  programDate: e.programDate,
                  palletCount: e.palletCount,
                  shipperProgramId:
                    e.shipperProgram?.id > 0
                      ? e.shipperProgram?.id
                      : updatedProgram.id,
                };
              }),
            },
          }).then(() => {
            setUpdateLoading((prevLoading) =>
              prevLoading.filter((l) => l !== 'shipper-programs-entries'),
            );
          });
        });
      } else {
        setUpdateLoading((prevLoading) => [
          ...prevLoading,
          `del-customer-program`,
        ]);
        handleDeleteCustomerPrograms({
          variables: {
            idsToDelete: pluck('id', removedItems.customerPrograms),
          },
        }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `del-customer-program`),
          );
        });

        setUpdateLoading((prevLoading) => [
          ...prevLoading,
          'customer-programs',
        ]);
        handleUpsertCustomerPrograms({
          variables: {
            customerPrograms: [
              ...changes.customerProgramUpdates,
              ...changes.newCustomerPrograms,
            ].map((p) => ({
              arrivalPort: p.arrivalPort,
              commonSpeciesId: parseInt(p.commonSpeciesId, 10) || null,
              commonVarietyId: parseInt(p.commonVarietyId, 10) || null,
              commonSizeId: parseInt(p.commonSizeId, 10) || null,
              commonPackTypeId: parseInt(p.commonPackTypeId, 10) || null,
              plu: p.plu,
              customerId: p.customerId,
              id: parseInt(p.id, 10) > 0 ? parseInt(p.id, 10) : undefined,
            })),
          },
        }).then((res) => {
          const updatedPrograms =
            res.data?.bulkUpsertCustomerProgram?.customerPrograms || [];

          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== 'customer-programs'),
          );

          setUpdateLoading((prevLoading) => [
            ...prevLoading,
            'customer-programs-entries',
          ]);

          handleUpsertCustomerProgramEntries({
            variables: {
              customerProgramEntries: [
                ...changes.customerProgramEntryUpdates,
                ...changes.newCustomerProgramEntries,
              ].map((e) => {
                const speciesValue = getCustomerProgramValue(
                  e.customerProgram,
                  'commonSpeciesId',
                ).value;
                const varietyValue = getCustomerProgramValue(
                  e.customerProgram,
                  'commonVarietyId',
                ).value;
                const sizeValue = getCustomerProgramValue(
                  e.customerProgram,
                  'commonSizeId',
                ).value;
                const packTypeValue = getCustomerProgramValue(
                  e.customerProgram,
                  'commonPackTypeId',
                ).value;
                const pluValue = getCustomerProgramValue(
                  e.customerProgram,
                  'plu',
                ).value;

                const updatedProgram = updatedPrograms.find(
                  (p) =>
                    p?.commonSpeciesId === (speciesValue || null) &&
                    p?.commonVarietyId === (varietyValue || null) &&
                    p?.commonSizeId === (sizeValue || null) &&
                    p?.commonPackTypeId === (packTypeValue || null) &&
                    p?.plu === (pluValue || ''),
                ) || { id: 0 };

                return {
                  id: parseInt(e.id, 10) > 0 ? parseInt(e.id, 10) : undefined,
                  notes: e.notes,
                  programDate: e.programDate,
                  palletCount: e.palletCount,
                  customerProgramId:
                    parseInt(e.customerProgram?.id, 10) > 0
                      ? e.customerProgram?.id
                      : updatedProgram.id,
                };
              }),
            },
          }).then(() => {
            setUpdateLoading((prevLoading) =>
              prevLoading.filter((l) => l !== 'customer-programs-entries'),
            );
          });
        });
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(previousUpdateLoading) && isEmpty(updateLoading) && !loading) {
      handleCancel();
    }
  }, [handleCancel, loading, previousUpdateLoading, updateLoading]);

  const handleChange = useCallback(
    <T extends UpdateType>(updates: T[], changesKey: keyof ProgramChanges) => {
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
    },
    [changes],
  );

  const handleShipperProgramChange = (update: ShipperProgramUpdate) => {
    const changesKey =
      update.id < 0 ? 'newShipperPrograms' : 'shipperProgramUpdates';
    handleChange([update], changesKey);
  };

  const handleCustomerProgramChange = (update: CustomerProgramUpdate) => {
    const changesKey =
      update.id < 0 ? 'newCustomerPrograms' : 'customerProgramUpdates';
    handleChange([update], changesKey);
  };

  const handleShipperProgramEntryChange = (
    update: ShipperProgramEntryUpdate,
  ) => {
    const changesKey =
      update.id < 0 ? 'newShipperProgramEntries' : 'shipperProgramEntryUpdates';
    handleChange([update], changesKey);
  };

  const handleCustomerProgramEntryChange = (
    update: CustomerProgramEntryUpdate,
  ) => {
    const changesKey =
      update.id < 0
        ? 'newCustomerProgramEntries'
        : 'customerProgramEntryUpdates';
    handleChange([update], changesKey);
  };

  const handleNewShipperProgram = (newShipperProgram: NewShipperProgram) => {
    setChanges({
      ...changes,
      newShipperPrograms: [
        ...changes.newShipperPrograms,
        {
          ...newShipperProgram,
          id: newItemNextIds.shipperProgram,
        },
      ],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      shipperProgram: newItemNextIds.shipperProgram - 1,
    });
  };

  const handleNewCustomerProgram = (newCustomerProgram: NewCustomerProgram) => {
    setChanges({
      ...changes,
      newCustomerPrograms: [
        ...changes.newCustomerPrograms,
        {
          ...newCustomerProgram,
          id: newItemNextIds.customerProgram,
        },
      ],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      customerProgram: newItemNextIds.customerProgram - 1,
    });
  };

  const handleNewShipperProgramEntry = (
    newShipperProgramEntry: NewShipperProgramEntry,
  ) => {
    setChanges({
      ...changes,
      newShipperProgramEntries: [
        ...changes.newShipperProgramEntries,
        {
          ...newShipperProgramEntry,
          id: newItemNextIds.shipperProgramEntry,
        },
      ],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      shipperProgramEntry: newItemNextIds.shipperProgramEntry - 1,
    });
  };

  const handleNewCustomerProgramEntry = (
    newCustomerProgramEntry: NewCustomerProgramEntry,
  ) => {
    setChanges({
      ...changes,
      newCustomerProgramEntries: [
        ...changes.newCustomerProgramEntries,
        {
          ...newCustomerProgramEntry,
          id: newItemNextIds.customerProgramEntry,
        },
      ],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      customerProgramEntry: newItemNextIds.customerProgramEntry - 1,
    });
  };

  const handleRemoveNewShipperProgram = (id: number) => {
    setChanges({
      ...changes,
      newShipperPrograms: changes.newShipperPrograms.filter(
        (item) => item.id !== id,
      ),
      newShipperProgramEntries: changes.newShipperProgramEntries.filter(
        (item) => item.shipperProgramId !== id,
      ),
    });
  };

  const handleRemoveNewCustomerProgram = (id: number) => {
    setChanges({
      ...changes,
      newCustomerPrograms: changes.newCustomerPrograms.filter(
        (item) => item.id !== id,
      ),
      newCustomerProgramEntries: changes.newCustomerProgramEntries.filter(
        (item) => item.customerProgramId !== id,
      ),
    });
  };

  const handleRemoveItem = (key: keyof RemovedItems, id: number) => {
    if (id < 0) {
      switch (key) {
        case 'shipperPrograms':
          handleRemoveNewShipperProgram(id);
          break;
        case 'customerPrograms':
          handleRemoveNewCustomerProgram(id);
          break;
        default:
          return;
      }
    } else {
      setRemovedItems({
        ...removedItems,
        [key]: [
          ...removedItems[key].filter((removedItem) => removedItem.id !== id),
          {
            id,
          },
        ],
      });
    }
  };

  const programs = (
    isCustomers ? filteredCustomerPrograms : filteredShipperPrograms
  ) as (CustomerProgram | ShipperProgram)[];

  const groupedProgramsByProduct = useMemo(
    () =>
      groupProgramsByProduct(specieses, programs, getProgramValue) as {
        [key: string]: (CustomerProgram | ShipperProgram)[];
      },
    [getProgramValue, programs, specieses],
  );

  const groupedProgramsByCustomerOrShipperAndProduct = useMemo(
    () =>
      mapObjIndexed(
        (progs: (CustomerProgram | ShipperProgram)[]) =>
          groupProgramsByProduct(specieses, progs, getProgramValue),
        groupBy(
          (program) =>
            (isCustomers
              ? (program as CustomerProgram).customer?.customerName
              : (program as ShipperProgram).shipper?.shipperName) || '',
          programs,
        ),
      ) as Record<
        string,
        {
          [index: string]: (CustomerProgram | ShipperProgram)[];
        }
      >,
    [getProgramValue, isCustomers, programs, specieses],
  );

  const getProgramEntryValue = (
    isCustomers ? getCustomerProgramEntryValue : getShipperProgramEntryValue
  ) as <
    L extends CustomerProgramEntry | ShipperProgramEntry,
    M extends CustomerProgramEntryUpdate | ShipperProgramEntryUpdate,
  >(
    entry: Maybe<L> | undefined,
    key: keyof M,
  ) => { dirty: boolean; value: string };

  const buildProgramTotals = useMemo(
    () =>
      <T extends CustomerProgram | ShipperProgram>(
        progs: T[],
        isCustomersOverride = isCustomers,
      ) =>
        getProgramTotals(
          (isCustomersOverride
            ? pluck('customerProgramEntries', progs as CustomerProgram[]).map(
                (es) => es?.nodes || [],
              )
            : pluck('shipperProgramEntries', progs as ShipperProgram[]).map(
                (es) => es?.nodes || [],
              )
          ).flat() as (CustomerProgramEntry | ShipperProgramEntry)[],
          startDate || '',
          weekCount,
          getProgramEntryValue,
          isCustomersOverride
            ? []
            : vesselInfos.filter(
                (vesselInfo) =>
                  progs[0] &&
                  vesselInfo.shipperId ===
                    (progs[0] as ShipperProgram).shipperId,
              ),
        ),
    [getProgramEntryValue, isCustomers, startDate, vesselInfos, weekCount],
  );

  const programTotals = useMemo(
    () =>
      (isCustomers ? selectedCustomer : selectedShipper)
        ? mapObjIndexed(
            (ps) => buildProgramTotals(ps, isCustomers),
            groupedProgramsByProduct,
          )
        : Object.keys(groupedProgramsByCustomerOrShipperAndProduct)
            .sort()
            .reduce((acc, key) => {
              const ps = groupedProgramsByCustomerOrShipperAndProduct[key];
              const newPrograms: {
                [key: string]: ProgramTotal[];
              } = {};
              if (ps) {
                Object.keys(ps).forEach((programsKey) => {
                  const programs = ps[programsKey as keyof typeof ps];
                  newPrograms[`${key}-${programsKey}`] =
                    buildProgramTotals(programs);
                });
              }
              return { ...acc, ...newPrograms };
            }, {}),
    [
      buildProgramTotals,
      isCustomers,
      groupedProgramsByProduct,
      groupedProgramsByCustomerOrShipperAndProduct,
      selectedCustomer,
      selectedShipper,
    ],
  );

  const customerGrandProgramTotals = useMemo(
    () => buildProgramTotals(filteredCustomerPrograms, true),
    [filteredCustomerPrograms, buildProgramTotals],
  );
  const shipperGrandProgramTotals = useMemo(
    () => buildProgramTotals(filteredShipperPrograms, false),
    [filteredShipperPrograms, buildProgramTotals],
  );
  const netGrandProgramTotals = shipperGrandProgramTotals.map(
    ({ total, available, projected }, i) => ({
      total: total - customerGrandProgramTotals[i].total,
      available:
        available === null && customerGrandProgramTotals[i].available === null
          ? null
          : (available || 0) - (customerGrandProgramTotals[i].available || 0),
      projected:
        projected === null && customerGrandProgramTotals[i].projected === null
          ? null
          : (projected || 0) - (customerGrandProgramTotals[i].projected || 0),
    }),
  );

  const programProps = {
    allocatedStartDate,
    allocatedEndDate,
    changeHandlers: {
      handleShipperProgramChange,
      handleCustomerProgramChange,
      handleShipperProgramEntryChange,
      handleCustomerProgramEntryChange,
    },
    customerPrograms: allCustomerPrograms,
    customerProgramEntries,
    customers,
    duplicateProgramIds: isCustomers
      ? duplicateCustomerProgramIds
      : duplicateShipperProgramIds,
    editing,
    endWeeks,
    error,
    handleRemoveItem,
    handleWeekRangeChange,
    isCustomers,
    loading,
    newItemHandlers: {
      handleNewShipperProgram,
      handleNewShipperProgramEntry,
      handleNewCustomerProgram,
      handleNewCustomerProgramEntry,
    },
    selectedCustomer,
    selectedWeekNumber,
    shipperPrograms: allShipperPrograms,
    shipperProgramEntries,
    showAllocated,
    startWeeks,
    updateLoading,
    valueGetters: {
      getShipperProgramValue,
      getCustomerProgramValue,
      getShipperProgramEntryValue,
      getCustomerProgramEntryValue,
    },
    vesselInfos,
    weekCount,
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
        editing ? (
          <l.Flex alignCenter key={1} relative>
            <BasicModal
              title="Confirm Discard Changes"
              content={
                <ty.BodyText>
                  You will lose all unsaved program changes.
                </ty.BodyText>
              }
              confirmText="Discard"
              handleConfirm={handleCancel}
              shouldConfirm={hasChanges}
              triggerProps={{
                mr: th.spacing.md,
                status: th.colors.status.error,
                width: 88,
              }}
              triggerText="Cancel"
            />
            {saveAttempt && !validate() && (
              <l.Div cursor="pointer" height={20} mr={th.spacing.md}>
                <ErrorPanel
                  customStyles={{
                    border: th.borders.error,
                    right: -105,
                    left: 'auto',
                    top: 30,
                    width: 'auto',
                    zIndex: 20,
                  }}
                  errors={[
                    {
                      text: 'No duplicate products',
                      value: hasDuplicatePrograms,
                    },
                    {
                      text: 'All products must be matched',
                      value: hasInvalidPrograms,
                    },
                  ]}
                />
              </l.Div>
            )}
            <b.Success
              disabled={saveAttempt && !validate()}
              onClick={handleSave}
              width={88}
            >
              {!isEmpty(updateLoading) ? (
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
          </l.Flex>
        ) : (
          (isCustomers ? selectedCustomer : selectedShipper) && (
            <b.Warning key={1} onClick={handleEdit} width={88}>
              Edit
            </b.Warning>
          )
        ),
        (isCustomers ? selectedCustomer : selectedShipper) ? (
          <l.AreaLink
            key={0}
            ml={th.spacing.lg}
            to={`/directory/${isCustomers ? 'customers' : 'shippers'}/${
              isCustomers ? customerId : shipperId
            }`}
          >
            <b.Primary>{isCustomers ? 'Customer' : 'Shipper'}</b.Primary>
          </l.AreaLink>
        ) : (
          <div key={0} />
        ),
      ]}
      extraPaddingTop={55}
      headerChildren={
        <l.Flex mb={th.spacing.md}>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.sm} secondary>
              Coast
            </ty.SmallText>
            <CoastTabBar />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.sm} secondary>
              View
            </ty.SmallText>
            <ViewTabBar />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.sm} secondary>
              {isCustomers ? 'Customer' : 'Shipper'}
            </ty.SmallText>
            {isCustomers ? CustomerItemSelector : ShipperItemSelector}
          </l.Div>
          <div>
            <ty.SmallText mb={th.spacing.sm} secondary>
              Week Of
            </ty.SmallText>
            <l.Flex alignCenter>
              {DateRangePicker}
              {BackwardButton}
              {ForwardButton}
            </l.Flex>
          </div>
          <ResetButton
            ml={th.sizes.icon}
            mt={29}
            onClick={() => {
              clearCustomerSearch();
              clearShipperSearch();
              setEditing(false);
            }}
          >
            <l.AreaLink
              cursor="pointer"
              height={th.sizes.icon}
              width={th.sizes.icon}
              to={`/sales/programs?programsView=${view}&coast=${coast}`}
            >
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.AreaLink>
          </ResetButton>
        </l.Flex>
      }
      title={`${isCustomers ? 'Customer' : 'Shipper'} Programs`}
    >
      <l.Flex column height="calc(100vh - 289px)">
        <l.Div flex={1} overflowX="auto" relative>
          <Header
            editing={editing}
            loading={loading}
            hasPrograms={hasPrograms}
            increaseWeekCount={increaseWeekCount}
            isCustomers={isCustomers}
            programs={
              isCustomers
                ? getFilteredCustomerPrograms(customerPrograms)
                : getFilteredShipperPrograms(shipperPrograms)
            }
            selectedWeekNumber={selectedWeekNumber}
            showAllocated={showAllocated}
            startDate={startDate || ''}
            toggleShowAllocated={toggleShowAllocated}
            weekCount={weekCount}
          />
          <l.Div mb={th.spacing.xxl} relative>
            {(hasPrograms || editing) && !loading ? (
              <>
                {(isCustomers ? selectedCustomer : selectedShipper) ? (
                  <ProgramSet
                    editing={editing}
                    getProgramValue={getProgramValue}
                    groupedPrograms={groupedProgramsByProduct}
                    isCustomers={isCustomers}
                    loading={loading}
                    programTotals={programTotals}
                    rest={programProps}
                    specieses={specieses}
                    startIndex={0}
                  />
                ) : (
                  <>
                    {Object.keys(groupedProgramsByCustomerOrShipperAndProduct)
                      .sort()
                      .map((key) => {
                        const programsByCustomerOrShipper =
                          groupedProgramsByCustomerOrShipperAndProduct[key];
                        const prog = values(
                          programsByCustomerOrShipper,
                        )[0]?.[0];
                        const newId = isCustomers
                          ? (prog as CustomerProgram)?.customerId
                          : (prog as ShipperProgram)?.shipperId;
                        const index = Object.keys(
                          groupedProgramsByCustomerOrShipperAndProduct,
                        ).indexOf(key);
                        const startIndex = sum(
                          values(
                            groupedProgramsByCustomerOrShipperAndProduct,
                          ).map((curr, idx) =>
                            idx < index ? Object.keys(curr).length : 0,
                          ),
                        );

                        return (
                          <ProgramSet
                            editing={editing}
                            getProgramValue={getProgramValue}
                            groupedPrograms={programsByCustomerOrShipper}
                            isCustomers={isCustomers}
                            key={key}
                            loading={loading}
                            programTotals={programTotals}
                            rest={programProps}
                            to={`${pathname}${search}&${
                              isCustomers ? 'customerId' : 'shipperId'
                            }=${newId}`}
                            specieses={specieses}
                            startIndex={startIndex}
                          />
                        );
                      })}
                  </>
                )}
                {(isCustomers ? selectedCustomer : selectedShipper) &&
                  editing && (
                    <NewProgramRow
                      hasPrograms={hasPrograms}
                      handleNewProgram={
                        isCustomers
                          ? handleNewCustomerProgram
                          : handleNewShipperProgram
                      }
                      id={(isCustomers ? customerId : shipperId) || ''}
                      {...programProps}
                    />
                  )}
                <ProgramTotalRow
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  isCustomers={isCustomers}
                  programTotals={
                    isCustomers
                      ? customerGrandProgramTotals
                      : shipperGrandProgramTotals
                  }
                  showAllocated={showAllocated}
                  species={`${isCustomers ? 'Customers' : 'Shippers'} Grand`}
                  wrapperStyles={{ pb: th.spacing.sm }}
                />
                {commonSpeciesId && (
                  <>
                    <ProgramTotalRow
                      editing={editing}
                      gridTemplateColumns={gridTemplateColumns}
                      isCustomers={isCustomers}
                      programTotals={
                        isCustomers
                          ? shipperGrandProgramTotals
                          : customerGrandProgramTotals
                      }
                      showAllocated={showAllocated}
                      species={`${
                        isCustomers ? 'Shippers' : 'Customers'
                      } Grand`}
                      wrapperStyles={{ py: th.spacing.sm }}
                    />
                    <ProgramTotalRow
                      editing={editing}
                      gridTemplateColumns={gridTemplateColumns}
                      isCustomers={isCustomers}
                      programTotals={netGrandProgramTotals}
                      showAllocated={showAllocated}
                      species="Net Grand"
                      wrapperStyles={{ pt: th.spacing.sm }}
                    />
                  </>
                )}
                <l.Div
                  borderLeft={th.borders.secondary}
                  position="absolute"
                  top={`-${th.spacing.sm}`}
                  bottom={0}
                />
                <l.Div
                  borderRight={th.borders.secondary}
                  position="absolute"
                  top={`-${th.spacing.sm}`}
                  left={gridWidth}
                  bottom={0}
                />
                <l.Div
                  borderBottom={th.borders.secondary}
                  position="absolute"
                  bottom={0}
                  width={gridWidth}
                />
              </>
            ) : (
              <DataMessage
                data={isCustomers ? customerPrograms : shipperPrograms}
                emptyProps={{
                  header: `No ${
                    isCustomers ? 'customer' : 'shipper'
                  } programs found`,
                }}
                error={error}
                loading={loading}
              />
            )}
          </l.Div>
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default Programs;
