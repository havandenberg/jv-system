create schema db2_GDSAPFIL;
IMPORT FOREIGN SCHEMA "GDSAPFIL" FROM SERVER as400 INTO db2_GDSAPFIL;

-- NOTICE:  Data type not supported (-2) for column INVNOH
-- NOTICE:  Data type not supported (-2) for column PTYPEH
-- NOTICE:  Data type not supported (-2) for column CHKSTH
-- NOTICE:  Data type not supported (-2) for column TRTYPH
-- NOTICE:  Data type not supported (-2) for column VEND#H

create schema db2_GDSDSFIL;
IMPORT FOREIGN SCHEMA "GDSDSFIL" FROM SERVER as400 INTO db2_GDSDSFIL;

create schema db2_GDSSYFIL;
IMPORT FOREIGN SCHEMA "GDSSYFIL" FROM SERVER as400 INTO db2_GDSSYFIL;

create schema db2_JVFIL;
IMPORT FOREIGN SCHEMA "JVFIL" EXCEPT (
 "FIELDREF" -- this is a table with more then 1600 columns that postgres won't import
) FROM SERVER as400 INTO db2_JVFIL;  -- long time +500s

create schema db2_JVPREFIL;
IMPORT FOREIGN SCHEMA "JVPREFIL" FROM SERVER as400 INTO db2_JVPREFIL;


