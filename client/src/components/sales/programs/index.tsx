import React, { useCallback, useEffect, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import {
  equals,
  groupBy,
  isEmpty,
  mapObjIndexed,
  omit,
  pluck,
  reduce,
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
import useDateRange from 'hooks/use-date-range';
import useKeyboardWeekChange from 'hooks/use-keyboard-week-change';
import usePrevious from 'hooks/use-previous';
import {
  useDateRangeQueryParams,
  useProgramsQueryParams,
  useQueryValue,
} from 'hooks/use-query-params';
import {
  CommonSpecies,
  Customer,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  Shipper,
  ShipperProgram,
  ShipperProgramEntry,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import { coastTabs, ResetButton } from '../inventory/use-filters';
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
  const [shipperId, setShipperId] = useQueryValue('shipperId');
  const [customerId, setCustomerId] = useQueryValue('customerId');

  const [
    { startDate = formatDate(new Date()), endDate = formatDate(new Date()) },
  ] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );

  const { TabBar: ViewTabBar, selectedTabId: view } = useTabBar(
    viewTabs,
    false,
    'customers',
    'view',
    0,
  );
  const isCustomers = view === 'customers';

  const { TabBar: CoastTabBar } = useTabBar(coastTabs, false, 'EC', 'coast', 1);

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
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = shipperData ? shipperData.nodes : [];
  const selectedShipper = shippers.find(
    (shipper) => shipper && shipper.id === shipperId,
  );

  const { ItemSelector: ShipperItemSelector, clearSearch: clearShipperSearch } =
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
      },
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      searchParamName: 'shipperSearch',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      width: 300,
    });

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers();
  const customers = customerData ? customerData.nodes : [];
  const selectedCustomer = customers.find(
    (customer) => customer && customer.id === customerId,
  );

  const {
    ItemSelector: CustomerItemSelector,
    clearSearch: clearCustomerSearch,
  } = useItemSelector<Customer>({
    selectItem: (customer) => {
      setCustomerId(customer.id);
    },
    allItems: customers as Customer[],
    closeOnSelect: true,
    clearSearchOnBlur: true,
    error: customerDataError,
    errorLabel: 'Customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    onClear: () => {
      setCustomerId(undefined);
    },
    onlyClearSearch: true,
    placeholder: 'Select customer',
    searchParamName: 'customerSearch',
    selectedItem: selectedCustomer
      ? `${selectedCustomer.customerName} (${selectedCustomer.id})`
      : undefined,
    width: 300,
  });

  const [weekCount, setWeekCount] = useState(32);

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

  const [
    { commonSpeciesId, commonVarietyId, commonSizeId, commonPackTypeId, plu },
  ] = useProgramsQueryParams();

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

  const filterProgram = (program: ShipperProgram | CustomerProgram) =>
    editing ||
    ((!commonSpeciesId || program.commonSpeciesId === commonSpeciesId) &&
      (!commonVarietyId || program.commonVarietyId === commonVarietyId) &&
      (!commonSizeId || program.commonSizeId === commonSizeId) &&
      (!commonPackTypeId || program.commonPackTypeId === commonPackTypeId) &&
      (!plu || program.plu === plu));

  const {
    data: shipperProgramData,
    loading: shipperProgramDataLoading,
    error: shipperProgramDataError,
  } = api.useShipperPrograms(weekCount, allocatedStartDate, allocatedEndDate);
  const shipperPrograms = (
    shipperProgramData ? shipperProgramData.nodes : []
  ) as ShipperProgram[];
  const allShipperPrograms = (
    getAllShipperPrograms(
      shipperPrograms,
      changes,
      removedItems,
    ) as ShipperProgram[]
  ).filter(filterProgram);

  const {
    data: customerProgramData,
    loading: customerProgramDataLoading,
    error: customerProgramDataError,
  } = api.useCustomerPrograms(weekCount, allocatedStartDate, allocatedEndDate);
  const customerPrograms = (
    customerProgramData ? customerProgramData.nodes : []
  ) as CustomerProgram[];
  const allCustomerPrograms = (
    getAllCustomerPrograms(
      customerPrograms,
      changes,
      removedItems,
    ) as CustomerProgram[]
  ).filter(filterProgram);

  const updatedShipperPrograms = allShipperPrograms.map((program) => ({
    id: program.id,
    commonSpeciesId: getShipperProgramValue(program, 'commonSpeciesId').value,
    commonVarietyId: getShipperProgramValue(program, 'commonVarietyId').value,
    commonSizeId: getShipperProgramValue(program, 'commonSizeId').value,
    commonPackTypeId: getShipperProgramValue(program, 'commonPackTypeId').value,
    plu: getShipperProgramValue(program, 'plu').value,
  })) as ShipperProgramUpdate[];

  const duplicateShipperProgramIds = getDuplicateProgramIds(
    updatedShipperPrograms,
  );

  const shipperProgramEntries = allShipperPrograms
    .map((p) => (p.shipperProgramEntries.nodes || []) as ShipperProgramEntry[])
    .flat();

  const updatedCustomerPrograms = allCustomerPrograms.map((program) => ({
    id: program.id,
    commonSpeciesId: getCustomerProgramValue(program, 'commonSpeciesId').value,
    commonVarietyId: getCustomerProgramValue(program, 'commonVarietyId').value,
    commonSizeId: getCustomerProgramValue(program, 'commonSizeId').value,
    commonPackTypeId: getCustomerProgramValue(program, 'commonPackTypeId')
      .value,
    plu: getCustomerProgramValue(program, 'plu').value,
  })) as CustomerProgramUpdate[];

  const duplicateCustomerProgramIds = getDuplicateProgramIds(
    updatedCustomerPrograms,
  );

  const customerProgramEntries = allCustomerPrograms
    .map(
      (p) => (p.customerProgramEntries.nodes || []) as CustomerProgramEntry[],
    )
    .flat();

  const { data: speciesData, loading: speciesLoading } =
    api.useCommonSpecieses();
  const specieses = (speciesData ? speciesData.nodes : []) as CommonSpecies[];

  const loading =
    shipperDataLoading ||
    customerDataLoading ||
    shipperProgramDataLoading ||
    customerProgramDataLoading ||
    speciesLoading;
  const error =
    shipperDataError ||
    customerDataError ||
    shipperProgramDataError ||
    customerProgramDataError;

  const [saveAttempt, setSaveAttempt] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpsertShipperPrograms] = api.useUpsertShipperPrograms();
  const [handleUpsertShipperProgramEntries] =
    api.useUpsertShipperProgramEntries(
      weekCount,
      allocatedStartDate,
      allocatedEndDate,
    );
  const [handleUpsertCustomerPrograms] = api.useUpsertCustomerPrograms();
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

  const hasDuplicatePrograms =
    !isEmpty(duplicateShipperProgramIds) ||
    !isEmpty(duplicateCustomerProgramIds);

  const validate = () => !hasDuplicatePrograms;

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
              arrivalPort: p.arrivalPort,
              commonSpeciesId: parseInt(p.commonSpeciesId, 10) || null,
              commonVarietyId: parseInt(p.commonVarietyId, 10) || null,
              commonSizeId: parseInt(p.commonSizeId, 10) || null,
              commonPackTypeId: parseInt(p.commonPackTypeId, 10) || null,
              plu: p.plu,
              shipperId: p.shipperId,
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
                const updatedProgram = updatedPrograms.find(
                  (p) =>
                    p?.commonSpeciesId ===
                      getShipperProgramValue(
                        e.shipperProgram,
                        'commonSpeciesId',
                      ).value &&
                    p?.commonVarietyId ===
                      getShipperProgramValue(
                        e.shipperProgram,
                        'commonVarietyId',
                      ).value &&
                    p?.commonSizeId ===
                      getShipperProgramValue(e.shipperProgram, 'commonSizeId')
                        .value &&
                    p?.commonPackTypeId ===
                      getShipperProgramValue(
                        e.shipperProgram,
                        'commonPackTypeId',
                      ).value &&
                    p?.plu ===
                      getShipperProgramValue(e.shipperProgram, 'plu').value,
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
                const updatedProgram = updatedPrograms.find(
                  (p) =>
                    p?.commonSpeciesId ===
                      getCustomerProgramValue(
                        e.customerProgram,
                        'commonSpeciesId',
                      ).value &&
                    p?.commonVarietyId ===
                      getCustomerProgramValue(
                        e.customerProgram,
                        'commonVarietyId',
                      ).value &&
                    p?.commonSizeId ===
                      getCustomerProgramValue(e.customerProgram, 'commonSizeId')
                        .value &&
                    p?.commonPackTypeId ===
                      getCustomerProgramValue(
                        e.customerProgram,
                        'commonPackTypeId',
                      ).value &&
                    p?.plu ===
                      getCustomerProgramValue(e.customerProgram, 'plu').value,
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
  }, [loading, previousUpdateLoading, updateLoading]);

  const handleCancel = () => {
    setState(initialState);
    setSaveAttempt(false);
  };

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

  const programs = (isCustomers ? allCustomerPrograms : allShipperPrograms) as (
    | CustomerProgram
    | ShipperProgram
  )[];

  const groupedProgramsByProduct = groupProgramsByProduct(
    specieses,
    programs,
    getProgramValue,
  ) as {
    [key: string]: (CustomerProgram | ShipperProgram)[];
  };

  const groupedProgramsByCustomerOrShipperAndProduct = mapObjIndexed(
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
  >;

  const { gridTemplateColumns, gridWidth } = getGridProps(weekCount);

  const hasPrograms = isCustomers
    ? customerPrograms.length > 0
    : shipperPrograms.length > 0;

  const getProgramEntryValue = (
    isCustomers ? getCustomerProgramEntryValue : getShipperProgramEntryValue
  ) as <
    L extends CustomerProgramEntry | ShipperProgramEntry,
    M extends CustomerProgramEntryUpdate | ShipperProgramEntryUpdate,
  >(
    entry: Maybe<L> | undefined,
    key: keyof M,
  ) => { dirty: boolean; value: string };

  const buildProgramTotals = <T extends CustomerProgram | ShipperProgram>(
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
      selectedWeekNumber,
      weekCount,
      getProgramEntryValue,
    );

  const programTotals = (isCustomers ? selectedCustomer : selectedShipper)
    ? mapObjIndexed((ps) => buildProgramTotals(ps), groupedProgramsByProduct)
    : Object.keys(groupedProgramsByCustomerOrShipperAndProduct).reduce(
        (acc, key) => {
          const ps = groupedProgramsByCustomerOrShipperAndProduct[key];
          const newProducts: {
            [key: string]: { total: number; available: number | null }[];
          } = {};
          if (ps) {
            Object.keys(ps).forEach((productKey) => {
              const product = ps[productKey as keyof typeof ps];
              newProducts[`${key}-${productKey}`] = buildProgramTotals(product);
            });
          }
          return { ...acc, ...newProducts };
        },
        {},
      );

  const customerGrandProgramTotals = buildProgramTotals(
    allCustomerPrograms,
    true,
  );
  const shipperGrandProgramTotals = buildProgramTotals(
    allShipperPrograms,
    false,
  );
  const netGrandProgramTotals = customerGrandProgramTotals.map(
    ({ total, available }, i) => ({
      total: total - shipperGrandProgramTotals[i].total,
      available:
        available === null && shipperGrandProgramTotals[i].available === null
          ? null
          : (available || 0) - (shipperGrandProgramTotals[i].available || 0),
    }),
  );

  const programProps = {
    changeHandlers: {
      handleShipperProgramChange,
      handleCustomerProgramChange,
      handleShipperProgramEntryChange,
      handleCustomerProgramEntryChange,
    },
    customerPrograms: allCustomerPrograms,
    customerProgramEntries,
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
          <l.Flex alignCenter key={0} relative>
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
              triggerProps={{ mr: th.spacing.md, width: 88 }}
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
                  ]}
                />
              </l.Div>
            )}
            <b.Primary
              disabled={saveAttempt && !validate()}
              key={0}
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
            </b.Primary>
          </l.Flex>
        ) : (
          (selectedCustomer || selectedShipper) && (
            <b.Primary key={0} onClick={handleEdit} width={88}>
              Edit
            </b.Primary>
          )
        ),
      ]}
      extraPaddingTop={58}
      headerChildren={
        <l.Flex mb={th.spacing.md}>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              View
            </ty.CaptionText>
            <ViewTabBar />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              {isCustomers ? 'Customer' : 'Shipper'}
            </ty.CaptionText>
            {isCustomers ? CustomerItemSelector : ShipperItemSelector}
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.CaptionText mb={th.spacing.sm} secondary>
              Coast
            </ty.CaptionText>
            <CoastTabBar />
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
          <ResetButton
            ml={th.spacing.md}
            mt={th.spacing.lg}
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
              to={`/sales/programs?view=${view}`}
            >
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.AreaLink>
          </ResetButton>
        </l.Flex>
      }
      title={`${isCustomers ? 'Customer' : 'Shipper'} Programs`}
    >
      <l.Flex column minHeight="calc(100vh - 289px)">
        <l.Div flex={1} overflowX="auto">
          <Header
            editing={editing}
            increaseWeekCount={increaseWeekCount}
            selectedWeekNumber={selectedWeekNumber}
            showAllocated={showAllocated}
            startDate={startDate || ''}
            toggleShowAllocated={toggleShowAllocated}
            weekCount={weekCount}
          />
          <l.Div mb={th.spacing.xxl} relative>
            <l.Grid
              gridColumnGap={th.spacing.sm}
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              mt={th.spacing.md}
            >
              <l.Grid
                gridColumnGap={th.spacing.xs}
                gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
                marginLeft={52}
                relative
              >
                <ty.CaptionText secondary>Species</ty.CaptionText>
                <ty.CaptionText secondary>Variety</ty.CaptionText>
                <ty.CaptionText secondary>Size</ty.CaptionText>
                <ty.CaptionText secondary>Pack Type</ty.CaptionText>
                <ty.CaptionText secondary>PLU/GTIN</ty.CaptionText>
                {(hasPrograms || editing) && !loading && (
                  <l.Div
                    borderTop={th.borders.secondary}
                    position="absolute"
                    left={-52}
                    bottom={`-${th.spacing.sm}`}
                    width={gridWidth}
                  />
                )}
              </l.Grid>
            </l.Grid>
            {(hasPrograms || editing) && !loading ? (
              <>
                {(isCustomers ? selectedCustomer : selectedShipper) ? (
                  <ProgramSet
                    editing={editing}
                    getProgramValue={getProgramValue}
                    groupedPrograms={groupedProgramsByProduct}
                    loading={loading}
                    programTotals={programTotals}
                    rest={programProps}
                    specieses={specieses}
                  />
                ) : (
                  <>
                    {values(
                      mapObjIndexed((programsByCustomerOrShipper, key) => {
                        const prog = values(
                          programsByCustomerOrShipper,
                        )[0]?.[0];
                        const newId = isCustomers
                          ? (prog as CustomerProgram)?.customerId
                          : (prog as ShipperProgram)?.shipperId;
                        return (
                          <ProgramSet
                            editing={editing}
                            getProgramValue={getProgramValue}
                            groupedPrograms={programsByCustomerOrShipper}
                            key={key}
                            loading={loading}
                            programTotals={programTotals}
                            rest={programProps}
                            to={`${pathname}${search}&${
                              isCustomers ? 'customerId' : 'shipperId'
                            }=${newId}`}
                            specieses={specieses}
                          />
                        );
                      }, groupedProgramsByCustomerOrShipperAndProduct),
                    )}
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
                  programTotals={
                    isCustomers
                      ? customerGrandProgramTotals
                      : shipperGrandProgramTotals
                  }
                  showAllocated={showAllocated}
                  species={`${isCustomers ? 'Customers' : 'Shippers'} Grand`}
                />
                {commonSpeciesId && (
                  <>
                    <ProgramTotalRow
                      editing={editing}
                      gridTemplateColumns={gridTemplateColumns}
                      programTotals={
                        isCustomers
                          ? shipperGrandProgramTotals
                          : customerGrandProgramTotals
                      }
                      showAllocated={showAllocated}
                      species={`${
                        isCustomers ? 'Shippers' : 'Customers'
                      } Grand`}
                    />
                    <ProgramTotalRow
                      editing={editing}
                      gridTemplateColumns={gridTemplateColumns}
                      programTotals={netGrandProgramTotals}
                      showAllocated={showAllocated}
                      species="Net Grand"
                    />
                  </>
                )}
                <l.Div
                  borderLeft={th.borders.secondary}
                  position="absolute"
                  top={27}
                  bottom={0}
                />
                <l.Div
                  borderRight={th.borders.secondary}
                  position="absolute"
                  top={26}
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
