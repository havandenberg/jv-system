
# Vessel Control Query

frontend makes the query `VESSEL_CONTROL_LIST`

[accounting/vessel-control/list.gql](/client/src/api/accounting/vessel-control/list.gql)

![vessel control data model](/docs/jv-systems-vessel-controll-datamodel.png)

Two inputs are passed to these collections.
```gql
  vesselControls(filter: $vesselControlFilter) {
```
```gql
      unpaids(filter: $unpaidFilter) {
```

> Question:
> does postgraphile provide all collections with filter arguments?

## Vessel Control and Unpaids

vessel control and unpaid tables


```sql
CREATE TABLE accounting.vessel_control (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  shipper_id TEXT NOT NULL,
  approval_1 BOOLEAN,
  approval_2 BOOLEAN,
  date_sent DATE,
  is_liquidated BOOLEAN,
  notes_1 TEXT,
  notes_2 TEXT
);

CREATE INDEX ON accounting.vessel_control (vessel_code, shipper_id, is_liquidated);

CREATE TABLE accounting.unpaid (
  id BIGSERIAL PRIMARY KEY,
  vessel_code TEXT NOT NULL,
  shipper_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  is_urgent BOOLEAN,
  is_approved BOOLEAN,
  notes TEXT
);

```

# Building Vessel Controls

Building Vessel Controls is based off of the current vessel controls. Where the current set is based off of the previous set.

> Question:
> Do we need recursive queries?

```gql
const ALL_VESSEL_CONTROLS = gql`
  query ALL_VESSEL_CONTROLS {
    allVesselControls {
      nodes {
```

the top level `allVesselControls` collection is defined by the sql function

```sql
CREATE FUNCTION accounting.all_vessel_controls()
  RETURNS setof accounting.vessel_control
  LANGUAGE 'sql'
  STABLE
  PARALLEL UNSAFE
  COST 100
AS $BODY$
  SELECT
  COALESCE(vc.id, CONCAT(v.id, s.id)::BIGINT),
  v.vessel_code,
  s.id,
  vc.approval_1, vc.approval_2, vc.date_sent, vc.is_liquidated, vc.notes_1, vc.notes_2
  FROM product.vessel v
    LEFT JOIN product.pallet p ON p.vessel_code = v.vessel_code
    LEFT JOIN directory.shipper s ON s.id = p.shipper_id
    LEFT JOIN accounting.vessel_control vc ON vc.vessel_code = v.vessel_code AND vc.shipper_id = s.id
      WHERE v.vessel_code NOT LIKE '9%' AND v.is_pre = FALSE AND v.vessel_code NOT IN ('CCC', 'EXC', 'E23')
      GROUP BY v.id, s.id, vc.id
      ORDER BY v.discharge_date + COALESCE(s.vessel_control_days_until_due, 45)::INTEGER DESC, v.vessel_code, s.shipper_name
$BODY$;
```

> TODO: Create view that replaces this function
>
> `accounting.all_vessel_controls_view` that provides a listing of vessel controls.
> There should be only one vessel control row for each shipper/vessel where a shipper has
> at least 1 pallet on that ship
>
> ```sql
> CREATE VIEW accounting.all_vessel_controls_view (
>   id,
>   vessel_code,
>   shipper_id,
>   approval_1,
>   approval_2,
>   date_sent,
>   is_liquidated,
>   notes_1,
>   notes_2
> ) as (
>     with shipper_vessels as (
>       select shipper_id, vessel_code from product.pallet_view
>       group by shipper_id, vessel_code
>     )
>     select
>       concat(shipper_id, '.', vessel_code) as id,
>       shipper_vessels.vessel_code,
>       shipper_vessels.shipper_id,
>       vc.approval_1, vc.approval_2, vc.date_sent, vc.is_liquidated, vc.notes_1, vc.notes_2
>     from shipper_vessels
>     left join accounting.vessel_control using(shipper_id, vessel_code)
> );
```


# Connecting Vessel Controls

Postgraphile has a number of ways to discover relationships between database tables.
Normally, foreign key constraints could be used to detect relationships.
Postgraphile also supports using functions to create relationships

```sql
CREATE FUNCTION accounting.vessel_control_pallets(IN vc accounting.vessel_control)
  RETURNS setof product.pallet
  LANGUAGE 'sql'
AS $BODY$
  SELECT * FROM product.pallet p
    WHERE (SELECT v.vessel_code FROM product.vessel v WHERE v.vessel_code = p.vessel_code ORDER BY v.discharge_date DESC LIMIT 1) = vc.vessel_code
    AND p.shipper_id = vc.shipper_id;
$BODY$;

```
It is also possible to create relationships with "smart" comments
```sql
comment on view product.pallet is E'
@foreignKey (vessel_code, shipper_id) references accounting.all_vessel_controls_view (vessel_code, shipper_id)|@foreignFieldName pallets
';
```

# Invoices and Unpaids

> TODO:
> Add FDW views for invoice items
>


> Question:
>   Are invoice items connected to invoice headers?
>   Are unpaids just invoice headers with a payed? column?

