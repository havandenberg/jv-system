-- db2_GDSAPFIL."ACPP600K" does not have an
-- id column

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
      date ("CHKMMK" || '-' || "CHKDDK" || '-' || "CHKYYK"),
      "BANK#K",
      "INVNOK",
      "VCHKCK" = '01',
      date ("RCDTMK" || '-' || "RCDTDK" || '-' || "RCDTYK")
    FROM db2_GDSAPFIL."ACPP600K"
  );