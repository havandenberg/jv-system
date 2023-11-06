
CREATE EXTENSION odbc_fdw;
CREATE SERVER as400 FOREIGN DATA WRAPPER odbc_fdw OPTIONS (dsn 'AS400');
GRANT USAGE ON FOREIGN SERVER as400 TO postgres;
CREATE USER MAPPING FOR PUBLIC SERVER as400 OPTIONS (odbc_UID 'HV', odbc_PWD '*******');
IMPORT FOREIGN SCHEMA "JVPREFIL" FROM SERVER as400 INTO public;

SELECT "PROD#X" FROM "public"."ORDP730X" LIMIT 10;
