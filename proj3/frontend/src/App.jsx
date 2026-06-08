import { App as AntdApp, ConfigProvider } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import { useBookstoreState } from './hooks/useBookstoreState.js';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminBookPage from './pages/AdminBookPage.jsx';
import AdminUserPage from './pages/AdminUserPage.jsx';
import StatsPage from './pages/StatsPage.jsx';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorBgLayout: '#f4f7fb',
    colorText: '#1f2937',
    borderRadius: 16,
    fontFamily:
      '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#f4f7fb',
      triggerBg: '#ffffff',
    },
    Menu: {
      itemBorderRadius: 12,
      itemHeight: 44,
      itemSelectedBg: '#e6f4ff',
      itemSelectedColor: '#1677ff',
    },
    Card: {
      borderRadiusLG: 20,
    },
  },
};

export default function App() {
  const store = useBookstoreState();

  return (
    <Routes>
        <Route
          element={
            <AppLayout
              cartCount={store.cartItems.reduce((total, item) => total + item.quantity, 0)}
              avatarUrl={store.headerAvatarUrl}
              user={store.user}
              onLogout={store.handleLogout}
            />
          }
        >
          <Route
            path="/books"
            element={
              <BookListPage
                books={store.books}
                heroBooks={store.heroBooks}
                searchTerm={store.searchTerm}
                onSearchChange={store.setSearchTerm}
                loading={store.booksLoading}
              />
            }
          />
          <Route
            path="/books/:id"
            element={
              <BookDetailPage
                onAddToCart={store.handleAddToCart}
                onQuickPurchase={store.handleQuickPurchase}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={store.cartItems}
                loading={store.cartLoading}
                checkingOut={store.checkingOut}
                user={store.user}
                onQuantityChange={store.handleUpdateCartQty}
                onRemoveItem={store.handleRemoveCartItem}
                onCheckout={store.handleCheckout}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrderListPage
                orders={store.orders}
                loading={store.ordersLoading}
                user={store.user}
                title="My Orders"
                description="可按时间范围、书名或二者组合过滤自己的订单"
                onSearch={store.loadUserOrders}
              />
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminBookPage
                books={store.books}
                loading={store.booksLoading}
                user={store.user}
                onBooksChanged={store.loadBooks}
              />
            }
          />
          <Route path="/admin/users" element={<AdminUserPage user={store.user} />} />
          <Route
            path="/admin/orders"
            element={
              <OrderListPage
                user={store.user}
                adminOnly
                title="All Orders"
                description="管理员可查看系统全部订单，并按时间范围和书名筛选"
                loadOrders={store.loadAllOrders}
              />
            }
          />
          <Route path="/stats" element={<StatsPage user={store.user} />} />
          <Route path="/login" element={<LoginPage user={store.user} onLogin={store.handleLogin} />} />
          <Route
            path="/profile"
            element={
              <ProfilePage
                draft={store.registrationDraft}
                onRegister={store.handleRegister}
              />
            }
          />
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/index.html" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
  );
}

export function AppRoot() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  );
}
