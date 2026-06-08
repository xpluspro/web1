import { LockOutlined, ReloadOutlined, UnlockOutlined } from '@ant-design/icons';
import {
  App as AntdApp,
  Button,
  Card,
  Empty,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUsers, updateUserStatus } from '../lib/api.js';

const { Text, Title } = Typography;

export default function AdminUserPage({ user }) {
  const { message } = AntdApp.useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      setUsers(await fetchUsers());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadUsers().catch((error) => message.error(`用户列表加载失败：${error.message}`));
    }
  }, [user]);

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

  async function handleStatusChange(record, disabled) {
    setUpdatingId(record.id);
    try {
      const updated = await updateUserStatus(record.id, disabled);
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      message.success(disabled ? '用户已禁用' : '用户已解禁');
    } finally {
      setUpdatingId(null);
    }
  }

  const columns = [
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => <Tag color={role === 'ADMIN' ? 'purple' : 'blue'}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      key: 'disabled',
      width: 140,
      render: (disabled) => (
        <Tag color={disabled ? 'red' : 'green'}>{disabled ? 'Disabled' : 'Active'}</Tag>
      ),
    },
    {
      title: 'Disable',
      key: 'disable',
      width: 160,
      render: (_, record) => (
        <Switch
          checked={record.disabled}
          loading={updatingId === record.id}
          disabled={record.id === user.id}
          checkedChildren={<LockOutlined />}
          unCheckedChildren={<UnlockOutlined />}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
  ];

  return (
    <Card>
      <div className="section-header">
        <div>
          <Text className="page-kicker">User Management</Text>
          <Title level={3} style={{ marginBottom: 4 }}>
            用户管理
          </Title>
          <Text type="secondary">管理员可以禁用或解禁用户，被禁用用户无法登录系统</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 860 }}
      />
    </Card>
  );
}
