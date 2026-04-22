import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Card, Empty, InputNumber, Space, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getBookById } from '../data/books.js';
import { getCartSummary } from '../lib/cartStorage.js';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;

export default function CartPage({ cartItems, onQuantityChange, onRemoveItem }) {
  const summary = getCartSummary(cartItems);

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image, record) => (
        <Link to={`/books/${record.slug || getBookById(record.id)?.slug || ''}`}>
          <img src={image} alt={record.title} className="cart-cover" />
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
      dataIndex: 'qty',
      key: 'qty',
      width: 140,
      render: (qty, record) => (
        <InputNumber
          min={1}
          value={qty}
          onChange={(value) => onQuantityChange(record.id, value || 1)}
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
      key: 'subtotal',
      width: 160,
      render: (_, record) => formatPrice(record.price * record.qty),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button danger type="link" icon={<DeleteOutlined />} onClick={() => onRemoveItem(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  if (cartItems.length === 0) {
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
            <Text type="secondary">本页面展示迭代 1 所需的购物车列表、数量调整和删除操作</Text>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={cartItems}
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
          <Text type="secondary">
            结算与支付链路不是本次迭代 1 的重点，因此这里重点展示前端页面结构与交互组织。
          </Text>
        </Space>
      </Card>
    </Space>
  );
}
