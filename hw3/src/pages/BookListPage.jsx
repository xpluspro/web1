import BookCard from '../components/BookCard.jsx';
import HeroSection from '../components/HeroSection.jsx';
import PriceFilterSidebar from '../components/PriceFilterSidebar.jsx';

function matchesSearch(book, searchTerm) {
  if (!searchTerm.trim()) {
    return true;
  }

  const keyword = searchTerm.trim().toLowerCase();
  const haystack = [book.title, book.author, book.category, book.summary].join(' ').toLowerCase();
  return haystack.includes(keyword);
}

export default function BookListPage({
  books,
  heroBooks,
  priceFilters,
  searchTerm,
  selectedFilterId,
  onFilterChange,
}) {
  const activeFilter =
    priceFilters.find((filter) => filter.id === selectedFilterId) ?? priceFilters[0];
  const visibleBooks = books.filter(
    (book) => activeFilter.match(book) && matchesSearch(book, searchTerm)
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <PriceFilterSidebar
        filters={priceFilters}
        selectedFilterId={selectedFilterId}
        onFilterChange={onFilterChange}
      />

      <div className="min-w-0 flex-1">
        <HeroSection books={heroBooks} />

        <section id="book-grid">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
                书籍目录
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">全部图书</h2>
            </div>
            <p className="text-sm text-gray-500">
              当前显示 {visibleBooks.length} 本，筛选条件为“{activeFilter.label}”
            </p>
          </div>

          {visibleBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="mb-3 text-xl font-bold text-gray-900">没有匹配到图书</h3>
              <p className="text-sm text-gray-500">
                你可以调整价格筛选条件，或者换一个关键词重新搜索。
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
