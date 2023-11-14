-- migrate:up
CREATE OR REPLACE FUNCTION parse_date(day numeric, month numeric, year numeric) returns date AS $$
SELECT case
        when day = 0
        or month = 0 then null
        else date (month || '-' || day || '-' || year)
    end $$ LANGUAGE SQL;
CREATE OR REPLACE VIEW directory.vendor_view (
        id,
        vendor_name,
        address1,
        address2,
        city,
        postal_state,
        zip_code,
        country_id,
        phone,
        attention,
        vendor_type,
        ledger_code,
        bank_code,
        has1099,
        id1099,
        is_temp
    ) as (
        select "VEND#V",
            "VNAMEV",
            "ADD1V",
            "ADD2V",
            "CITYV",
            "STATEV",
            --TODO: parse zip code?
            "ZIPCDV",
            "CNTRYV",
            --TODO: parse phone number?
            "ARECDV" || '.' || "EXCHGV" || '.' || "PHONEV",
            "ATTENV",
            "VTYPEV",
            "GLCD1V",
            "BANKV",
            "VCODEV",
            "VDESCV",
            case
                when "VTEMPV" = '' then false
                else true
            end --TODO: parse string to boolean?
        from db2_GDSSYFIL."ACPP100V"
    );
CREATE OR REPLACE VIEW product.vessel_view (
        is_pre,
        vessel_code,
        pre_vessel_code,
        vessel_name,
        arrival_port,
        country_id,
        departure_date,
        arrival_date,
        discharge_date,
        coast,
        inv_flag
    ) as (
        with vessel as (
            select false,
                "BOAT#Z",
                '',
                "BNAMEZ",
                "ARVPTZ",
                "CNTRYZ",
                parse_date("DEPDDZ", "DEPMMZ", "DEPYYZ"),
                parse_date("ARVDDZ", "ARVMMZ", "ARVYYZ"),
                parse_date("DISDDZ", "DISMMZ", "DISYYZ"),
                case
                    when "PAYTYZ" = 'W' then 'WC'
                    else 'EC'
                end,
                "INVFGZ"
            from db2_JVFIL."ORDP750Z"
        ),
        pre_vessel as (
            select true,
                "BOAT#Z",
                "BOAT#Z",
                "BNAMEZ",
                "ARVPTZ",
                "CNTRYZ",
                parse_date("DEPDDZ", "DEPMMZ", "DEPYYZ"),
                parse_date("ARVDDZ", "ARVMMZ", "ARVYYZ"),
                parse_date("DISDDZ", "DISMMZ", "DISYYZ"),
                case
                    when "PAYTYZ" = 'W' then 'WC'
                    else 'EC'
                end,
                "INVFGZ"
            from db2_JVPREFIL."ORDP750Z"
        )
        select *
        from vessel
        union
        select *
        from pre_vessel
    );
CREATE VIEW product.pallet_view (
    id,
    vessel_code,
    pallet_id,
    product_id,
    current_box_quantity,
    received_box_quantity,
    returned_box_quantity,
    location_id,
    room,
    section,
    row,
    jv_lot_number,
    shipper_id,
    date_transferred_to_storage,
    order_id,
    back_order_id,
    shipped,
    age,
    volume_discount_code,
    original_location_id,
    filler,
    grower_id,
    old_pack_code,
    pack_date,
    hatch,
    deck,
    bill_of_lading,
    container_id,
    temperature_recording
) as (
    SELECT "PID#V",
        "BOAT#V",
        "PID#V",
        "PROD#V",
        "PBOXQV",
        "RBOXQV",
        "QTYRTV",
        "PLOC#V",
        "ROOMV",
        "SECTV",
        "ROWV",
        "JVLOTV",
        "SHPR#V",
        "TRNCSV",
        "ORD#V",
        "BONBRV",
        "SHPFGV" = 'Y',
        "AGEDV",
        "VOLDCV",
        "ORGLCV",
        "FILLER",
        "GROWID",
        "PACKG",
        "PACKDT",
        "HATCH",
        "DECKS",
        "PLBOL",
        "CONTR",
        "TEMP#J"
    from db2_JVFIL."ORDP710V" as master
        left join db2_JVFIL."ORDP710J" as secondary on master."PID#V" = secondary."PALID"
);
CREATE OR REPLACE VIEW directory.shipper_view (id, shipper_name, country_id, group_id) as (
        SELECT "SHPR#K",
            "VNAMEK",
            "CNTRYK",
            "CMBK"
        from db2_JVFIL."INVP510K"
    );
CREATE OR REPLACE VIEW accounting.check_header_view (
        is_reconciled,
        check_status,
        check_number,
        vendor_id,
        remit_to_code,
        invoice_amount,
        discount_amount,
        check_amount,
        check_date,
        bank_id,
        invoice_id,
        is_void,
        entry_date
    ) as (
        select "CHKCDK" = 'V',
            "CHKSTK",
            "CHKNOK",
            trim("VEND#K"),
            "REMCDK",
            "INVAMK",
            "DSCNTK",
            "CHKAMK",
            parse_date("CHKDDK", "CHKMMK", "CHKYYK"),
            "BANK#K",
            "INVNOK",
            "VCHKCK" = '01',
            parse_date("RCDTDK", "RCDTMK", "RCDTYK")
        FROM db2_GDSAPFIL."ACPP600K"
    );
CREATE OR REPLACE VIEW accounting.expense_header_view (
        vendor_id,
        voucher_id,
        invoice_id,
        is_estimated,
        paid_code,
        receivable_cut,
        ap_hide,
        is_prorate,
        expense_amount,
        check_number,
        entry_date,
        expense_code,
        truck_load_id,
        vessel_code,
        customs_entry_code,
        vessel_discharge_date,
        is_available
    ) as (
        select trim("VEND#A"),
            trim("VOCH#A"),
            "APINVA",
            "ESTA" = 'Y',
            "PAIDA",
            "ARA" = 'R',
            "NOAPA" = 'X',
            "PROA" = 'P',
            "AMTA",
            "CHKA",
            parse_date("ENTDDA", "ENTMMA", "ENTYYA"),
            "EXPA",
            "LOADA",
            "BOATA",
            "ENTRYA",
            (
                SELECT discharge_date
                FROM product.vessel v
                WHERE v.vessel_code = "BOATA"
                    AND v.is_pre = FALSE
                ORDER BY v.discharge_date DESC
                limit 1
            ),
            (
                SELECT is_available
                FROM product.vessel v
                WHERE v.vessel_code = "BOATA"
                    AND v.is_pre = FALSE
                ORDER BY v.discharge_date DESC
                LIMIT 1
            )

        FROM db2_JVFIL."EXPP100A"
    );
CREATE OR REPLACE VIEW accounting.expense_item_view (
        id,
        vendor_id,
        voucher_id,
        sequence_id,
        quantity,
        unit_price,
        item_amount,
        bill_of_lading_id,
        product_code,
        pallet_id,
        shipper_id,
        expense_code,
        vessel_code
    ) as (
        select trim("VEND#B") || '.' || trim("VOCH#B") || '.' || "SEQB",
            trim("VEND#B"),
            trim("VOCH#B"),
            "SEQB",
            "QTYB",
            "PRICEB",
            "AMTB",
            "BOLB",
            "PRODB",
            trim("PID#B"),
            "SHPRB",
            "EXPB",
            trim("BOATB")
        FROM db2_JVFIL."EXPP120B"
    );
comment on view accounting.expense_header_view is E'
@foreignKey (vendor_id) references directory.vendor_view (id)|@fieldName vendor
@foreignKey (vessel_code) references product.vessel_view (vessel_code)|@fieldName vessel
';
comment on view accounting.expense_item_view is E'
@foreignKey (voucher_id, vendor_id) references accounting.expense_header_view (voucher_id, vendor_id)|@foreignFieldName items
@foreignKey (pallet_id) references product.pallet_view (pallet_id)|@fieldName pallet
@foreignKey (shipper_id) references directory.shipper_view (id)|@fieldName shipper
';
-- migrate:down
DROP VIEW directory.vendor_view;
DROP VIEW product.vessel_view;
DROP VIEW accounting.expense_header_view;
DROP VIEW accounting.expense_item_view;
DROP VIEW accounting.check_header_view;
DROP VIEW directory.shipper_view;
DROP VIEW product.pallet_view;
DROP FUNCTION parse_date(numeric, numeric, numeric);