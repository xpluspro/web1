import {
  BookOutlined,
  BarChartOutlined,
  LoginOutlined,
  OrderedListOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Layout, Menu, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Content, Header, Sider } = Layout;
const { Text, Title } = Typography;

function getMenuItems(user) {
  const isAdmin = user?.role === 'ADMIN';
  const baseItems = [
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
  ];

  const adminItems = isAdmin
    ? [
        {
          key: '/admin/books',
          icon: <SettingOutlined />,
          label: 'Book Manage',
        },
        {
          key: '/admin/users',
          icon: <TeamOutlined />,
          label: 'User Manage',
        },
        {
          key: '/admin/orders',
          icon: <OrderedListOutlined />,
          label: 'All Orders',
        },
        {
          key: '/stats',
          icon: <BarChartOutlined />,
          label: 'Statistics',
        },
      ]
    : [
        {
          key: '/stats',
          icon: <BarChartOutlined />,
          label: 'My Statistics',
        },
      ];

  return [
    ...baseItems,
    ...adminItems,
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Register',
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

  if (pathname.startsWith('/admin/books')) {
    return '/admin/books';
  }

  if (pathname.startsWith('/admin/users')) {
    return '/admin/users';
  }

  if (pathname.startsWith('/admin/orders')) {
    return '/admin/orders';
  }

  if (pathname.startsWith('/stats')) {
    return '/stats';
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

  if (pathname.startsWith('/admin/books')) {
    return [{ title: 'Admin' }, { title: 'Book Manage' }];
  }

  if (pathname.startsWith('/admin/users')) {
    return [{ title: 'Admin' }, { title: 'User Manage' }];
  }

  if (pathname.startsWith('/admin/orders')) {
    return [{ title: 'Admin' }, { title: 'All Orders' }];
  }

  if (pathname.startsWith('/stats')) {
    return [{ title: 'Statistics' }];
  }

  if (pathname.startsWith('/profile')) {
    return [{ title: 'Register' }];
  }

  if (pathname.startsWith('/login')) {
    return [{ title: 'Login' }];
  }

  return [{ title: 'Book List' }];
}

export default function AppLayout({ avatarUrl, cartCount, user, onLogout }) {
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
            <Text className="page-kicker">Book Store</Text>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Space size={16}>
            <Badge count={cartCount} size="small">
              <Avatar icon={<ShoppingCartOutlined />} />
            </Badge>
            <Space size={10}>
              <Avatar src={avatarUrl} icon={<UserOutlined />} />
              <div className="header-user-copy">
                <Text className="header-greeting">Hi, {displayName}</Text>
                <Text type="secondary">
                  {user ? `${user.role === 'ADMIN' ? '管理员' : '顾客'} @${user.username}` : 'Please login'}
                </Text>
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
