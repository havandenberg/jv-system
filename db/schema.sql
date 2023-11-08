SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: accounting; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA accounting;


--
-- Name: db2_gdsapfil; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA db2_gdsapfil;


--
-- Name: db2_gdsdsfil; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA db2_gdsdsfil;


--
-- Name: db2_gdssyfil; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA db2_gdssyfil;


--
-- Name: db2_jvfil; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA db2_jvfil;


--
-- Name: db2_jvprefil; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA db2_jvprefil;


--
-- Name: directory; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA directory;


--
-- Name: inspection; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA inspection;


--
-- Name: operations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA operations;


--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgraphile_watch;


--
-- Name: product; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA product;


--
-- Name: sales; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA sales;


--
-- Name: odbc_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS odbc_fdw WITH SCHEMA public;


--
-- Name: EXTENSION odbc_fdw; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION odbc_fdw IS 'Foreign data wrapper for accessing remote databases using ODBC';


--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: -
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


--
-- Name: as400; Type: SERVER; Schema: -; Owner: -
--

CREATE SERVER as400 FOREIGN DATA WRAPPER odbc_fdw OPTIONS (
    dsn 'AS400'
);


--
-- Name: USER MAPPING public SERVER as400; Type: USER MAPPING; Schema: -; Owner: -
--

CREATE USER MAPPING FOR public SERVER as400 OPTIONS (
    odbc_pwd '*****',
    odbc_uid 'HV'
);


SET default_tablespace = '';

--
-- Name: ACPP600K; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP600K" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP600K'
);


--
-- Name: ACPP600KJ1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP600KJ1" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP600KJ1'
);


--
-- Name: ACPP600KJ2; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP600KJ2" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP600KJ2'
);


--
-- Name: ACPP600KS1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP600KS1" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP600KS1'
);


--
-- Name: ACPP600KS2; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP600KS2" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP600KS2'
);


--
-- Name: ACPP950J; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPP950J" (
    "PTYPEJ" character(1),
    "TRTYPJ" character(1),
    "INVNOJ" character(10),
    "INVSQJ" numeric(2,0),
    "VOCH1J" numeric(6,0),
    "VEND#J" character(8),
    "REMCDJ" numeric(3,0),
    "INVAMJ" numeric(11,2),
    "QTYJ" numeric(6,0),
    "DATEMJ" numeric(2,0),
    "DATEDJ" numeric(2,0),
    "DATEYJ" numeric(2,0),
    "DTEMMJ" numeric(2,0),
    "DTEDDJ" numeric(2,0),
    "DTEYYJ" numeric(2,0),
    "REF#1J" character(10),
    "INVLKJ" character(10),
    "PERYRJ" numeric(2,0),
    "PERMOJ" numeric(2,0),
    "RELCDJ" character(1),
    "BANK#J" character(2),
    "CO#J" numeric(2,0),
    "DIV#J" numeric(2,0),
    "GLCD1J" character(3),
    "GLCD2J" character(4),
    "GLCD3J" character(3),
    "GLCD4J" character(2),
    "DTEMBJ" numeric(2,0),
    "DTEDBJ" numeric(2,0),
    "DTEYBJ" numeric(2,0),
    "DTEMEJ" numeric(2,0),
    "DTEDEJ" numeric(2,0),
    "DTEYEJ" numeric(2,0),
    "CSTATJ" character(1),
    "OFFJ" character(1),
    "PONOJ" character(8),
    "GLTYPJ" character(1),
    "CHECKJ" numeric(6,0),
    "DESCRJ" character(20)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPP950J'
);


--
-- Name: ACPPW55U; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPPW55U" (
    "TRTYPU" character(1),
    "INVNOU" character(10),
    "INVSQU" numeric(2,0),
    "VOCH1U" numeric(6,0),
    "VEND#U" character(8),
    "REMCDU" numeric(3,0),
    "INVAMU" numeric(9,2),
    "QTYU" numeric(6,0),
    "DATEMU" numeric(2,0),
    "DATEDU" numeric(2,0),
    "DATEYU" numeric(2,0),
    "DTEMMU" numeric(2,0),
    "DTEDDU" numeric(2,0),
    "DTEYYU" numeric(2,0),
    "REF#1U" character(10),
    "INVLKU" character(10),
    "PERNOU" numeric(2,0),
    "RELCDU" character(1),
    "BANK#U" character(2),
    "CO#U" numeric(2,0),
    "DIV#U" numeric(2,0),
    "GLCD1U" character(3),
    "GLCD2U" character(4),
    "GLCD3U" character(3),
    "GLCD4U" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPPW55U'
);


--
-- Name: ACPPW60Z; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPPW60Z" (
    "CHKCDZ" character(1),
    "CHKSTZ" character(1),
    "CHKNOZ" numeric(6,0),
    "VEND#Z" character(8),
    "REMCDZ" numeric(3,0),
    "VNAMEZ" character(30),
    "INVAMZ" numeric(9,2),
    "DSCNTZ" numeric(9,2),
    "CHKAMZ" numeric(9,2),
    "CHKMMZ" numeric(2,0),
    "CHKDDZ" numeric(2,0),
    "CHKYYZ" numeric(2,0),
    "UDTEMZ" numeric(2,0),
    "UDTEDZ" numeric(2,0),
    "UDTEYZ" numeric(2,0),
    "CO#Z" numeric(2,0),
    "DIV#Z" numeric(2,0),
    "BANK#Z" character(2),
    "INVNOZ" character(10),
    "INVSQZ" numeric(2,0),
    "VCHKCZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPPW60Z'
);


--
-- Name: ACPT500H; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPT500H" (
    "GLACYH" numeric(2,0),
    "GLACMH" numeric(2,0),
    "VOCH1H" numeric(6,0),
    "INVAMH" numeric(9,2),
    "DATEMH" numeric(2,0),
    "DATEDH" numeric(2,0),
    "DATEYH" numeric(2,0),
    "DTEMMH" numeric(2,0),
    "DTEDDH" numeric(2,0),
    "DTEYYH" numeric(2,0),
    "PERNOH" numeric(2,0),
    "CHKNOH" numeric(6,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPT500H'
);


--
-- Name: ACPT600K; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPT600K" (
    "CHKCDK" character(1),
    "CHKSTK" character(1),
    "CHKNOK" numeric(6,0),
    "VEND#K" character(8),
    "REMCDK" numeric(3,0),
    "VNAMEK" character(30),
    "INVAMK" numeric(9,2),
    "DSCNTK" numeric(9,2),
    "CHKAMK" numeric(9,2),
    "CHKMMK" numeric(2,0),
    "CHKDDK" numeric(2,0),
    "CHKYYK" numeric(2,0),
    "UDTEMK" numeric(2,0),
    "UDTEDK" numeric(2,0),
    "UDTEYK" numeric(2,0),
    "CO#K" numeric(2,0),
    "DIV#K" numeric(2,0),
    "BANK#K" character(2),
    "INVNOK" character(10),
    "INVSQK" numeric(2,0),
    "VCHKCK" character(2),
    "GLINK" character(1),
    "GLRVK" character(1),
    "GLACMK" numeric(2,0),
    "GLACYK" numeric(2,0),
    "RCDTMK" numeric(2,0),
    "RCDTDK" numeric(2,0),
    "RCDTYK" numeric(2,0),
    "RCFLAG" character(1),
    "PERNOK" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPT600K'
);


--
-- Name: ACPTHINV; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPTHINV" (
    "HINVCD" character(2),
    "HIDESC" character(50)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPTHINV'
);


--
-- Name: ACPTVCHK; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPTVCHK" (
    "VCHKCD" character(2),
    "VCDESC" character(50)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPTVCHK'
);


--
-- Name: ACPTVINV; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPTVINV" (
    "VINVCD" character(2),
    "VIDESC" character(50)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPTVINV'
);


--
-- Name: ACPX700; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPX700" (
    "XHINV" character(2),
    "XIDESC" character(50),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPX700'
);


--
-- Name: ACPX730; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPX730" (
    "XVINV" character(2),
    "XIDESC" character(50),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPX730'
);


--
-- Name: ACPX740; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."ACPX740" (
    "XVCHK" character(2),
    "XCDESC" character(50),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'ACPX740'
);


--
-- Name: AJPP400C; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP400C" (
    "PTYPEC" character(1),
    "TRTYPC" character(1),
    "INVNOC" character(10),
    "INVSQC" numeric(2,0),
    "VOCH1C" numeric(6,0),
    "VEND#C" character(8),
    "REMCDC" numeric(3,0),
    "INVAMC" numeric(9,2),
    "QTYC" numeric(6,0),
    "DATEMC" numeric(2,0),
    "DATEDC" numeric(2,0),
    "DATEYC" numeric(2,0),
    "DSCNTC" numeric(9,2),
    "DSPCTC" numeric(5,2),
    "DSDUCC" numeric(9,2),
    "DSDAYC" numeric(3,0),
    "DSDTMC" numeric(2,0),
    "DSDTDC" numeric(2,0),
    "DSDTYC" numeric(2,0),
    "DTEMMC" numeric(2,0),
    "DTEDDC" numeric(2,0),
    "DTEYYC" numeric(2,0),
    "REF#1C" character(10),
    "INVLKC" character(10),
    "CHKNOC" numeric(6,0),
    "CHKAMC" numeric(9,2),
    "DTECMC" numeric(2,0),
    "DTECDC" numeric(2,0),
    "DTECYC" numeric(2,0),
    "AMTPDC" numeric(9,2),
    "AMTTPC" numeric(9,2),
    "COMT1C" character(50),
    "PERNOC" numeric(2,0),
    "RELCDC" character(1),
    "CHKSTC" character(1),
    "PAYSTC" character(1),
    "BANK#C" character(2),
    "CO#C" numeric(2,0),
    "DIV#C" numeric(2,0),
    "PONUMC" character(8),
    "JDATEC" numeric(5,0),
    "DDAYSC" numeric(3,0),
    "DTEUMC" numeric(2,0),
    "DTEUDC" numeric(2,0),
    "DTEUYC" numeric(2,0),
    "VCHKCC" character(2),
    "VINVCC" character(2),
    "OFFNOC" character(10),
    "OFFLGC" character(1),
    "HINVCC" character(2),
    "TERMSC" character(3)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP400C'
);


--
-- Name: AJPP500H; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP500H" (
    "TRTYPH" character(1),
    "INVNOH" character(10),
    "INVSQH" numeric(2,0),
    "VOCH1H" numeric(6,0),
    "VEND#H" character(8),
    "REMCDH" numeric(3,0),
    "INVAMH" numeric(9,2),
    "QTYH" numeric(6,0),
    "DATEMH" numeric(2,0),
    "DATEDH" numeric(2,0),
    "DATEYH" numeric(2,0),
    "DTEMMH" numeric(2,0),
    "DTEDDH" numeric(2,0),
    "DTEYYH" numeric(2,0),
    "REF#1H" character(10),
    "INVLKH" character(10),
    "PERNOH" numeric(2,0),
    "RELCDH" character(1),
    "BANK#H" character(2),
    "CO#H" numeric(2,0),
    "DIV#H" numeric(2,0),
    "GLCD1H" character(3),
    "GLCD2H" character(4),
    "GLCD3H" character(3),
    "GLCD4H" character(2),
    "PTYPEH" character(1),
    "CHKSTH" character(1),
    "CHKNOH" numeric(6,0),
    "POLN#H" numeric(3,0),
    "GLINH" character(1),
    "GLRVH" character(1),
    "GLACMH" numeric(2,0),
    "GLACYH" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP500H'
);


--
-- Name: AJPP500HH1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP500HH1" (
    "TRTYPH" character(1),
    "INVNOH" character(10),
    "INVSQH" numeric(2,0),
    "VOCH1H" numeric(6,0),
    "VEND#H" character(8),
    "REMCDH" numeric(3,0),
    "INVAMH" numeric(9,2),
    "QTYH" numeric(6,0),
    "DATEMH" numeric(2,0),
    "DATEDH" numeric(2,0),
    "DATEYH" numeric(2,0),
    "DTEMMH" numeric(2,0),
    "DTEDDH" numeric(2,0),
    "DTEYYH" numeric(2,0),
    "REF#1H" character(10),
    "INVLKH" character(10),
    "PERNOH" numeric(2,0),
    "RELCDH" character(1),
    "BANK#H" character(2),
    "CO#H" numeric(2,0),
    "DIV#H" numeric(2,0),
    "GLCD1H" character(3),
    "GLCD2H" character(4),
    "GLCD3H" character(3),
    "GLCD4H" character(2),
    "PTYPEH" character(1),
    "CHKSTH" character(1),
    "CHKNOH" numeric(6,0),
    "POLN#H" numeric(3,0),
    "GLINH" character(1),
    "GLRVH" character(1),
    "GLACMH" numeric(2,0),
    "GLACYH" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP500HH1'
);


--
-- Name: AJPP500HS1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP500HS1" (
    "TRTYPH" character(1),
    "INVNOH" character(10),
    "INVSQH" numeric(2,0),
    "VOCH1H" numeric(6,0),
    "VEND#H" character(8),
    "REMCDH" numeric(3,0),
    "INVAMH" numeric(9,2),
    "QTYH" numeric(6,0),
    "DATEMH" numeric(2,0),
    "DATEDH" numeric(2,0),
    "DATEYH" numeric(2,0),
    "DTEMMH" numeric(2,0),
    "DTEDDH" numeric(2,0),
    "DTEYYH" numeric(2,0),
    "REF#1H" character(10),
    "INVLKH" character(10),
    "PERNOH" numeric(2,0),
    "RELCDH" character(1),
    "BANK#H" character(2),
    "CO#H" numeric(2,0),
    "DIV#H" numeric(2,0),
    "GLCD1H" character(3),
    "GLCD2H" character(4),
    "GLCD3H" character(3),
    "GLCD4H" character(2),
    "PTYPEH" character(1),
    "CHKSTH" character(1),
    "CHKNOH" numeric(6,0),
    "POLN#H" numeric(3,0),
    "GLINH" character(1),
    "GLRVH" character(1),
    "GLACMH" numeric(2,0),
    "GLACYH" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP500HS1'
);


--
-- Name: AJPP580N; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP580N" (
    "TRTYPN" character(1),
    "INVNON" character(10),
    "INVSQN" numeric(2,0),
    "VOCH1N" numeric(6,0),
    "VEND#N" character(8),
    "REMCDN" numeric(3,0),
    "INVAMN" numeric(9,2),
    "QTYN" numeric(6,0),
    "DATEMN" numeric(2,0),
    "DATEDN" numeric(2,0),
    "DATEYN" numeric(2,0),
    "DTEMMN" numeric(2,0),
    "DTEDDN" numeric(2,0),
    "DTEYYN" numeric(2,0),
    "REF#1N" character(10),
    "INVLKN" character(10),
    "PERNON" numeric(2,0),
    "RELCDN" character(1),
    "BANK#N" character(2),
    "CO#N" numeric(2,0),
    "DIV#N" numeric(2,0),
    "GLCD1N" character(3),
    "GLCD2N" character(4),
    "GLCD3N" character(3),
    "GLCD4N" character(2),
    "PTYPEN" character(1),
    "CHKSTN" character(1),
    "CHKNON" numeric(6,0),
    "POLN#N" numeric(3,0),
    "GLINN" character(1),
    "GLRVN" character(1),
    "GLACMN" numeric(2,0),
    "GLACYN" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP580N'
);


--
-- Name: AJPP580NH1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP580NH1" (
    "TRTYPN" character(1),
    "INVNON" character(10),
    "INVSQN" numeric(2,0),
    "VOCH1N" numeric(6,0),
    "VEND#N" character(8),
    "REMCDN" numeric(3,0),
    "INVAMN" numeric(9,2),
    "QTYN" numeric(6,0),
    "DATEMN" numeric(2,0),
    "DATEDN" numeric(2,0),
    "DATEYN" numeric(2,0),
    "DTEMMN" numeric(2,0),
    "DTEDDN" numeric(2,0),
    "DTEYYN" numeric(2,0),
    "REF#1N" character(10),
    "INVLKN" character(10),
    "PERNON" numeric(2,0),
    "RELCDN" character(1),
    "BANK#N" character(2),
    "CO#N" numeric(2,0),
    "DIV#N" numeric(2,0),
    "GLCD1N" character(3),
    "GLCD2N" character(4),
    "GLCD3N" character(3),
    "GLCD4N" character(2),
    "PTYPEN" character(1),
    "CHKSTN" character(1),
    "CHKNON" numeric(6,0),
    "POLN#N" numeric(3,0),
    "GLINN" character(1),
    "GLRVN" character(1),
    "GLACMN" numeric(2,0),
    "GLACYN" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP580NH1'
);


--
-- Name: AJPP580NS1; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP580NS1" (
    "TRTYPN" character(1),
    "INVNON" character(10),
    "INVSQN" numeric(2,0),
    "VOCH1N" numeric(6,0),
    "VEND#N" character(8),
    "REMCDN" numeric(3,0),
    "INVAMN" numeric(9,2),
    "QTYN" numeric(6,0),
    "DATEMN" numeric(2,0),
    "DATEDN" numeric(2,0),
    "DATEYN" numeric(2,0),
    "DTEMMN" numeric(2,0),
    "DTEDDN" numeric(2,0),
    "DTEYYN" numeric(2,0),
    "REF#1N" character(10),
    "INVLKN" character(10),
    "PERNON" numeric(2,0),
    "RELCDN" character(1),
    "BANK#N" character(2),
    "CO#N" numeric(2,0),
    "DIV#N" numeric(2,0),
    "GLCD1N" character(3),
    "GLCD2N" character(4),
    "GLCD3N" character(3),
    "GLCD4N" character(2),
    "PTYPEN" character(1),
    "CHKSTN" character(1),
    "CHKNON" numeric(6,0),
    "POLN#N" numeric(3,0),
    "GLINN" character(1),
    "GLRVN" character(1),
    "GLACMN" numeric(2,0),
    "GLACYN" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP580NS1'
);


--
-- Name: AJPP850B; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP850B" (
    "CO#B" numeric(2,0),
    "DIV#B" numeric(2,0),
    "PTYPEB" character(1),
    "PERYRB" numeric(2,0),
    "PERMOB" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP850B'
);


--
-- Name: AJPP950J; Type: FOREIGN TABLE; Schema: db2_gdsapfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsapfil."AJPP950J" (
    "PTYPEJ" character(1),
    "TRTYPJ" character(1),
    "INVNOJ" character(10),
    "INVSQJ" numeric(2,0),
    "VOCH1J" numeric(6,0),
    "VEND#J" character(8),
    "REMCDJ" numeric(3,0),
    "INVAMJ" numeric(9,2),
    "QTYJ" numeric(6,0),
    "DATEMJ" numeric(2,0),
    "DATEDJ" numeric(2,0),
    "DATEYJ" numeric(2,0),
    "DTEMMJ" numeric(2,0),
    "DTEDDJ" numeric(2,0),
    "DTEYYJ" numeric(2,0),
    "REF#1J" character(10),
    "INVLKJ" character(10),
    "PERYRJ" numeric(2,0),
    "PERMOJ" numeric(2,0),
    "RELCDJ" character(1),
    "BANK#J" character(2),
    "CO#J" numeric(2,0),
    "DIV#J" numeric(2,0),
    "GLCD1J" character(3),
    "GLCD2J" character(4),
    "GLCD3J" character(3),
    "GLCD4J" character(2),
    "DTEMBJ" numeric(2,0),
    "DTEDBJ" numeric(2,0),
    "DTEYBJ" numeric(2,0),
    "DTEMEJ" numeric(2,0),
    "DTEDEJ" numeric(2,0),
    "DTEYEJ" numeric(2,0),
    "CSTATJ" character(1),
    "OFFJ" character(1),
    "PONOJ" character(8),
    "GLTYPJ" character(1),
    "CHECKJ" numeric(6,0),
    "DESCRJ" character(20)
)
SERVER as400
OPTIONS (
    schema 'GDSAPFIL',
    "table" 'AJPP950J'
);


--
-- Name: ITPP010; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ITPP010" (
    "DATA" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ITPP010'
);


--
-- Name: ITPP011; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ITPP011" (
    "DATA" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ITPP011'
);


--
-- Name: ORDP140C; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP140C" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP140C'
);


--
-- Name: ORDP140CJ1; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP140CJ1" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP140CJ1'
);


--
-- Name: ORDP140CS1; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP140CS1" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP140CS1'
);


--
-- Name: ORDP140CS2; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP140CS2" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP140CS2'
);


--
-- Name: ORDP140CS3; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP140CS3" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP140CS3'
);


--
-- Name: ORDP606C; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP606C" (
    "RSTATC" character(1),
    "RCODEC" character(2),
    "RDESCC" character(30),
    "LOSTSC" character(1),
    "RDATEC" numeric(6,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP606C'
);


--
-- Name: ORDP940C; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDP940C" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDP940C'
);


--
-- Name: ORDT940C; Type: FOREIGN TABLE; Schema: db2_gdsdsfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdsdsfil."ORDT940C" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'GDSDSFIL',
    "table" 'ORDT940C'
);


--
-- Name: ACPP010; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPP010" (
    "CO#" numeric(2,0),
    "DIV#" numeric(2,0),
    "DATA" character(25)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPP010'
);


--
-- Name: ACPP100V; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPP100V" (
    "CO#V" numeric(2,0),
    "DIV#V" numeric(2,0),
    "VEND#V" character(8),
    "VNAMEV" character(30),
    "ADD1V" character(30),
    "ADD2V" character(30),
    "CITYV" character(17),
    "STATEV" character(2),
    "ZIPCDV" character(10),
    "CNTRYV" character(10),
    "ARECDV" numeric(3,0),
    "EXCHGV" numeric(3,0),
    "PHONEV" numeric(4,0),
    "ATTENV" character(30),
    "SERCHV" character(10),
    "DLTCDV" character(1),
    "MTDISV" numeric(9,2),
    "YTDISV" numeric(9,2),
    "ACBALV" numeric(9,2),
    "MTPURV" numeric(9,2),
    "YTPURV" numeric(9,2),
    "MTNETV" numeric(9,2),
    "YTNETV" numeric(9,2),
    "TERMSV" character(3),
    "VTYPEV" character(2),
    "REMCDV" numeric(3,0),
    "PFLAGV" character(1),
    "CRBALV" numeric(9,2),
    "GLCD1V" character(3),
    "GLCD2V" character(4),
    "GLCD3V" character(3),
    "GLCD4V" character(2),
    "DATEMV" numeric(2,0),
    "DATEDV" numeric(2,0),
    "DATEYV" numeric(2,0),
    "CHKAMV" numeric(9,2),
    "DTELMV" numeric(2,0),
    "DTELDV" numeric(2,0),
    "DTELYV" numeric(2,0),
    "AMTV" numeric(9,2),
    "DSPCTV" numeric(5,4),
    "DTEOMV" numeric(2,0),
    "DTEODV" numeric(2,0),
    "DTEOYV" numeric(2,0),
    "FXBALV" numeric(9,2),
    "FXPAYV" numeric(9,2),
    "DSDAYV" numeric(3,0),
    "GCDA1V" character(3),
    "GCDA2V" character(4),
    "GCDA3V" character(3),
    "GCDA4V" character(2),
    "GCDB1V" character(3),
    "GCDB2V" character(4),
    "GCDB3V" character(3),
    "GCDB4V" character(2),
    "PADAYV" numeric(3,0),
    "LYPURV" numeric(9,2),
    "LYDISV" numeric(9,2),
    "LYNETV" numeric(9,2),
    "TCODEV" character(3),
    "VNPAYV" numeric(9,2),
    "VCODEV" character(1),
    "VDESCV" character(15),
    "VTEMPV" character(1),
    "VCATV" character(3),
    "BANKV" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPP100V'
);


--
-- Name: ACPP100V99; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPP100V99" (
    "CO#V" numeric(2,0),
    "DIV#V" numeric(2,0),
    "VEND#V" character(8),
    "VNAMEV" character(30),
    "ADD1V" character(30),
    "ADD2V" character(30),
    "CITYV" character(17),
    "STATEV" character(2),
    "ZIPCDV" character(10),
    "CNTRYV" character(10),
    "ARECDV" numeric(3,0),
    "EXCHGV" numeric(3,0),
    "PHONEV" numeric(4,0),
    "ATTENV" character(30),
    "SERCHV" character(10),
    "DLTCDV" character(1),
    "MTDISV" numeric(9,2),
    "YTDISV" numeric(9,2),
    "ACBALV" numeric(9,2),
    "MTPURV" numeric(9,2),
    "YTPURV" numeric(9,2),
    "MTNETV" numeric(9,2),
    "YTNETV" numeric(9,2),
    "TERMSV" character(3),
    "VTYPEV" character(2),
    "REMCDV" numeric(3,0),
    "PFLAGV" character(1),
    "CRBALV" numeric(9,2),
    "GLCD1V" character(3),
    "GLCD2V" character(4),
    "GLCD3V" character(3),
    "GLCD4V" character(2),
    "DATEMV" numeric(2,0),
    "DATEDV" numeric(2,0),
    "DATEYV" numeric(2,0),
    "CHKAMV" numeric(9,2),
    "DTELMV" numeric(2,0),
    "DTELDV" numeric(2,0),
    "DTELYV" numeric(2,0),
    "AMTV" numeric(9,2),
    "DSPCTV" numeric(5,2),
    "DTEOMV" numeric(2,0),
    "DTEODV" numeric(2,0),
    "DTEOYV" numeric(2,0),
    "FXBALV" numeric(9,2),
    "FXPAYV" numeric(9,2),
    "DSDAYV" numeric(3,0),
    "GCDA1V" character(3),
    "GCDA2V" character(4),
    "GCDA3V" character(3),
    "GCDA4V" character(2),
    "GCDB1V" character(3),
    "GCDB2V" character(4),
    "GCDB3V" character(3),
    "GCDB4V" character(2),
    "PADAYV" numeric(3,0),
    "LYPURV" numeric(9,2),
    "LYDISV" numeric(9,2),
    "LYNETV" numeric(9,2),
    "TCODEV" character(3),
    "VNPAYV" numeric(9,2),
    "VCODEV" character(1),
    "VDESCV" character(15),
    "VTEMPV" character(1),
    "VCATV" character(3),
    "BANKV" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPP100V99'
);


--
-- Name: ACPP100VS2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPP100VS2" (
    "CO#V" numeric(2,0),
    "DIV#V" numeric(2,0),
    "VEND#V" character(8),
    "VNAMEV" character(30),
    "ADD1V" character(30),
    "ADD2V" character(30),
    "CITYV" character(17),
    "STATEV" character(2),
    "ZIPCDV" character(10),
    "CNTRYV" character(10),
    "ARECDV" numeric(3,0),
    "EXCHGV" numeric(3,0),
    "PHONEV" numeric(4,0),
    "ATTENV" character(30),
    "SERCHV" character(10),
    "DLTCDV" character(1),
    "MTDISV" numeric(9,2),
    "YTDISV" numeric(9,2),
    "ACBALV" numeric(9,2),
    "MTPURV" numeric(9,2),
    "YTPURV" numeric(9,2),
    "MTNETV" numeric(9,2),
    "YTNETV" numeric(9,2),
    "TERMSV" character(3),
    "VTYPEV" character(2),
    "REMCDV" numeric(3,0),
    "PFLAGV" character(1),
    "CRBALV" numeric(9,2),
    "GLCD1V" character(3),
    "GLCD2V" character(4),
    "GLCD3V" character(3),
    "GLCD4V" character(2),
    "DATEMV" numeric(2,0),
    "DATEDV" numeric(2,0),
    "DATEYV" numeric(2,0),
    "CHKAMV" numeric(9,2),
    "DTELMV" numeric(2,0),
    "DTELDV" numeric(2,0),
    "DTELYV" numeric(2,0),
    "AMTV" numeric(9,2),
    "DSPCTV" numeric(5,4),
    "DTEOMV" numeric(2,0),
    "DTEODV" numeric(2,0),
    "DTEOYV" numeric(2,0),
    "FXBALV" numeric(9,2),
    "FXPAYV" numeric(9,2),
    "DSDAYV" numeric(3,0),
    "GCDA1V" character(3),
    "GCDA2V" character(4),
    "GCDA3V" character(3),
    "GCDA4V" character(2),
    "GCDB1V" character(3),
    "GCDB2V" character(4),
    "GCDB3V" character(3),
    "GCDB4V" character(2),
    "PADAYV" numeric(3,0),
    "LYPURV" numeric(9,2),
    "LYDISV" numeric(9,2),
    "LYNETV" numeric(9,2),
    "TCODEV" character(3),
    "VNPAYV" numeric(9,2),
    "VCODEV" character(1),
    "VDESCV" character(15),
    "VTEMPV" character(1),
    "VCATV" character(3),
    "BANKV" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPP100VS2'
);


--
-- Name: ACPP100VS3; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPP100VS3" (
    "CO#V" numeric(2,0),
    "DIV#V" numeric(2,0),
    "VEND#V" character(8),
    "VNAMEV" character(30),
    "ADD1V" character(30),
    "ADD2V" character(30),
    "CITYV" character(17),
    "STATEV" character(2),
    "ZIPCDV" character(10),
    "CNTRYV" character(10),
    "ARECDV" numeric(3,0),
    "EXCHGV" numeric(3,0),
    "PHONEV" numeric(4,0),
    "ATTENV" character(30),
    "SERCHV" character(10),
    "DLTCDV" character(1),
    "MTDISV" numeric(9,2),
    "YTDISV" numeric(9,2),
    "ACBALV" numeric(9,2),
    "MTPURV" numeric(9,2),
    "YTPURV" numeric(9,2),
    "MTNETV" numeric(9,2),
    "YTNETV" numeric(9,2),
    "TERMSV" character(3),
    "VTYPEV" character(2),
    "REMCDV" numeric(3,0),
    "PFLAGV" character(1),
    "CRBALV" numeric(9,2),
    "GLCD1V" character(3),
    "GLCD2V" character(4),
    "GLCD3V" character(3),
    "GLCD4V" character(2),
    "DATEMV" numeric(2,0),
    "DATEDV" numeric(2,0),
    "DATEYV" numeric(2,0),
    "CHKAMV" numeric(9,2),
    "DTELMV" numeric(2,0),
    "DTELDV" numeric(2,0),
    "DTELYV" numeric(2,0),
    "AMTV" numeric(9,2),
    "DSPCTV" numeric(5,4),
    "DTEOMV" numeric(2,0),
    "DTEODV" numeric(2,0),
    "DTEOYV" numeric(2,0),
    "FXBALV" numeric(9,2),
    "FXPAYV" numeric(9,2),
    "DSDAYV" numeric(3,0),
    "GCDA1V" character(3),
    "GCDA2V" character(4),
    "GCDA3V" character(3),
    "GCDA4V" character(2),
    "GCDB1V" character(3),
    "GCDB2V" character(4),
    "GCDB3V" character(3),
    "GCDB4V" character(2),
    "PADAYV" numeric(3,0),
    "LYPURV" numeric(9,2),
    "LYDISV" numeric(9,2),
    "LYNETV" numeric(9,2),
    "TCODEV" character(3),
    "VNPAYV" numeric(9,2),
    "VCODEV" character(1),
    "VDESCV" character(15),
    "VTEMPV" character(1),
    "VCATV" character(3),
    "BANKV" character(2)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPP100VS3'
);


--
-- Name: ACPTCAT; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPTCAT" (
    "TCCAT" character(3),
    "TCDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPTCAT'
);


--
-- Name: ACPTTYP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPTTYP" (
    "TTTYPE" character(2),
    "TTDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPTTYP'
);


--
-- Name: ACPX710; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPX710" (
    "XTTYPE" character(2),
    "XTDESC" character(30),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPX710'
);


--
-- Name: ACPX720; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACPX720" (
    "XCCAT" character(3),
    "XCDESC" character(30),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACPX720'
);


--
-- Name: ACRJ100R; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRJ100R" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRJ100R'
);


--
-- Name: ACRP100R; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100R" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100R'
);


--
-- Name: ACRP100RJ1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RJ1" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RJ1'
);


--
-- Name: ACRP100RJ2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RJ2" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RJ2'
);


--
-- Name: ACRP100RS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS1" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS1'
);


--
-- Name: ACRP100RS2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS2" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS2'
);


--
-- Name: ACRP100RS3; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS3" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS3'
);


--
-- Name: ACRP100RS4; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS4" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS4'
);


--
-- Name: ACRP100RS5; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS5" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS5'
);


--
-- Name: ACRP100RS6; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS6" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS6'
);


--
-- Name: ACRP100RS7; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100RS7" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100RS7'
);


--
-- Name: ACRP100V; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100V" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100V'
);


--
-- Name: ACRP100VS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRP100VS1" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRP100VS1'
);


--
-- Name: ACRPINSURE; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRPINSURE" (
    "CUSTA" character(8),
    "YES_NO" character(1)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRPINSURE'
);


--
-- Name: ACRT100R; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRT100R" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RCKNUM" character(8),
    "RCKCUS" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTRNCD" character(3),
    "RTRNTY" numeric(2,0),
    "RRSNCD" character(3),
    "RTERMS" character(3),
    "RREMRK" character(30),
    "RAMT" numeric(9,2),
    "RTXAMT" numeric(9,2),
    "RFRAMT" numeric(9,2),
    "RMSAMT" numeric(9,2),
    "RGRAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RCAMT" numeric(9,2),
    "RPSTDU" numeric(3,0),
    "RSTST" character(1),
    "RINVAG" character(1),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RXTRA9" numeric(3,0),
    "RLACTY" numeric(2,0),
    "RLACTM" numeric(2,0),
    "RLACTD" numeric(2,0),
    "RCRTDY" numeric(2,0),
    "RCRTDM" numeric(2,0),
    "RCRTDD" numeric(2,0),
    "RXFLAG" character(1),
    "RPYAMT" numeric(9,2),
    "RPTDAM" numeric(9,2),
    "RWS" character(10),
    "RUSER" character(10),
    "RPURGK" character(8),
    "RCONUM" numeric(2,0),
    "RSLSMN" character(4),
    "RDESCR" character(30),
    "RDIVSN" numeric(2,0),
    "RBRNCH" character(2),
    "RXTRA1" character(1),
    "RXTRA2" character(1),
    "RXTRA3" character(3),
    "RXTRA5" numeric(2,0),
    "RXTRA6" numeric(6,0),
    "RSTATF" character(1),
    "RBANK" character(2),
    "RDEPYY" numeric(2,0),
    "RDEPMM" numeric(2,0),
    "RDEPDD" numeric(2,0),
    "RGLAC1" character(3),
    "RGLAC2" character(4),
    "RGLAC3" character(3),
    "RGLAC4" character(2),
    "RCLODM" numeric(2,0),
    "RCLODD" numeric(2,0),
    "RCLODY" numeric(2,0),
    "RREFNO" character(10),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RXTRA8" character(1),
    "RORDNO" numeric(11,0),
    "RPORD#" character(22),
    "RSORTA" character(15),
    "RACTM" numeric(2,0),
    "RACTY" numeric(2,0),
    "RXTRA7" character(1),
    "RARCUS" character(7),
    "RBATCH" numeric(5,0),
    "RFLAG" character(1),
    "RAMNT4" numeric(4,0),
    "RAMNT9" numeric(9,2),
    "RJULN" numeric(5,0),
    "RDSJD1" numeric(3,0),
    "RDSJY1" numeric(2,0),
    "RDSJD2" numeric(3,0),
    "RDSJY2" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRT100R'
);


--
-- Name: ACRX055; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ACRX055" (
    "RCUSNO" character(8),
    "RINVNO" character(8),
    "RTRNYR" numeric(2,0),
    "RTRNMO" numeric(2,0),
    "RTRNDA" numeric(2,0),
    "RTRNJD" numeric(3,0),
    "RTRNJY" numeric(2,0),
    "RTERMS" character(3),
    "RAMT" numeric(9,2),
    "RDISCT" numeric(9,2),
    "RDISC2" numeric(9,2),
    "RDUEYR" numeric(2,0),
    "RDUEMO" numeric(2,0),
    "RDUEDA" numeric(2,0),
    "RDUEJD" numeric(3,0),
    "RDUEJY" numeric(2,0),
    "RDISDY" numeric(2,0),
    "RDISDM" numeric(2,0),
    "RDISDD" numeric(2,0),
    "RDIS2Y" numeric(2,0),
    "RDIS2M" numeric(2,0),
    "RDIS2D" numeric(2,0),
    "RDESCR" character(30),
    "RCONUM" numeric(2,0),
    "RDIVSN" numeric(2,0),
    "RJULN" numeric(5,0),
    "RDSJY1" numeric(2,0),
    "RDSJD1" numeric(3,0),
    "RDSJY2" numeric(2,0),
    "RDSJD2" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ACRX055'
);


--
-- Name: APLOOKUP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."APLOOKUP" (
    "CO#" numeric(2,0),
    "DIV#" numeric(2,0),
    "WORD" character(10),
    "VE#" character(8),
    "RE#" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'APLOOKUP'
);


--
-- Name: CCP010; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CCP010" (
    "DATA" character(22)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CCP010'
);


--
-- Name: CSLOOKUP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CSLOOKUP" (
    "WORD" character(15),
    "VE#" character(8)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CSLOOKUP'
);


--
-- Name: CSPP010; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CSPP010" (
    "DATA" character(23)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CSPP010'
);


--
-- Name: CULOOKUP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CULOOKUP" (
    "WORD" character(15),
    "VE#" character(8),
    "SH#" character(4)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CULOOKUP'
);


--
-- Name: CUPP010; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CUPP010" (
    "DATA" character(27)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CUPP010'
);


--
-- Name: CUPP011; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."CUPP011" (
    "DATA" character(27)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'CUPP011'
);


--
-- Name: DATAREC; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DATAREC" (
    "ORDT#" numeric(11,0),
    "BODT#" numeric(2,0),
    "PRTDT" character(1)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DATAREC'
);


--
-- Name: DATARECS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DATARECS1" (
    "ORDT#" numeric(11,0),
    "BODT#" numeric(2,0),
    "PRTDT" character(1)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DATARECS1'
);


--
-- Name: DSSP200C; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200C" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200C'
);


--
-- Name: DSSP200CS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS1" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS1'
);


--
-- Name: DSSP200CS2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS2" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS2'
);


--
-- Name: DSSP200CS3; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS3" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS3'
);


--
-- Name: DSSP200CS4; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS4" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS4'
);


--
-- Name: DSSP200CS5; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS5" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS5'
);


--
-- Name: DSSP200CS6; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP200CS6" (
    "CDELCD" character(1),
    "CUST#C" character(8),
    "OPNDCC" numeric(1,0),
    "OPNDMC" numeric(2,0),
    "OPNDDC" numeric(2,0),
    "OPNDYC" numeric(2,0),
    "CLSDCC" numeric(1,0),
    "CLSDMC" numeric(2,0),
    "CLSDDC" numeric(2,0),
    "CLSDYC" numeric(2,0),
    "CUSNMC" character(30),
    "ADRESC" character(30),
    "ADRS2C" character(30),
    "CITYC" character(17),
    "STATEC" character(2),
    "ZIPCDC" character(10),
    "CNTRYC" character(5),
    "AREAC" numeric(3,0),
    "EXCHGC" numeric(3,0),
    "TEL#C" numeric(4,0),
    "TERMSC" character(3),
    "ACKNC" character(1),
    "CORP#C" character(8),
    "NOFIVC" numeric(2,0),
    "SICDC" character(4),
    "MINDLC" character(1),
    "MINCHC" character(1),
    "PRCDC" numeric(2,0),
    "PRIORC" numeric(2,0),
    "CLASS" character(2),
    "CTYPE" character(2),
    "STRGPC" character(7),
    "PORQC" character(1),
    "REGNC" character(5),
    "BKORDC" character(1),
    "BOMINC" numeric(7,0),
    "BOMAXC" numeric(2,0),
    "CONBOC" character(1),
    "PSHIPC" character(1),
    "CARRC" character(3),
    "FRTALC" numeric(3,2),
    "MFRTC" numeric(7,0),
    "TAXCDC" character(1),
    "RSALEC" character(15),
    "CTAXST" character(2),
    "CTAXCT" character(3),
    "CTAXCI" character(5),
    "CCRLMT" numeric(11,2),
    "ORDPRC" numeric(11,2),
    "CAMDUE" numeric(11,2),
    "CCRMTD" numeric(11,2),
    "CCRYTD" numeric(11,2),
    "CCRLST" numeric(11,2),
    "CSLMTD" numeric(11,2),
    "CSLYTD" numeric(11,2),
    "CLYSLS" numeric(11,2),
    "CCSTMN" numeric(11,2),
    "CCSTYR" numeric(11,2),
    "CLYCST" numeric(11,2),
    "CCBMTD" numeric(11,2),
    "CCBYTD" numeric(11,2),
    "CCBLST" numeric(11,2),
    "CORDRS" numeric(5,0),
    "CRHOLD" character(1),
    "CCHOLD" numeric(2,0),
    "REMRK1" character(30),
    "REMRK2" character(30),
    "CRDRMC" character(1),
    "PCOMMC" character(1),
    "CMNT1C" character(30),
    "PRTC1C" numeric(1,0),
    "CMNT2C" character(30),
    "PRTC2C" numeric(1,0),
    "CMNT3C" character(30),
    "PRTC3C" numeric(1,0),
    "LORD#C" numeric(11,0),
    "INVDD" numeric(2,0),
    "INVMM" numeric(2,0),
    "INVYY" numeric(2,0),
    "INVNO" character(8),
    "SORTAC" character(15),
    "LMNTCC" numeric(2,0),
    "LMNTMC" numeric(2,0),
    "LMNTDC" numeric(2,0),
    "LMNTYC" numeric(2,0),
    "ADRS3C" character(30),
    "CONTYC" character(10),
    "CRALRT" character(2),
    "LORDCC" numeric(1,0),
    "LORDMC" numeric(2,0),
    "LORDDC" numeric(2,0),
    "LORDYC" numeric(2,0),
    "CDEA#" character(1),
    "CEIA" character(1),
    "CDATE" numeric(6,0),
    "CMISC" character(1),
    "DEAEDT" numeric(6,0),
    "BUYERC" character(30),
    "SLSM1C" character(4),
    "CBRANH" character(2),
    "CREMIT" character(2),
    "CTAXTD" character(2),
    "HRBALC" numeric(11,2),
    "GRPCDC" numeric(4,0),
    "CUSER" character(10),
    "CWS" character(10),
    "NAMTDC" numeric(11,2),
    "DISPUC" numeric(11,2),
    "SVRTYC" character(1),
    "STATUC" character(1),
    "CUSN2C" character(30),
    "TERRTC" character(2),
    "DLPYYC" numeric(2,0),
    "DLPYMC" numeric(2,0),
    "DLPYDC" numeric(2,0),
    "CFINCD" character(1),
    "TCLASC" character(2),
    "PAYAMT" numeric(11,2),
    "CRDEXC" numeric(3,0),
    "CREX$C" numeric(11,2),
    "DBRTNG" character(5),
    "DUNCOD" character(2),
    "DUNYYC" numeric(2,0),
    "DUNMYC" numeric(2,0),
    "DUNDYC" numeric(2,0),
    "STMNTF" character(1),
    "CFLAG" character(1),
    "AVGDTP" numeric(3,0),
    "CCURR" numeric(11,2),
    "CAGEP1" numeric(11,2),
    "CAGEP2" numeric(11,2),
    "CAGEP3" numeric(11,2),
    "CAGEP4" numeric(11,2),
    "CAGEP5" numeric(11,2),
    "CAGEP6" numeric(11,2),
    "CAGEP7" numeric(11,2),
    "CAGEP8" numeric(11,2),
    "CCAGEF" numeric(11,2),
    "CEXLIM" character(1),
    "COLDYC" numeric(2,0),
    "COLDMC" numeric(2,0),
    "COLDDC" numeric(2,0),
    "IPDUEC" character(10),
    "CRDTYC" numeric(2,0),
    "CRDTMC" numeric(2,0),
    "CRDTDC" numeric(2,0),
    "OVLMTC" character(1),
    "REVBYC" character(2),
    "FCMTDC" numeric(11,2),
    "FCYTDC" numeric(11,2),
    "FCLSTC" numeric(11,2),
    "PAYPMC" numeric(11,2),
    "PAYDCC" numeric(11,2),
    "PAYLTC" numeric(11,2),
    "DBDTYC" numeric(2,0),
    "DBDTMC" numeric(2,0),
    "DBDTDC" numeric(2,0),
    "AVLTCC" numeric(11,2),
    "AVLTPC" numeric(11,2),
    "DSOC" numeric(5,2),
    "HPBALC" numeric(11,2),
    "BANKC" character(2),
    "CONUMC" numeric(2,0),
    "BRNCHC" character(2),
    "DIVSNC" numeric(2,0),
    "PLNSPC" character(1),
    "CTAXEX" character(1),
    "CCTYYN" character(1),
    "CCITYN" character(1),
    "CMTDYN" character(1),
    "CCBNOC" numeric(4,0),
    "DIMTDC" numeric(11,2),
    "DIYTDC" numeric(11,2),
    "DILSTC" numeric(11,2),
    "DINOC" numeric(4,0),
    "DIFLGC" character(1),
    "PMPCTC" numeric(5,2),
    "LTPCTC" numeric(5,2),
    "DCPCTC" numeric(5,2),
    "ARCUSC" character(7),
    "PAYFRC" character(1),
    "CRHLDC" numeric(4,0),
    "RTCHKC" numeric(4,0),
    "CUMSGC" character(50),
    "AMNT4C" numeric(4,0),
    "REM30C" character(30),
    "FLAGC" character(1),
    "DUNNSC" character(8),
    "ACHR1C" character(1),
    "BCHR1C" character(1),
    "ACHR2C" character(2),
    "BCHR2C" character(2),
    "ACHR3C" character(3),
    "BCHR3C" character(3),
    "ACHR4C" character(4),
    "BCHR4C" character(4),
    "XAMT1C" numeric(11,2),
    "XAMT2C" numeric(11,2),
    "DISCC" numeric(5,2),
    "GOALC" numeric(9,0),
    "JVCRDC" numeric(9,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP200CS6'
);


--
-- Name: DSSP500G; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."DSSP500G" (
    "CONUMG" numeric(2,0),
    "DIVSNG" numeric(2,0),
    "GROUPG" numeric(4,0),
    "GRPNMG" character(30),
    "HLDFLG" character(1),
    "CRDLMG" numeric(14,0),
    "CREXTG" numeric(14,0),
    "ORDLMG" numeric(14,0),
    "ORDPRG" numeric(14,2),
    "ARNETG" numeric(14,2),
    "CAMDUG" numeric(14,2),
    "CCURG" numeric(14,2),
    "CAGEFG" numeric(14,2),
    "AGP01G" numeric(14,2),
    "AGP30G" numeric(14,2),
    "AGP60G" numeric(14,2),
    "AGP90G" numeric(14,2),
    "AGP12G" numeric(14,2),
    "AGPUNG" numeric(14,2),
    "DSPUTG" numeric(14,2),
    "HICRTG" numeric(14,2),
    "HICLTG" numeric(14,2),
    "LORDMG" numeric(2,0),
    "LORDDG" numeric(2,0),
    "LORDYG" numeric(2,0),
    "LMNTMG" numeric(2,0),
    "LMNTDG" numeric(2,0),
    "LMNTYG" numeric(2,0),
    "AVGDTG" numeric(3,0),
    "SLMTDG" numeric(14,2),
    "SLYTDG" numeric(14,2),
    "SLLSTG" numeric(14,2),
    "CRMTDG" numeric(14,2),
    "CRYTDG" numeric(14,2),
    "CRLSTG" numeric(14,2),
    "DEMTDG" numeric(14,2),
    "DEYTDG" numeric(14,2),
    "DELSTG" numeric(14,2),
    "DENOG" numeric(4,0),
    "DSMTDG" numeric(14,2),
    "DSYTDG" numeric(14,2),
    "DSLSTG" numeric(14,2),
    "DSNOG" numeric(4,0),
    "FCMTDG" numeric(14,2),
    "FCYTDG" numeric(14,2),
    "FCLSTG" numeric(14,2),
    "DSOG" numeric(5,2),
    "CRHOLG" numeric(4,0),
    "CRTDMG" numeric(2,0),
    "CRTDDG" numeric(2,0),
    "CRTDYG" numeric(2,0),
    "USERG" character(10),
    "WSG" character(10),
    "TIMEG" numeric(6,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'DSSP500G'
);


--
-- Name: EXPJ100A; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."EXPJ100A" (
    "VEND#A" character(8),
    "VOCH#A" character(10),
    "APINVA" character(10),
    "ESTA" character(1),
    "PAIDA" character(1),
    "ARA" character(1),
    "NOAPA" character(1),
    "PROA" character(1),
    "AMTA" numeric(9,2),
    "DISCA" numeric(7,2),
    "CHKA" numeric(6,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "EXPA" character(3),
    "LOADA" character(6),
    "LOTA" character(5),
    "BOATA" character(3),
    "ENTRYA" character(13)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'EXPJ100A'
);


--
-- Name: GLPP020I; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP020I" (
    "CMPNOI" character(3),
    "JSCDEI" character(2),
    "IFSEQI" numeric(3,0),
    "DPTNOI" character(3),
    "ACCNOI" character(4),
    "SUBNOI" character(3),
    "PRDNOI" character(2),
    "JREF1I" character(10),
    "JREF2I" character(10),
    "JDESCI" character(50),
    "JSTCDI" character(1),
    "JBTCHI" numeric(5,0),
    "DLTCDI" character(1),
    "JUPELI" character(1),
    "RVSFLI" character(1),
    "RVDSCI" character(50),
    "BALNPI" numeric(11,2),
    "JDRLWI" numeric(11,2),
    "JDRHII" numeric(11,2),
    "JCRLWI" numeric(11,2),
    "JCRHII" numeric(11,2),
    "RERUNI" character(1),
    "FRSTPI" numeric(2,0),
    "TESTMI" character(1),
    "RESEQI" character(1),
    "INSTMI" numeric(2,0),
    "INSTYI" numeric(4,0),
    "INCRMI" numeric(2,0),
    "INCRYI" numeric(4,0),
    "INPGMI" character(10),
    "INTIMI" numeric(6,0),
    "INMONI" numeric(2,0),
    "INDAYI" numeric(2,0),
    "INDYRI" numeric(2,0),
    "UPUSRI" character(10),
    "UPJOBI" character(10),
    "UPTIMI" numeric(6,0),
    "UPMONI" numeric(2,0),
    "UPDAYI" numeric(2,0),
    "UPDYRI" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP020I'
);


--
-- Name: GLPP100M; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP100M" (
    "CMPNOM" character(3),
    "DPTNOM" character(3),
    "ACCNOM" character(4),
    "SUBNOM" character(3),
    "PRDNOM" character(2),
    "TYPCDM" character(2),
    "ACCLNM" numeric(2,0),
    "COANMM" character(30),
    "PERYRM" numeric(2,0),
    "QUANTM" numeric(7,0),
    "DLTCDM" character(1),
    "CYEARM" numeric(4,0),
    "CYD00M" numeric(11,2),
    "CYD01M" numeric(11,2),
    "CYD02M" numeric(11,2),
    "CYD03M" numeric(11,2),
    "CYD04M" numeric(11,2),
    "CYD05M" numeric(11,2),
    "CYD06M" numeric(11,2),
    "CYD07M" numeric(11,2),
    "CYD08M" numeric(11,2),
    "CYD09M" numeric(11,2),
    "CYD10M" numeric(11,2),
    "CYD11M" numeric(11,2),
    "CYD12M" numeric(11,2),
    "CYD13M" numeric(11,2),
    "CYC00M" numeric(11,2),
    "CYC01M" numeric(11,2),
    "CYC02M" numeric(11,2),
    "CYC03M" numeric(11,2),
    "CYC04M" numeric(11,2),
    "CYC05M" numeric(11,2),
    "CYC06M" numeric(11,2),
    "CYC07M" numeric(11,2),
    "CYC08M" numeric(11,2),
    "CYC09M" numeric(11,2),
    "CYC10M" numeric(11,2),
    "CYC11M" numeric(11,2),
    "CYC12M" numeric(11,2),
    "CYC13M" numeric(11,2),
    "PYEARM" numeric(4,0),
    "PYD00M" numeric(11,2),
    "PYD01M" numeric(11,2),
    "PYD02M" numeric(11,2),
    "PYD03M" numeric(11,2),
    "PYD04M" numeric(11,2),
    "PYD05M" numeric(11,2),
    "PYD06M" numeric(11,2),
    "PYD07M" numeric(11,2),
    "PYD08M" numeric(11,2),
    "PYD09M" numeric(11,2),
    "PYD10M" numeric(11,2),
    "PYD11M" numeric(11,2),
    "PYD12M" numeric(11,2),
    "PYD13M" numeric(11,2),
    "PYC00M" numeric(11,2),
    "PYC01M" numeric(11,2),
    "PYC02M" numeric(11,2),
    "PYC03M" numeric(11,2),
    "PYC04M" numeric(11,2),
    "PYC05M" numeric(11,2),
    "PYC06M" numeric(11,2),
    "PYC07M" numeric(11,2),
    "PYC08M" numeric(11,2),
    "PYC09M" numeric(11,2),
    "PYC10M" numeric(11,2),
    "PYC11M" numeric(11,2),
    "PYC12M" numeric(11,2),
    "PYC13M" numeric(11,2),
    "CYQ00M" numeric(7,0),
    "CYQ01M" numeric(7,0),
    "CYQ02M" numeric(7,0),
    "CYQ03M" numeric(7,0),
    "CYQ04M" numeric(7,0),
    "CYQ05M" numeric(7,0),
    "CYQ06M" numeric(7,0),
    "CYQ07M" numeric(7,0),
    "CYQ08M" numeric(7,0),
    "CYQ09M" numeric(7,0),
    "CYQ10M" numeric(7,0),
    "CYQ11M" numeric(7,0),
    "CYQ12M" numeric(7,0),
    "CYQ13M" numeric(7,0),
    "PYQ00M" numeric(7,0),
    "PYQ01M" numeric(7,0),
    "PYQ02M" numeric(7,0),
    "PYQ03M" numeric(7,0),
    "PYQ04M" numeric(7,0),
    "PYQ05M" numeric(7,0),
    "PYQ06M" numeric(7,0),
    "PYQ07M" numeric(7,0),
    "PYQ08M" numeric(7,0),
    "PYQ09M" numeric(7,0),
    "PYQ10M" numeric(7,0),
    "PYQ11M" numeric(7,0),
    "PYQ12M" numeric(7,0),
    "PYQ13M" numeric(7,0),
    "MAT01M" character(1),
    "MAT02M" character(1),
    "MAT03M" character(1),
    "MAT04M" character(1),
    "MAT05M" character(1),
    "MAT06M" character(1),
    "MAT07M" character(1),
    "MAT08M" character(1),
    "MAT09M" character(1),
    "MAT10M" character(1),
    "MAT11M" character(1),
    "MAT12M" character(1),
    "MAT13M" character(1),
    "UPUSRM" character(10),
    "UPJOBM" character(10),
    "UPTIMM" numeric(6,0),
    "UPMONM" numeric(2,0),
    "UPDAYM" numeric(2,0),
    "UPDYRM" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP100M'
);


--
-- Name: GLPP200J; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP200J" (
    "CMPNOJ" character(3),
    "DPTNOJ" character(3),
    "ACCNOJ" character(4),
    "SUBNOJ" character(3),
    "PRDNOJ" character(2),
    "JREF1J" character(10),
    "JREF2J" character(10),
    "JSTCDJ" character(1),
    "JDESCJ" character(50),
    "JSEQNJ" numeric(3,0),
    "JCHKNJ" numeric(11,0),
    "JVNDRJ" character(10),
    "JRVSEJ" character(1),
    "JBTCHJ" numeric(5,0),
    "JPONOJ" character(12),
    "JTRMMJ" numeric(2,0),
    "JTRDDJ" numeric(2,0),
    "JTRYYJ" numeric(2,0),
    "JPSTMJ" numeric(2,0),
    "JPSTYJ" numeric(4,0),
    "DLTCDJ" character(1),
    "JSCDEJ" character(2),
    "JDEBTJ" numeric(11,2),
    "JCREDJ" numeric(11,2),
    "RVSFLJ" character(1),
    "JUPELJ" character(1),
    "UPUSRJ" character(10),
    "UPJOBJ" character(10),
    "UPTIMJ" numeric(6,0),
    "UPMONJ" numeric(2,0),
    "UPDAYJ" numeric(2,0),
    "UPDYRJ" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP200J'
);


--
-- Name: GLPP200JSV; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP200JSV" (
    "CMPNOJ" character(3),
    "DPTNOJ" character(3),
    "ACCNOJ" character(4),
    "SUBNOJ" character(3),
    "PRDNOJ" character(2),
    "JREF1J" character(10),
    "JREF2J" character(10),
    "JSTCDJ" character(1),
    "JDESCJ" character(50),
    "JSEQNJ" numeric(3,0),
    "JCHKNJ" numeric(11,0),
    "JVNDRJ" character(10),
    "JRVSEJ" character(1),
    "JBTCHJ" numeric(5,0),
    "JPONOJ" character(12),
    "JTRMMJ" numeric(2,0),
    "JTRDDJ" numeric(2,0),
    "JTRYYJ" numeric(2,0),
    "JPSTMJ" numeric(2,0),
    "JPSTYJ" numeric(4,0),
    "DLTCDJ" character(1),
    "JSCDEJ" character(2),
    "JDEBTJ" numeric(11,2),
    "JCREDJ" numeric(11,2),
    "RVSFLJ" character(1),
    "JUPELJ" character(1),
    "UPUSRJ" character(10),
    "UPJOBJ" character(10),
    "UPTIMJ" numeric(6,0),
    "UPMONJ" numeric(2,0),
    "UPDAYJ" numeric(2,0),
    "UPDYRJ" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP200JSV'
);


--
-- Name: GLPP250R; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP250R" (
    "CMPNOR" character(3),
    "DPTNOR" character(3),
    "ACCNOR" character(4),
    "SUBNOR" character(3),
    "PRDNOR" character(2),
    "JREF1R" character(10),
    "JREF2R" character(10),
    "JSTCDR" character(1),
    "JDESCR" character(50),
    "JSEQNR" numeric(3,0),
    "JCHKNR" numeric(11,0),
    "JVNDRR" character(10),
    "JRVSER" character(1),
    "JBTCHR" numeric(5,0),
    "JPONOR" character(12),
    "JTRMMR" numeric(2,0),
    "JTRDDR" numeric(2,0),
    "JTRYYR" numeric(2,0),
    "JPSTMR" numeric(2,0),
    "JPSTYR" numeric(4,0),
    "DLTCDR" character(1),
    "JSCDER" character(2),
    "PER01R" character(1),
    "PER02R" character(1),
    "PER03R" character(1),
    "PER04R" character(1),
    "PER05R" character(1),
    "PER06R" character(1),
    "PER07R" character(1),
    "PER08R" character(1),
    "PER09R" character(1),
    "PER10R" character(1),
    "PER11R" character(1),
    "PER12R" character(1),
    "PER13R" character(1),
    "JDEBTR" numeric(11,2),
    "JCREDR" numeric(11,2),
    "JBACMR" numeric(2,0),
    "JBACYR" numeric(4,0),
    "JEACMR" numeric(2,0),
    "JEACYR" numeric(4,0),
    "RVSFLR" character(1),
    "JUPELR" character(1),
    "UPUSRR" character(10),
    "UPJOBR" character(10),
    "UPTIMR" numeric(6,0),
    "UPMONR" numeric(2,0),
    "UPDAYR" numeric(2,0),
    "UPDYRR" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP250R'
);


--
-- Name: GLPP270X; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP270X" (
    "CMPNOX" character(3),
    "DPTNOX" character(3),
    "ACCNOX" character(4),
    "SUBNOX" character(3),
    "PRDNOX" character(2),
    "JREF1X" character(10),
    "JREF2X" character(10),
    "JSTCDX" character(1),
    "JDESCX" character(50),
    "JSEQNX" numeric(3,0),
    "JCHKNX" numeric(11,0),
    "JVNDRX" character(10),
    "JRVSEX" character(1),
    "JBTCHX" numeric(5,0),
    "JPONOX" character(12),
    "JTRMMX" numeric(2,0),
    "JTRDDX" numeric(2,0),
    "JTRYYX" numeric(2,0),
    "JPSTMX" numeric(2,0),
    "JPSTYX" numeric(4,0),
    "DLTCDX" character(1),
    "JSCDEX" character(2),
    "JDEBTX" numeric(11,2),
    "JCREDX" numeric(11,2),
    "RVSFLX" character(1),
    "JUPELX" character(1),
    "UPUSRX" character(10),
    "UPJOBX" character(10),
    "UPTIMX" numeric(6,0),
    "UPMONX" numeric(2,0),
    "UPDAYX" numeric(2,0),
    "UPDYRX" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP270X'
);


--
-- Name: GLPP270XS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP270XS1" (
    "CMPNOX" character(3),
    "DPTNOX" character(3),
    "ACCNOX" character(4),
    "SUBNOX" character(3),
    "PRDNOX" character(2),
    "JREF1X" character(10),
    "JREF2X" character(10),
    "JSTCDX" character(1),
    "JDESCX" character(50),
    "JSEQNX" numeric(3,0),
    "JCHKNX" numeric(11,0),
    "JVNDRX" character(10),
    "JRVSEX" character(1),
    "JBTCHX" numeric(5,0),
    "JPONOX" character(12),
    "JTRMMX" numeric(2,0),
    "JTRDDX" numeric(2,0),
    "JTRYYX" numeric(2,0),
    "JPSTMX" numeric(2,0),
    "JPSTYX" numeric(4,0),
    "DLTCDX" character(1),
    "JSCDEX" character(2),
    "JDEBTX" numeric(11,2),
    "JCREDX" numeric(11,2),
    "RVSFLX" character(1),
    "JUPELX" character(1),
    "UPUSRX" character(10),
    "UPJOBX" character(10),
    "UPTIMX" numeric(6,0),
    "UPMONX" numeric(2,0),
    "UPDAYX" numeric(2,0),
    "UPDYRX" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP270XS1'
);


--
-- Name: GLPP270XS2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP270XS2" (
    "CMPNOX" character(3),
    "DPTNOX" character(3),
    "ACCNOX" character(4),
    "SUBNOX" character(3),
    "PRDNOX" character(2),
    "JREF1X" character(10),
    "JREF2X" character(10),
    "JSTCDX" character(1),
    "JDESCX" character(50),
    "JSEQNX" numeric(3,0),
    "JCHKNX" numeric(11,0),
    "JVNDRX" character(10),
    "JRVSEX" character(1),
    "JBTCHX" numeric(5,0),
    "JPONOX" character(12),
    "JTRMMX" numeric(2,0),
    "JTRDDX" numeric(2,0),
    "JTRYYX" numeric(2,0),
    "JPSTMX" numeric(2,0),
    "JPSTYX" numeric(4,0),
    "DLTCDX" character(1),
    "JSCDEX" character(2),
    "JDEBTX" numeric(11,2),
    "JCREDX" numeric(11,2),
    "RVSFLX" character(1),
    "JUPELX" character(1),
    "UPUSRX" character(10),
    "UPJOBX" character(10),
    "UPTIMX" numeric(6,0),
    "UPMONX" numeric(2,0),
    "UPDAYX" numeric(2,0),
    "UPDYRX" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP270XS2'
);


--
-- Name: GLPP270XS3; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP270XS3" (
    "CMPNOX" character(3),
    "DPTNOX" character(3),
    "ACCNOX" character(4),
    "SUBNOX" character(3),
    "PRDNOX" character(2),
    "JREF1X" character(10),
    "JREF2X" character(10),
    "JSTCDX" character(1),
    "JDESCX" character(50),
    "JSEQNX" numeric(3,0),
    "JCHKNX" numeric(11,0),
    "JVNDRX" character(10),
    "JRVSEX" character(1),
    "JBTCHX" numeric(5,0),
    "JPONOX" character(12),
    "JTRMMX" numeric(2,0),
    "JTRDDX" numeric(2,0),
    "JTRYYX" numeric(2,0),
    "JPSTMX" numeric(2,0),
    "JPSTYX" numeric(4,0),
    "DLTCDX" character(1),
    "JSCDEX" character(2),
    "JDEBTX" numeric(11,2),
    "JCREDX" numeric(11,2),
    "RVSFLX" character(1),
    "JUPELX" character(1),
    "UPUSRX" character(10),
    "UPJOBX" character(10),
    "UPTIMX" numeric(6,0),
    "UPMONX" numeric(2,0),
    "UPDAYX" numeric(2,0),
    "UPDYRX" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP270XS3'
);


--
-- Name: GLPP400C; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPP400C" (
    "CMPNOC" character(3),
    "CMPNMC" character(40),
    "FPERDC" numeric(4,0),
    "DLTCDC" character(1),
    "DPTNOC" character(3),
    "ACCNOC" character(4),
    "SUBNOC" character(3),
    "PRDNOC" character(2),
    "CALNOC" numeric(3,0),
    "ACCPDC" numeric(2,0),
    "ACCMFC" numeric(2,0),
    "ACCDFC" numeric(2,0),
    "ACCYFC" numeric(2,0),
    "ACCMTC" numeric(2,0),
    "ACCDTC" numeric(2,0),
    "ACCYTC" numeric(2,0),
    "FP00DC" character(9),
    "FP01DC" character(9),
    "FP02DC" character(9),
    "FP03DC" character(9),
    "FP04DC" character(9),
    "FP05DC" character(9),
    "FP06DC" character(9),
    "FP07DC" character(9),
    "FP08DC" character(9),
    "FP09DC" character(9),
    "FP10DC" character(9),
    "FP11DC" character(9),
    "FP12DC" character(9),
    "FP13DC" character(9),
    "ME00DC" character(30),
    "ME01DC" character(30),
    "ME02DC" character(30),
    "ME03DC" character(30),
    "ME04DC" character(30),
    "ME05DC" character(30),
    "ME06DC" character(30),
    "ME07DC" character(30),
    "ME08DC" character(30),
    "ME09DC" character(30),
    "ME10DC" character(30),
    "ME11DC" character(30),
    "ME12DC" character(30),
    "ME13DC" character(30),
    "CF01DC" numeric(6,0),
    "CF02DC" numeric(6,0),
    "CF03DC" numeric(6,0),
    "CF04DC" numeric(6,0),
    "CF05DC" numeric(6,0),
    "CF06DC" numeric(6,0),
    "CF07DC" numeric(6,0),
    "CF08DC" numeric(6,0),
    "CF09DC" numeric(6,0),
    "CF10DC" numeric(6,0),
    "CF11DC" numeric(6,0),
    "CF12DC" numeric(6,0),
    "CF13DC" numeric(6,0),
    "CT01DC" numeric(6,0),
    "CT02DC" numeric(6,0),
    "CT03DC" numeric(6,0),
    "CT04DC" numeric(6,0),
    "CT05DC" numeric(6,0),
    "CT06DC" numeric(6,0),
    "CT07DC" numeric(6,0),
    "CT08DC" numeric(6,0),
    "CT09DC" numeric(6,0),
    "CT10DC" numeric(6,0),
    "CT11DC" numeric(6,0),
    "CT12DC" numeric(6,0),
    "CT13DC" numeric(6,0),
    "JSC01C" character(2),
    "JSC02C" character(2),
    "JSC03C" character(2),
    "JSC04C" character(2),
    "JSC05C" character(2),
    "JSC06C" character(2),
    "JSC07C" character(2),
    "JSC08C" character(2),
    "JSC09C" character(2),
    "JSC10C" character(2),
    "JSC11C" character(2),
    "JSC12C" character(2),
    "JSC13C" character(2),
    "JSC14C" character(2),
    "JSC15C" character(2),
    "FPTBPC" numeric(2,0),
    "FYTBPC" numeric(4,0),
    "MMTBPC" numeric(2,0),
    "DDTBPC" numeric(2,0),
    "YYTBPC" numeric(2,0),
    "ATC01C" character(2),
    "ATC02C" character(2),
    "ATC03C" character(2),
    "ATC04C" character(2),
    "ATC05C" character(2),
    "ATC06C" character(2),
    "ATC07C" character(2),
    "ATC08C" character(2),
    "ATC09C" character(2),
    "ATC10C" character(2),
    "ALCYDC" character(1),
    "ALCYBC" character(1),
    "ALDZAC" character(1),
    "ALPYDC" character(1),
    "ALPYBC" character(1),
    "DSCOAC" character(21),
    "CMPSDC" character(40),
    "DPTSDC" character(40),
    "ACCSDC" character(40),
    "SUBSDC" character(40),
    "PRDSDC" character(40),
    "CHGDTC" numeric(6,0),
    "DPTDSC" character(3),
    "ACCDSC" character(4),
    "SUBDSC" character(3),
    "PRDDSC" character(2),
    "OUTQNC" character(10),
    "JOBQNC" character(10),
    "UPUSRC" character(10),
    "UPJOBC" character(10),
    "UPTIMC" numeric(6,0),
    "UPMONC" numeric(2,0),
    "UPDAYC" numeric(2,0),
    "UPDYRC" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPP400C'
);


--
-- Name: GLPT200J; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."GLPT200J" (
    "CMPNOJ" character(3),
    "DPTNOJ" character(3),
    "ACCNOJ" character(4),
    "SUBNOJ" character(3),
    "PRDNOJ" character(2),
    "JREF1J" character(10),
    "JREF2J" character(10),
    "JSTCDJ" character(1),
    "JDESCJ" character(50),
    "JSEQNJ" numeric(3,0),
    "JCHKNJ" numeric(11,0),
    "JVNDRJ" character(10),
    "JRVSEJ" character(1),
    "JBTCHJ" numeric(5,0),
    "JPONOJ" character(12),
    "JTRMMJ" numeric(2,0),
    "JTRDDJ" numeric(2,0),
    "JTRYYJ" numeric(2,0),
    "JPSTMJ" numeric(2,0),
    "JPSTYJ" numeric(4,0),
    "DLTCDJ" character(1),
    "JSCDEJ" character(2),
    "JDEBTJ" numeric(11,2),
    "JCREDJ" numeric(11,2),
    "RVSFLJ" character(1),
    "JUPELJ" character(1),
    "UPUSRJ" character(10),
    "UPJOBJ" character(10),
    "UPTIMJ" numeric(6,0),
    "UPMONJ" numeric(2,0),
    "UPDAYJ" numeric(2,0),
    "UPDYRJ" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'GLPT200J'
);


--
-- Name: HLPP100; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."HLPP100" (
    "HPGM#" character(10),
    "HSID#" character(8),
    "HSEQ#" numeric(3,0),
    "HL01" character(78),
    "HL02" character(78),
    "HL03" character(78),
    "HL04" character(78),
    "HL05" character(78),
    "HL06" character(78),
    "HL07" character(78),
    "HL08" character(78),
    "HL09" character(78),
    "HL10" character(78),
    "HL11" character(78),
    "HL12" character(78),
    "HL13" character(78),
    "HL14" character(78),
    "HL15" character(78),
    "HL16" character(78),
    "HL17" character(78),
    "HL18" character(78),
    "HL19" character(78),
    "HL20" character(78),
    "HL21" character(78),
    "HL22" character(78)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'HLPP100'
);


--
-- Name: ITLOOKUP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ITLOOKUP" (
    "WORD" character(15),
    "VE#" character(15)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ITLOOKUP'
);


--
-- Name: LOOKUP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."LOOKUP" (
    "CONUM" numeric(2,0),
    "DIVSN" numeric(2,0),
    "WORD" character(10),
    "CUST#" character(8)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'LOOKUP'
);


--
-- Name: ORDP010T; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ORDP010T" (
    "STATUT" character(1),
    "MAJKYT" character(3),
    "MINKYT" character(15),
    "TABLET" character(60),
    "DCHMOT" numeric(2,0),
    "DCHDDT" numeric(2,0),
    "DCHYRT" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ORDP010T'
);


--
-- Name: ORDP010TS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ORDP010TS1" (
    "STATUT" character(1),
    "MAJKYT" character(3),
    "MINKYT" character(15),
    "TABLET" character(60),
    "DCHMOT" numeric(2,0),
    "DCHDDT" numeric(2,0),
    "DCHYRT" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ORDP010TS1'
);


--
-- Name: ORDP160E; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."ORDP160E" (
    "STSE" character(1),
    "SREGNE" character(5),
    "SLSMNE" character(4),
    "SLNAME" character(30),
    "SLAD1E" character(30),
    "SLAD2E" character(30),
    "SLAD3E" character(30),
    "SLCTYE" character(17),
    "SLSTE" character(2),
    "SLZIPE" character(10),
    "SLAREE" numeric(3,0),
    "SLEXCE" numeric(3,0),
    "SLTL#E" numeric(4,0),
    "SLHDDE" numeric(2,0),
    "SLHMME" numeric(2,0),
    "SLHYYE" numeric(2,0),
    "SLHCCE" numeric(1,0),
    "SLTDDE" numeric(2,0),
    "SLTMME" numeric(2,0),
    "SLTYYE" numeric(2,0),
    "SLTCCE" numeric(1,0),
    "SLCDDE" numeric(2,0),
    "SLCMME" numeric(2,0),
    "SLCYYE" numeric(2,0),
    "SLCCCE" numeric(1,0),
    "SLPCME" numeric(5,3),
    "SCQM1" numeric(11,2),
    "SCQM2" numeric(11,2),
    "SCQM3" numeric(11,2),
    "SCQM4" numeric(11,2),
    "SCQM5" numeric(11,2),
    "SCQM6" numeric(11,2),
    "SCQM7" numeric(11,2),
    "SCQM8" numeric(11,2),
    "SCQM9" numeric(11,2),
    "SCQM10" numeric(11,2),
    "SCQM11" numeric(11,2),
    "SCQM12" numeric(11,2),
    "SCQM13" numeric(11,2),
    "SCSM1" numeric(11,2),
    "SCSM2" numeric(11,2),
    "SCSM3" numeric(11,2),
    "SCSM4" numeric(11,2),
    "SCSM5" numeric(11,2),
    "SCSM6" numeric(11,2),
    "SCSM7" numeric(11,2),
    "SCSM8" numeric(11,2),
    "SCSM9" numeric(11,2),
    "SCSM10" numeric(11,2),
    "SCSM11" numeric(11,2),
    "SCSM12" numeric(11,2),
    "SCSM13" numeric(11,2),
    "SLQM1" numeric(11,2),
    "SLQM2" numeric(11,2),
    "SLQM3" numeric(11,2),
    "SLQM4" numeric(11,2),
    "SLQM5" numeric(11,2),
    "SLQM6" numeric(11,2),
    "SLQM7" numeric(11,2),
    "SLQM8" numeric(11,2),
    "SLQM9" numeric(11,2),
    "SLQM10" numeric(11,2),
    "SLQM11" numeric(11,2),
    "SLQM12" numeric(11,2),
    "SLQM13" numeric(11,2),
    "SLSM1" numeric(11,2),
    "SLSM2" numeric(11,2),
    "SLSM3" numeric(11,2),
    "SLSM4" numeric(11,2),
    "SLSM5" numeric(11,2),
    "SLSM6" numeric(11,2),
    "SLSM7" numeric(11,2),
    "SLSM8" numeric(11,2),
    "SLSM9" numeric(11,2),
    "SLSM10" numeric(11,2),
    "SLSM11" numeric(11,2),
    "SLSM12" numeric(11,2),
    "SLSM13" numeric(11,2),
    "OPNDDE" numeric(2,0),
    "OPNDME" numeric(2,0),
    "OPNDYE" numeric(2,0),
    "OPNDCE" numeric(1,0),
    "APVNDE" character(8),
    "MTDS$E" numeric(11,2)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'ORDP160E'
);


--
-- Name: SECP001P; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SECP001P" (
    "MENUP" character(10),
    "PROFP" character(10),
    "DATA" character(99)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SECP001P'
);


--
-- Name: SYSP001P; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP001P" (
    "MENUP" character(10),
    "PROFP" character(10),
    "DATA" character(99),
    "CO#P" numeric(2,0),
    "DIV#P" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP001P'
);


--
-- Name: SYSP400H; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP400H" (
    "HLPPGM" character(10),
    "HLPFMT" character(10),
    "HLPSEQ" numeric(4,0),
    "HLPDES" character(72)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP400H'
);


--
-- Name: SYSP650Y; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP650Y" (
    "YCMPNY" numeric(2,0),
    "YDIVSN" numeric(2,0),
    "YNAME" character(25),
    "YADR1" character(30),
    "YADR2" character(30),
    "YCITY" character(17),
    "YSTATE" character(2),
    "YZIPCD" character(10),
    "YFLAG" character(1),
    "YACTMM" numeric(2,0),
    "YACTYY" numeric(2,0),
    "YLACTM" numeric(2,0),
    "YLACTY" numeric(2,0),
    "YCLODM" numeric(2,0),
    "YCLODD" numeric(2,0),
    "YCLODY" numeric(2,0),
    "YLCLOM" numeric(2,0),
    "YLCLOD" numeric(2,0),
    "YLCLOY" numeric(2,0),
    "YMTHPR" character(1),
    "YAPACM" numeric(2,0),
    "YAPACY" numeric(2,0),
    "YAPLSM" numeric(2,0),
    "YAPLSY" numeric(2,0),
    "YAPFMM" numeric(2,0),
    "YAPFMD" numeric(2,0),
    "YAPFMY" numeric(2,0),
    "YAPTOM" numeric(2,0),
    "YAPTOD" numeric(2,0),
    "YAPTOY" numeric(2,0),
    "YGLCD1" character(3),
    "YGLCD2" character(4),
    "YGLCD3" character(3),
    "YGLCD4" character(2),
    "YFEDID" character(15),
    "YPFLAG" character(1),
    "YARGLY" numeric(2,0),
    "YARGLM" numeric(2,0),
    "YAPGLY" numeric(2,0),
    "YAPGLM" numeric(2,0),
    "YLBID" character(10),
    "YOEGLM" numeric(2,0),
    "YOEGLY" numeric(2,0),
    "YACTM" numeric(2,0),
    "YACTY" numeric(2,0),
    "YARGL" character(12),
    "YAPGL" character(12),
    "YXTRA1" character(10),
    "YXTRA2" character(10),
    "YXTRA3" numeric(7,0),
    "YXTRA4" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP650Y'
);


--
-- Name: SYSP650YS1; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP650YS1" (
    "YCMPNY" numeric(2,0),
    "YDIVSN" numeric(2,0),
    "YNAME" character(25),
    "YADR1" character(30),
    "YADR2" character(30),
    "YCITY" character(17),
    "YSTATE" character(2),
    "YZIPCD" character(10),
    "YFLAG" character(1),
    "YACTMM" numeric(2,0),
    "YACTYY" numeric(2,0),
    "YLACTM" numeric(2,0),
    "YLACTY" numeric(2,0),
    "YCLODM" numeric(2,0),
    "YCLODD" numeric(2,0),
    "YCLODY" numeric(2,0),
    "YLCLOM" numeric(2,0),
    "YLCLOD" numeric(2,0),
    "YLCLOY" numeric(2,0),
    "YMTHPR" character(1),
    "YAPACM" numeric(2,0),
    "YAPACY" numeric(2,0),
    "YAPLSM" numeric(2,0),
    "YAPLSY" numeric(2,0),
    "YAPFMM" numeric(2,0),
    "YAPFMD" numeric(2,0),
    "YAPFMY" numeric(2,0),
    "YAPTOM" numeric(2,0),
    "YAPTOD" numeric(2,0),
    "YAPTOY" numeric(2,0),
    "YGLCD1" character(3),
    "YGLCD2" character(4),
    "YGLCD3" character(3),
    "YGLCD4" character(2),
    "YFEDID" character(15),
    "YPFLAG" character(1),
    "YARGLY" numeric(2,0),
    "YARGLM" numeric(2,0),
    "YAPGLY" numeric(2,0),
    "YAPGLM" numeric(2,0),
    "YLBID" character(10),
    "YOEGLM" numeric(2,0),
    "YOEGLY" numeric(2,0),
    "YACTM" numeric(2,0),
    "YACTY" numeric(2,0),
    "YARGL" character(12),
    "YAPGL" character(12),
    "YXTRA1" character(10),
    "YXTRA2" character(10),
    "YXTRA3" numeric(7,0),
    "YXTRA4" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP650YS1'
);


--
-- Name: SYSP650YS2; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP650YS2" (
    "YCMPNY" numeric(2,0),
    "YDIVSN" numeric(2,0),
    "YNAME" character(25),
    "YADR1" character(30),
    "YADR2" character(30),
    "YCITY" character(17),
    "YSTATE" character(2),
    "YZIPCD" character(10),
    "YFLAG" character(1),
    "YACTMM" numeric(2,0),
    "YACTYY" numeric(2,0),
    "YLACTM" numeric(2,0),
    "YLACTY" numeric(2,0),
    "YCLODM" numeric(2,0),
    "YCLODD" numeric(2,0),
    "YCLODY" numeric(2,0),
    "YLCLOM" numeric(2,0),
    "YLCLOD" numeric(2,0),
    "YLCLOY" numeric(2,0),
    "YMTHPR" character(1),
    "YAPACM" numeric(2,0),
    "YAPACY" numeric(2,0),
    "YAPLSM" numeric(2,0),
    "YAPLSY" numeric(2,0),
    "YAPFMM" numeric(2,0),
    "YAPFMD" numeric(2,0),
    "YAPFMY" numeric(2,0),
    "YAPTOM" numeric(2,0),
    "YAPTOD" numeric(2,0),
    "YAPTOY" numeric(2,0),
    "YGLCD1" character(3),
    "YGLCD2" character(4),
    "YGLCD3" character(3),
    "YGLCD4" character(2),
    "YFEDID" character(15),
    "YPFLAG" character(1),
    "YARGLY" numeric(2,0),
    "YARGLM" numeric(2,0),
    "YAPGLY" numeric(2,0),
    "YAPGLM" numeric(2,0),
    "YLBID" character(10),
    "YOEGLM" numeric(2,0),
    "YOEGLY" numeric(2,0),
    "YACTM" numeric(2,0),
    "YACTY" numeric(2,0),
    "YARGL" character(12),
    "YAPGL" character(12),
    "YXTRA1" character(10),
    "YXTRA2" character(10),
    "YXTRA3" numeric(7,0),
    "YXTRA4" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP650YS2'
);


--
-- Name: SYSP650YS3; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSP650YS3" (
    "YCMPNY" numeric(2,0),
    "YDIVSN" numeric(2,0),
    "YNAME" character(25),
    "YADR1" character(30),
    "YADR2" character(30),
    "YCITY" character(17),
    "YSTATE" character(2),
    "YZIPCD" character(10),
    "YFLAG" character(1),
    "YACTMM" numeric(2,0),
    "YACTYY" numeric(2,0),
    "YLACTM" numeric(2,0),
    "YLACTY" numeric(2,0),
    "YCLODM" numeric(2,0),
    "YCLODD" numeric(2,0),
    "YCLODY" numeric(2,0),
    "YLCLOM" numeric(2,0),
    "YLCLOD" numeric(2,0),
    "YLCLOY" numeric(2,0),
    "YMTHPR" character(1),
    "YAPACM" numeric(2,0),
    "YAPACY" numeric(2,0),
    "YAPLSM" numeric(2,0),
    "YAPLSY" numeric(2,0),
    "YAPFMM" numeric(2,0),
    "YAPFMD" numeric(2,0),
    "YAPFMY" numeric(2,0),
    "YAPTOM" numeric(2,0),
    "YAPTOD" numeric(2,0),
    "YAPTOY" numeric(2,0),
    "YGLCD1" character(3),
    "YGLCD2" character(4),
    "YGLCD3" character(3),
    "YGLCD4" character(2),
    "YFEDID" character(15),
    "YPFLAG" character(1),
    "YARGLY" numeric(2,0),
    "YARGLM" numeric(2,0),
    "YAPGLY" numeric(2,0),
    "YAPGLM" numeric(2,0),
    "YLBID" character(10),
    "YOEGLM" numeric(2,0),
    "YOEGLY" numeric(2,0),
    "YACTM" numeric(2,0),
    "YACTY" numeric(2,0),
    "YARGL" character(12),
    "YAPGL" character(12),
    "YXTRA1" character(10),
    "YXTRA2" character(10),
    "YXTRA3" numeric(7,0),
    "YXTRA4" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSP650YS3'
);


--
-- Name: SYSPLIB; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSPLIB" (
    "APPCDL" character(3),
    "LIBSQL" numeric(3,0),
    "LIBTPL" character(3),
    "LIBNML" character(10)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSPLIB'
);


--
-- Name: SYSTCCD; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTCCD" (
    "CCCOD" character(2),
    "CCDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTCCD'
);


--
-- Name: SYSTCLS; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTCLS" (
    "CLCUST" character(2),
    "CLDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTCLS'
);


--
-- Name: SYSTSTA; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTSTA" (
    "STCOD" character(2),
    "STDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTSTA'
);


--
-- Name: SYSTTCL; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTTCL" (
    "TCLAS" character(2),
    "TCDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTTCL'
);


--
-- Name: SYSTTRM; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTTRM" (
    "TTERMS" character(3),
    "TTRMTY" numeric(2,0),
    "TTDESC" character(30),
    "TTNDAY" numeric(4,0),
    "TTDDAY" numeric(4,0),
    "TTDPCT" numeric(5,2),
    "TTDDA2" numeric(4,0),
    "TTDPC2" numeric(5,2),
    "TTDEF" numeric(2,0),
    "TTINST" numeric(2,0),
    "TTGDAY" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTTRM'
);


--
-- Name: SYSTTYP; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSTTYP" (
    "TYCUST" character(2),
    "TYDESC" character(30)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSTTYP'
);


--
-- Name: SYSX520; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX520" (
    "XGA1" character(3),
    "XGA2" character(4),
    "XGA3" character(3),
    "XGA4" character(2),
    "XGDESC" character(30),
    "XSCODE" character(1),
    "XUPSTS" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX520'
);


--
-- Name: SYSX540; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX540" (
    "XBBANK" character(2),
    "XBNAME" character(20),
    "XBDESC" character(20),
    "XBGLNO" character(12),
    "XBGLOF" character(12),
    "XSCODE" character(1),
    "XUPSTS" character(6),
    "XBADR1" character(30),
    "XBADR2" character(30),
    "XBCITY" character(17),
    "XBSTAT" character(2),
    "XBZIP" character(10),
    "XBAREA" numeric(3,0),
    "XBEXCD" numeric(3,0),
    "XBTEL#" numeric(4,0),
    "XBFIL1" character(6),
    "XBGLCS" character(12),
    "XBGLAP" character(12),
    "XBBNNO" character(7)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX540'
);


--
-- Name: SYSX625; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX625" (
    "STCODW" character(2),
    "STDESW" character(30),
    "STTYP" character(1),
    "RECDES" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX625'
);


--
-- Name: SYSX630; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX630" (
    "CCCODW" character(2),
    "CCDESW" character(30),
    "CCTYP" character(1),
    "RECDES" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX630'
);


--
-- Name: SYSX635; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX635" (
    "TCLASW" character(2),
    "TCDESW" character(30),
    "TCTYP" character(1),
    "RECDES" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX635'
);


--
-- Name: SYSX640; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX640" (
    "CLCUSW" character(2),
    "CLDESW" character(30),
    "CLTYP" character(1),
    "RECDES" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX640'
);


--
-- Name: SYSX645; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX645" (
    "TYCUSW" character(2),
    "TYDESW" character(30),
    "TYTYP" character(1),
    "RECDES" character(6)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX645'
);


--
-- Name: SYSX655; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX655" (
    "XCMPNY" numeric(2,0),
    "XDIVSN" numeric(2,0),
    "XNAME" character(25),
    "XADR1" character(30),
    "XADR2" character(30),
    "XCITY" character(17),
    "XSTATE" character(2),
    "XZIPCD" character(10),
    "XVUSTS" character(6),
    "XVSTAT" character(1),
    "XGLCD1" character(3),
    "XGLCD2" character(4),
    "XGLCD3" character(3),
    "XGLCD4" character(2),
    "XFEDID" character(15),
    "XPFLAG" character(1),
    "XARGL" character(12),
    "XAPGL" character(12),
    "XLBID" character(10)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX655'
);


--
-- Name: SYSX720; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."SYSX720" (
    "XTERMS" character(3),
    "XTRMTY" numeric(2,0),
    "XTDESC" character(30),
    "XTNDAY" numeric(4,0),
    "XTDDAY" numeric(4,0),
    "XTDPCT" numeric(5,2),
    "XTDDA2" numeric(4,0),
    "XTDPC2" numeric(5,2),
    "XTDEF" numeric(2,0),
    "XTSTAT" character(1),
    "XTUSTS" character(6),
    "XTINST" numeric(2,0),
    "XTGDAY" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'SYSX720'
);


--
-- Name: TABTRN; Type: FOREIGN TABLE; Schema: db2_gdssyfil; Owner: -
--

CREATE FOREIGN TABLE db2_gdssyfil."TABTRN" (
    "TTSVC" character(1),
    "TTCODE" character(3),
    "TTDESC" character(30),
    "TTTYPE" numeric(2,0),
    "TTDAYS" numeric(3,0),
    "TTSTMT" character(20),
    "TTAFCL" character(1),
    "TTGLN1" character(3),
    "TTGLN2" character(4),
    "TTGLN3" character(3),
    "TTGLN4" character(2),
    "TTGLO1" character(3),
    "TTGLO2" character(4),
    "TTGLO3" character(3),
    "TTGLO4" character(2),
    "TTAGE" character(1),
    "TTRMS" character(3)
)
SERVER as400
OPTIONS (
    schema 'GDSSYFIL',
    "table" 'TABTRN'
);


--
-- Name: DSSP200I; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."DSSP200I" (
    "CUSTI" character(8),
    "BCUSI" character(8),
    "VOLDCI" numeric(6,0),
    "VAMTI" numeric(5,2),
    "FLAGI" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'DSSP200I'
);


--
-- Name: EXPP100A; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."EXPP100A" (
    "VEND#A" character(8),
    "VOCH#A" character(10),
    "APINVA" character(10),
    "ESTA" character(1),
    "PAIDA" character(1),
    "ARA" character(1),
    "NOAPA" character(1),
    "PROA" character(1),
    "AMTA" numeric(9,2),
    "DISCA" numeric(7,2),
    "CHKA" numeric(6,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "EXPA" character(3),
    "LOADA" character(6),
    "LOTA" character(5),
    "BOATA" character(3),
    "ENTRYA" character(13)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'EXPP100A'
);


--
-- Name: EXPP120B; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."EXPP120B" (
    "VEND#B" character(8),
    "VOCH#B" character(10),
    "SEQB" numeric(4,0),
    "EXPB" character(3),
    "NOAPB" character(1),
    "PAIDB" character(1),
    "QTYB" numeric(5,0),
    "PRICEB" numeric(7,2),
    "AMTB" numeric(9,2),
    "PRORTB" numeric(4,2),
    "BOATB" character(3),
    "BOLB" character(6),
    "EMB" numeric(2,0),
    "PRODB" numeric(4,0),
    "PID#B" character(12),
    "SHPRB" character(7)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'EXPP120B'
);


--
-- Name: INVP200A; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP200A" (
    "PRODA" character(2),
    "DSCPA" character(20),
    "GRUPA" character(5),
    "FDAPRA" character(2),
    "FDACDA" character(3),
    "TEMPA" character(2),
    "SRT1A" numeric(3,0),
    "SUM1A" character(1),
    "PRD2A" character(2),
    "CMBA" character(2),
    "CMBSRA" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP200A'
);


--
-- Name: INVP200B; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP200B" (
    "VARB" character(4),
    "DESCVB" character(15),
    "SQB" numeric(2,0),
    "DESC2B" character(10),
    "SQ2B" numeric(2,0),
    "SRT2B" numeric(3,0),
    "SUM2B" character(1),
    "GRPB" character(2),
    "CMBB" character(4),
    "URLB" character(40)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP200B'
);


--
-- Name: INVP200E; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP200E" (
    "ITEME" character(15),
    "COSDEE" character(18),
    "DFPLQE" numeric(5,0),
    "UPCE" numeric(10,0),
    "VDPROE" character(1),
    "VDEXCE" character(1),
    "LOT#E" character(4),
    "OPNCE" numeric(1,0),
    "OPNME" numeric(2,0),
    "OPNDE" numeric(2,0),
    "OPNYE" numeric(2,0),
    "CHGDCE" numeric(1,0),
    "CHGDME" numeric(2,0),
    "CHGDDE" numeric(2,0),
    "CHGDYE" numeric(2,0),
    "USERE" character(10),
    "URLE" character(40)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP200E'
);


--
-- Name: INVP205C; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP205C" (
    "ITEMC" character(2),
    "VARC" character(4),
    "JVCODC" character(3),
    "JVSRTC" character(3),
    "JVDSCC" character(7),
    "SHPCODC" character(3),
    "SHPSRTC" character(3),
    "SHPDSCC" character(5),
    "CMBCODC" character(3),
    "CMBSRTC" character(3),
    "CMBDSCC" character(7),
    "SHPRC" character(7)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP205C'
);


--
-- Name: INVP220W; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP220W" (
    "STSW" character(1),
    "WHSEW" character(2),
    "NAMEW" character(30),
    "ADD1W" character(30),
    "ADD2W" character(30),
    "ADD3W" character(30),
    "CITYW" character(17),
    "STW" character(2),
    "CTRYW" character(5),
    "ZIPW" character(10),
    "AREAW" numeric(3,0),
    "EXCHGW" numeric(3,0),
    "TEL#W" numeric(4,0),
    "OUTQW" character(10),
    "OPNDCW" numeric(1,0),
    "OPNDMW" numeric(2,0),
    "OPNDDW" numeric(2,0),
    "OPNDYW" numeric(2,0),
    "CLSDCW" numeric(1,0),
    "CLSDMW" numeric(2,0),
    "CLSDDW" numeric(2,0),
    "CLSDYW" numeric(2,0),
    "CHGDCW" numeric(1,0),
    "CHGDMW" numeric(2,0),
    "CHGDDW" numeric(2,0),
    "CHGDYW" numeric(2,0),
    "S$MTDW" numeric(11,2),
    "S$YTDW" numeric(11,2),
    "SQMTDW" numeric(9,0),
    "SQYTDW" numeric(9,0),
    "RQMTDW" numeric(9,0),
    "RQYTDW" numeric(9,0),
    "TQMTDW" numeric(9,0),
    "TQYTDW" numeric(9,0),
    "XQMTDW" numeric(9,0),
    "XQYTDW" numeric(9,0),
    "TCDSTW" character(2),
    "TCDCTW" character(3),
    "TCDCIW" character(5),
    "TCDMTW" character(2),
    "PIFLGW" character(1),
    "CNTYW" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP220W'
);


--
-- Name: INVP509J; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP509J" (
    "SHPR#J" character(7),
    "CNTRYJ" character(3),
    "ITEMJ" character(1),
    "LABELJ" character(3),
    "CCODEJ" character(2),
    "BOXTJ" character(2),
    "BOXSJ" character(2),
    "PACKSJ" character(2),
    "PACKOJ" character(2),
    "PACKQJ" numeric(2,0),
    "PACKWJ" numeric(3,1),
    "PCODEJ" character(2),
    "TREEJ" character(2),
    "GRADEJ" character(2),
    "MAWJ" character(2),
    "LINERJ" character(2),
    "NETWTJ" numeric(3,1),
    "NETBWJ" numeric(2,1),
    "LENGTHJ" numeric(3,1),
    "WIDTHJ" numeric(3,1),
    "HIGHTJ" numeric(3,1),
    "PIDJ" character(2),
    "DEFQTYJ" numeric(3,0),
    "PLUJ" character(1),
    "DESTJ" character(2),
    "OLDPKJ" character(4),
    "OLDLBJ" character(3),
    "JVPAKJ" character(4),
    "NEWPKJ" character(5),
    "DESC2D" character(5),
    "SRT3D" numeric(3,0),
    "P4J" character(4),
    "S1J" character(1),
    "S3J" character(1),
    "GROWJ" character(8),
    "SPEJ" character(2),
    "SUBCATJ" character(2),
    "HOLDJ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP509J'
);


--
-- Name: INVP510K; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP510K" (
    "SHPR#K" character(7),
    "VNAMEK" character(20),
    "CNTRYK" character(3),
    "CMBK" character(7),
    "CMBSRK" character(3)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP510K'
);


--
-- Name: INVP511L; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP511L" (
    "CNTRYL" character(3),
    "CNAMEL" character(20),
    "CMBL" character(2),
    "CMBSRL" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP511L'
);


--
-- Name: INVP513N; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP513N" (
    "LABELN" character(3),
    "LNAMEN" character(4),
    "SHPR#N" character(7),
    "SNAMEN" character(15),
    "SRTN" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP513N'
);


--
-- Name: INVP514O; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP514O" (
    "SHPR#O" character(7),
    "CCODEO" character(2),
    "CUST#O" character(8),
    "CNAMEO" character(10),
    "SRTO" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP514O'
);


--
-- Name: INVP515P; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP515P" (
    "SHPR#P" character(7),
    "BOXP" character(2),
    "BXDSCP" character(10),
    "SRTP" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP515P'
);


--
-- Name: INVP516Q; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP516Q" (
    "SHPR#Q" character(7),
    "BOXQ" character(2),
    "BXDSCQ" character(10),
    "CMBQ" character(2),
    "CMDSCQ" character(10),
    "CMBSRQ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP516Q'
);


--
-- Name: INVP517R; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP517R" (
    "SHPR#R" character(7),
    "PACKR" character(2),
    "DESCRR" character(10),
    "CMBR" character(2),
    "CMBSRR" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP517R'
);


--
-- Name: INVP518S; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP518S" (
    "SHPR#S" character(7),
    "PACKS" character(2),
    "DESCS" character(10),
    "CMBS" character(2),
    "CMBSRS" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP518S'
);


--
-- Name: INVP519T; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP519T" (
    "SHPR#T" character(7),
    "PCODET" character(2),
    "DESCTT" character(10),
    "CMBT" character(2),
    "CMBSRT" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP519T'
);


--
-- Name: INVP520U; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP520U" (
    "SHPR#U" character(7),
    "TREEU" character(2),
    "DESCTU" character(10),
    "SRTU" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP520U'
);


--
-- Name: INVP521V; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP521V" (
    "SHPR#V" character(7),
    "GRADEV" character(2),
    "DESCTV" character(7),
    "SRTV" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP521V'
);


--
-- Name: INVP522W; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP522W" (
    "SHPR#W" character(7),
    "MAW" character(2),
    "DESCTW" character(10),
    "SRTW" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP522W'
);


--
-- Name: INVP523X; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP523X" (
    "SHPR#X" character(7),
    "LINERX" character(2),
    "DESCTX" character(10),
    "SRTX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP523X'
);


--
-- Name: INVP524Y; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP524Y" (
    "SHPR#Y" character(7),
    "PIDY" character(2),
    "DESCTY" character(10),
    "CMBY" character(2),
    "CMBSRY" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP524Y'
);


--
-- Name: INVP525Z; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP525Z" (
    "SHPR#Z" character(7),
    "DESTZ" character(2),
    "DESCTZ" character(10),
    "SRTZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP525Z'
);


--
-- Name: INVP526A; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."INVP526A" (
    "SHPR#A" character(7),
    "HOLDA" character(2),
    "DESCTA" character(10),
    "SRTA" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'INVP526A'
);


--
-- Name: ORDP100A; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP100A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP100A'
);


--
-- Name: ORDP120B; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP120B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP120B'
);


--
-- Name: ORDP170H; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP170H" (
    "FLAGH" character(1),
    "OPTH" character(1),
    "STATH" character(1),
    "ORDNOH" numeric(11,0),
    "BO#H" numeric(2,0),
    "LINE#H" numeric(3,0),
    "SEQ#H" numeric(3,0),
    "PID#H" character(12),
    "SHPQTH" numeric(7,0),
    "CONCDH" character(1),
    "CRCODH" character(1),
    "SELLPH" numeric(7,2),
    "VLD1H" numeric(3,2),
    "VLD2H" numeric(3,2),
    "PROMOH" numeric(3,2),
    "BRKRGH" numeric(3,2),
    "FRTH" numeric(5,2),
    "ADJFH" numeric(5,2),
    "ADJH" numeric(5,2),
    "MRKPH" numeric(7,2),
    "USRPRH" character(10),
    "CHGDTH" numeric(6,0),
    "CHGTIH" numeric(6,0),
    "YEARH" numeric(2,0),
    "LAYERH" numeric(1,0),
    "MIAH" numeric(5,2),
    "SEASH" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP170H'
);


--
-- Name: ORDP170U; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP170U" (
    "STATU" character(1),
    "ORDNOU" numeric(11,0),
    "BO#U" numeric(2,0),
    "LINE#U" numeric(3,0),
    "SEQ#U" numeric(3,0),
    "SHPQTU" numeric(7,0),
    "BOAT#U" character(3),
    "PID#U" character(12),
    "CONCDU" character(1),
    "CRCODU" character(1),
    "SELLPU" numeric(7,2),
    "VLD1U" numeric(3,2),
    "VLD2U" numeric(3,2),
    "BRKRGU" numeric(3,2),
    "PROMOU" numeric(3,2),
    "FRTU" numeric(5,2),
    "ADJFU" numeric(5,2),
    "ADJU" numeric(5,2),
    "CRAMTU" numeric(9,2),
    "CCLQTU" numeric(3,0),
    "MRKPU" numeric(7,2),
    "LAYERU" numeric(1,0),
    "MIAU" numeric(5,2),
    "SEASU" character(2),
    "FLAG1U" character(2),
    "FLAG2U" character(2),
    "FLAG3U" character(2),
    "FLAG4U" character(2),
    "FLAG5U" character(2),
    "CODE#U" character(3)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP170U'
);


--
-- Name: ORDP7102; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP7102" (
    "VESSL" character(3),
    "PALID" character(12),
    "GROWID" character(8),
    "PRODNO" character(4),
    "PACKG" character(4),
    "SIZE" character(3),
    "QNTYP" numeric(3,0),
    "FUMIG" character(1),
    "PACKDT" numeric(4,0),
    "FILL1" character(1),
    "CLASIF" numeric(2,0),
    "HATCH" character(1),
    "DECKS" character(1),
    "FILL2" character(3),
    "PORTCD" numeric(3,0),
    "PORTEM" numeric(2,0),
    "SIZEQ" character(3),
    "SEASON" character(2),
    "SHIPPR" character(7),
    "FDAID2" character(15),
    "GTIN#" character(14),
    "BATCH#" character(20),
    "SSCC#" character(18)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP7102'
);


--
-- Name: ORDP710J; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP710J" (
    "RECTYP" character(1),
    "FILLER" character(1),
    "VESSL" character(3),
    "PALID" character(12),
    "PRODNO" numeric(4,0),
    "GROWID" character(8),
    "PACKG" character(4),
    "SIZEQ" numeric(3,0),
    "QNTYP" numeric(3,0),
    "FUMIG" character(1),
    "PACKDT" numeric(4,0),
    "CLASIF" numeric(2,0),
    "HATCH" character(1),
    "DECKS" character(1),
    "PLBOL" character(6),
    "PORTCD" numeric(3,0),
    "PORTEM" numeric(2,0),
    "VARIND" numeric(1,0),
    "OCCURS" numeric(2,0),
    "QLST1" numeric(2,0),
    "CALGN1" numeric(1,0),
    "QLST2" numeric(2,0),
    "CALGN2" numeric(1,0),
    "QLST3" numeric(2,0),
    "CALGN3" numeric(1,0),
    "QLST4" numeric(2,0),
    "CALGN4" numeric(1,0),
    "QLST5" numeric(2,0),
    "CALGN5" numeric(1,0),
    "PRIBOX" numeric(3,0),
    "GRWBOX" numeric(2,0),
    "BLUSH" numeric(3,0),
    "COLOR" character(2),
    "PRESSR" numeric(3,0),
    "OBSV1" numeric(3,0),
    "OBSV2" numeric(3,0),
    "GROUP" character(2),
    "HRVDAT" character(4),
    "CONTR" character(15),
    "FACIL" character(1),
    "SEASON" character(2),
    "SHIPPR" character(7),
    "FDAIDJ" character(15),
    "TEMP#J" character(12)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP710J'
);


--
-- Name: ORDP710V; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP710V" (
    "BOAT#V" character(3),
    "PID#V" character(12),
    "NOPALV" character(1),
    "PROD#V" character(15),
    "PBOXQV" numeric(7,0),
    "RBOXQV" numeric(7,0),
    "QTYRTV" numeric(3,0),
    "PLOC#V" character(2),
    "ROOMV" character(2),
    "SECTV" character(2),
    "ROWV" character(3),
    "JVLOTV" character(5),
    "SHPR#V" character(7),
    "TRNCSV" numeric(6,0),
    "ORD#V" numeric(11,0),
    "BONBRV" numeric(2,0),
    "SHPFGV" character(1),
    "AGEDV" numeric(3,0),
    "CLASSV" character(2),
    "VOLDCV" numeric(6,0),
    "ORGLCV" character(2),
    "TIERV" character(1),
    "TIMEV" character(5),
    "FLG1V" character(1),
    "FLG2V" character(1),
    "FLG3V" character(1),
    "FLG4V" character(1),
    "FLG5V" character(1),
    "SEQV" character(2),
    "TCENV" character(1),
    "TDATEV" character(6),
    "TTIMEV" character(6),
    "SEASV" character(2),
    "AVLDTV" character(4),
    "AVLTMV" character(4),
    "COMMV" character(40)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP710V'
);


--
-- Name: ORDP730X; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP730X" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP730X'
);


--
-- Name: ORDP740Y; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP740Y" (
    "LOAD#Y" character(6),
    "TRKIDY" character(8),
    "FRGTY" numeric(9,2),
    "FOBY" character(1),
    "SHPDTY" numeric(6,0),
    "RYAN#Y" character(10),
    "SPIN1Y" character(50),
    "TRKNMY" character(30),
    "EXPEDY" character(10),
    "TSTRTY" numeric(6,0),
    "TCOMPY" numeric(6,0),
    "LOCNY" character(2),
    "CFLAGY" character(1),
    "TLIC#Y" character(10),
    "STATY" character(1),
    "INUSY" character(1),
    "TCNFRY" numeric(6,0),
    "CRTIDY" character(8),
    "CRGTY" numeric(9,2),
    "TEMPY" character(2),
    "TIMINY" numeric(6,0),
    "TIMOTY" numeric(6,0),
    "LDLCKY" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP740Y'
);


--
-- Name: ORDP750Z; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP750Z" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3),
    "COL#Z" character(2),
    "FRTDDZ" numeric(2,0),
    "FRTMMZ" numeric(2,0),
    "FRTYYZ" numeric(2,0),
    "FRTCEZ" numeric(2,0),
    "FRTFXZ" character(12),
    "DOCDDZ" numeric(2,0),
    "DOCMMZ" numeric(2,0),
    "DOCYYZ" numeric(2,0),
    "DOCCEZ" numeric(2,0),
    "DOCFXZ" character(12),
    "PAYTYZ" character(1),
    "INVWKZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP750Z'
);


--
-- Name: ORDP900A; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."ORDP900A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "TYPEA" character(2),
    "PWHSEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1),
    "OKA" character(1),
    "OKMMA" numeric(2,0),
    "OKDDA" numeric(2,0),
    "OKYYA" numeric(2,0),
    "OKCCA" numeric(1,0),
    "OKTIMA" numeric(6,0),
    "ALRA" character(1),
    "ALRMMA" numeric(2,0),
    "ALRDDA" numeric(2,0),
    "ALRYYA" numeric(2,0),
    "ALRCCA" numeric(1,0),
    "ALRTMA" numeric(6,0),
    "ARPPA" character(1),
    "ARMMA" numeric(2,0),
    "ARDDA" numeric(2,0),
    "ARYYA" numeric(2,0),
    "ARCCA" numeric(1,0),
    "ARTMA" numeric(6,0),
    "LD#2A" character(6)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'ORDP900A'
);


--
-- Name: TEMP100H; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."TEMP100H" (
    "TLOCH" character(2),
    "ORD#H" character(10),
    "PACKH" character(8),
    "TEMPH" character(2),
    "BAGSH" numeric(5,0),
    "LOSSP" numeric(6,3),
    "ORDDATE" numeric(6,0),
    "WTIN" numeric(9,3),
    "WTOUT" numeric(9,3),
    "BOXIN" numeric(5,0),
    "BOXOUT" numeric(5,0),
    "RUN#" character(6),
    "COMM#H" character(40),
    "CRTDATE" numeric(6,0),
    "USERH" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'TEMP100H'
);


--
-- Name: TEMP110D; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."TEMP110D" (
    "ORD#D" character(10),
    "RUN#D" character(6),
    "PACKD" character(8),
    "TEMPD" character(2),
    "LIQD" character(3),
    "PID#D" character(15),
    "PIDNEW" character(15),
    "BOX_IN" numeric(3,0),
    "BOX_OUT" numeric(3,0),
    "COMMENTD" character(12),
    "CRTDATED" numeric(6,0),
    "USERD" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'TEMP110D'
);


--
-- Name: TEMP200S; Type: FOREIGN TABLE; Schema: db2_jvfil; Owner: -
--

CREATE FOREIGN TABLE db2_jvfil."TEMP200S" (
    "PACKS" character(8),
    "CTXWTS" character(5),
    "DESCS" character(30),
    "LIQS" character(3),
    "LENGTHS" numeric(5,3),
    "PKWT" numeric(4,2)
)
SERVER as400
OPTIONS (
    schema 'JVFIL',
    "table" 'TEMP200S'
);


--
-- Name: INVJ200C; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."INVJ200C" (
    "ORGSZC" character(3),
    "SIZC" character(5),
    "SRT4C" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'INVJ200C'
);


--
-- Name: INVP200E; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."INVP200E" (
    "ITEME" character(15),
    "COSDEE" character(18),
    "DFPLQE" numeric(5,0),
    "UPCE" numeric(10,0),
    "VDPROE" character(1),
    "VDEXCE" character(1),
    "LOT#E" character(4),
    "OPNCE" numeric(1,0),
    "OPNME" numeric(2,0),
    "OPNDE" numeric(2,0),
    "OPNYE" numeric(2,0),
    "CHGDCE" numeric(1,0),
    "CHGDME" numeric(2,0),
    "CHGDDE" numeric(2,0),
    "CHGDYE" numeric(2,0),
    "USERE" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'INVP200E'
);


--
-- Name: INVP200ESV; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."INVP200ESV" (
    "ITEME" character(15),
    "COSDEE" character(18),
    "DFPLQE" numeric(5,0),
    "UPCE" numeric(10,0),
    "VDPROE" character(1),
    "VDEXCE" character(1),
    "LOT#E" character(4),
    "OPNCE" numeric(1,0),
    "OPNME" numeric(2,0),
    "OPNDE" numeric(2,0),
    "OPNYE" numeric(2,0),
    "CHGDCE" numeric(1,0),
    "CHGDME" numeric(2,0),
    "CHGDDE" numeric(2,0),
    "CHGDYE" numeric(2,0),
    "USERE" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'INVP200ESV'
);


--
-- Name: INVP730X; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."INVP730X" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'INVP730X'
);


--
-- Name: JRN100; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."JRN100" (
    "JOENTT" character(2),
    "JODATE" character(6),
    "JOJOB" character(10),
    "JOUSER" character(10),
    "JOTIME" numeric(6,0),
    "JOPGM" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'JRN100'
);


--
-- Name: JRN100A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."JRN100A" (
    "JOENTT" character(2),
    "JODATE" character(6),
    "JOTIME" numeric(6,0),
    "JOJOB" character(10),
    "JOUSER" character(10),
    "JOPGM" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'JRN100A'
);


--
-- Name: JRN120HOLD; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."JRN120HOLD" (
    "JOSEQN" numeric(10,0),
    "YEAR" character(2),
    "JODATE" character(6),
    "JOTIME" numeric(6,0),
    "JOJOB" character(10),
    "JOUSER" character(10),
    "JOENTT" character(2),
    "JOPGM" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'JRN120HOLD'
);


--
-- Name: ORDJ750Z; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDJ750Z" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDJ750Z'
);


--
-- Name: ORDN750Z; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDN750Z" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3),
    "COL#Z" character(2),
    "FRTDDZ" numeric(2,0),
    "FRTMMZ" numeric(2,0),
    "FRTYYZ" numeric(2,0),
    "FRTCEZ" numeric(2,0),
    "FRTFXZ" character(12),
    "DOCDDZ" numeric(2,0),
    "DOCMMZ" numeric(2,0),
    "DOCYYZ" numeric(2,0),
    "DOCCEZ" numeric(2,0),
    "DOCFXZ" character(12),
    "PAYTYZ" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDN750Z'
);


--
-- Name: ORDP100A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP100A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP100A'
);


--
-- Name: ORDP100AJJ; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP100AJJ" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP100AJJ'
);


--
-- Name: ORDP100AS1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP100AS1" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP100AS1'
);


--
-- Name: ORDP100ASV; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP100ASV" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP100ASV'
);


--
-- Name: ORDP105A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP105A" (
    "SEQ#A" numeric(4,0),
    "LINEA" character(74)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP105A'
);


--
-- Name: ORDP110A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP110A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "SNAMA" character(30),
    "SATTA" character(30),
    "SADD1A" character(30),
    "SADD2A" character(30),
    "SADD3A" character(30),
    "SCTYA" character(22),
    "SSTA" character(2),
    "SZIPA" character(10),
    "SCTRYA" character(5),
    "SEAS#A" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP110A'
);


--
-- Name: ORDP1201; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP1201" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "BOAT#B" character(3),
    "SELLPB" numeric(11,4),
    "FRT$B" numeric(4,2),
    "NPALB" numeric(5,0),
    "ADJAB" character(5),
    "SORDB" character(1),
    "SHPIDB" character(7),
    "I2" character(2),
    "I4" character(4),
    "SZ" character(3),
    "FOBA" character(1),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPMMA" numeric(2,0),
    "CPO#A" character(22),
    "DISCC" numeric(5,2),
    "FRTALC" numeric(3,2),
    "CUST#C" character(8),
    "CUSNMC" character(30),
    "SUM2B" character(1),
    "DFPLQE" numeric(5,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP1201'
);


--
-- Name: ORDP120B; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP120B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP120B'
);


--
-- Name: ORDP120BJ1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP120BJ1" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP120BJ1'
);


--
-- Name: ORDP120BJ2; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP120BJ2" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP120BJ2'
);


--
-- Name: ORDP120BS1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP120BS1" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP120BS1'
);


--
-- Name: ORDP120BSV; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP120BSV" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2),
    "WHCODB" character(2),
    "SRTWHB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP120BSV'
);


--
-- Name: ORDP123B; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP123B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJB" numeric(5,2),
    "PROPRD" character(15),
    "CUSTA" character(8),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CUSNMC" character(30),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISCC" numeric(5,2),
    "VOLDCI" numeric(6,0),
    "FRTALC" numeric(3,2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP123B'
);


--
-- Name: ORDP126B; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP126B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "ORGPB" numeric(5,0),
    "CUSTA" character(8),
    "BCUS#S" character(8),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "FLAGB" character(1),
    "ENTCCB" numeric(1,0),
    "ENTYYB" numeric(2,0),
    "ENTMMB" numeric(2,0),
    "ENTDDB" numeric(2,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP126B'
);


--
-- Name: ORDP140C; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP140C" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP140C'
);


--
-- Name: ORDP140CS1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP140CS1" (
    "STATC" character(1),
    "ORD#C" numeric(11,0),
    "BONBRC" numeric(2,0),
    "SEQC" numeric(3,0),
    "COMMC" character(30),
    "PRTC" numeric(1,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP140CS1'
);


--
-- Name: ORDP170U; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP170U" (
    "STATU" character(1),
    "ORDNOU" numeric(11,0),
    "BO#U" numeric(2,0),
    "LINE#U" numeric(3,0),
    "SEQ#U" numeric(3,0),
    "SHPQTU" numeric(7,0),
    "BOAT#U" character(3),
    "PID#U" character(7),
    "CONCDU" character(1),
    "CRCODU" character(1),
    "SELLPU" numeric(7,2),
    "VLD1U" numeric(3,2),
    "VLD2U" numeric(3,2),
    "BRKRGU" numeric(3,2),
    "PROMOU" numeric(3,2),
    "FRTU" numeric(5,2),
    "ADJFU" numeric(5,2),
    "ADJU" numeric(5,2),
    "CRAMTU" numeric(9,2),
    "CCLQTU" numeric(3,0),
    "MRKPU" numeric(7,2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP170U'
);


--
-- Name: ORDP705R; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP705R" (
    "BOAT#R" character(3),
    "PID#R" character(7),
    "NOPALR" character(1),
    "PROD#R" character(15),
    "PBOXQR" numeric(7,0),
    "RBOXQR" numeric(7,0),
    "PLOC#R" character(2),
    "FLADDR" character(10),
    "JVLOTR" character(5),
    "SHPR#R" character(7),
    "CLASSR" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP705R'
);


--
-- Name: ORDP710V; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP710V" (
    "BOAT#V" character(3),
    "PID#V" character(7),
    "NOPALV" character(1),
    "PROD#V" character(15),
    "PBOXQV" numeric(7,0),
    "RBOXQV" numeric(7,0),
    "QTYRTV" numeric(3,0),
    "PLOC#V" character(2),
    "ROOMV" character(2),
    "SECTV" character(2),
    "ROWV" character(3),
    "JVLOTV" character(5),
    "SHPR#V" character(7),
    "TRNCSV" numeric(6,0),
    "ORD#V" numeric(11,0),
    "BONBRV" numeric(2,0),
    "SHPFGV" character(1),
    "AGEDV" numeric(3,0),
    "CLASSV" character(2),
    "VOLDCV" numeric(6,0),
    "ORGLCV" character(2),
    "TIERV" character(1),
    "TIMEV" character(5)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP710V'
);


--
-- Name: ORDP730X; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730X" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730X'
);


--
-- Name: ORDP730XH; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730XH" (
    "ACTION" character(10),
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2),
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "COL#Z" character(2),
    "WEEK#Z" numeric(2,0),
    "CHGDATE" numeric(6,0),
    "CHGTIME" numeric(6,0),
    "CHGUSER" character(10),
    "CHGPGM" character(10)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730XH'
);


--
-- Name: ORDP730XJJ; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730XJJ" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730XJJ'
);


--
-- Name: ORDP730XS1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730XS1" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730XS1'
);


--
-- Name: ORDP730XS2; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730XS2" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730XS2'
);


--
-- Name: ORDP730XSV; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP730XSV" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0),
    "COL#X" character(2),
    "P2X" character(2),
    "P4X" character(4),
    "CMB4X" character(4),
    "CBSR2X" character(3),
    "PLUX" character(3),
    "PKWTX" character(4),
    "G2X" character(2),
    "G2SRTX" character(2),
    "GPCODX" character(3),
    "GPCDSX" character(3),
    "JVCODX" character(3),
    "JVCDSX" character(3),
    "SHCODX" character(3),
    "SHCDSX" character(3),
    "S2X" character(2),
    "S2SRTX" character(2),
    "CSHPRX" character(7),
    "CBSRKX" character(3),
    "CNTRYX" character(3),
    "CMBLX" character(2),
    "CNTSRX" character(2),
    "LABELX" character(3),
    "LABSRX" character(2),
    "CCODEX" character(2),
    "SRTOX" character(2),
    "BOXPX" character(2),
    "SRTPX" character(2),
    "BOXQX" character(2),
    "CMBQX" character(2),
    "CBSRQX" character(2),
    "PACKRX" character(2),
    "CMBKRX" character(2),
    "CBSRRX" character(2),
    "PACKSX" character(2),
    "CMBKSX" character(2),
    "CBSRSX" character(2),
    "PCODEX" character(2),
    "CMBTX" character(2),
    "CBSRTX" character(2),
    "TREEX" character(2),
    "SRTUX" character(2),
    "GRADEX" character(2),
    "SRTVX" character(2),
    "MAX" character(2),
    "SRTWX" character(2),
    "PIDX" character(2),
    "CMBYX" character(2),
    "CBSRYX" character(2),
    "GPDSCX" character(7),
    "WEEKX" character(2),
    "GLOCX" character(2),
    "SRTLCX" character(2),
    "HOLDX" character(2),
    "SRTHDX" character(2),
    "LOTSPX" character(2),
    "HTMLX" character(1),
    "REGX" character(2),
    "INVWKX" character(2),
    "COLDAY" character(2),
    "WHCODX" character(2),
    "SRTWHX" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP730XSV'
);


--
-- Name: ORDP735Q; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP735Q" (
    "PROD#Q" character(15),
    "BOAT#Q" character(3),
    "SHPR#Q" character(7),
    "PONHQ" numeric(7,0),
    "PAVLQ" numeric(7,0),
    "PSHPQ" numeric(7,0),
    "PRCVQ" numeric(7,0),
    "RBOXQQ" numeric(7,0),
    "PBOXQQ" numeric(7,0),
    "CBOXQQ" numeric(7,0),
    "SBOXQQ" numeric(7,0),
    "HIQ" numeric(7,2),
    "LOQ" numeric(7,2),
    "AVQ" numeric(7,2),
    "ADJ1Q" numeric(11,2),
    "ADJ2Q" numeric(11,2),
    "FOB$Q" numeric(11,2),
    "QFRMQ" numeric(7,2),
    "QTOQ" numeric(7,2),
    "TRBLQ" character(1),
    "P4Q" character(4),
    "GPCODQ" character(3),
    "GPCDSQ" character(3),
    "GPDSCQ" character(7),
    "LOTSPQ" character(2),
    "ORDTAQ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP735Q'
);


--
-- Name: ORDP740Y; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP740Y" (
    "LOAD#Y" character(5),
    "TRKIDY" character(8),
    "FRGTY" numeric(9,2),
    "FOBY" character(1),
    "SHPDTY" numeric(6,0),
    "RYAN#Y" character(7),
    "SPIN1Y" character(50),
    "TRKNMY" character(30),
    "EXPEDY" character(10),
    "TSTRTY" numeric(6,0),
    "TCOMPY" numeric(6,0),
    "LOCNY" character(2),
    "CFLAGY" character(1),
    "TLIC#Y" character(10),
    "STATY" character(1),
    "INUSY" character(1),
    "TCNFRY" numeric(6,0),
    "CRTIDY" character(8),
    "CRGTY" numeric(9,2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP740Y'
);


--
-- Name: ORDP750P; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP750P" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP750P'
);


--
-- Name: ORDP750Z; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP750Z" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3),
    "COL#Z" character(2),
    "FRTDDZ" numeric(2,0),
    "FRTMMZ" numeric(2,0),
    "FRTYYZ" numeric(2,0),
    "FRTCEZ" numeric(2,0),
    "FRTFXZ" character(12),
    "DOCDDZ" numeric(2,0),
    "DOCMMZ" numeric(2,0),
    "DOCYYZ" numeric(2,0),
    "DOCCEZ" numeric(2,0),
    "DOCFXZ" character(12),
    "PAYTYZ" character(1),
    "INVWKZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP750Z'
);


--
-- Name: ORDP750ZS1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP750ZS1" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3),
    "COL#Z" character(2),
    "FRTDDZ" numeric(2,0),
    "FRTMMZ" numeric(2,0),
    "FRTYYZ" numeric(2,0),
    "FRTCEZ" numeric(2,0),
    "FRTFXZ" character(12),
    "DOCDDZ" numeric(2,0),
    "DOCMMZ" numeric(2,0),
    "DOCYYZ" numeric(2,0),
    "DOCCEZ" numeric(2,0),
    "DOCFXZ" character(12),
    "PAYTYZ" character(1),
    "INVWKZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP750ZS1'
);


--
-- Name: ORDP750ZSV; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP750ZSV" (
    "BOAT#Z" character(3),
    "BNAMEZ" character(30),
    "ARVPTZ" character(2),
    "CNTRYZ" character(3),
    "DEPDDZ" numeric(2,0),
    "DEPMMZ" numeric(2,0),
    "DEPYYZ" numeric(2,0),
    "DEPCEZ" numeric(2,0),
    "ARVDDZ" numeric(2,0),
    "ARVMMZ" numeric(2,0),
    "ARVYYZ" numeric(2,0),
    "ARVCEZ" numeric(2,0),
    "DISDDZ" numeric(2,0),
    "DISMMZ" numeric(2,0),
    "DISYYZ" numeric(2,0),
    "DISCEZ" numeric(2,0),
    "SEASNZ" numeric(2,0),
    "INVFGZ" character(1),
    "LQDFGZ" character(1),
    "WEEK#Z" numeric(2,0),
    "PRE#Z" character(3),
    "CMB#Z" character(3),
    "COL#Z" character(2),
    "FRTDDZ" numeric(2,0),
    "FRTMMZ" numeric(2,0),
    "FRTYYZ" numeric(2,0),
    "FRTCEZ" numeric(2,0),
    "FRTFXZ" character(12),
    "DOCDDZ" numeric(2,0),
    "DOCMMZ" numeric(2,0),
    "DOCYYZ" numeric(2,0),
    "DOCCEZ" numeric(2,0),
    "DOCFXZ" character(12),
    "PAYTYZ" character(1),
    "INVWKZ" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP750ZSV'
);


--
-- Name: ORDP900A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDP900A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "TYPEA" character(2),
    "PWHSEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1),
    "OKA" character(1),
    "OKMMA" numeric(2,0),
    "OKDDA" numeric(2,0),
    "OKYYA" numeric(2,0),
    "OKCCA" numeric(1,0),
    "OKTIMA" numeric(6,0),
    "ALRA" character(1),
    "ALRMMA" numeric(2,0),
    "ALRDDA" numeric(2,0),
    "ALRYYA" numeric(2,0),
    "ALRCCA" numeric(1,0),
    "ALRTMA" numeric(6,0),
    "ARPPA" character(1),
    "ARMMA" numeric(2,0),
    "ARDDA" numeric(2,0),
    "ARYYA" numeric(2,0),
    "ARCCA" numeric(1,0),
    "ARTMA" numeric(6,0),
    "LD#2A" character(6)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDP900A'
);


--
-- Name: ORDPPRE1; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDPPRE1" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDPPRE1'
);


--
-- Name: ORDPPRE2; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDPPRE2" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDPPRE2'
);


--
-- Name: ORDQ120B; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDQ120B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "SELLPB" numeric(11,4),
    "DISCC" numeric(5,2),
    "FRTALC" numeric(3,2),
    "FRT$B" numeric(4,2),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "CUST#C" character(8),
    "DIFLGC" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDQ120B'
);


--
-- Name: ORDQ170U; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDQ170U" (
    "STATU" character(1),
    "ORDNOU" numeric(11,0),
    "BO#U" numeric(2,0),
    "LINE#U" numeric(3,0),
    "SHPQTU" numeric(7,0),
    "SELLPU" numeric(7,2),
    "VLD1U" numeric(3,2),
    "VLD2U" numeric(3,2),
    "BRKRGU" numeric(3,2),
    "PROMOU" numeric(3,2),
    "FRTU" numeric(5,2),
    "ADJU" numeric(5,2),
    "ADJFU" numeric(5,2),
    "CONCDU" character(1),
    "BOAT#V" character(3),
    "PROD#V" character(15)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDQ170U'
);


--
-- Name: ORDT100A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDT100A" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "PWHSEA" character(2),
    "TYPEA" character(2),
    "INV#A" character(8),
    "REFNOA" character(8),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "CPO#A" character(22),
    "CORMMA" numeric(2,0),
    "CORDDA" numeric(2,0),
    "CORYYA" numeric(2,0),
    "CORCCA" numeric(1,0),
    "ENTMMA" numeric(2,0),
    "ENTDDA" numeric(2,0),
    "ENTYYA" numeric(2,0),
    "ENTCCA" numeric(1,0),
    "ASPMMA" numeric(2,0),
    "ASPDDA" numeric(2,0),
    "ASPYYA" numeric(2,0),
    "ASPCCA" numeric(1,0),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "CHG#A" numeric(5,0),
    "CHGDTA" numeric(6,0),
    "INVMMA" numeric(2,0),
    "INVDDA" numeric(2,0),
    "INVYYA" numeric(2,0),
    "INVCCA" numeric(1,0),
    "QTYTA" numeric(7,0),
    "INV$A" numeric(9,2),
    "CMPUTA" numeric(9,2),
    "SLSMCA" character(4),
    "USRIDA" character(10),
    "ORTIMA" numeric(6,0),
    "REG#A" numeric(3,0),
    "PAIDA" character(1),
    "WEEK#A" numeric(2,0),
    "SEAS#A" numeric(2,0),
    "DLZNA" character(4),
    "TPLQTA" numeric(7,0),
    "TBXQTA" numeric(7,0),
    "LOAD#A" character(6),
    "LDLOCA" character(1),
    "TRKIDA" character(8),
    "LDSTSA" character(1),
    "FOBA" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDT100A'
);


--
-- Name: ORDT120B; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDT120B" (
    "STATB" character(1),
    "ORD#B" numeric(11,0),
    "BONBRB" numeric(2,0),
    "LINE#B" numeric(3,0),
    "ITEMNB" character(15),
    "SWHS#B" character(2),
    "ORDQTB" numeric(7,0),
    "SELLPB" numeric(11,4),
    "NOINVB" character(1),
    "FRT$B" numeric(4,2),
    "BOAT#B" character(3),
    "SHPIDB" character(7),
    "JVLOTB" character(5),
    "NPALB" numeric(5,0),
    "SORDB" character(1),
    "ADJAB" character(5),
    "P2B" character(2),
    "P4B" character(4),
    "SRT1B" character(3),
    "SRT2BB" character(3),
    "CMB4B" character(4),
    "CBSR2B" character(3),
    "PLUB" character(3),
    "PKWTB" character(4),
    "G2B" character(2),
    "G2SRTB" character(2),
    "GPCODB" character(3),
    "GPCDSB" character(3),
    "JVCODB" character(3),
    "JVCDSB" character(3),
    "SHCODB" character(3),
    "SHCDSB" character(3),
    "S2B" character(2),
    "S2SRTB" character(2),
    "CSHPRB" character(7),
    "CBSRKB" character(3),
    "CNTRYB" character(3),
    "CMBLB" character(2),
    "CNTSRB" character(2),
    "LABELB" character(3),
    "LABSRB" character(2),
    "CCODEB" character(2),
    "SRTOB" character(2),
    "BOXPB" character(2),
    "SRTPB" character(2),
    "BOXQB" character(2),
    "CMBQB" character(2),
    "CBSRQB" character(2),
    "PACKRB" character(2),
    "CMBKRB" character(2),
    "CBSRRB" character(2),
    "PACKSB" character(2),
    "CMBKSB" character(2),
    "CBSRSB" character(2),
    "PCODEB" character(2),
    "CMBTB" character(2),
    "CBSRTB" character(2),
    "TREEB" character(2),
    "SRTUB" character(2),
    "GRADEB" character(2),
    "SRTVB" character(2),
    "MAB" character(2),
    "SRTWB" character(2),
    "PIDB" character(2),
    "CMBYB" character(2),
    "CBSRYB" character(2),
    "FLAGB" character(1),
    "GLOCB" character(2),
    "SRTLCB" character(2),
    "HOLDB" character(2),
    "SRTHDB" character(2),
    "LOTSPB" character(2),
    "REGB" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDT120B'
);


--
-- Name: ORDT121C; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDT121C" (
    "STATA" character(1),
    "ORD#A" numeric(11,0),
    "BONBRA" numeric(2,0),
    "CUSTA" character(8),
    "SHP#A" character(4),
    "SWHS#B" character(2),
    "DWHS#B" character(2),
    "SHPMMA" numeric(2,0),
    "SHPDDA" numeric(2,0),
    "SHPYYA" numeric(2,0),
    "SHPCCA" numeric(1,0),
    "DLZ1" character(1),
    "DLZ3" character(3),
    "NPALB" numeric(5,0),
    "BOAT#B" character(3),
    "FOBA" character(1),
    "SNAMA" character(30),
    "SCTYA" character(22),
    "SSTA" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDT121C'
);


--
-- Name: ORDT7303; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDT7303" (
    "SRT1X" numeric(3,0),
    "SUM2X" character(1),
    "SRT3X" numeric(3,0),
    "PROD4X" character(4),
    "BOAT#X" character(3),
    "INDEX" numeric(3,0),
    "RCVC" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDT7303'
);


--
-- Name: ORDT7304; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."ORDT7304" (
    "SUM2X" character(1),
    "BOAT#X" character(3),
    "SIZEX" character(3),
    "PRCVX" numeric(7,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'ORDT7304'
);


--
-- Name: SAVP730X; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."SAVP730X" (
    "PROD#X" character(15),
    "PLOC#X" character(2),
    "BOAT#X" character(3),
    "JVLOTX" character(5),
    "SHPR#X" character(7),
    "PRCVX" numeric(7,0),
    "PCOMX" numeric(7,0),
    "PONHX" numeric(7,0),
    "PAVLX" numeric(7,0),
    "PSHPX" numeric(7,0),
    "PXFRIX" numeric(7,0),
    "PXFROX" numeric(7,0),
    "INVFGX" character(1),
    "SRT1X" numeric(3,0),
    "SUM1X" character(1),
    "SRT2X" numeric(3,0),
    "SUM2X" character(1),
    "SRT4X" numeric(3,0),
    "SRT3X" numeric(3,0)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'SAVP730X'
);


--
-- Name: SESS710R; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."SESS710R" (
    "SEAYRR" character(2),
    "BOAT#R" character(3),
    "WEEKR" numeric(2,0),
    "WEEK1R" numeric(2,0),
    "COLOR" character(5),
    "SIZE" character(3),
    "PROD4R" character(4),
    "PROD3R" character(3),
    "PROD2R" character(4),
    "RBOXQR" numeric(7,0),
    "PRD2R" character(2),
    "SRT2R" numeric(3,0),
    "SRT4R" numeric(3,0),
    "PAGER" character(1),
    "SHPR#R" character(7),
    "RECVR" numeric(2,0),
    "COASTR" character(1)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'SESS710R'
);


--
-- Name: SESS710RX; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."SESS710RX" (
    "SEAYRR" character(2),
    "BOAT#R" character(3),
    "WEEKR" numeric(2,0),
    "COLOR" character(5),
    "SIZE" character(3),
    "PROD4R" character(4),
    "PROD3R" character(3),
    "PROD2R" character(2),
    "RBOXQR" numeric(7,0),
    "PRD2R" character(2)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'SESS710RX'
);


--
-- Name: SLSO100A; Type: FOREIGN TABLE; Schema: db2_jvprefil; Owner: -
--

CREATE FOREIGN TABLE db2_jvprefil."SLSO100A" (
    "BREAKLVL" character(1),
    "OVERFLOW" character(1),
    "SLSMCA" character(4)
)
SERVER as400
OPTIONS (
    schema 'JVPREFIL',
    "table" 'SLSO100A'
);


SET default_table_access_method = heap;

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231108144453');
