import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-primary-600">404</p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">页面不存在</h1>
      <p className="mb-8 text-gray-500">当前地址没有匹配到 React 路由，请返回书籍列表继续浏览。</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        返回主页
      </Link>
    </div>
  );
}
