import React, { useCallback, useEffect, useState } from 'react';
import { equals, isEmpty, omit, reduce } from 'ramda';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import ErrorPanel from 'components/error-panel';
import useItemSelector from 'components/item-selector';
import { BasicModal } from 'components/modal';
import Page from 'components/page';
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
import ShipperPrograms from './shipper';
import {
  CollapsedItems,
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
} from './utils';
import CustomerPrograms from './customer';

const initialCollapsedItemsState: CollapsedItems = {
  shipperPrograms: [],
  customerPrograms: [],
};

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
  const [shipperId, setShipperId] = useQueryValue('shipperId');
  const [customerId, setCustomerId] = useQueryValue('customerId');

  const [{ startDate = formatDate(new Date()), endDate }] =
    useDateRangeQueryParams();
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
  const { changes, editing, newItemNextIds, removedItems } = state;
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

  const [
    { commonSpeciesId, commonVarietyId, commonSizeId, commonPackTypeId, plu },
  ] = useProgramsQueryParams();

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
  } = api.useShipperPrograms(weekCount);
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
  } = api.useCustomerPrograms(weekCount);
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

  const loading =
    shipperDataLoading ||
    customerDataLoading ||
    shipperProgramDataLoading ||
    customerProgramDataLoading;
  const error =
    shipperDataError ||
    customerDataError ||
    shipperProgramDataError ||
    customerProgramDataError;

  const [saveAttempt, setSaveAttempt] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpsertShipperPrograms] = api.useUpsertShipperPrograms(weekCount);
  const [handleUpsertShipperProgramEntries] =
    api.useUpsertShipperProgramEntries(weekCount);
  const [handleUpsertCustomerPrograms] =
    api.useUpsertCustomerPrograms(weekCount);
  const [handleUpsertCustomerProgramEntries] =
    api.useUpsertCustomerProgramEntries(weekCount);
  const [handleDeleteShipperProgram] = api.useDeleteShipperProgram(weekCount);
  const [handleDeleteCustomerProgram] = api.useDeleteCustomerProgram(weekCount);

  const [collapsedItems, setCollapsedItems] = useState(
    initialCollapsedItemsState,
  );

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
    expandAllItems();
    setEditing(true);
  };

  const hasDuplicatePrograms =
    !isEmpty(duplicateShipperProgramIds) ||
    !isEmpty(duplicateCustomerProgramIds);

  const validate = () => !hasDuplicatePrograms;

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
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
                    getShipperProgramValue(e.shipperProgram, 'commonSpeciesId')
                      .value ||
                  (null &&
                    p?.commonVarietyId ===
                      getShipperProgramValue(
                        e.shipperProgram,
                        'commonVarietyId',
                      ).value) ||
                  (null &&
                    p?.commonSizeId ===
                      getShipperProgramValue(e.shipperProgram, 'commonSizeId')
                        .value) ||
                  (null &&
                    p?.commonPackTypeId ===
                      getShipperProgramValue(
                        e.shipperProgram,
                        'commonPackTypeId',
                      ).value) ||
                  (null &&
                    p?.plu ===
                      getShipperProgramValue(e.shipperProgram, 'plu').value),
              ) || { id: 0 };

              return {
                id: parseInt(e.id, 10) > 0 ? parseInt(e.id, 10) : undefined,
                notes: e.notes,
                programDate: e.programDate,
                palletCount: e.palletCount,
                shipperProgramId:
                  e.shipperProgramId > 0
                    ? e.shipperProgramId
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

      setUpdateLoading((prevLoading) => [...prevLoading, 'customer-programs']);
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
                    ).value ||
                  (null &&
                    p?.commonVarietyId ===
                      getCustomerProgramValue(
                        e.customerProgram,
                        'commonVarietyId',
                      ).value) ||
                  (null &&
                    p?.commonSizeId ===
                      getCustomerProgramValue(e.customerProgram, 'commonSizeId')
                        .value) ||
                  (null &&
                    p?.commonPackTypeId ===
                      getCustomerProgramValue(
                        e.customerProgram,
                        'commonPackTypeId',
                      ).value) ||
                  (null &&
                    p?.plu ===
                      getCustomerProgramValue(e.customerProgram, 'plu').value),
              ) || { id: 0 };
              return {
                id: parseInt(e.id, 10) > 0 ? parseInt(e.id, 10) : undefined,
                notes: e.notes,
                programDate: e.programDate,
                palletCount: e.palletCount,
                customerProgramId:
                  e.customerProgramId > 0
                    ? e.customerProgramId
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

      removedItems.shipperPrograms.forEach(({ id }, idx) => {
        setUpdateLoading((prevLoading) => [
          ...prevLoading,
          `del-shipper-program-${idx}`,
        ]);
        handleDeleteShipperProgram({
          variables: { id },
        }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `del-shipper-program-${idx}`),
          );
        });
      });

      removedItems.customerPrograms.forEach(({ id }, idx) => {
        setUpdateLoading((prevLoading) => [
          ...prevLoading,
          `del-customer-program-${idx}`,
        ]);
        handleDeleteCustomerProgram({
          variables: { id },
        }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `del-customer-program-${idx}`),
          );
        });
      });
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

  const toggleCollapseItem = (key: keyof CollapsedItems, id: number) => {
    if (collapsedItems[key].includes(id)) {
      setCollapsedItems({
        ...collapsedItems,
        [key]: collapsedItems[key].filter((it) => it !== id),
      });
    } else {
      setCollapsedItems({
        ...collapsedItems,
        [key]: [...collapsedItems[key], id],
      });
    }
  };

  const isItemCollapsed = (key: keyof CollapsedItems, id: number) =>
    collapsedItems[key].includes(id);

  const collapseAllItems = () => {
    const newCollapsedItems: CollapsedItems = {
      shipperPrograms: [],
      customerPrograms: [],
    };
    allCustomerPrograms.forEach((customerProgram) => {
      if (customerProgram) {
        newCollapsedItems.customerPrograms.push(customerProgram.id);
      }
    });
    allShipperPrograms.forEach((shipperProgram) => {
      if (shipperProgram) {
        newCollapsedItems.shipperPrograms.push(shipperProgram.id);
      }
    });
    setCollapsedItems(newCollapsedItems);
  };

  const expandAllItems = () => {
    setCollapsedItems(initialCollapsedItemsState);
  };

  const programProps = {
    changeHandlers: {
      handleShipperProgramChange,
      handleCustomerProgramChange,
      handleShipperProgramEntryChange,
      handleCustomerProgramEntryChange,
    },
    editing,
    error,
    handleRemoveItem,
    isItemCollapsed,
    loading,
    newItemHandlers: {
      handleNewShipperProgram,
      handleNewShipperProgramEntry,
      handleNewCustomerProgram,
      handleNewCustomerProgramEntry,
    },
    selectedWeekNumber,
    toggleCollapseItem,
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
            collapseAllItems={collapseAllItems}
            editing={editing}
            expandAllItems={expandAllItems}
            increaseWeekCount={increaseWeekCount}
            selectedWeekNumber={selectedWeekNumber}
            startDate={startDate || ''}
            weekCount={weekCount}
          />
          {isCustomers ? (
            <CustomerPrograms
              {...programProps}
              duplicateProgramIds={duplicateCustomerProgramIds}
              programs={allCustomerPrograms as CustomerProgram[]}
              selectedCustomer={selectedCustomer}
            />
          ) : (
            <ShipperPrograms
              {...programProps}
              duplicateProgramIds={duplicateShipperProgramIds}
              programs={allShipperPrograms as ShipperProgram[]}
              selectedShipper={selectedShipper}
            />
          )}
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default Programs;
