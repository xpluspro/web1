import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';

const filterOptions = ['全部', '已支付', '待支付'];

function getStatusClassName(status) {
  if (status === '已支付') {
    return 'bg-green-100 text-green-700';
  }

  if (status === '待支付') {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-slate-100 text-slate-700';
}

export default function MyOrdersPage({ orders, onMarkOrderPaid }) {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('全部');
  const filterCounts = {
    全部: orders.length,
    已支付: orders.filter((order) => order.status === '已支付').length,
    待支付: orders.filter((order) => order.status === '待支付').length,
  };
  const activeOrders =
    selectedFilter === '全部'
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  function handlePayNow(orderNumber) {
    const paidOrder = onMarkOrderPaid(orderNumber);

    if (paidOrder) {
      navigate('/success', { state: { order: paidOrder } });
    }
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-16 shadow-sm">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-600">
            My Orders
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">还没有订单记录</h1>
          <p className="mb-8 text-sm leading-7 text-gray-500">
            完成一次结算后，这里会集中展示所有订单，包括已支付和待支付状态。
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            去逛书单
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-primary-600">
            My Orders
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">我的订单</h1>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            这里集中展示所有订单记录，你可以查看状态、时间、收货信息以及订单明细。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  selectedFilter === filter
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-500'
                }`}
              >
                {filterCounts[filter]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
            当前筛选“{selectedFilter}”下暂无订单
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-500">
            订单列表还在，只是这个状态下暂时没有匹配结果。切换上方筛选即可查看其他订单。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
        {activeOrders.map((order) => (
          <article
            key={order.orderNumber}
            className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <h2 className="text-lg font-bold text-gray-900">订单号：{order.orderNumber}</h2>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusClassName(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                <p>创建时间：{order.createdAt}</p>
                <p>收货人：{order.customer.name}</p>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="mb-4 text-base font-semibold text-gray-900">订单商品</h3>
                <ul className="space-y-4">
                  {order.items.map((item) => (
                    <li
                      key={`${order.orderNumber}-${item.id}`}
                      className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-16 rounded-xl border border-gray-100 bg-white object-contain p-2"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
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

              <div className="rounded-[1.5rem] bg-slate-950 px-5 py-6 text-white">
                <h3 className="mb-4 text-base font-semibold">订单信息</h3>
                <div className="space-y-3 text-sm text-slate-200">
                  <p>收货人：{order.customer.name}</p>
                  <p>联系电话：{order.customer.phone}</p>
                  <p>收货地址：{order.customer.address}</p>
                  <p>支付方式：{order.customer.paymentMethod}</p>
                  <p>订单状态：{order.status}</p>
                  <p>合计金额：{formatPrice(order.total)}</p>
                  {order.paidAt ? <p>支付时间：{order.paidAt}</p> : null}
                </div>

                {order.status === '待支付' ? (
                  <button
                    type="button"
                    onClick={() => handlePayNow(order.orderNumber)}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    继续支付
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    继续选购
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
        </div>
      )}
    </div>
  );
}
