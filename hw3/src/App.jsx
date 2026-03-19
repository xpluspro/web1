import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import StatusToast from './components/StatusToast.jsx';
import { books, heroBooks, priceFilters } from './data/books.js';
import {
  addCartItem,
  readCart,
  removeCartItem,
  updateCartItemQty,
  writeCart,
} from './lib/cartStorage.js';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterId, setSelectedFilterId] = useState('all');
  const [cartItems, setCartItems] = useState(() => readCart());
  const [notice, setNotice] = useState('');
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice('');
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  function handleAddToCart(book, quantity) {
    setCartItems((currentItems) => addCartItem(currentItems, book, quantity));
    setNotice(`已将《${book.title}》加入购物车`);
  }

  function handleChangeCartQty(itemId, quantity) {
    setCartItems((currentItems) => updateCartItemQty(currentItems, itemId, quantity));
  }

  function handleRemoveCartItem(itemId) {
    setCartItems((currentItems) => removeCartItem(currentItems, itemId));
  }

  function handlePlaceOrder(customer) {
    const order = {
      orderNumber: `SF${Date.now().toString().slice(-10)}`,
      customer,
      items: cartItems,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    };

    setLatestOrder(order);
    setNotice('订单已提交，正在跳转到成功页');

    return order;
  }

  const handleCompleteOrder = useCallback(() => {
    setCartItems([]);
  }, []);

  function handleLoginSuccess(name) {
    setNotice(`${name || '用户'}，欢迎来到书香云端`);
  }

  return (
    <AppLayout
      cartCount={cartItems.reduce((total, item) => total + item.qty, 0)}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      <StatusToast message={notice} />
      <Routes>
        <Route
          path="/"
          element={
            <BookListPage
              books={books}
              heroBooks={heroBooks}
              priceFilters={priceFilters}
              searchTerm={searchTerm}
              selectedFilterId={selectedFilterId}
              onFilterChange={setSelectedFilterId}
            />
          }
        />
        <Route
          path="/books/:slug"
          element={
            <BookDetailPage
              books={books}
              relatedBooks={books}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              onQuantityChange={handleChangeCartQty}
              onRemoveItem={handleRemoveCartItem}
            />
          }
        />
        <Route
          path="/order"
          element={<OrderPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />}
        />
        <Route
          path="/success"
          element={
            <SuccessPage
              latestOrder={latestOrder}
              onCompleteOrder={handleCompleteOrder}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
