import { Link, NavLink, useLocation } from 'react-router-dom';

const navClassName = ({ isActive }) =>
  `border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
    isActive
      ? 'border-primary-600 text-primary-600'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
  }`;

export default function SiteHeader({ cartCount, searchTerm, onSearchChange }) {
  const location = useLocation();
  const showSearch = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex-shrink-0 text-2xl font-bold tracking-tight text-primary-600">
          书香云端
        </Link>

        {showSearch ? (
          <div className="hidden max-w-lg flex-1 md:block">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="block w-full rounded-full border border-transparent bg-gray-100 px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-primary-500 focus:bg-white focus:ring-primary-500"
              placeholder="搜索书名、作者或分类..."
            />
          </div>
        ) : (
          <div className="hidden flex-1 md:block" />
        )}

        <nav className="hidden items-center space-x-8 md:flex">
          <NavLink to="/" end className={navClassName}>
            商店主页
          </NavLink>
          <NavLink to="/myorder" className={navClassName}>
            我的订单
          </NavLink>
          <NavLink to="/cart" className={navClassName}>
            购物车({cartCount})
          </NavLink>
          <NavLink to="/login" className={navClassName}>
            登录/注册
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
