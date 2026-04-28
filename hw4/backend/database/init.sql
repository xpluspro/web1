CREATE DATABASE IF NOT EXISTS bookstore_hw4
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookstore_hw4;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;

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
  status VARCHAR(50) NOT NULL,
  cover VARCHAR(255) NOT NULL,
  summary VARCHAR(1000) NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  twitter VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(255),
  notes VARCHAR(1000),
  created_at DATETIME NOT NULL
);

INSERT INTO books (
  slug, title, author, publisher, category, language, isbn, price, status, cover, summary, description, highlights
) VALUES
(
  'refactoring',
  'Refactoring',
  'Martin Fowler',
  'Addison-Wesley',
  'Software Engineering',
  'English',
  '978-0201485677',
  89.00,
  'In Stock',
  '/images/book1.jpg',
  'A classic guide to improving existing code structures without changing external behavior.',
  'Refactoring systematically explains how to improve the internal structure of code while preserving the software behavior that users rely on.\nIt fits this assignment well because it highlights maintainability, incremental redesign, and engineering discipline, which are the same ideas we want to demonstrate in a React component-based project.',
  'Catalog of common refactoring techniques\nFocus on readability and maintainability\nUseful for explaining design decisions to teaching assistants'
),
(
  'mythical-man-month',
  'The Mythical Man-Month',
  'Frederick P. Brooks Jr.',
  'Addison-Wesley',
  'Project Management',
  'English',
  '978-0201835953',
  45.00,
  'In Stock',
  '/images/book2.jpg',
  'A foundational text on software project management, complexity, and communication cost.',
  'The Mythical Man-Month discusses why large software projects become difficult, how communication overhead grows, and why adding people to a delayed project can make it later.\nIt complements the bookstore theme by giving the homepage a serious technical-book focus while still providing diverse hard-coded data for card and detail pages.',
  'Brooks Law and schedule risk\nStrong support for architecture and planning discussions\nGood metadata for detail page descriptions'
),
(
  'design-patterns',
  'Design Patterns',
  'Erich Gamma et al.',
  'Addison-Wesley',
  'Software Architecture',
  'English',
  '978-0201633610',
  68.50,
  'In Stock',
  '/images/book3.jpg',
  'The famous catalog of reusable object-oriented design patterns.',
  'Design Patterns summarizes recurring design problems and presents reusable object-oriented solutions that are still relevant in modern frontend and backend development.\nFor this iteration, it also helps demonstrate a bookstore homepage with consistent but non-trivial book metadata such as author, publisher, language, and ISBN.',
  'Twenty-three classic patterns\nGreat for architecture-related category browsing\nHelps justify reusable React component design'
),
(
  'clean-code',
  'Clean Code',
  'Robert C. Martin',
  'Prentice Hall',
  'Coding Practice',
  'English',
  '978-0132350884',
  72.00,
  'Limited Stock',
  '/images/book4.jpg',
  'A practical book about readable code, naming, functions, and long-term maintainability.',
  'Clean Code focuses on naming, functions, comments, boundaries, and testing habits that keep code understandable for future developers.\nThat makes it a natural fit for this assignment because we are not only building a UI, but also organizing the project into maintainable React components and route modules.',
  'Readable and maintainable coding habits\nPairs well with the component-based design principle\nA strong visual anchor for the bookstore demo'
);
