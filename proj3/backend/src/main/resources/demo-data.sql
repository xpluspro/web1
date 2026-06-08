INSERT INTO books (
  id, slug, title, author, publisher, category, language, isbn, price, stock, status, cover, summary, description, highlights
) VALUES
(
  1,
  'refactoring',
  'Refactoring',
  'Martin Fowler',
  'Addison-Wesley',
  'Software Engineering',
  'English',
  '978-0201485677',
  89.00,
  24,
  'In Stock',
  '/images/book1.jpg',
  'A classic guide to improving existing code structures without changing external behavior.',
  'Refactoring systematically explains how to improve the internal structure of code while preserving the software behavior that users rely on.\nIt fits this assignment well because it highlights maintainability, incremental redesign, and engineering discipline, which are the same ideas we want to demonstrate in a React component-based project.',
  'Catalog of common refactoring techniques\nFocus on readability and maintainability\nUseful for explaining design decisions to teaching assistants'
),
(
  2,
  'mythical-man-month',
  'The Mythical Man-Month',
  'Frederick P. Brooks Jr.',
  'Addison-Wesley',
  'Project Management',
  'English',
  '978-0201835953',
  45.00,
  16,
  'In Stock',
  '/images/book2.jpg',
  'A foundational text on software project management, complexity, and communication cost.',
  'The Mythical Man-Month discusses why large software projects become difficult, how communication overhead grows, and why adding people to a delayed project can make it later.\nIt complements the bookstore theme by giving the homepage a serious technical-book focus while still providing diverse hard-coded data for card and detail pages.',
  'Brooks Law and schedule risk\nStrong support for architecture and planning discussions\nGood metadata for detail page descriptions'
),
(
  3,
  'design-patterns',
  'Design Patterns',
  'Erich Gamma et al.',
  'Addison-Wesley',
  'Software Architecture',
  'English',
  '978-0201633610',
  68.50,
  12,
  'In Stock',
  '/images/book3.jpg',
  'The famous catalog of reusable object-oriented design patterns.',
  'Design Patterns summarizes recurring design problems and presents reusable object-oriented solutions that are still relevant in modern frontend and backend development.\nFor this iteration, it also helps demonstrate a bookstore homepage with consistent but non-trivial book metadata such as author, publisher, language, and ISBN.',
  'Twenty-three classic patterns\nGreat for architecture-related category browsing\nHelps justify reusable React component design'
),
(
  4,
  'clean-code',
  'Clean Code',
  'Robert C. Martin',
  'Prentice Hall',
  'Coding Practice',
  'English',
  '978-0132350884',
  72.00,
  5,
  'Limited Stock',
  '/images/book4.jpg',
  'A practical book about readable code, naming, functions, and long-term maintainability.',
  'Clean Code focuses on naming, functions, comments, boundaries, and testing habits that keep code understandable for future developers.\nThat makes it a natural fit for this assignment because we are not only building a UI, but also organizing the project into maintainable React components and route modules.',
  'Readable and maintainable coding habits\nPairs well with the component-based design principle\nA strong visual anchor for the bookstore demo'
);

INSERT INTO users (
  id, username, password, email, first_name, last_name, twitter, avatar_url, notes, role, disabled, created_at
) VALUES
(
  1,
  'tom',
  '123456',
  'tom@example.com',
  'Tom',
  'Cat',
  '@TomCat',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
  'Demo user for the iteration 2 integrated bookstore.',
  'CUSTOMER',
  FALSE,
  CURRENT_TIMESTAMP
),
(
  2,
  'admin',
  '123456',
  'admin@example.com',
  'Admin',
  'User',
  '@BookAdmin',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'Administrator account for iteration 3 management features.',
  'ADMIN',
  FALSE,
  CURRENT_TIMESTAMP
),
(
  3,
  'disabled',
  '123456',
  'disabled@example.com',
  'Disabled',
  'Reader',
  '@DisabledReader',
  '',
  'Disabled demo account for login validation.',
  'CUSTOMER',
  TRUE,
  CURRENT_TIMESTAMP
);
