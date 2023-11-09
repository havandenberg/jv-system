-- migrate:up
CREATE OR REPLACE VIEW accounting.check_header_view (
        is_reconciled,
        check_status,
        check_number,
        vendor_id,
        remit_to_code,
        invoice_amount,
        discount_amount,
        check_amount,
        check_fate,
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
        truckLoad_id,
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
comment on view accounting.expense_item_view is E'
@foreignKey (voucher_id, vendor_id) references accounting.expense_header_view (voucher_id, vendor_id)|@foreignFieldName items
';
-- migrate:down