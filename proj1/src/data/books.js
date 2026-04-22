export const books = [
  {
    id: 'book1',
    slug: 'refactoring',
    title: 'Refactoring',
    author: 'Martin Fowler',
    publisher: 'Addison-Wesley',
    category: 'Software Engineering',
    language: 'English',
    isbn: '978-0201485677',
    price: 89,
    status: 'In Stock',
    cover: '/images/book1.jpg',
    summary: 'A classic guide to improving existing code structures without changing external behavior.',
    description: [
      'Refactoring systematically explains how to improve the internal structure of code while preserving the software behavior that users rely on.',
      'It fits this assignment well because it highlights maintainability, incremental redesign, and engineering discipline, which are the same ideas we want to demonstrate in a React component-based project.',
    ],
    highlights: [
      'Catalog of common refactoring techniques',
      'Focus on readability and maintainability',
      'Useful for explaining design decisions to teaching assistants',
    ],
  },
  {
    id: 'book2',
    slug: 'mythical-man-month',
    title: 'The Mythical Man-Month',
    author: 'Frederick P. Brooks Jr.',
    publisher: 'Addison-Wesley',
    category: 'Project Management',
    language: 'English',
    isbn: '978-0201835953',
    price: 45,
    status: 'In Stock',
    cover: '/images/book2.jpg',
    summary: 'A foundational text on software project management, complexity, and communication cost.',
    description: [
      'The Mythical Man-Month discusses why large software projects become difficult, how communication overhead grows, and why adding people to a delayed project can make it later.',
      'It complements the bookstore theme by giving the homepage a serious technical-book focus while still providing diverse hard-coded data for card and detail pages.',
    ],
    highlights: [
      'Brooks Law and schedule risk',
      'Strong support for architecture and planning discussions',
      'Good metadata for detail page descriptions',
    ],
  },
  {
    id: 'book3',
    slug: 'design-patterns',
    title: 'Design Patterns',
    author: 'Erich Gamma et al.',
    publisher: 'Addison-Wesley',
    category: 'Software Architecture',
    language: 'English',
    isbn: '978-0201633610',
    price: 68.5,
    status: 'In Stock',
    cover: '/images/book3.jpg',
    summary: 'The famous catalog of reusable object-oriented design patterns.',
    description: [
      'Design Patterns summarizes recurring design problems and presents reusable object-oriented solutions that are still relevant in modern frontend and backend development.',
      'For this iteration, it also helps demonstrate a bookstore homepage with consistent but non-trivial book metadata such as author, publisher, language, and ISBN.',
    ],
    highlights: [
      'Twenty-three classic patterns',
      'Great for architecture-related category browsing',
      'Helps justify reusable React component design',
    ],
  },
  {
    id: 'book4',
    slug: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    category: 'Coding Practice',
    language: 'English',
    isbn: '978-0132350884',
    price: 72,
    status: 'Limited Stock',
    cover: '/images/book4.jpg',
    summary: 'A practical book about readable code, naming, functions, and long-term maintainability.',
    description: [
      'Clean Code focuses on naming, functions, comments, boundaries, and testing habits that keep code understandable for future developers.',
      'That makes it a natural fit for this assignment because we are not only building a UI, but also organizing the project into maintainable React components and route modules.',
    ],
    highlights: [
      'Readable and maintainable coding habits',
      'Pairs well with the component-based design principle',
      'A strong visual anchor for the bookstore demo',
    ],
  },
];

export const heroBooks = [
  {
    ...books[0],
    eyebrow: 'Featured Book',
  },
  {
    ...books[2],
    eyebrow: 'Architecture Pick',
  },
  {
    ...books[3],
    eyebrow: 'Code Quality',
  },
];

export function getBookById(bookId) {
  return books.find((book) => book.id === bookId);
}

export function getBookBySlug(slug) {
  return books.find((book) => book.slug === slug);
}
