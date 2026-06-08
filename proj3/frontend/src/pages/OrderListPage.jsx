import { ReloadOutlined, SearchOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Empty, Form, Input, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

function toFilters(values = {}) {
  const range = values.range || [];
  return {
    startDate: range[0]?.format('YYYY-MM-DD'),
    endDate: range[1]?.format('YYYY-MM-DD'),
    bookName: values.bookName?.trim(),
  };
}

export default function OrderListPage({
  orders: externalOrders,
  loading: externalLoading,
  user,
  title = 'My Orders',
  description = '下单成功后，订单会从后端数据库读取并显示在这里',
  onSearch,
  loadOrders,
  adminOnly = false,
}) {
  const [form] = Form.useForm();
  const [internalOrders, setInternalOrders] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const orders = externalOrders ?? internalOrders;
  const loading = externalLoading ?? internalLoading;

  async function handleSearch(values = form.getFieldsValue()) {
    const filters = toFilters(values);
    if (loadOrders) {
      setInternalLoading(true);
      try {
        setInternalOrders(await loadOrders(filters));
      } finally {
        setInternalLoading(false);
      }
      return;
    }

    await onSearch?.(filters);
  }

  function handleReset() {
    form.resetFields();
    handleSearch({});
  }

  useEffect(() => {
    if (user && loadOrders) {
      handleSearch({});
    }
  }, [user, loadOrders]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => `#${id}`,
    },
    ...(adminOnly
      ? [
          {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            width: 180,
            render: (_, record) => (
              <Space orientation="vertical" size={2}>
                <Text strong>{record.userFullName}</Text>
                <Text type="secondary">@{record.username}</Text>
              </Space>
            ),
          },
        ]
      : []),
    {
      title: 'Books',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Space orientation="vertical" size={4}>
          {items.map((item) => (
            <Text key={`${item.bookId}-${item.title}`}>
              {item.title} x {item.quantity}
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 140,
      render: (value) => formatPrice(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <Tag color="green">{status}</Tag>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 220,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  if (!user) {
    return (
      <Card>
        <Empty description="请先登录后查看订单">
          <Link to="/login">
            <Button type="primary">去登录</Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return (
      <Card>
        <Empty description="该功能仅管理员可访问" />
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <div className="section-header">
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              {title}
            </Title>
            <Text type="secondary">{description}</Text>
          </div>
        </div>

        <Form
          form={form}
          layout="inline"
          className="order-filter-form"
          onFinish={handleSearch}
        >
          <Form.Item name="range">
            <RangePicker />
          </Form.Item>
          <Form.Item name="bookName">
            <Input allowClear prefix={<SearchOutlined />} placeholder="按书籍名称筛选" />
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

        {orders.length === 0 && !loading ? (
          <Empty description="暂无订单，请先在购物车中下单">
            <Link to="/books">
              <Button type="primary" icon={<ShoppingOutlined />}>
                返回书店首页
              </Button>
            </Link>
          </Empty>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={orders}
            loading={loading}
            pagination={false}
            scroll={{ x: 860 }}
          />
        )}
      </Card>
    </Space>
  );
}
