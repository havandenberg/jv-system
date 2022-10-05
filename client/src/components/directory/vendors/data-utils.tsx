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
    filterable: true,
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
    readOnly: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
    readOnly: true,
  },
  {
    key: 'attention',
    label: 'Attention',
    readOnly: true,
  },
  {
    key: 'vendorType',
    label: 'Vendor Type',
    readOnly: true,
  },
  {
    key: 'address1',
    label: 'Address 1',
    readOnly: true,
  },
  {
    key: 'address2',
    label: 'Address 2',
    readOnly: true,
  },
  {
    key: 'city',
    label: 'City',
    readOnly: true,
  },
  {
    key: 'postalState',
    label: 'State',
    readOnly: true,
  },
  {
    key: 'zipCode',
    label: 'Zip Code',
    readOnly: true,
  },
  {
    key: 'ledgerCode',
    label: 'Ledger Code',
    readOnly: true,
  },
  {
    key: 'bankCode',
    label: 'Bank Code',
    readOnly: true,
  },
  {
    key: 'has1099',
    label: 'Has 1099?',
    readOnly: true,
  },
  {
    key: 'id1099',
    label: '1099 ID',
    readOnly: true,
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
    readOnly: true,
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
