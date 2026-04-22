import { useEffect, useState } from 'react';
import { ConfigProvider, message } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import { books, heroBooks } from './data/books.js';
import { addCartItem, readCart, removeCartItem, updateCartItemQty, writeCart } from './lib/cartStorage.js';
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
  const [cartItems, setCartItems] = useState(() => readCart());
  const [profile, setProfile] = useState(() => readProfile());

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

  function handleSaveProfile(nextProfile) {
    setProfile(nextProfile);
    message.success('个人信息已保存在前端本地状态中');
  }

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
              />
            }
          />
          <Route
            path="/books/:slug"
            element={
              <BookDetailPage
                books={books}
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
