# Steps

* Download IBM Data Server Client (Linux AMD64 and Intel EM64T). This is larger but includes the header files for db2_fdw
  * This required a login but not a paid subscription.
  * Page worked in Chrome but not Firefox.
  * https://epwt-www.mybluemix.net/software/support/trial/cst/programwebsite.wss?siteId=850&h=null&tabId=
* Copy `db2consv_ee.lic` from running worker or graphql server docker instances
  * Inside the node_modules directory on the volume
* Build and run docker
* psql commands from fdw.sql
