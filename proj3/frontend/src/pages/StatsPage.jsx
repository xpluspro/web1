import { BarChartOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App as AntdApp,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Space,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  fetchBookSalesStats,
  fetchCustomerStats,
  fetchUserConsumptionStats,
} from '../lib/api.js';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

function toFilters(values = {}) {
  const range = values.range || [];
  return {
    startDate: range[0]?.format('YYYY-MM-DD'),
    endDate: range[1]?.format('YYYY-MM-DD'),
  };
}

function QuantityBar({ value, max }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="stats-bar-cell">
      <span className="stats-bar-track">
        <span className="stats-bar-fill" style={{ width: `${width}%` }} />
      </span>
      <Text>{value}</Text>
    </div>
  );
}

export default function StatsPage({ user }) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [bookStats, setBookStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [customerStats, setCustomerStats] = useState({ books: [], totalQuantity: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  async function loadStats(values = form.getFieldsValue()) {
    if (!user) {
      return;
    }

    const filters = toFilters(values);
    setLoading(true);
    try {
      if (user.role === 'ADMIN') {
        const [books, users] = await Promise.all([
          fetchBookSalesStats(filters),
          fetchUserConsumptionStats(filters),
        ]);
        setBookStats(books);
        setUserStats(users);
      } else {
        setCustomerStats(await fetchCustomerStats(user.id, filters));
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    form.resetFields();
    loadStats({});
  }

  useEffect(() => {
    loadStats().catch((error) => message.error(`统计数据加载失败：${error.message}`));
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const maxBookQuantity = Math.max(0, ...bookStats.map((item) => item.totalQuantity));
  const maxUserAmount = Math.max(0, ...userStats.map((item) => Number(item.totalAmount)));
  const maxCustomerQuantity = Math.max(0, ...customerStats.books.map((item) => item.quantity));

  const bookColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Book',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space orientation="vertical" size={2}>
          <Text strong>{record.title}</Text>
          <Text type="secondary">{record.author} · ISBN {record.isbn}</Text>
        </Space>
      ),
    },
    {
      title: 'Sales',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 220,
      render: (value) => <QuantityBar value={value} max={maxBookQuantity} />,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 140,
      render: (value) => formatPrice(value),
    },
  ];

  const userColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => (
        <Space orientation="vertical" size={2}>
          <Text strong>{record.fullName}</Text>
          <Text type="secondary">@{record.username}</Text>
        </Space>
      ),
    },
    {
      title: 'Books',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 120,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 240,
      render: (value) => (
        <QuantityBar value={Number(value)} max={maxUserAmount} />
      ),
    },
  ];

  const customerColumns = [
    {
      title: 'Book',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space orientation="vertical" size={2}>
          <Text strong>{record.title}</Text>
          <Text type="secondary">{record.author}</Text>
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 220,
      render: (value) => <QuantityBar value={value} max={maxCustomerQuantity} />,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 140,
      render: (value) => formatPrice(value),
    },
  ];

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <div className="section-header">
          <div>
            <Text className="page-kicker">Statistics</Text>
            <Title level={3} style={{ marginBottom: 4 }}>
              {user.role === 'ADMIN' ? '统计中心' : '我的购书统计'}
            </Title>
            <Text type="secondary">
              {user.role === 'ADMIN'
                ? '管理员可查看指定时间范围内的热销榜和用户消费榜'
                : '顾客可查看指定时间范围内自己的购书明细、总本数和总金额'}
            </Text>
          </div>
        </div>

        <Form form={form} layout="inline" className="order-filter-form" onFinish={loadStats}>
          <Form.Item name="range">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {user.role === 'ADMIN' ? (
        <Tabs
          items={[
            {
              key: 'books',
              label: '热销榜',
              children: (
                <Card>
                  <Table
                    rowKey="bookId"
                    columns={bookColumns}
                    dataSource={bookStats}
                    loading={loading}
                    locale={{ emptyText: <Empty description="暂无销售数据" /> }}
                    pagination={false}
                    scroll={{ x: 780 }}
                  />
                </Card>
              ),
            },
            {
              key: 'users',
              label: '消费榜',
              children: (
                <Card>
                  <Table
                    rowKey="userId"
                    columns={userColumns}
                    dataSource={userStats}
                    loading={loading}
                    locale={{ emptyText: <Empty description="暂无消费数据" /> }}
                    pagination={false}
                    scroll={{ x: 780 }}
                  />
                </Card>
              ),
            },
          ]}
        />
      ) : (
        <Space orientation="vertical" size={24} style={{ width: '100%' }}>
          <div className="stats-summary-grid">
            <Card>
              <Statistic
                title="购书总本数"
                value={customerStats.totalQuantity}
                prefix={<BarChartOutlined />}
              />
            </Card>
            <Card>
              <Statistic title="购书总金额" value={formatPrice(customerStats.totalAmount)} />
            </Card>
          </div>
          <Card>
            <Table
              rowKey="bookId"
              columns={customerColumns}
              dataSource={customerStats.books}
              loading={loading}
              locale={{ emptyText: <Empty description="暂无购书统计" /> }}
              pagination={false}
              scroll={{ x: 760 }}
            />
          </Card>
        </Space>
      )}
    </Space>
  );
}
