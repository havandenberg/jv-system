-- migrate:up

CREATE EXTENSION odbc_fdw;
CREATE SERVER as400 FOREIGN DATA WRAPPER odbc_fdw OPTIONS (dsn 'AS400');
GRANT USAGE ON FOREIGN SERVER as400 TO postgres;
-- update password before running
CREATE USER MAPPING FOR PUBLIC SERVER as400 OPTIONS (odbc_UID 'HV', odbc_PWD '****');

create schema db2_GDSAPFIL;
IMPORT FOREIGN SCHEMA "GDSAPFIL"
FROM SERVER as400 INTO db2_GDSAPFIL;
create schema db2_GDSDSFIL;
IMPORT FOREIGN SCHEMA "GDSDSFIL"
FROM SERVER as400 INTO db2_GDSDSFIL;
create schema db2_GDSSYFIL;
IMPORT FOREIGN SCHEMA "GDSSYFIL"
FROM SERVER as400 INTO db2_GDSSYFIL;


create schema db2_JVFIL;
IMPORT FOREIGN SCHEMA "JVFIL"
LIMIT TO (
        "DSSP200I",
        "EXPP100A",
        "EXPP120B",
        "INVP200A",
        "INVP200B",
        "INVP200E",
        "INVP205C",
        "INVP220W",
        "INVP509J",
        "INVP510K",
        "INVP511L",
        "INVP513N",
        "INVP514O",
        "INVP515P",
        "INVP516Q",
        "INVP517R",
        "INVP518S",
        "INVP519T",
        "INVP520U",
        "INVP521V",
        "INVP522W",
        "INVP523X",
        "INVP524Y",
        "INVP525Z",
        "INVP526A",
        "ORDP100A",
        "ORDP120B",
        "ORDP170H",
        "ORDP170U",
        "ORDP7102",
        "ORDP710V",
        "ORDP710J",
        "ORDP730X",
        "ORDP740Y",
        "ORDP750Z",
        "ORDP900A",
        "TEMP100H",
        "TEMP110D",
        "TEMP200S"
    )
FROM SERVER as400 INTO db2_JVFIL;

create schema db2_JVPREFIL;
IMPORT FOREIGN SCHEMA "JVPREFIL"
FROM SERVER as400 INTO db2_JVPREFIL;

-- migrate:down