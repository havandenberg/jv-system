import React, { Fragment, useEffect, useState } from 'react';
import { sortBy, prop, equals } from 'ramda';

import api from 'api';
import RemoveImg from 'assets/images/remove';
import useItemSelector from 'components/item-selector';
import usePrevious from 'hooks/use-previous';
import { Customer, Maybe, Shipper, Vendor, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const CompanyContent = <T extends { id: string }>({
  allItems,
  baseTo,
  editing,
  label,
  nameKey,
  setAdditionalItems,
}: {
  allItems: T[];
  baseTo?: string;
  editing: boolean;
  label: string;
  nameKey: keyof T;
  setAdditionalItems: (items: T[]) => void;
}) => (
  <>
    {allItems.map((it, idx) => (
      <Fragment key={idx}>
        {idx === 0 ? (
          <ty.BodyText>
            {label}
            {allItems.length > 1 ? 's' : ''}:{' '}
          </ty.BodyText>
        ) : (
          <div />
        )}
        <l.Flex alignCenter>
          {baseTo && !editing ? (
            <ty.LinkText mr={th.spacing.sm} to={`${baseTo}/${it.id}`}>
              <ty.Span bold>{it[nameKey]}</ty.Span> ({it.id})
            </ty.LinkText>
          ) : (
            <ty.BodyText mr={th.spacing.sm}>
              <ty.Span bold>{it[nameKey]}</ty.Span> ({it.id})
            </ty.BodyText>
          )}
          {editing && idx > 0 && (
            <l.Div
              cursor="pointer"
              height={th.sizes.xs}
              onClick={() => {
                setAdditionalItems(
                  allItems.slice(1).filter((i) => i.id !== it.id),
                );
              }}
            >
              <RemoveImg height={th.sizes.xs} width={th.sizes.xs} />
            </l.Div>
          )}
        </l.Flex>
      </Fragment>
    ))}
  </>
);

interface Props {
  customer?: Maybe<Customer>;
  defaultAdditionalCustomers?: Customer[];
  defaultAdditionalShippers?: Shipper[];
  defaultAdditionalWarehouses?: Warehouse[];
  defaultAdditionalVendors?: Vendor[];
  editing: boolean;
  shipper?: Maybe<Shipper>;
  warehouse?: Maybe<Warehouse>;
  vendor?: Maybe<Vendor>;
}

const useContactCompanyInfo = ({
  customer,
  defaultAdditionalCustomers = [],
  editing,
  shipper,
  defaultAdditionalShippers = [],
  warehouse,
  defaultAdditionalWarehouses = [],
  vendor,
  defaultAdditionalVendors = [],
}: Props) => {
  const previousDefaultAdditionalCustomers = usePrevious(
    defaultAdditionalCustomers,
  );
  const previousDefaultAdditionalShippers = usePrevious(
    defaultAdditionalShippers,
  );
  const previousDefaultAdditionalWarehouses = usePrevious(
    defaultAdditionalWarehouses,
  );
  const previousDefaultAdditionalVendors = usePrevious(
    defaultAdditionalVendors,
  );
  const [additionalCustomers, setAdditionalCustomers] = useState<Customer[]>(
    defaultAdditionalCustomers,
  );
  const [additionalShippers, setAdditionalShippers] = useState<Shipper[]>(
    defaultAdditionalShippers,
  );
  const [additionalWarehouses, setAdditionalWarehouses] = useState<Warehouse[]>(
    defaultAdditionalWarehouses,
  );
  const [additionalVendors, setAdditionalVendors] = useState<Vendor[]>(
    defaultAdditionalVendors,
  );
  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers();
  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers();
  const {
    data: warehouseData,
    loading: warehouseDataLoading,
    error: warehouseDataError,
  } = api.useWarehouses();
  const {
    data: vendorData,
    loading: vendorDataLoading,
    error: vendorDataError,
  } = api.useVendors();
  const allCustomers = customer
    ? [customer, ...sortBy(prop('customerName'), additionalCustomers)]
    : [];
  const allShippers = shipper
    ? [shipper, ...sortBy(prop('shipperName'), additionalShippers)]
    : [];
  const allWarehouses = warehouse
    ? [warehouse, ...sortBy(prop('warehouseName'), additionalWarehouses)]
    : [];
  const allVendors = vendor
    ? [vendor, ...sortBy(prop('vendorName'), additionalVendors)]
    : [];

  const { ItemSelector: CustomerItemSelector } = useItemSelector<Customer>({
    selectItem: (c) => {
      setAdditionalCustomers([...additionalCustomers, c]);
    },
    allItems: () => (customerData ? customerData.nodes : []) as Customer[],
    excludedItems: allCustomers,
    error: customerDataError,
    errorLabel: 'customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    searchParamName: 'customerSearch',
    placeholder: 'Add customers',
    width: 350,
  });

  const { ItemSelector: ShipperItemSelector } = useItemSelector<Shipper>({
    selectItem: (s) => {
      setAdditionalShippers([...additionalShippers, s]);
    },
    allItems: () => (shipperData ? shipperData.nodes : []) as Shipper[],
    excludedItems: allShippers,
    error: shipperDataError,
    errorLabel: 'shippers',
    loading: shipperDataLoading,
    nameKey: 'shipperName',
    placeholder: 'Add shippers',
    searchParamName: 'shipperSearch',
    width: 350,
  });

  const { ItemSelector: WarehouseItemSelector } = useItemSelector<Warehouse>({
    selectItem: (w) => {
      setAdditionalWarehouses([...additionalWarehouses, w]);
    },
    allItems: () => (warehouseData ? warehouseData.nodes : []) as Warehouse[],
    excludedItems: allWarehouses,
    error: warehouseDataError,
    errorLabel: 'warehouses',
    loading: warehouseDataLoading,
    nameKey: 'warehouseName',
    placeholder: 'Add warehouses',
    searchParamName: 'warehouseSearch',
    width: 350,
  });

  const { ItemSelector: VendorItemSelector } = useItemSelector<Vendor>({
    selectItem: (w) => {
      setAdditionalVendors([...additionalVendors, w]);
    },
    allItems: () => (vendorData ? vendorData.nodes : []) as Vendor[],
    excludedItems: allVendors,
    error: vendorDataError,
    errorLabel: 'vendors',
    loading: vendorDataLoading,
    nameKey: 'vendorName',
    placeholder: 'Add vendors',
    searchParamName: 'vendorSearch',
    width: 350,
  });

  const handleReset = () => {
    setAdditionalCustomers(defaultAdditionalCustomers);
    setAdditionalShippers(defaultAdditionalShippers);
    setAdditionalWarehouses(defaultAdditionalWarehouses);
    setAdditionalVendors(defaultAdditionalVendors);
  };

  useEffect(() => {
    if (
      !equals(previousDefaultAdditionalCustomers, defaultAdditionalCustomers)
    ) {
      setAdditionalCustomers(defaultAdditionalCustomers);
    }
  }, [defaultAdditionalCustomers, previousDefaultAdditionalCustomers]);

  useEffect(() => {
    if (!equals(previousDefaultAdditionalShippers, defaultAdditionalShippers)) {
      setAdditionalShippers(defaultAdditionalShippers);
    }
  }, [defaultAdditionalShippers, previousDefaultAdditionalShippers]);

  useEffect(() => {
    if (
      !equals(previousDefaultAdditionalWarehouses, defaultAdditionalWarehouses)
    ) {
      setAdditionalWarehouses(defaultAdditionalWarehouses);
    }
  }, [defaultAdditionalWarehouses, previousDefaultAdditionalWarehouses]);

  useEffect(() => {
    if (!equals(previousDefaultAdditionalVendors, defaultAdditionalVendors)) {
      setAdditionalVendors(defaultAdditionalVendors);
    }
  }, [defaultAdditionalVendors, previousDefaultAdditionalVendors]);

  const customerInfo = customer && (
    <>
      <l.Grid gridTemplateColumns="120px 1fr">
        <CompanyContent
          allItems={allCustomers}
          baseTo="/directory/customers"
          editing={editing}
          label="Customer"
          nameKey="customerName"
          setAdditionalItems={setAdditionalCustomers}
        />
        {editing && (
          <>
            <div />
            <l.Flex pt={th.spacing.sm}>{CustomerItemSelector}</l.Flex>
          </>
        )}
      </l.Grid>
    </>
  );
  const shipperInfo = shipper && (
    <l.Grid gridTemplateColumns="120px 1fr">
      <CompanyContent
        allItems={allShippers}
        baseTo="/directory/shippers"
        editing={editing}
        label="Shipper"
        nameKey="shipperName"
        setAdditionalItems={setAdditionalShippers}
      />
      {editing && (
        <>
          <div />
          <l.Flex pt={th.spacing.sm}>{ShipperItemSelector}</l.Flex>
        </>
      )}
    </l.Grid>
  );
  const warehouseInfo = warehouse && (
    <l.Grid gridTemplateColumns="120px 1fr">
      <CompanyContent
        allItems={allWarehouses}
        baseTo="/directory/warehouses"
        editing={editing}
        label="Warehouse"
        nameKey="warehouseName"
        setAdditionalItems={setAdditionalWarehouses}
      />
      {editing && (
        <>
          <div />
          <l.Flex pt={th.spacing.sm}>{WarehouseItemSelector}</l.Flex>
        </>
      )}
    </l.Grid>
  );
  const vendorInfo = vendor && (
    <l.Grid gridTemplateColumns="120px 1fr">
      <CompanyContent
        allItems={allVendors}
        baseTo="/directory/vendors"
        editing={editing}
        label="Vendor"
        nameKey="vendorName"
        setAdditionalItems={setAdditionalVendors}
      />
      {editing && (
        <>
          <div />
          <l.Flex pt={th.spacing.sm}>{VendorItemSelector}</l.Flex>
        </>
      )}
    </l.Grid>
  );

  const info = !!customer
    ? customerInfo
    : !!shipper
    ? shipperInfo
    : !!warehouse
    ? warehouseInfo
    : !!vendor
    ? vendorInfo
    : null;

  return {
    allCustomers,
    allShippers,
    allWarehouses,
    allVendors,
    info,
    handleReset,
  };
};

export default useContactCompanyInfo;
