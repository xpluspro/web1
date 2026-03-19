export const books = [
  {
    id: 'book1',
    slug: 'refactoring',
    title: '重构：改善既有代码的设计',
    author: 'Martin Fowler',
    category: '软件工程',
    price: 89,
    cover: '/images/book1.jpg',
    summary: '用一套可执行的重构方法，让既有代码逐步变得清晰、稳定、可维护。',
    description: [
      '《重构：改善既有代码的设计》系统讲解了如何在不改变外部行为的前提下改善代码结构，并给出了大量可直接操作的重构手法。',
      '它既适合软件开发人员，也适合项目管理者，是理解“可维护性”与“演进式设计”的经典读物。',
    ],
    highlights: ['70+ 可落地重构手法', '经典坏味道识别', '强调测试保护与小步修改'],
  },
  {
    id: 'book2',
    slug: 'mythical-man-month',
    title: '人月神话',
    author: 'Frederick P. Brooks Jr.',
    category: '项目管理',
    price: 45,
    cover: '/images/book2.jpg',
    summary: '从真实大型项目经验出发，讨论软件工程管理中的复杂性与协作成本。',
    description: [
      '《人月神话》从系统软件项目实践出发，分析了人员扩张、沟通成本、进度失控等问题背后的根本原因。',
      '它对团队协作、项目排期和复杂系统管理仍然具有非常强的现实指导意义。',
    ],
    highlights: ['Brooks 定律', '大型项目管理经验', '复杂性与协作成本分析'],
  },
  {
    id: 'book3',
    slug: 'design-patterns',
    title: '设计模式：可复用面向对象软件的基础',
    author: 'Erich Gamma 等',
    category: '软件架构',
    price: 68.5,
    cover: '/images/book3.jpg',
    summary: '用 23 个经典设计模式总结对象协作经验，提升抽象能力与架构表达力。',
    description: [
      '本书围绕面向对象设计中的可复用经验，提炼了 23 个经典设计模式以及它们的适用场景与权衡。',
      '它非常适合在掌握基础编程之后，用来建立更高层级的软件抽象和架构思维。',
    ],
    highlights: ['23 个经典设计模式', '强调对象协作', '适合架构能力进阶'],
  },
  {
    id: 'book4',
    slug: 'clean-code',
    title: '代码整洁之道',
    author: 'Robert C. Martin',
    category: '编程规范',
    price: 72,
    cover: '/images/book4.jpg',
    summary: '从命名、函数、注释到设计习惯，建立面向长期维护的代码质量观。',
    description: [
      '《代码整洁之道》从日常编码细节切入，讨论什么是可读、可扩展、可持续维护的代码风格。',
      '它不只是一套语法规范，更是一种将工程质量落实到每个小决定中的开发态度。',
    ],
    highlights: ['强调可读性', '关注长期维护', '适合团队代码规范建设'],
  },
];

export const heroBooks = books.slice(0, 2).map((book, index) => ({
  ...book,
  eyebrow: index === 0 ? '本周推荐' : '经典必读',
  cta: index === 0 ? '查看重构指南' : '进入管理经典',
}));

export const priceFilters = [
  { id: 'all', label: '全部', match: () => true },
  { id: '0-50', label: '¥0 - ¥50', match: (book) => book.price < 50 },
  { id: '50-100', label: '¥50 - ¥100', match: (book) => book.price >= 50 && book.price <= 100 },
  { id: '100+', label: '¥100以上', match: (book) => book.price > 100 },
];

export function getBookById(bookId) {
  return books.find((book) => book.id === bookId);
}

export function getBookBySlug(slug) {
  return books.find((book) => book.slug === slug);
}
