import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';

export default function BookCard({ book }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/books/${book.slug}`}
        state={{ bookId: book.id }}
        className="relative block bg-gray-50 pt-[100%]"
      >
        <img
          src={book.cover}
          alt={book.title}
          className="absolute inset-0 h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-primary-600">
          {book.category}
        </p>
        <h2 className="mb-2 text-lg font-bold leading-7 text-gray-900">{book.title}</h2>
        <p className="mb-4 text-sm text-gray-500">{book.author}</p>
        <p className="mb-5 text-sm leading-6 text-gray-600">{book.summary}</p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {formatPrice(book.price)}
          </span>
          <Link
            to={`/books/${book.slug}`}
            state={{ bookId: book.id }}
            className="inline-flex items-center justify-center rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-600 hover:text-white"
          >
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
