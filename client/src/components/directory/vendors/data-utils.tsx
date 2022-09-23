import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Vendor } from 'types';
import ty from 'ui/typography';

export type VendorLabelInfo = LabelInfo<Vendor>;

export const listLabels: VendorLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vendorName',
    label: 'Vendor Name',
    sortable: true,
  },
  {
    key: 'vendorType',
    label: 'Vendor Type',
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
];

export const baseLabels: (params: {
  isShipper: boolean;
  isCustomer: boolean;
  isWarehouse: boolean;
}) => VendorLabelInfo[] = ({ isShipper, isCustomer, isWarehouse }) => [
  {
    key: 'id',
    label: 'ID',
    readOnly: true,
  },
  {
    key: 'vendorName',
    label: 'Vendor Name',
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
  {
    key: 'attention',
    label: 'Attention',
  },
  {
    key: 'vendorType',
    label: 'Vendor Type',
  },
  {
    key: 'address1',
    label: 'Address 1',
  },
  {
    key: 'address2',
    label: 'Address 2',
  },
  {
    key: 'city',
    label: 'City',
  },
  {
    key: 'postalState',
    label: 'State',
  },
  {
    key: 'zipCode',
    label: 'Zip Code',
  },
  {
    key: 'ledgerCode',
    label: 'Ledger Code',
  },
  {
    key: 'bankCode',
    label: 'Bank Code',
  },
  {
    key: 'has1099',
    label: 'Has 1099?',
  },
  {
    key: 'id1099',
    label: '1099 ID',
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) => (
      <ty.BodyText>{data.country?.countryName || ''}</ty.BodyText>
    ),
    readOnly: true,
  },
  ...((isShipper
    ? [
        {
          key: 'shipper',
          label: 'Shipper',
          getValue: ({ shipper }) =>
            shipper ? (
              <ty.LinkText
                hover="false"
                to={`/directory/shippers/${shipper.id}`}
              >
                {shipper.id}
              </ty.LinkText>
            ) : (
              '-'
            ),
          readOnly: true,
        },
      ]
    : []) as VendorLabelInfo[]),
  ...((isCustomer
    ? [
        {
          key: 'customer',
          label: 'Customer',
          getValue: ({ customer }) =>
            customer ? (
              <ty.LinkText
                hover="false"
                to={`/directory/customers/${customer.id}`}
              >
                {customer.id}
              </ty.LinkText>
            ) : (
              '-'
            ),
          readOnly: true,
        },
      ]
    : []) as VendorLabelInfo[]),
  ...((isWarehouse
    ? [
        {
          key: 'warehouse',
          label: 'Warehouse',
          getValue: ({ warehouse }) =>
            warehouse ? (
              <ty.LinkText
                hover="false"
                to={`/directory/warehouses/${warehouse.id}`}
              >
                {warehouse.id}
              </ty.LinkText>
            ) : (
              '-'
            ),
          readOnly: true,
        },
      ]
    : []) as VendorLabelInfo[]),
  {
    key: 'isTemp',
    label: 'Temp?',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
