DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  language VARCHAR(50) NOT NULL,
  isbn VARCHAR(50) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  cover VARCHAR(255) NOT NULL,
  summary VARCHAR(1000) NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  twitter VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  notes VARCHAR(1000),
  role VARCHAR(20) NOT NULL,
  disabled BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT uk_cart_user_book UNIQUE (user_id, book_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_cart_book FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_item_book FOREIGN KEY (book_id) REFERENCES books(id)
);
