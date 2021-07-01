import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, pluck } from 'ramda';

import useLocalStorage from 'hooks/use-local-storage';
import usePrevious from 'hooks/use-previous';
import {
  ContactGroup,
  Customer,
  PersonContact,
  Shipper,
  Warehouse,
} from 'types';

interface SelectedGroup extends ContactGroup {
  selectedContacts: PersonContact[];
}

interface SelectedCustomer extends Customer {
  selectedContacts: PersonContact[];
}

interface SelectedShipper extends Shipper {
  selectedContacts: PersonContact[];
}

interface SelectedWarehouse extends Warehouse {
  selectedContacts: PersonContact[];
}

interface DirectorySelectionState {
  groups: SelectedGroup[];
  customers: SelectedCustomer[];
  internal: PersonContact[];
  shippers: SelectedShipper[];
  warehouses: SelectedWarehouse[];
}

const defaultContext = {
  groups: [],
  customers: [],
  internal: [],
  shippers: [],
  warehouses: [],
};

export const DirectorySelectionContext = createContext<
  [DirectorySelectionState, { [key: string]: any }]
>([
  defaultContext,
  {
    clearAllSelectedItems: () => {},
    selectInternalContact: () => {},
    isAllInternalContactsSelected: () => {},
    toggleAllInternalContacts: () => {},
    selectCustomer: () => {},
    selectCustomerPersonContact: () => {},
    isAllCustomersSelected: () => {},
    isAllCustomerPersonContactsSelected: () => {},
    removeSelectedContactsFromCustomer: () => {},
    toggleAllCustomers: () => {},
    toggleAllCustomerPersonContacts: () => {},
    selectShipper: () => {},
    selectShipperPersonContact: () => {},
    isAllShippersSelected: () => {},
    isAllShipperPersonContactsSelected: () => {},
    removeSelectedContactsFromShipper: () => {},
    toggleAllShippers: () => {},
    toggleAllShipperPersonContacts: () => {},
    selectWarehouse: () => {},
    selectWarehousePersonContact: () => {},
    isAllWarehousesSelected: () => {},
    isAllWarehousePersonContactsSelected: () => {},
    removeSelectedContactsFromWarehouse: () => {},
    toggleAllWarehouses: () => {},
    toggleAllWarehousePersonContacts: () => {},
    selectGroup: () => {},
    selectGroupPersonContact: () => {},
    isAllGroupsSelected: () => {},
    isAllGroupPersonContactsSelected: () => {},
    toggleAllGroups: () => {},
    toggleAllGroupPersonContacts: () => {},
    removeSelectedContactsFromGroup: () => {},
  },
]);

export const useDirectorySelectionContext = () =>
  useContext(DirectorySelectionContext);

export const DirectorySelectionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedItems, setSelectedItems] =
    useLocalStorage<DirectorySelectionState>(
      'directorySelection',
      defaultContext,
    );
  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  const clearAllSelectedItems = useCallback(() => {
    setSelectedItems(defaultContext);
  }, [setSelectedItems]);

  useEffect(() => {
    if (pathname !== previousPathname && !pathname.includes('directory')) {
      clearAllSelectedItems();
    }
  }, [clearAllSelectedItems, pathname, previousPathname]);

  const selectInternalContact = (item: PersonContact) => {
    const selectedInternalContacts = selectedItems.internal;
    if (selectedInternalContacts.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        internal: selectedInternalContacts.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        internal: [...selectedInternalContacts, item],
      });
    }
  };

  const isAllInternalContactsSelected = (items: PersonContact[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.internal.find((it) => it.id === item.id),
      true,
    );

  const toggleAllInternalContacts = (items: PersonContact[]) => {
    const selectedInternalContacts = selectedItems.internal;
    const filteredInternalContacts = selectedInternalContacts.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllInternalContactsSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        internal: filteredInternalContacts,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        internal: [...filteredInternalContacts, ...items],
      });
    }
  };

  const selectCustomer = (item: Customer) => {
    const selectedCustomers = selectedItems.customers;
    if (selectedCustomers.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        customers: selectedCustomers.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        customers: [
          ...selectedCustomers,
          {
            ...item,
            selectedContacts:
              item.personContactsByCustomerPersonContactCustomerIdAndPersonContactId.nodes.filter(
                (contact) => contact?.isPrimary,
              ) as PersonContact[],
          },
        ],
      });
    }
  };

  const isAllCustomersSelected = (items: Customer[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.customers.find((it) => it.id === item.id),
      true,
    );

  const toggleAllCustomers = (items: Customer[]) => {
    const selectedCustomers = selectedItems.customers;
    const filteredCustomers = selectedCustomers.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllCustomersSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        customers: filteredCustomers,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        customers: [
          ...filteredCustomers,
          ...items.map((item) => ({
            ...item,
            selectedContacts: item
              .personContactsByCustomerPersonContactCustomerIdAndPersonContactId
              .nodes as PersonContact[],
          })),
        ],
      });
    }
  };

  const selectShipper = (item: Shipper) => {
    const selectedShippers = selectedItems.shippers;
    if (selectedShippers.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        shippers: selectedShippers.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        shippers: [
          ...selectedShippers,
          {
            ...item,
            selectedContacts:
              item.personContactsByShipperPersonContactShipperIdAndPersonContactId.nodes.filter(
                (contact) => contact?.isPrimary,
              ) as PersonContact[],
          },
        ],
      });
    }
  };

  const isAllShippersSelected = (items: Shipper[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.shippers.find((it) => it.id === item.id),
      true,
    );

  const toggleAllShippers = (items: Shipper[]) => {
    const selectedShippers = selectedItems.shippers;
    const filteredShippers = selectedShippers.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllShippersSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        shippers: filteredShippers,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        shippers: [
          ...filteredShippers,
          ...items.map((item) => ({
            ...item,
            selectedContacts: item
              .personContactsByShipperPersonContactShipperIdAndPersonContactId
              .nodes as PersonContact[],
          })),
        ],
      });
    }
  };

  const selectWarehouse = (item: Warehouse) => {
    const selectedWarehouses = selectedItems.warehouses;
    if (selectedWarehouses.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        warehouses: selectedWarehouses.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        warehouses: [
          ...selectedWarehouses,
          {
            ...item,
            selectedContacts:
              item.personContactsByWarehousePersonContactWarehouseIdAndPersonContactId.nodes.filter(
                (contact) => contact?.isPrimary,
              ) as PersonContact[],
          },
        ],
      });
    }
  };

  const isAllWarehousesSelected = (items: Warehouse[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.warehouses.find((it) => it.id === item.id),
      true,
    );

  const toggleAllWarehouses = (items: Warehouse[]) => {
    const selectedWarehouses = selectedItems.warehouses;
    const filteredWarehouses = selectedWarehouses.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllWarehousesSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        warehouses: filteredWarehouses,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        warehouses: [
          ...filteredWarehouses,
          ...items.map((item) => ({
            ...item,
            selectedContacts: item
              .personContactsByWarehousePersonContactWarehouseIdAndPersonContactId
              .nodes as PersonContact[],
          })),
        ],
      });
    }
  };

  const selectGroup = (item: ContactGroup) => {
    const selectedGroups = selectedItems.groups;
    if (selectedGroups.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        groups: selectedGroups.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        groups: [
          ...selectedGroups,
          {
            ...item,
            selectedContacts: item
              .personContactsByContactGroupPersonContactGroupIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const isAllGroupsSelected = (items: ContactGroup[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.groups.find((it) => it.id === item.id),
      true,
    );

  const toggleAllGroups = (items: ContactGroup[]) => {
    const selectedGroups = selectedItems.groups;
    const filteredGroups = selectedGroups.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllGroupsSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        groups: filteredGroups,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        groups: [
          ...filteredGroups,
          ...items.map((item) => ({
            ...item,
            selectedContacts: item
              .personContactsByContactGroupPersonContactGroupIdAndPersonContactId
              .nodes as PersonContact[],
          })),
        ],
      });
    }
  };

  const selectCustomerPersonContact =
    (customer: Customer) => (item: PersonContact) => {
      const selectedCustomer = selectedItems.customers.find(
        (c) => c.id === customer.id,
      );
      if (selectedCustomer) {
        if (selectedCustomer.selectedContacts.find((it) => it.id === item.id)) {
          const newCustomerContacts = selectedCustomer.selectedContacts.filter(
            (it) => it.id !== item.id,
          );
          if (newCustomerContacts.length === 0) {
            setSelectedItems({
              ...selectedItems,
              customers: selectedItems.customers.filter(
                (c) => c.id !== customer.id,
              ),
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              customers: selectedItems.customers.map((c) =>
                c.id === customer.id
                  ? {
                      ...c,
                      selectedContacts: newCustomerContacts,
                    }
                  : c,
              ),
            });
          }
        } else {
          setSelectedItems({
            ...selectedItems,
            customers: selectedItems.customers.map((c) =>
              c.id === customer.id
                ? {
                    ...c,
                    selectedContacts: [
                      ...selectedCustomer.selectedContacts,
                      item,
                    ],
                  }
                : c,
            ),
          });
        }
      } else {
        setSelectedItems({
          ...selectedItems,
          customers: [
            ...selectedItems.customers,
            {
              ...customer,
              selectedContacts: [item],
            },
          ],
        });
      }
    };

  const isAllCustomerPersonContactsSelected = (customer: Customer) => {
    const selectedCustomer = selectedItems.customers.find(
      (c) => c.id === customer.id,
    );
    return selectedCustomer
      ? customer.personContactsByCustomerPersonContactCustomerIdAndPersonContactId.nodes.reduce(
          (acc, item) =>
            acc &&
            !!item &&
            !!selectedCustomer.selectedContacts.find((it) => it.id === item.id),
          true,
        )
      : false;
  };

  const toggleAllCustomerPersonContacts = (customer: Customer) => {
    const selectedCustomer = selectedItems.customers.find(
      (c) => c.id === customer.id,
    );
    if (selectedCustomer) {
      if (isAllCustomerPersonContactsSelected(customer)) {
        setSelectedItems({
          ...selectedItems,
          customers: selectedItems.customers.filter(
            (c) => c.id !== customer.id,
          ),
        });
      } else {
        setSelectedItems({
          ...selectedItems,
          customers: selectedItems.customers.map((c) =>
            c.id === customer.id
              ? {
                  ...c,
                  selectedContacts: customer
                    .personContactsByCustomerPersonContactCustomerIdAndPersonContactId
                    .nodes as PersonContact[],
                }
              : c,
          ),
        });
      }
    } else {
      setSelectedItems({
        ...selectedItems,
        customers: [
          ...selectedItems.customers,
          {
            ...customer,
            selectedContacts: customer
              .personContactsByCustomerPersonContactCustomerIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const removeSelectedContactsFromCustomer = (
    contactsToRemove: PersonContact[],
    customerId: string,
  ) => {
    const selectedCustomer = selectedItems.customers.find(
      (c) => c.id === customerId,
    );
    if (selectedCustomer) {
      const newSelectedContacts = selectedCustomer.selectedContacts.filter(
        (c) => !pluck('id', contactsToRemove).includes(c.id),
      );
      const filteredCustomers = selectedItems.customers.filter(
        (c) => c.id !== selectedCustomer.id,
      );
      const newCustomers = isEmpty(newSelectedContacts)
        ? filteredCustomers
        : [
            ...filteredCustomers,
            {
              ...selectedCustomer,
              selectedContacts: newSelectedContacts,
            },
          ];
      setSelectedItems({
        ...selectedItems,
        customers: newCustomers,
      });
    }
  };

  const selectShipperPersonContact =
    (shipper: Shipper) => (item: PersonContact) => {
      const selectedShipper = selectedItems.shippers.find(
        (c) => c.id === shipper.id,
      );
      if (selectedShipper) {
        if (selectedShipper.selectedContacts.find((it) => it.id === item.id)) {
          const newShipperContacts = selectedShipper.selectedContacts.filter(
            (it) => it.id !== item.id,
          );
          if (newShipperContacts.length === 0) {
            setSelectedItems({
              ...selectedItems,
              shippers: selectedItems.shippers.filter(
                (s) => s.id !== shipper.id,
              ),
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              shippers: selectedItems.shippers.map((s) =>
                s.id === shipper.id
                  ? {
                      ...s,
                      selectedContacts: newShipperContacts,
                    }
                  : s,
              ),
            });
          }
        } else {
          setSelectedItems({
            ...selectedItems,
            shippers: selectedItems.shippers.map((s) =>
              s.id === shipper.id
                ? {
                    ...s,
                    selectedContacts: [
                      ...selectedShipper.selectedContacts,
                      item,
                    ],
                  }
                : s,
            ),
          });
        }
      } else {
        setSelectedItems({
          ...selectedItems,
          shippers: [
            ...selectedItems.shippers,
            {
              ...shipper,
              selectedContacts: [item],
            },
          ],
        });
      }
    };

  const isAllShipperPersonContactsSelected = (shipper: Shipper) => {
    const selectedShipper = selectedItems.shippers.find(
      (s) => s.id === shipper.id,
    );
    return selectedShipper
      ? shipper.personContactsByShipperPersonContactShipperIdAndPersonContactId.nodes.reduce(
          (acc, item) =>
            acc &&
            !!item &&
            !!selectedShipper.selectedContacts.find((it) => it.id === item.id),
          true,
        )
      : false;
  };

  const toggleAllShipperPersonContacts = (shipper: Shipper) => {
    const selectedShipper = selectedItems.shippers.find(
      (s) => s.id === shipper.id,
    );
    if (selectedShipper) {
      if (isAllShipperPersonContactsSelected(shipper)) {
        setSelectedItems({
          ...selectedItems,
          shippers: selectedItems.shippers.filter((s) => s.id !== shipper.id),
        });
      } else {
        setSelectedItems({
          ...selectedItems,
          shippers: selectedItems.shippers.map((s) =>
            s.id === shipper.id
              ? {
                  ...s,
                  selectedContacts: shipper
                    .personContactsByShipperPersonContactShipperIdAndPersonContactId
                    .nodes as PersonContact[],
                }
              : s,
          ),
        });
      }
    } else {
      setSelectedItems({
        ...selectedItems,
        shippers: [
          ...selectedItems.shippers,
          {
            ...shipper,
            selectedContacts: shipper
              .personContactsByShipperPersonContactShipperIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const removeSelectedContactsFromShipper = (
    contactsToRemove: PersonContact[],
    shipperId: string,
  ) => {
    const selectedShipper = selectedItems.shippers.find(
      (s) => s.id === shipperId,
    );
    if (selectedShipper) {
      const newSelectedContacts = selectedShipper.selectedContacts.filter(
        (c) => !pluck('id', contactsToRemove).includes(c.id),
      );
      const filteredShippers = selectedItems.shippers.filter(
        (s) => s.id !== selectedShipper.id,
      );
      const newShippers = isEmpty(newSelectedContacts)
        ? filteredShippers
        : [
            ...filteredShippers,
            {
              ...selectedShipper,
              selectedContacts: newSelectedContacts,
            },
          ];
      setSelectedItems({
        ...selectedItems,
        shippers: newShippers,
      });
    }
  };

  const selectWarehousePersonContact =
    (warehouse: Warehouse) => (item: PersonContact) => {
      const selectedWarehouse = selectedItems.warehouses.find(
        (w) => w.id === warehouse.id,
      );
      if (selectedWarehouse) {
        if (
          selectedWarehouse.selectedContacts.find((it) => it.id === item.id)
        ) {
          const newWarehouseContacts =
            selectedWarehouse.selectedContacts.filter(
              (it) => it.id !== item.id,
            );
          if (newWarehouseContacts.length === 0) {
            setSelectedItems({
              ...selectedItems,
              warehouses: selectedItems.warehouses.filter(
                (w) => w.id !== warehouse.id,
              ),
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              warehouses: selectedItems.warehouses.map((w) =>
                w.id === warehouse.id
                  ? {
                      ...w,
                      selectedContacts: newWarehouseContacts,
                    }
                  : w,
              ),
            });
          }
        } else {
          setSelectedItems({
            ...selectedItems,
            warehouses: selectedItems.warehouses.map((w) =>
              w.id === warehouse.id
                ? {
                    ...w,
                    selectedContacts: [
                      ...selectedWarehouse.selectedContacts,
                      item,
                    ],
                  }
                : w,
            ),
          });
        }
      } else {
        setSelectedItems({
          ...selectedItems,
          warehouses: [
            ...selectedItems.warehouses,
            {
              ...warehouse,
              selectedContacts: [item],
            },
          ],
        });
      }
    };

  const isAllWarehousePersonContactsSelected = (warehouse: Warehouse) => {
    const selectedWarehouse = selectedItems.warehouses.find(
      (w) => w.id === warehouse.id,
    );
    return selectedWarehouse
      ? warehouse.personContactsByWarehousePersonContactWarehouseIdAndPersonContactId.nodes.reduce(
          (acc, item) =>
            acc &&
            !!item &&
            !!selectedWarehouse.selectedContacts.find(
              (it) => it.id === item.id,
            ),
          true,
        )
      : false;
  };

  const toggleAllWarehousePersonContacts = (warehouse: Warehouse) => {
    const selectedWarehouse = selectedItems.warehouses.find(
      (w) => w.id === warehouse.id,
    );
    if (selectedWarehouse) {
      if (isAllWarehousePersonContactsSelected(warehouse)) {
        setSelectedItems({
          ...selectedItems,
          warehouses: selectedItems.warehouses.filter(
            (w) => w.id !== warehouse.id,
          ),
        });
      } else {
        setSelectedItems({
          ...selectedItems,
          warehouses: selectedItems.warehouses.map((w) =>
            w.id === warehouse.id
              ? {
                  ...w,
                  selectedContacts: warehouse
                    .personContactsByWarehousePersonContactWarehouseIdAndPersonContactId
                    .nodes as PersonContact[],
                }
              : w,
          ),
        });
      }
    } else {
      setSelectedItems({
        ...selectedItems,
        warehouses: [
          ...selectedItems.warehouses,
          {
            ...warehouse,
            selectedContacts: warehouse
              .personContactsByWarehousePersonContactWarehouseIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const removeSelectedContactsFromWarehouse = (
    contactsToRemove: PersonContact[],
    warehouseId: string,
  ) => {
    const selectedWarehouse = selectedItems.warehouses.find(
      (w) => w.id === warehouseId,
    );
    if (selectedWarehouse) {
      const newSelectedContacts = selectedWarehouse.selectedContacts.filter(
        (c) => !pluck('id', contactsToRemove).includes(c.id),
      );
      const filteredWarehouses = selectedItems.warehouses.filter(
        (w) => w.id !== selectedWarehouse.id,
      );
      const newWarehouses = isEmpty(newSelectedContacts)
        ? filteredWarehouses
        : [
            ...filteredWarehouses,
            {
              ...selectedWarehouse,
              selectedContacts: newSelectedContacts,
            },
          ];
      setSelectedItems({
        ...selectedItems,
        warehouses: newWarehouses,
      });
    }
  };

  const selectGroupPersonContact =
    (group: ContactGroup) => (item: PersonContact) => {
      const selectedGroup = selectedItems.groups.find((a) => a.id === group.id);
      if (selectedGroup) {
        if (selectedGroup.selectedContacts.find((it) => it.id === item.id)) {
          const newGroupContacts = selectedGroup.selectedContacts.filter(
            (it) => it.id !== item.id,
          );
          if (newGroupContacts.length === 0) {
            setSelectedItems({
              ...selectedItems,
              groups: selectedItems.groups.filter((a) => a.id !== group.id),
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              groups: selectedItems.groups.map((a) =>
                a.id === group.id
                  ? {
                      ...a,
                      selectedContacts: newGroupContacts,
                    }
                  : a,
              ),
            });
          }
        } else {
          setSelectedItems({
            ...selectedItems,
            groups: selectedItems.groups.map((a) =>
              a.id === group.id
                ? {
                    ...a,
                    selectedContacts: [...selectedGroup.selectedContacts, item],
                  }
                : a,
            ),
          });
        }
      } else {
        setSelectedItems({
          ...selectedItems,
          groups: [
            ...selectedItems.groups,
            {
              ...group,
              selectedContacts: [item],
            },
          ],
        });
      }
    };

  const isAllGroupPersonContactsSelected = (group: ContactGroup) => {
    const selectedGroup = selectedItems.groups.find((a) => a.id === group.id);
    return selectedGroup
      ? group.personContactsByContactGroupPersonContactGroupIdAndPersonContactId.nodes.reduce(
          (acc, item) =>
            acc &&
            !!item &&
            !!selectedGroup.selectedContacts.find((it) => it.id === item.id),
          true,
        )
      : false;
  };

  const toggleAllGroupPersonContacts = (group: ContactGroup) => {
    const selectedGroup = selectedItems.groups.find((a) => a.id === group.id);
    if (selectedGroup) {
      if (isAllGroupPersonContactsSelected(group)) {
        setSelectedItems({
          ...selectedItems,
          groups: selectedItems.groups.filter((a) => a.id !== group.id),
        });
      } else {
        setSelectedItems({
          ...selectedItems,
          groups: selectedItems.groups.map((a) =>
            a.id === group.id
              ? {
                  ...a,
                  selectedContacts: group
                    .personContactsByContactGroupPersonContactGroupIdAndPersonContactId
                    .nodes as PersonContact[],
                }
              : a,
          ),
        });
      }
    } else {
      setSelectedItems({
        ...selectedItems,
        groups: [
          ...selectedItems.groups,
          {
            ...group,
            selectedContacts: group
              .personContactsByContactGroupPersonContactGroupIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const removeSelectedContactsFromGroup = (
    contactsToRemove: PersonContact[],
    groupId: string,
  ) => {
    const selectedGroup = selectedItems.groups.find((a) => a.id === groupId);
    if (selectedGroup) {
      const newSelectedContacts = selectedGroup.selectedContacts.filter(
        (a) => !pluck('id', contactsToRemove).includes(a.id),
      );
      const filteredGroups = selectedItems.groups.filter(
        (a) => a.id !== selectedGroup.id,
      );
      const newGroups = isEmpty(newSelectedContacts)
        ? filteredGroups
        : [
            ...filteredGroups,
            {
              ...selectedGroup,
              selectedContacts: newSelectedContacts,
            },
          ];
      setSelectedItems({
        ...selectedItems,
        groups: newGroups,
      });
    }
  };

  return (
    <DirectorySelectionContext.Provider
      children={children}
      value={[
        selectedItems,
        {
          clearAllSelectedItems,
          selectInternalContact,
          isAllInternalContactsSelected,
          toggleAllInternalContacts,
          selectCustomer,
          selectCustomerPersonContact,
          isAllCustomersSelected,
          isAllCustomerPersonContactsSelected,
          toggleAllCustomers,
          toggleAllCustomerPersonContacts,
          removeSelectedContactsFromCustomer,
          selectShipper,
          selectShipperPersonContact,
          isAllShippersSelected,
          isAllShipperPersonContactsSelected,
          toggleAllShippers,
          toggleAllShipperPersonContacts,
          removeSelectedContactsFromShipper,
          selectWarehouse,
          selectWarehousePersonContact,
          isAllWarehousesSelected,
          isAllWarehousePersonContactsSelected,
          toggleAllWarehouses,
          toggleAllWarehousePersonContacts,
          removeSelectedContactsFromWarehouse,
          selectGroup,
          selectGroupPersonContact,
          isAllGroupsSelected,
          isAllGroupPersonContactsSelected,
          toggleAllGroups,
          toggleAllGroupPersonContacts,
          removeSelectedContactsFromGroup,
        },
      ]}
    />
  );
};
