import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Image,
  InputNumber,
  Result,
  Row,
  Spin,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../lib/format.js';
import { fetchBookById, fetchBooks } from '../lib/api.js';

const { Paragraph, Text, Title } = Typography;

export default function BookDetailPage({ onAddToCart, onQuickPurchase }) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError('');
        const [detail, related] = await Promise.all([fetchBookById(id), fetchBooks()]);

        if (!active) {
          return;
        }

        setBook(detail);
        setBooks(related);
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
          setBook(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      active = false;
    };
  }, [id]);

  const recommendations = useMemo(() => {
    if (!book) {
      return [];
    }

    return books.filter((item) => item.id !== book.id).slice(0, 3);
  }, [book, books]);

  if (loading) {
    return (
      <Card>
        <Spin size="large" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Result
          status="error"
          title="书籍详情加载失败"
          subTitle={error}
          extra={
            <Link to="/books">
              <Button type="primary">返回 Book List</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  if (!book) {
    return (
      <Card>
        <Empty
          description="未找到对应书籍，请返回列表页重新选择"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/books">
            <Button type="primary">返回 Book List</Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
        返回上一页
      </Button>

      <Card>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={9}>
            <div className="detail-image-panel">
              <Image src={book.cover} alt={book.title} preview={false} />
            </div>
          </Col>

          <Col xs={24} lg={15}>
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <Space wrap>
                <Tag color="blue">{book.category}</Tag>
                <Tag color={book.status === 'In Stock' ? 'green' : 'orange'}>{book.status}</Tag>
                <Tag color="purple">{book.language}</Tag>
              </Space>

              <div>
                <Title level={2} style={{ marginBottom: 8 }}>
                  {book.title}
                </Title>
                <Text type="secondary">
                  {book.author} · {book.publisher}
                </Text>
              </div>

              <Text className="detail-price">{formatPrice(book.price)}</Text>

              <Descriptions
                bordered
                size="middle"
                column={1}
                items={[
                  { key: 'author', label: 'Author', children: book.author },
                  { key: 'publisher', label: 'Publisher', children: book.publisher },
                  { key: 'price', label: 'Price', children: formatPrice(book.price) },
                  { key: 'status', label: 'Status', children: book.status },
                  { key: 'isbn', label: 'ISBN', children: book.isbn },
                ]}
              />

              <div>
                <Title level={4}>Introduction</Title>
                {book.description.map((paragraph) => (
                  <Paragraph key={paragraph}>{paragraph}</Paragraph>
                ))}
              </div>

              <div>
                <Title level={5}>Highlights</Title>
                <ul className="detail-highlight-list">
                  {book.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <Space wrap size={16}>
                <Space orientation="vertical" size={6}>
                  <Text type="secondary">Amount</Text>
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                  />
                </Space>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => onAddToCart(book, quantity)}
                >
                  Add to Shopping Cart
                </Button>
                <Button
                  size="large"
                  icon={<ThunderboltOutlined />}
                  onClick={() => onQuickPurchase(book)}
                >
                  Purchase Now
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="Related Books">
        <Row gutter={[16, 16]}>
          {recommendations.map((item) => (
            <Col key={item.id} xs={24} md={8}>
              <Card
                hoverable
                className="related-book-card"
                cover={<img src={item.cover} alt={item.title} className="related-book-image" />}
              >
                <Title level={5}>{item.title}</Title>
                <Paragraph type="secondary">{item.author}</Paragraph>
                <Link to={`/books/${item.id}`}>
                  <Button type="link" style={{ paddingLeft: 0 }}>
                    查看详情
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  );
}
