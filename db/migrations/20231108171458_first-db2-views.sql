-- migrate:up

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
        isPre,
        vessel_code,
        preVessel_code,
        vessel_name,
        arrival_port,
        country_id,
        departure_date,
        arrival_date,
        discharge_date,
        coast,
        invFlag
    ) as (
        with vessel as (
            select false,
                "BOAT#Z",
                '',
                "BNAMEZ",
                "ARVPTZ",
                "CNTRYZ",
                -- TODO: parse dates
                ("DEPMMZ" || '-' || "DEPDDZ" || '-' || "DEPYYZ"),
                ("ARVMMZ" || '-' || "ARVDDZ" || '-' || "ARVYYZ"),
                ("DISMMZ" || '-' || "DISDDZ" || '-' || "DISYYZ"),
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
                ("DEPMMZ" || '-' || "DEPDDZ" || '-' || "DEPYYZ"),
                ("ARVMMZ" || '-' || "ARVDDZ" || '-' || "ARVYYZ"),
                ("DISMMZ" || '-' || "DISDDZ" || '-' || "DISYYZ"),
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
            "VEND#K",
            "REMCDK",
            "INVAMK",
            "DSCNTK",
            "CHKAMK",
            -- TODO: parse dates
            -- some of these dates are not valid ie month 00, day 00
            ("CHKMMK" || '-' || "CHKDDK" || '-' || "CHKYYK"),
            "BANK#K",
            "INVNOK",
            "VCHKCK" = '01',
            ("RCDTMK" || '-' || "RCDTDK" || '-' || "RCDTYK")
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
        customs_entry_code
    ) as (
        select "VEND#A",
            "VOCH#A",
            "APINVA",
            "ESTA" = 'Y',
            "PAIDA",
            "ARA" = 'R',
            "NOAPA" = 'X',
            "PROA" = 'P',
            "AMTA",
            "CHKA",
            -- TODO: parse dates
            ("ENTMMA" || '-' || "ENTDDA" || '-' || "ENTYYA"),
            "EXPA",
            "LOADA",
            "BOATA",
            "ENTRYA"
        FROM db2_JVFIL."EXPP100A"
    );
CREATE OR REPLACE VIEW accounting.expense_item_view (
        vendor_id,
        voucher_id,
        sequence_id,
        quantity,
        unit_price,
        item_amount,
        bill_of_lading_id,
        product_code,
        pallet_cd,
        shipper_id,
        expense_code,
        vessel_code
    ) as (
        select "VEND#B",
            "VOCH#B",
            "SEQB",
            "QTYB",
            "PRICEB",
            "AMTB",
            "BOLB",
            "PRODB",
            "PID#B",
            "SHPRB",
            "EXPB",
            "BOATB"
        FROM db2_JVFIL."EXPP120B"
    );

comment on view accounting.expense_header_view is E'
@foreignKey (vendor_id) references directory.vendor_view (id)|@fieldName vendor
@foreignKey (vessel_code) references product.vessel_view (vessel_code)|@fieldName vessel
';
comment on view accounting.expense_item_view is E'
@foreignKey (voucher_id, vendor_id) references accounting.expense_header_view (voucher_id, vendor_id)|@foreignFieldName items
';
-- migrate:down

DROP VIEW directory.vendor_view;
DROP VIEW product.vessel_view;
DROP VIEW accounting.expense_header_view;
DROP VIEW accounting.expense_item_view;
DROP VIEW accounting.check_header_view;