import { ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Space, Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;

export default function OrderListPage({ orders, loading, user }) {
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => `#${id}`,
    },
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

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <div className="section-header">
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              My Orders
            </Title>
            <Text type="secondary">下单成功后，订单会从后端数据库读取并显示在这里</Text>
          </div>
        </div>

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
