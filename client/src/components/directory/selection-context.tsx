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
  ContactAlias,
  Customer,
  PersonContact,
  Shipper,
  Warehouse,
} from 'types';

interface SelectedAlias extends ContactAlias {
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
  aliases: SelectedAlias[];
  customers: SelectedCustomer[];
  internal: PersonContact[];
  shippers: SelectedShipper[];
  warehouses: SelectedWarehouse[];
}

const defaultContext = {
  aliases: [],
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
    selectAlias: () => {},
    selectAliasPersonContact: () => {},
    isAllAliasesSelected: () => {},
    isAllAliasPersonContactsSelected: () => {},
    toggleAllAliases: () => {},
    toggleAllAliasPersonContacts: () => {},
    removeSelectedContactsFromAlias: () => {},
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
            selectedContacts: item.personContacts.nodes.filter(
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
            selectedContacts: item.personContacts.nodes as PersonContact[],
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
            selectedContacts: item.personContacts.nodes.filter(
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
            selectedContacts: item.personContacts.nodes as PersonContact[],
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
            selectedContacts: item.personContacts.nodes.filter(
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
            selectedContacts: item.personContacts.nodes as PersonContact[],
          })),
        ],
      });
    }
  };

  const selectAlias = (item: ContactAlias) => {
    const selectedAliases = selectedItems.aliases;
    if (selectedAliases.find((it) => it.id === item.id)) {
      setSelectedItems({
        ...selectedItems,
        aliases: selectedAliases.filter((it) => it.id !== item.id),
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        aliases: [
          ...selectedAliases,
          {
            ...item,
            selectedContacts: item
              .personContactsByContactAliasPersonContactAliasIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const isAllAliasesSelected = (items: ContactAlias[]) =>
    items.reduce(
      (acc, item) =>
        acc && !!selectedItems.aliases.find((it) => it.id === item.id),
      true,
    );

  const toggleAllAliases = (items: ContactAlias[]) => {
    const selectedAliases = selectedItems.aliases;
    const filteredAliases = selectedAliases.filter(
      (it) => !pluck('id', items).includes(it.id),
    );
    if (isAllAliasesSelected(items)) {
      setSelectedItems({
        ...selectedItems,
        aliases: filteredAliases,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        aliases: [
          ...filteredAliases,
          ...items.map((item) => ({
            ...item,
            selectedContacts: item
              .personContactsByContactAliasPersonContactAliasIdAndPersonContactId
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
      ? customer.personContacts.nodes.reduce(
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
                  selectedContacts: customer.personContacts
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
            selectedContacts: customer.personContacts.nodes as PersonContact[],
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
      ? shipper.personContacts.nodes.reduce(
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
                  selectedContacts: shipper.personContacts
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
            selectedContacts: shipper.personContacts.nodes as PersonContact[],
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
      ? warehouse.personContacts.nodes.reduce(
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
                  selectedContacts: warehouse.personContacts
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
            selectedContacts: warehouse.personContacts.nodes as PersonContact[],
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

  const selectAliasPersonContact =
    (alias: ContactAlias) => (item: PersonContact) => {
      const selectedAlias = selectedItems.aliases.find(
        (a) => a.id === alias.id,
      );
      if (selectedAlias) {
        if (selectedAlias.selectedContacts.find((it) => it.id === item.id)) {
          const newAliasContacts = selectedAlias.selectedContacts.filter(
            (it) => it.id !== item.id,
          );
          if (newAliasContacts.length === 0) {
            setSelectedItems({
              ...selectedItems,
              aliases: selectedItems.aliases.filter((a) => a.id !== alias.id),
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              aliases: selectedItems.aliases.map((a) =>
                a.id === alias.id
                  ? {
                      ...a,
                      selectedContacts: newAliasContacts,
                    }
                  : a,
              ),
            });
          }
        } else {
          setSelectedItems({
            ...selectedItems,
            aliases: selectedItems.aliases.map((a) =>
              a.id === alias.id
                ? {
                    ...a,
                    selectedContacts: [...selectedAlias.selectedContacts, item],
                  }
                : a,
            ),
          });
        }
      } else {
        setSelectedItems({
          ...selectedItems,
          aliases: [
            ...selectedItems.aliases,
            {
              ...alias,
              selectedContacts: [item],
            },
          ],
        });
      }
    };

  const isAllAliasPersonContactsSelected = (alias: ContactAlias) => {
    const selectedAlias = selectedItems.aliases.find((a) => a.id === alias.id);
    return selectedAlias
      ? alias.personContactsByContactAliasPersonContactAliasIdAndPersonContactId.nodes.reduce(
          (acc, item) =>
            acc &&
            !!item &&
            !!selectedAlias.selectedContacts.find((it) => it.id === item.id),
          true,
        )
      : false;
  };

  const toggleAllAliasPersonContacts = (alias: ContactAlias) => {
    const selectedAlias = selectedItems.aliases.find((a) => a.id === alias.id);
    if (selectedAlias) {
      if (isAllAliasPersonContactsSelected(alias)) {
        setSelectedItems({
          ...selectedItems,
          aliases: selectedItems.aliases.filter((a) => a.id !== alias.id),
        });
      } else {
        setSelectedItems({
          ...selectedItems,
          aliases: selectedItems.aliases.map((a) =>
            a.id === alias.id
              ? {
                  ...a,
                  selectedContacts: alias
                    .personContactsByContactAliasPersonContactAliasIdAndPersonContactId
                    .nodes as PersonContact[],
                }
              : a,
          ),
        });
      }
    } else {
      setSelectedItems({
        ...selectedItems,
        aliases: [
          ...selectedItems.aliases,
          {
            ...alias,
            selectedContacts: alias
              .personContactsByContactAliasPersonContactAliasIdAndPersonContactId
              .nodes as PersonContact[],
          },
        ],
      });
    }
  };

  const removeSelectedContactsFromAlias = (
    contactsToRemove: PersonContact[],
    aliasId: string,
  ) => {
    const selectedAlias = selectedItems.aliases.find((a) => a.id === aliasId);
    if (selectedAlias) {
      const newSelectedContacts = selectedAlias.selectedContacts.filter(
        (a) => !pluck('id', contactsToRemove).includes(a.id),
      );
      const filteredAliases = selectedItems.aliases.filter(
        (a) => a.id !== selectedAlias.id,
      );
      const newAliases = isEmpty(newSelectedContacts)
        ? filteredAliases
        : [
            ...filteredAliases,
            {
              ...selectedAlias,
              selectedContacts: newSelectedContacts,
            },
          ];
      setSelectedItems({
        ...selectedItems,
        aliases: newAliases,
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
          selectAlias,
          selectAliasPersonContact,
          isAllAliasesSelected,
          isAllAliasPersonContactsSelected,
          toggleAllAliases,
          toggleAllAliasPersonContacts,
          removeSelectedContactsFromAlias,
        },
      ]}
    />
  );
};
