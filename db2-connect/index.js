var ibmdb = require('ibm_db');
var connStr =
  'DATABASE=S7808481;HOSTNAME=172.30.30.10;UID=HV;PWD=HV;PORT=446;PROTOCOL=TCPIP;';

ibmdb.open(connStr, function (err, conn) {
  if (err) return console.log(err);
  console.log('good');

  conn.query('select 1 from sysibm.sysdummy1', function (err, data) {
    if (err) console.log(err);
    else console.log(data);

    conn.close(function () {
      console.log('done');
    });
  });
});
