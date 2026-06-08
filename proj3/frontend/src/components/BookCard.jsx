import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';

const { Paragraph, Text, Title } = Typography;

export default function BookCard({ book }) {
  return (
    <Card
      hoverable
      className="book-card"
      cover={
        <Link to={`/books/${book.id}`} className="book-card-cover">
          <img src={book.cover} alt={book.title} className="book-card-image" />
        </Link>
      }
    >
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <Space wrap>
          <Tag color="blue">{book.category}</Tag>
          <Tag color={book.status === 'In Stock' ? 'green' : 'orange'}>{book.status}</Tag>
          <Tag color={book.stock > 0 ? 'cyan' : 'red'}>库存 {book.stock}</Tag>
        </Space>

        <div>
          <Title level={4} className="book-card-title">
            {book.title}
          </Title>
          <Text type="secondary">
            {book.author} · {book.publisher}
          </Text>
        </div>

        <Paragraph className="book-card-summary" ellipsis={{ rows: 3 }}>
          {book.summary}
        </Paragraph>

        <Text type="secondary">ISBN {book.isbn}</Text>

        <div className="book-card-footer">
          <Text strong className="book-card-price">
            {formatPrice(book.price)}
          </Text>
          <Link to={`/books/${book.id}`}>
            <Button type="primary" icon={<EyeOutlined />}>
              查看详情
            </Button>
          </Link>
        </div>
      </Space>
    </Card>
  );
}
