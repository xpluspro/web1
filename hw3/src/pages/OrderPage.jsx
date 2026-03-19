import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary.jsx';
import { getCartSummary } from '../lib/cartStorage.js';
import { formatPrice } from '../lib/format.js';

const initialForm = {
  name: '',
  phone: '',
  address: '',
  paymentMethod: '微信支付',
};

export default function OrderPage({ cartItems, onPlaceOrder }) {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();
  const summary = getCartSummary(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-16 shadow-sm">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-600">
            Checkout Empty
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">当前没有可提交的订单</h1>
          <p className="mb-8 text-sm leading-7 text-gray-500">
            你的购物车可能已经清空，或者还没有选择图书。你可以继续浏览书单，或先返回购物车确认商品。
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              返回首页
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              去购物车
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const order = onPlaceOrder(form);
    navigate('/success', { state: { order } });
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <section className="min-w-0 flex-1 space-y-8">
        <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
                Checkout
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">确认订单</h1>
            </div>
            <Link to="/cart" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              返回购物车
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 w-20 rounded-2xl border border-gray-100 bg-gray-50 object-contain p-3"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.author} · x{item.qty}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * item.qty)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
              Customer
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">收货与支付信息</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">姓名</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">手机号码</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-700">详细地址</span>
              <input
                required
                type="text"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="block w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="省、市、区、街道门牌号"
              />
            </label>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-gray-700">支付方式</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['微信支付', '支付宝', '信用卡 / 借记卡'].map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    form.paymentMethod === option
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={option}
                    checked={form.paymentMethod === option}
                    onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            确认提交订单
          </button>
        </form>
      </section>

      <OrderSummary summary={summary} />
    </div>
  );
}
