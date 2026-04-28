import { useEffect, useState } from 'react';
import { ConfigProvider, message } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import { addCartItem, readCart, removeCartItem, updateCartItemQty, writeCart } from './lib/cartStorage.js';
import { fetchBooks, registerUser } from './lib/api.js';
import { readProfile, writeProfile } from './lib/profileStorage.js';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => readCart());
  const [profile, setProfile] = useState(() => readProfile());

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
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeProfile(profile);
  }, [profile]);

  function handleAddToCart(book, quantity = 1) {
    setCartItems((currentItems) => addCartItem(currentItems, book, quantity));
    message.success(`已将《${book.title}》加入购物车`);
  }

  function handleQuickPurchase(book) {
    message.info(`“立即购买”按钮已展示，本次迭代 1 不接后端支付流程。你已查看《${book.title}》的购买入口。`);
  }

  function handleUpdateCartQty(itemId, quantity) {
    setCartItems((currentItems) => updateCartItemQty(currentItems, itemId, quantity));
  }

  function handleRemoveCartItem(itemId) {
    setCartItems((currentItems) => removeCartItem(currentItems, itemId));
    message.success('商品已从购物车移除');
  }

  async function handleSaveProfile(nextProfile) {
    const payload = {
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
    <ConfigProvider theme={theme}>
      <Routes>
        <Route
          element={
            <AppLayout
              cartCount={cartItems.reduce((total, item) => total + item.qty, 0)}
              profile={profile}
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
                onQuantityChange={handleUpdateCartQty}
                onRemoveItem={handleRemoveCartItem}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage profile={profile} onSaveProfile={handleSaveProfile} />}
          />
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/index.html" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}
