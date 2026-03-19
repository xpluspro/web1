import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import StatusToast from './components/StatusToast.jsx';
import { books, heroBooks, priceFilters } from './data/books.js';
import {
  addCartItem,
  getCartSummary,
  readCart,
  removeCartItem,
  updateCartItemQty,
  writeCart,
} from './lib/cartStorage.js';
import {
  prependOrder,
  readOrders,
  updateOrderStatus,
  writeOrders,
} from './lib/orderStorage.js';
import BookDetailPage from './pages/BookDetailPage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterId, setSelectedFilterId] = useState('all');
  const [cartItems, setCartItems] = useState(() => readCart());
  const [orders, setOrders] = useState(() => readOrders());
  const [notice, setNotice] = useState('');
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeOrders(orders);
  }, [orders]);

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

  function createOrder(customer, status) {
    const summary = getCartSummary(cartItems);
    const order = {
      orderNumber: `SF${Date.now().toString().slice(-10)}`,
      customer,
      items: cartItems,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      status,
      total: summary.total,
    };

    setLatestOrder(order);
    setOrders((currentOrders) => prependOrder(currentOrders, order));

    return order;
  }

  function handlePlaceOrder(customer) {
    const order = createOrder(customer, '已支付');
    setNotice('订单已提交，正在跳转到成功页');
    return order;
  }

  function handleSavePendingOrder(customer) {
    const order = createOrder(customer, '待支付');
    setCartItems([]);
    setNotice('订单已保存到我的订单，状态为待支付');
    return order;
  }

  function handleMarkOrderPaid(orderNumber) {
    let paidOrder = null;
    const paidAt = new Date().toLocaleString('zh-CN', { hour12: false });

    setOrders((currentOrders) =>
      updateOrderStatus(currentOrders, orderNumber, '已支付', { paidAt }).map((order) => {
        if (order.orderNumber === orderNumber) {
          paidOrder = order;
        }

        return order;
      })
    );

    if (paidOrder) {
      const nextOrder = {
        ...paidOrder,
        status: '已支付',
        paidAt,
      };
      setLatestOrder(nextOrder);
      setNotice(`订单 ${orderNumber} 已更新为已支付`);
      return nextOrder;
    }

    return null;
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
          element={
            <OrderPage
              cartItems={cartItems}
              onPlaceOrder={handlePlaceOrder}
              onSavePendingOrder={handleSavePendingOrder}
            />
          }
        />
        <Route
          path="/myorder"
          element={
            <MyOrdersPage
              orders={orders}
              onMarkOrderPaid={handleMarkOrderPaid}
            />
          }
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
