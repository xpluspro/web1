import { useCallback, useEffect, useMemo, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  addCartItem,
  checkoutCart,
  fetchAllOrders,
  fetchBooks,
  fetchCart,
  fetchOrders,
  loginUser,
  registerUser,
  removeCartItem,
  updateCartItem,
} from '../lib/api.js';
import {
  readRegistrationDraft,
  writeRegistrationDraft,
} from '../lib/registrationDraftStorage.js';
import { readUser, writeUser } from '../lib/sessionStorage.js';

// Keeps cross-page bookstore state and side-effectful API workflows out of App.jsx,
// leaving App.jsx focused on route composition and page wiring.
export function useBookstoreState() {
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
  const [registrationDraft, setRegistrationDraft] = useState(() => readRegistrationDraft());
  const [user, setUser] = useState(() => readUser());

  const loadBooks = useCallback(async () => {
    setBooksLoading(true);
    try {
      const nextBooks = await fetchBooks();
      setBooks(nextBooks);
      return nextBooks;
    } finally {
      setBooksLoading(false);
    }
  }, []);

  const loadUserOrders = useCallback(
    async (filters = {}) => {
      if (!user) {
        setOrders([]);
        return [];
      }

      setOrdersLoading(true);
      try {
        const nextOrders = await fetchOrders(user.id, filters);
        setOrders(nextOrders);
        return nextOrders;
      } finally {
        setOrdersLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadBooks().catch((error) => message.error(`书籍列表加载失败：${error.message}`));
  }, [loadBooks, message]);

  useEffect(() => {
    writeRegistrationDraft(registrationDraft);
  }, [registrationDraft]);

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
  }, [message, user]);

  async function handleLogin(credentials) {
    const nextUser = await loginUser(credentials);
    setUser(nextUser);
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
      setOrders(await fetchOrders(user.id));
      await loadBooks();
      message.success(`订单 #${order.id} 创建成功`);
      navigate('/orders');
    } finally {
      setCheckingOut(false);
    }
  }

  async function handleRegister(nextDraft) {
    const payload = {
      ...nextDraft,
      username: nextDraft.username.trim(),
      email: nextDraft.email.trim(),
      avatarUrl: nextDraft.avatarUrl?.startsWith('data:') ? '' : nextDraft.avatarUrl,
    };
    const result = await registerUser(payload);
    setRegistrationDraft(nextDraft);
    message.success(`${result.message}：${result.fullName}`);
    navigate('/login');
  }

  const heroBooks = useMemo(
    () =>
      books.slice(0, 3).map((book, index) => ({
        ...book,
        eyebrow: ['Featured Book', 'Architecture Pick', 'Code Quality'][index] || 'Recommended',
      })),
    [books]
  );

  return {
    books,
    booksLoading,
    cartItems,
    cartLoading,
    checkingOut,
    headerAvatarUrl: user?.avatarUrl || registrationDraft.avatarUrl,
    heroBooks,
    loadAllOrders: fetchAllOrders,
    loadBooks,
    loadUserOrders,
    orders,
    ordersLoading,
    registrationDraft,
    searchTerm,
    setSearchTerm,
    user,
    handleAddToCart,
    handleCheckout,
    handleLogin,
    handleLogout,
    handleQuickPurchase,
    handleRegister,
    handleRemoveCartItem,
    handleUpdateCartQty,
  };
}
