# Homework 4 Backend

Spring Boot backend for the online bookstore homework.

## Run With MySQL

1. Start MySQL.
2. Initialize the database:

```bash
mysql -u root < database/init.sql
```

If your local MySQL user is not `root`, replace `root` with your username.

3. Start the backend:

```bash
mvn spring-boot:run
```

The service runs on `http://localhost:8080` by default.

## APIs

- `POST /api/v1/users/register`
- `GET /api/v1/books`
- `GET /api/v1/book/{id}`

## Configuration

Environment variables:

- `MYSQL_URL`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
