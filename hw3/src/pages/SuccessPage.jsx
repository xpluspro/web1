import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SuccessPage({ latestOrder, onCompleteOrder }) {
  const location = useLocation();
  const order = location.state?.order ?? latestOrder;
  const clearedOrderRef = useRef(null);

  useEffect(() => {
    if (!order || !onCompleteOrder) {
      return;
    }

    if (clearedOrderRef.current === order.orderNumber) {
      return;
    }

    clearedOrderRef.current = order.orderNumber;
    onCompleteOrder();
  }, [onCompleteOrder, order]);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-16 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">暂无订单信息</h1>
          <p className="mb-8 text-sm leading-7 text-gray-500">
            你可以回到书籍列表重新加入商品，再从购物车完成结算流程。
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            返回主页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2.25rem] border border-gray-200 bg-white px-8 py-14 text-center shadow-sm sm:px-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-600">
          Payment Success
        </p>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900">支付成功</h1>
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-gray-500">
          订单已经确认，我们会尽快处理。下面保留了订单号和收货信息，方便你提交作业时展示完整流程。
        </p>

        <div className="mx-auto mb-8 max-w-xl rounded-[1.75rem] bg-slate-950 px-6 py-6 text-left text-white">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <span className="text-sm text-slate-300">订单编号</span>
            <strong className="text-lg tracking-[0.2em]">{order.orderNumber}</strong>
          </div>
          <div className="space-y-3 text-sm text-slate-200">
            <p>下单时间：{order.createdAt}</p>
            <p>收货人：{order.customer.name}</p>
            <p>联系电话：{order.customer.phone}</p>
            <p>收货地址：{order.customer.address}</p>
            <p>支付方式：{order.customer.paymentMethod}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            打印收据
          </button>
          <Link
            to="/myorder"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            查看我的订单
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            继续选购
          </Link>
        </div>
      </section>
    </div>
  );
}
