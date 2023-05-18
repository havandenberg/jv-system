CREATE TABLE accounting.wire_request (
  id BIGSERIAL PRIMARY KEY,
  bank_id TEXT NOT NULL,
  vendor_id TEXT NOT NULL,
  wire_number TEXT,
  request_date DATE NOT NULL,
  wire_date DATE NOT NULL,
  wire_type TEXT NOT NULL,
  approval_user_code TEXT,
  approval_date DATE,
  request_user_code TEXT NOT NULL,
  is_verified BOOLEAN,
  sent_date DATE
);

CREATE INDEX ON accounting.wire_request (vendor_id);

CREATE FUNCTION accounting.wire_request_vendor(IN w accounting.wire_request)
    RETURNS directory.vendor 
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM directory.vendor v WHERE v.id = w.vendor_id;
$BODY$;

CREATE FUNCTION accounting.wire_request_approval_user(IN w accounting.wire_request)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code  = w.approval_user_code;
$BODY$;

CREATE FUNCTION accounting.wire_request_request_user(IN w accounting.wire_request)
    RETURNS public.user
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM public.user u WHERE u.user_code  = w.request_user_code;
$BODY$;

CREATE FUNCTION accounting.wire_request_check_header(IN w accounting.wire_request)
    RETURNS accounting.check_header
    LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
  SELECT * FROM accounting.check_header c WHERE w.wire_number = c.check_number;
$BODY$;

CREATE FUNCTION accounting.wire_request_search_text(IN w accounting.wire_request)
	RETURNS TEXT
	LANGUAGE 'sql'
    STABLE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
SELECT CONCAT (
		w.wire_number
	) FROM accounting.wire_request wr WHERE wr.id = w.id;
$BODY$;
