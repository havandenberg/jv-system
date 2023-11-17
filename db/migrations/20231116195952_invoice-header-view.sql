-- migrate:up
CREATE MATERIALIZED VIEW accounting.invoice_header_view (
    order_status,
    order_id,
    back_order_id,
    truck_load_id,
    ship_warehouse_id,
    invoice_id,
    billing_customer_id,
    sales_user_code,
    customer_po,
    invoice_date,
    shipping_customer_id,
    order_date,
    entry_date,
    actual_ship_date,
    expected_ship_date,
    amount_owed,
    paid_code,
    load_location,
    vendor_id,
    load_status,
    fob,
    register_number,
    delivery_zone
) as (
    select "STATA",
        "ORD#A",
        "BONBRA",
        "LOAD#A",
        "PWHSEA",
        "INV#A",
        "CUSTA",
        "SLSMCA",
        "CPO#A",
        parse_date("INVDDA", "INVMMA", "INVYYA"),
        "SHP#A",
        parse_date("CORDDA", "CORMMA", "CORYYA"),
        parse_date("ENTDDA", "ENTMMA", "ENTYYA"),
        parse_date("ASPDDA", "ASPMMA", "ASPYYA"),
        parse_date("SHPDDA", "SHPMMA", "SHPYYA"),
        "INV$A",
        "PAIDA",
        "LDLOCA",
        "TRKIDA",
        "LDSTSA",
        "FOBA",
        "REG#A",
        "DLZNA"
    from db2_JVFIL."ORDP900A"
);
-- migrate:down
DROP MATERIALIZED VIEW accounting.invoice_header_view;