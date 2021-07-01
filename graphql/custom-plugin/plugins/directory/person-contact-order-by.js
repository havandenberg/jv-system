const {
  makeAddPgTableOrderByPlugin,
  orderByAscDesc,
} = require('graphile-utils');

const CustomerPersonContactOrderByPlugin = makeAddPgTableOrderByPlugin(
  'directory',
  'person_contact',
  ({ pgSql: sql }) => {
    const customer = sql.identifier(Symbol('customer'));
    const customerPersonContact = sql.identifier(
      Symbol('customerPersonContact'),
    );
    return orderByAscDesc(
      'CUSTOMERS_BY_CUSTOMER_PERSON_CONTACT_PERSON_CONTACT_ID_AND_CUSTOMER_ID',
      ({ queryBuilder }) => sql.fragment`(
        SELECT ${customer}.customer_name
        FROM directory.customer AS ${customer}
        LEFT JOIN directory.customer_person_contact AS ${customerPersonContact}
        ON ${customer}.id = ${customerPersonContact}.customer_id
        WHERE ${customerPersonContact}.person_contact_id = ${queryBuilder.getTableAlias()}.id
        ORDER BY ${customer}.customer_name desc
        LIMIT 1
      )`,
    );
  },
);

const ShipperPersonContactOrderByPlugin = makeAddPgTableOrderByPlugin(
  'directory',
  'person_contact',
  ({ pgSql: sql }) => {
    const shipper = sql.identifier(Symbol('shipper'));
    const shipperPersonContact = sql.identifier(Symbol('shipperPersonContact'));
    return orderByAscDesc(
      'SHIPPERS_BY_SHIPPER_PERSON_CONTACT_PERSON_CONTACT_ID_AND_SHIPPER_ID',
      ({ queryBuilder }) => sql.fragment`(
        SELECT ${shipper}.shipper_name
        FROM directory.shipper AS ${shipper}
        LEFT JOIN directory.shipper_person_contact AS ${shipperPersonContact}
        ON ${shipper}.id = ${shipperPersonContact}.shipper_id
        WHERE ${shipperPersonContact}.person_contact_id = ${queryBuilder.getTableAlias()}.id
        ORDER BY ${shipper}.shipper_name desc
        LIMIT 1
      )`,
    );
  },
);

const WarehousePersonContactOrderByPlugin = makeAddPgTableOrderByPlugin(
  'directory',
  'person_contact',
  ({ pgSql: sql }) => {
    const warehouse = sql.identifier(Symbol('warehouse'));
    const warehousePersonContact = sql.identifier(
      Symbol('warehousePersonContact'),
    );
    return orderByAscDesc(
      'WAREHOUSES_BY_WAREHOUSE_PERSON_CONTACT_PERSON_CONTACT_ID_AND_WAREHOUSE_ID',
      ({ queryBuilder }) => sql.fragment`(
        SELECT ${warehouse}.warehouse_name
        FROM directory.warehouse AS ${warehouse}
        LEFT JOIN directory.warehouse_person_contact AS ${warehousePersonContact}
        ON ${warehouse}.id = ${warehousePersonContact}.warehouse_id
        WHERE ${warehousePersonContact}.person_contact_id = ${queryBuilder.getTableAlias()}.id
        ORDER BY ${warehouse}.warehouse_name desc
        LIMIT 1
      )`,
    );
  },
);

module.exports = {
  CustomerPersonContactOrderByPlugin,
  ShipperPersonContactOrderByPlugin,
  WarehousePersonContactOrderByPlugin,
};
