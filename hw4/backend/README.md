# Homework 4 Backend

## Default mode: MySQL

1. Start a MySQL server.
2. Run the initialization script:

```bash
mysql -u root < database/init.sql
```

3. Start the backend:

```bash
mvn spring-boot:run
```

Environment variables:

- `MYSQL_URL`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`
- `CORS_ALLOWED_ORIGINS`

## Demo mode: embedded H2

This profile is only for local API verification when a MySQL daemon is unavailable in the current environment.

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```
