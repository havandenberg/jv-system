# Jac Vandenberg System

## DBMate

https://github.com/amacneil/dbmate

running database migrations with dbmate, this will run any pending database migrations.

```bash
docker compose run db dbmate up
```
DB mate keeps track of which migrations have been run inside each database, giving better
control over when a migration runs. This also protects against partial migrations by
wrapping everything in a transaction and rolling it back if there was failure.


creating database migrations with dbmate

```bash
docker compose run db dbmate n <name-the-migration>
```