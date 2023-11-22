FROM postgres:13

ADD ./v11.5.4_linuxx64_client.tar.gz /db2

RUN apt update && apt install -y \
    odbc-postgresql \
    freetds-dev \
    unixodbc \
    unixodbc-dev \
    git \
    dpkg-dev \
    libodbc1 \
    postgresql-server-dev-13 && \
  git clone https://github.com/CartoDB/odbc_fdw.git && \
  cd odbc_fdw && \
  make && \
  make install

RUN apt -y install postgresql-13-cron

# add dbmate
RUN apt install -y curl
RUN curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
RUN chmod +x /usr/local/bin/dbmate

RUN  yes yes | /db2/client/db2_install -f sysreq

ENV DB2_HOME    /opt/ibm/db2/V11.5
ENV AS400_PWD default

RUN echo "\n\
[DB2]\n\
Driver=/opt/ibm/db2/V11.5/lib64/libdb2o.so\n\
Description=Db2 ODBC\n\
Pooling=Yes\n\
FileUsage=1\n\
DontDLClose=1\n\
CPTimeout=120\n\
UsageCount=1\n\
Threading=2\n\
\n\
[ODBC]\n\
Pooling=Yes\n\
"> /etc/odbcinst.ini

RUN echo "\n\
[as400]\n\
Driver=DB2\n\
Database=S7808481\n\
Protocol=TCPIP\n\
Hostname=172.30.30.10\n\
Port=446\n\
uid=HV\n\
pwd=${AS400_PWD}\n\
FileUsage=1\n\
DontDLClose=1\n\
CPTimeout=120\n\
\n\
[ODBC]\n\
Pooling=Yes\n\
" >> /etc/odbc.ini

ENV DB2LIB      /opt/ibm/db2/V11.5/lib64
ENV DB2INSTANCE postgres

RUN /opt/ibm/db2/V11.5/instance/db2icrt postgres && \
  cp /etc/odbc.ini /var/lib/postgresql/sqllib/cfg/db2cli.ini

# COPY db2consv_ee.lic /opt/ibm/db2/V11.5/license/db2consv_ee.lic
COPY *_linuxx64_client.tar.gz /var/lib/postgresql
COPY db2consv_ee.lic /var/lib/postgresql
COPY db2consv_ee.lic /opt/ibm/db2/V11.5

USER postgres

RUN sh -c "/var/lib/postgresql/sqllib/adm/db2licm -a /opt/ibm/db2/V11.5/db2consv_ee.lic"


ADD ./init /docker-entrypoint-initdb.d

ADD ./migrations /db/migrations

USER root