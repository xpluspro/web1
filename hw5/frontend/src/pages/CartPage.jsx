import { DeleteOutlined, ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Button, Card, Empty, InputNumber, Space, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getCartSummary } from '../lib/cartStorage.js';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;

export default function CartPage({
  cartItems,
  loading,
  checkingOut,
  user,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
}) {
  const summary = getCartSummary(cartItems);

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render: (cover, record) => (
        <Link to={`/books/${record.bookId}`}>
          <img src={cover} alt={record.title} className="cart-cover" />
        </Link>
      ),
    },
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
      title: 'Amount',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 140,
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => onQuantityChange(record.bookId, value || 1)}
        />
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price) => formatPrice(price),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 160,
      render: (subtotal) => formatPrice(subtotal),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button danger type="link" icon={<DeleteOutlined />} onClick={() => onRemoveItem(record.bookId)}>
          Delete
        </Button>
      ),
    },
  ];

  if (!user) {
    return (
      <Card>
        <Empty description="请先登录后使用购物车">
          <Link to="/login">
            <Button type="primary">去登录</Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  if (!loading && cartItems.length === 0) {
    return (
      <Card>
        <Empty description="购物车为空，请先从主页选择图书">
          <Link to="/books">
            <Button type="primary" icon={<ShoppingOutlined />}>
              返回书店首页
            </Button>
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
              My Shopping Cart
            </Title>
            <Text type="secondary">购物车数据来自后端数据库，数量修改和删除会即时同步</Text>
          </div>
        </div>

        <Table
          rowKey="bookId"
          columns={columns}
          dataSource={cartItems}
          loading={loading}
          pagination={false}
          scroll={{ x: 860 }}
        />
      </Card>

      <Card className="cart-summary-card">
        <Space orientation="vertical" size={10} style={{ width: '100%' }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Cart Summary
          </Title>
          <div className="summary-row">
            <Text>Subtotal</Text>
            <Text>{formatPrice(summary.subtotal)}</Text>
          </div>
          <div className="summary-row">
            <Text>Discount</Text>
            <Text>-{formatPrice(summary.discount)}</Text>
          </div>
          <div className="summary-row">
            <Text>Shipping</Text>
            <Text>{formatPrice(summary.shipping)}</Text>
          </div>
          <div className="summary-row summary-row-total">
            <Text strong>Total</Text>
            <Text strong>{formatPrice(summary.total)}</Text>
          </div>
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            loading={checkingOut}
            disabled={cartItems.length === 0}
            onClick={onCheckout}
            block
          >
            Checkout
          </Button>
        </Space>
      </Card>
    </Space>
  );
}
