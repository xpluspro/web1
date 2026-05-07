import { useEffect, useState } from 'react';
import { App as AntdApp, ConfigProvider } from 'antd';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import {
  addCartItem,
  checkoutCart,
  fetchBooks,
  fetchCart,
  fetchOrders,
  loginUser,
  registerUser,
  removeCartItem,
  updateCartItem,
} from './lib/api.js';
import { readProfile, writeProfile } from './lib/profileStorage.js';
import { readUser, writeUser } from './lib/sessionStorage.js';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

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
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [profile, setProfile] = useState(() => readProfile());
  const [user, setUser] = useState(() => readUser());

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        setBooksLoading(true);
        const nextBooks = await fetchBooks();
        if (active) {
          setBooks(nextBooks);
        }
      } catch (error) {
        if (active) {
          message.error(`书籍列表加载失败：${error.message}`);
        }
      } finally {
        if (active) {
          setBooksLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    writeProfile(profile);
  }, [profile]);

  useEffect(() => {
    writeUser(user);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setOrders([]);
      return;
    }

    let active = true;

    async function loadUserData() {
      try {
        setCartLoading(true);
        setOrdersLoading(true);
        const [cart, nextOrders] = await Promise.all([fetchCart(user.id), fetchOrders(user.id)]);

        if (active) {
          setCartItems(cart.items);
          setOrders(nextOrders);
        }
      } catch (error) {
        if (active) {
          message.error(`用户数据加载失败：${error.message}`);
        }
      } finally {
        if (active) {
          setCartLoading(false);
          setOrdersLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      active = false;
    };
  }, [user]);

  async function handleLogin(credentials) {
    const nextUser = await loginUser(credentials);
    setUser(nextUser);
    setProfile((current) => ({
      ...current,
      firstName: nextUser.firstName,
      lastName: nextUser.lastName,
      twitter: nextUser.twitter,
      avatarUrl: nextUser.avatarUrl || current.avatarUrl,
      notes: nextUser.notes || current.notes,
    }));
    message.success(`登录成功：${nextUser.fullName}`);
    navigate('/books');
  }

  function handleLogout() {
    setUser(null);
    message.success('已退出登录');
    navigate('/login');
  }

  async function handleAddToCart(book, quantity = 1) {
    if (!user) {
      message.warning('请先登录后加入购物车');
      navigate('/login');
      return;
    }

    const cart = await addCartItem(user.id, book.id, quantity);
    setCartItems(cart.items);
    message.success(`已将《${book.title}》加入购物车`);
  }

  async function handleQuickPurchase(book, quantity = 1) {
    await handleAddToCart(book, quantity);
    navigate('/cart');
  }

  async function handleUpdateCartQty(bookId, quantity) {
    if (!user) {
      return;
    }

    const cart = await updateCartItem(user.id, bookId, quantity);
    setCartItems(cart.items);
  }

  async function handleRemoveCartItem(bookId) {
    if (!user) {
      return;
    }

    const cart = await removeCartItem(user.id, bookId);
    setCartItems(cart.items);
    message.success('商品已从购物车移除');
  }

  async function handleCheckout() {
    if (!user) {
      message.warning('请先登录后下单');
      navigate('/login');
      return;
    }

    try {
      setCheckingOut(true);
      const order = await checkoutCart(user.id);
      setCartItems([]);
      const nextOrders = await fetchOrders(user.id);
      setOrders(nextOrders);
      message.success(`订单 #${order.id} 创建成功`);
      navigate('/orders');
    } finally {
      setCheckingOut(false);
    }
  }

  async function handleSaveProfile(nextProfile) {
    const payload = {
      username: nextProfile.username || `${nextProfile.firstName}${nextProfile.lastName}`.toLowerCase(),
      password: nextProfile.password || '123456',
      ...nextProfile,
      avatarUrl: nextProfile.avatarUrl?.startsWith('data:') ? '' : nextProfile.avatarUrl,
    };
    const result = await registerUser(payload);
    setProfile(nextProfile);
    message.success(`${result.message}：${result.fullName}`);
  }

  const heroBooks = books.slice(0, 3).map((book, index) => ({
    ...book,
    eyebrow: ['Featured Book', 'Architecture Pick', 'Code Quality'][index] || 'Recommended',
  }));

  return (
    <Routes>
        <Route
          element={
            <AppLayout
              cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
              profile={profile}
              user={user}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            path="/books"
            element={
              <BookListPage
                books={books}
                heroBooks={heroBooks}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                loading={booksLoading}
              />
            }
          />
          <Route
            path="/books/:id"
            element={
              <BookDetailPage
                onAddToCart={handleAddToCart}
                onQuickPurchase={handleQuickPurchase}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                loading={cartLoading}
                checkingOut={checkingOut}
                user={user}
                onQuantityChange={handleUpdateCartQty}
                onRemoveItem={handleRemoveCartItem}
                onCheckout={handleCheckout}
              />
            }
          />
          <Route
            path="/orders"
            element={<OrderListPage orders={orders} loading={ordersLoading} user={user} />}
          />
          <Route path="/login" element={<LoginPage user={user} onLogin={handleLogin} />} />
          <Route path="/profile" element={<ProfilePage profile={profile} onSaveProfile={handleSaveProfile} />} />
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
