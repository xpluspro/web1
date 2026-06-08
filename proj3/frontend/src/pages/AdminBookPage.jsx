import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  App as AntdApp,
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createBook, deleteBook, updateBook } from '../lib/api.js';
import { formatPrice } from '../lib/format.js';

const { Text, Title } = Typography;
const { TextArea } = Input;

const emptyBook = {
  slug: '',
  title: '',
  author: '',
  publisher: '',
  category: '',
  language: 'English',
  isbn: '',
  price: 0,
  stock: 0,
  status: 'In Stock',
  cover: '/images/book1.jpg',
  summary: '',
  description: '',
  highlights: '',
};

function toFormValues(book) {
  if (!book) {
    return emptyBook;
  }

  return {
    ...book,
    description: Array.isArray(book.description) ? book.description.join('\n') : book.description,
    highlights: Array.isArray(book.highlights) ? book.highlights.join('\n') : book.highlights,
  };
}

function matchesKeyword(book, keyword) {
  if (!keyword.trim()) {
    return true;
  }

  const text = [book.title, book.author, book.publisher, book.isbn]
    .join(' ')
    .toLowerCase();
  return text.includes(keyword.trim().toLowerCase());
}

export default function AdminBookPage({ books, loading, user, onBooksChanged }) {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const visibleBooks = useMemo(
    () => books.filter((book) => matchesKeyword(book, keyword)),
    [books, keyword]
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return (
      <Card>
        <Empty description="该功能仅管理员可访问" />
      </Card>
    );
  }

  function openCreateModal() {
    setEditingBook(null);
    form.setFieldsValue(emptyBook);
    setModalOpen(true);
  }

  async function openEditModal(book) {
    setEditingBook(book);
    form.setFieldsValue(toFormValues(book));
    setModalOpen(true);
  }

  async function handleDelete(bookId) {
    await deleteBook(bookId);
    await onBooksChanged();
    message.success('图书已删除');
  }

  async function handleFinish(values) {
    setSaving(true);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      };
      if (editingBook) {
        await updateBook(editingBook.id, payload);
        message.success('图书信息已更新');
      } else {
        await createBook(payload);
        message.success('新图书已添加');
      }
      setModalOpen(false);
      await onBooksChanged();
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover',
      width: 96,
      render: (cover, record) => (
        <img src={cover} alt={record.title} className="admin-book-cover" />
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
      title: 'ISBN',
      dataIndex: 'isbn',
      key: 'isbn',
      width: 170,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 180,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 110,
      render: (stock) => <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => formatPrice(price),
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="删除这本图书？"
            description="删除后将不再出现在图书列表中。"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <div className="section-header">
          <div>
            <Text className="page-kicker">Book Management</Text>
            <Title level={3} style={{ marginBottom: 4 }}>
              图书管理
            </Title>
            <Text type="secondary">管理员可搜索、添加、编辑和删除数据库中的图书</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Book
          </Button>
        </div>

        <Input
          allowClear
          className="table-search-input"
          prefix={<SearchOutlined />}
          placeholder="按书名、作者、出版社或 ISBN 搜索"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={visibleBooks}
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 980 }}
        />
      </Card>

      <Modal
        title={editingBook ? 'Edit Book' : 'Add Book'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={760}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="admin-book-form-grid">
            <Form.Item label="Slug" name="slug" rules={[{ required: true, message: '请输入 slug' }]}>
              <Input placeholder="clean-architecture" />
            </Form.Item>
            <Form.Item label="Title" name="title" rules={[{ required: true, message: '请输入书名' }]}>
              <Input placeholder="Clean Architecture" />
            </Form.Item>
            <Form.Item label="Author" name="author" rules={[{ required: true, message: '请输入作者' }]}>
              <Input placeholder="Robert C. Martin" />
            </Form.Item>
            <Form.Item label="Publisher" name="publisher" rules={[{ required: true, message: '请输入出版社' }]}>
              <Input placeholder="Prentice Hall" />
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true, message: '请输入分类' }]}>
              <Input placeholder="Software Architecture" />
            </Form.Item>
            <Form.Item label="Language" name="language" rules={[{ required: true, message: '请输入语言' }]}>
              <Input placeholder="English" />
            </Form.Item>
            <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: '请输入 ISBN' }]}>
              <Input placeholder="978-0134494166" />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Input placeholder="In Stock" />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: '请输入定价' }]}>
              <InputNumber min={0.01} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Stock" name="stock" rules={[{ required: true, message: '请输入库存' }]}>
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item label="Cover" name="cover" rules={[{ required: true, message: '请输入封面地址' }]}>
            <Input placeholder="/images/book1.jpg" />
          </Form.Item>
          <Form.Item label="Summary" name="summary" rules={[{ required: true, message: '请输入简介' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: '请输入详细描述' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Highlights" name="highlights" rules={[{ required: true, message: '请输入卖点' }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save
            </Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
