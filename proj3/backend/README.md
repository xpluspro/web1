# Iteration 3 Backend

本后端使用 Spring Boot + Spring Data JPA 实现在线书店迭代 3 的数据库访问和 JSON API。工程按控制层、服务接口、服务实现、数据访问层、实体层和 DTO 分层组织。

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

The demo accounts are:

- customer: `tom / 123456`
- administrator: `admin / 123456`
- disabled account: `disabled / 123456`

## Main APIs

- `POST /api/v1/users/login`: login with a database user and receive `{ token, user }`.
- `POST /api/v1/users/register`: register a new user.
- `GET /api/v1/users`: list users for administrator management.
- `PUT /api/v1/users/{userId}/status`: disable or enable a user.
- `GET /api/v1/books`: list all books from MySQL.
- `GET /api/v1/book/{id}`: get one book detail.
- `POST /api/v1/admin/books`: create a book.
- `PUT /api/v1/admin/books/{id}`: update a book.
- `DELETE /api/v1/admin/books/{id}`: delete a book.
- `GET /api/v1/users/{userId}/cart`: get a user's cart.
- `POST /api/v1/users/{userId}/cart/items`: add a book to cart.
- `PUT /api/v1/users/{userId}/cart/items/{bookId}`: update cart quantity.
- `DELETE /api/v1/users/{userId}/cart/items/{bookId}`: remove cart item.
- `POST /api/v1/users/{userId}/orders`: checkout cart into an order.
- `GET /api/v1/users/{userId}/orders`: list and filter a customer's orders.
- `GET /api/v1/admin/orders`: list and filter all orders.
- `GET /api/v1/admin/stats/books`: book sales leaderboard.
- `GET /api/v1/admin/stats/users`: user consumption leaderboard.
- `GET /api/v1/users/{userId}/orders/stats`: customer purchase statistics.

Protected APIs require `Authorization: Bearer <token>`. Administrator APIs require an `ADMIN` user token, and customer-scoped APIs only allow the matching user or an administrator.

## Database Tables

The submitted SQL script is `database/init.sql`. It creates `users`, `books`, `cart_items`, `orders`, and `order_items`, plus the demo data used by the frontend.

## Verification

```bash
mvn test
```
