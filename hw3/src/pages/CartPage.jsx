import { Link } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary.jsx';
import { getBookById } from '../data/books.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { getCartSummary } from '../lib/cartStorage.js';
import { formatPrice } from '../lib/format.js';

export default function CartPage({ cartItems, onQuantityChange, onRemoveItem }) {
  const summary = getCartSummary(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-16 shadow-sm">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-600">
            Cart Empty
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">购物车还是空的</h1>
          <p className="mb-8 text-sm leading-7 text-gray-500">
            先回到书籍列表挑选想看的书，再通过详情页把它们加入购物车。
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            去逛书单
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <section className="min-w-0 flex-1 rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
              Shopping Cart
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">您的购物车</h1>
          </div>
          <Link to="/" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            继续购物
          </Link>
        </div>

        <ul className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <li key={item.id} className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-24 rounded-2xl border border-gray-100 bg-gray-50 object-contain p-3"
                />
                <div>
                  {(() => {
                    const book = getBookById(item.id);

                    if (!book) {
                      return <p className="mb-1 block text-lg font-bold text-gray-900">{item.title}</p>;
                    }

                    return (
                      <Link
                        to={`/books/${book.slug}`}
                        state={{ bookId: item.id }}
                        className="mb-1 block text-lg font-bold text-gray-900 hover:text-primary-600"
                      >
                        {item.title}
                      </Link>
                    );
                  })()}
                  <p className="mb-3 text-sm text-gray-500">{item.author}</p>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(item.price)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <QuantityStepper
                  value={item.qty}
                  onDecrease={() => onQuantityChange(item.id, item.qty - 1)}
                  onIncrease={() => onQuantityChange(item.id, item.qty + 1)}
                />
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                >
                  移除商品
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <OrderSummary
        summary={summary}
        action={
          <Link
            to="/order"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            前往结账
          </Link>
        }
      />
    </div>
  );
}
