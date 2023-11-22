
# write new config
echo "
cron.database_name = 'jv-db'
shared_preload_libraries = 'pg_cron'
" >> /var/lib/postgresql/data/postgresql.conf
