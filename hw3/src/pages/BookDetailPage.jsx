import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { formatPrice } from '../lib/format.js';

export default function BookDetailPage({ books, relatedBooks, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const params = useParams();
  const selectedBookId = location.state?.bookId;
  const book = selectedBookId
    ? books.find((item) => item.id === selectedBookId)
    : books.find((item) => item.slug === params.slug);

  if (!book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">未找到对应图书</h1>
        <p className="mb-8 text-gray-500">当前路由参数没有匹配到书籍数据，请返回列表重新选择。</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          返回书单
        </Link>
      </div>
    );
  }

  const suggestions = relatedBooks
    .filter((item) => item.id !== book.id && item.category !== book.category)
    .slice(0, 2);

  function handleAddClick() {
    if (onAddToCart) {
      onAddToCart(book, quantity);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          返回书单
        </Link>
      </div>

      <article className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex min-h-[420px] items-center justify-center border-b border-gray-100 bg-gray-50 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <img
            src={book.cover}
            alt={book.title}
            className="max-h-[500px] max-w-full object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex flex-col p-8 lg:p-12">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-primary-600">
            {book.category}
          </p>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900">{book.title}</h1>
          <p className="mb-6 text-lg text-gray-500">作者：{book.author}</p>
          <div className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
            {formatPrice(book.price)}
          </div>

          <div className="mb-8 grid gap-6 rounded-[1.5rem] bg-slate-950 px-6 py-6 text-white md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-200">
                内容简介
              </p>
              <div className="space-y-3 text-sm leading-7 text-slate-200">
                {book.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-200">
                阅读亮点
              </p>
              <ul className="space-y-3 text-sm text-slate-200">
                {book.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center">
            <QuantityStepper
              value={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />

            <button
              type="button"
              onClick={handleAddClick}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary-600 px-6 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              加入购物车
            </button>
          </div>
        </div>
      </article>

      {suggestions.length > 0 ? (
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
                延伸阅读
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">你也许还会喜欢</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {suggestions.map((item) => (
              <Link
                key={item.id}
                to={`/books/${item.slug}`}
                state={{ bookId: item.id }}
                className="flex items-center gap-4 rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-28 w-24 rounded-2xl bg-gray-50 object-contain p-3"
                />
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-primary-600">
                    {item.category}
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
