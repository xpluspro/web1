import { LoginOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import { getDefaultCredentials } from '../lib/sessionStorage.js';

const { Text, Title } = Typography;

export default function LoginPage({ user, onLogin }) {
  const [form] = Form.useForm();
  const defaultCredentials = getDefaultCredentials();

  async function handleFinish(values) {
    await onLogin(values);
  }

  function fillDemoAccount() {
    form.setFieldsValue(defaultCredentials);
  }

  return (
    <Card>
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={14}>
            <Text className="page-kicker">User Login</Text>
            <Title level={2}>数据库用户登录</Title>
            <Text type="secondary">
              普通用户使用数据库中的用户名和密码登录。默认演示账号是 tom / 123456。
            </Text>
            {user ? <Text strong>当前已登录：{user.fullName}</Text> : null}
          </Space>
        </Col>

        <Col xs={24} lg={15}>
          <Form
            form={form}
            layout="vertical"
            initialValues={defaultCredentials}
            onFinish={handleFinish}
            className="login-form"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="tom" autoComplete="username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="123456" autoComplete="current-password" />
            </Form.Item>

            <Space wrap>
              <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
                Login
              </Button>
              <Button onClick={fillDemoAccount}>Use Demo Account</Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}
