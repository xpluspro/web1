import { SearchOutlined } from '@ant-design/icons';
import { Card, Carousel, Col, Empty, Input, Row, Skeleton, Space, Tag, Typography } from 'antd';
import BookCard from '../components/BookCard.jsx';

const { Paragraph, Text, Title } = Typography;

function matchesSearch(book, searchTerm) {
  if (!searchTerm.trim()) {
    return true;
  }

  const keyword = searchTerm.trim().toLowerCase();
  const haystack = [
    book.title,
    book.author,
    book.category,
    book.summary,
    book.publisher,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(keyword);
}

export default function BookListPage({ books, heroBooks, searchTerm, onSearchChange, loading }) {
  const visibleBooks = books.filter((book) => matchesSearch(book, searchTerm));

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Card className="hero-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} xl={8}>
            <Space orientation="vertical" size={12}>
              <Text className="page-kicker">Online Book Store</Text>
              <Title level={2} style={{ margin: 0 }}>
                书店首页与书籍目录
              </Title>
              <Paragraph className="page-intro">
                本次迭代 2 使用 React、React Router、Ant Design 和 Fetch API
                接入 Spring Boot 后端，书籍列表数据来自数据库并以 JSON 返回。
              </Paragraph>
              <Input
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                placeholder="搜索书名、作者、出版社或分类"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </Space>
          </Col>

          <Col xs={24} xl={16}>
            <Carousel autoplay className="book-hero-carousel">
              {heroBooks.map((book) => (
                <div key={book.id}>
                  <div className="hero-slide">
                    <img src={book.cover} alt={book.title} className="hero-slide-image" />
                    <div className="hero-slide-copy">
                      <Tag color="gold">{book.eyebrow}</Tag>
                      <Title level={3} style={{ color: '#ffffff', marginTop: 12 }}>
                        {book.title}
                      </Title>
                      <Paragraph style={{ color: 'rgba(255,255,255,0.86)', marginBottom: 12 }}>
                        {book.summary}
                      </Paragraph>
                      <Text style={{ color: '#ffffff' }}>
                        {book.author} · {book.publisher}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Card>

      <Card>
        <div className="section-header">
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              全部图书
            </Title>
            <Text type="secondary">当前共展示 {visibleBooks.length} 本图书</Text>
          </div>
        </div>

        {loading ? (
          <Row gutter={[20, 20]}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Col key={index} xs={24} sm={12} xl={8}>
                <Card>
                  <Skeleton active avatar={false} paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : visibleBooks.length > 0 ? (
          <Row gutter={[20, 20]}>
            {visibleBooks.map((book) => (
              <Col key={book.id} xs={24} sm={12} xl={8}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="没有找到匹配的图书，请尝试更换关键词" />
        )}
      </Card>
    </Space>
  );
}
