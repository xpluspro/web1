# Iteration 2 Backend

本后端使用 Spring Boot + Spring Data JPA 实现在线书店迭代 2 的数据库访问和 JSON API。工程按控制层、服务接口、服务实现、数据访问层、实体层和 DTO 分层组织。

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

The demo account is:

- username: `tom`
- password: `123456`

## Main APIs

- `POST /api/v1/users/login`: login with a database user.
- `POST /api/v1/users/register`: register a new user.
- `GET /api/v1/books`: list all books from MySQL.
- `GET /api/v1/book/{id}`: get one book detail.
- `GET /api/v1/users/{userId}/cart`: get a user's cart.
- `POST /api/v1/users/{userId}/cart/items`: add a book to cart.
- `PUT /api/v1/users/{userId}/cart/items/{bookId}`: update cart quantity.
- `DELETE /api/v1/users/{userId}/cart/items/{bookId}`: remove cart item.
- `POST /api/v1/users/{userId}/orders`: checkout cart into an order.
- `GET /api/v1/users/{userId}/orders`: list orders.

## Database Tables

The submitted SQL script is `database/init.sql`. It creates `users`, `books`, `cart_items`, `orders`, and `order_items`, plus the demo data used by the frontend.

## Verification

```bash
mvn test
```
