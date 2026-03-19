import { formatPrice } from '../lib/format.js';

export default function OrderSummary({ summary, action }) {
  return (
    <aside className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="mb-6 border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
          订单摘要
        </h2>

        <dl className="space-y-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <dt>商品总价</dt>
            <dd className="font-medium text-gray-900">{formatPrice(summary.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>运费</dt>
            <dd className="font-medium text-gray-900">{formatPrice(summary.shipping)}</dd>
          </div>
          <div className="flex justify-between text-green-600">
            <dt>优惠折扣</dt>
            <dd className="font-medium">-{formatPrice(summary.discount)}</dd>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base">
            <dt className="font-bold text-gray-900">合计金额</dt>
            <dd className="font-bold text-gray-900">{formatPrice(summary.total)}</dd>
          </div>
        </dl>

        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </aside>
  );
}
