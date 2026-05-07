import {
  BookOutlined,
  LoginOutlined,
  OrderedListOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Layout, Menu, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Content, Header, Sider } = Layout;
const { Text, Title } = Typography;

function getMenuItems(user) {
  return [
    {
      key: '/books',
      icon: <BookOutlined />,
      label: 'Book List',
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: 'My Cart',
    },
    {
      key: '/orders',
      icon: <OrderedListOutlined />,
      label: 'My Orders',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: '/login',
      icon: <LoginOutlined />,
      label: user ? 'Switch User' : 'Login',
    },
  ];
}

function getSelectedMenuKey(pathname) {
  if (pathname.startsWith('/cart')) {
    return '/cart';
  }

  if (pathname.startsWith('/orders')) {
    return '/orders';
  }

  if (pathname.startsWith('/profile')) {
    return '/profile';
  }

  if (pathname.startsWith('/login')) {
    return '/login';
  }

  return '/books';
}

function getBreadcrumbItems(pathname) {
  if (pathname.startsWith('/books/') && pathname !== '/books') {
    return [{ title: 'Book List' }, { title: 'Book Detail' }];
  }

  if (pathname.startsWith('/cart')) {
    return [{ title: 'My Cart' }];
  }

  if (pathname.startsWith('/orders')) {
    return [{ title: 'My Orders' }];
  }

  if (pathname.startsWith('/profile')) {
    return [{ title: 'My Profile' }];
  }

  if (pathname.startsWith('/login')) {
    return [{ title: 'Login' }];
  }

  return [{ title: 'Book List' }];
}

export default function AppLayout({ cartCount, profile, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMenuKey = getSelectedMenuKey(location.pathname);
  const menuItems = useMemo(() => getMenuItems(user), [user]);
  const breadcrumbItems = useMemo(
    () => getBreadcrumbItems(location.pathname),
    [location.pathname]
  );
  const displayName = user?.fullName || 'Guest';

  return (
    <Layout className="book-app-shell">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={240}
        className="book-app-sider"
      >
        <div className="brand-block">
          <Avatar size={40} className="brand-avatar" icon={<BookOutlined />} />
          <div>
            <Title level={4} className="brand-title">
              Book Store
            </Title>
            <Text type="secondary">Spring Boot + React</Text>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header className="book-app-header">
          <div>
            <Text className="page-kicker">Homework 4</Text>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Space size={16}>
            <Badge count={cartCount} size="small">
              <Avatar icon={<ShoppingCartOutlined />} />
            </Badge>
            <Space size={10}>
              <Avatar src={profile.avatarUrl} icon={<UserOutlined />} />
              <div className="header-user-copy">
                <Text className="header-greeting">Hi, {displayName}</Text>
                <Text type="secondary">{user ? `@${user.username}` : 'Please login'}</Text>
              </div>
            </Space>
            {user ? (
              <Button size="small" onClick={onLogout}>
                Logout
              </Button>
            ) : null}
          </Space>
        </Header>

        <Content className="book-app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
