import {
  InboxOutlined,
  ReloadOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';

const { Text, Title } = Typography;
const { TextArea } = Input;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// This page is intentionally a registration screen, not profile editing.
// Existing users use Login/Switch User; new users are created through /users/register.
export default function ProfilePage({ draft, onRegister }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(draft.avatarUrl);
  const [submitting, setSubmitting] = useState(false);
  const firstName = Form.useWatch('firstName', form);
  const lastName = Form.useWatch('lastName', form);
  const twitter = Form.useWatch('twitter', form);
  const password = Form.useWatch('password', form);

  useEffect(() => {
    form.setFieldsValue(draft);
    setAvatarUrl(draft.avatarUrl);
  }, [draft, form]);

  async function handleUploadChange(info) {
    const file = info.fileList[0]?.originFileObj;

    if (!file) {
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setAvatarUrl(dataUrl);
    form.setFieldValue('avatarUrl', dataUrl);
  }

  async function handleFinish(values) {
    setSubmitting(true);

    try {
      await onRegister({ ...values, avatarUrl });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    form.setFieldsValue(draft);
    setAvatarUrl(draft.avatarUrl);
  }

  return (
    <Card>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Space orientation="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Text className="page-kicker">Register</Text>
              <Title level={2}>用户注册</Title>
              <Text type="secondary">
                新用户需要填写用户名、密码、重复密码和邮箱。提交后会调用后端注册接口并保存到数据库。
              </Text>
            </div>

            <Card className="profile-preview-card">
              <Space orientation="vertical" align="center" style={{ width: '100%' }}>
                <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} />
                <Title level={4} style={{ marginBottom: 0 }}>
                  {[firstName, lastName].filter(Boolean).join(' ') || 'Book User'}
                </Title>
                <Text type="secondary">{twitter || '@book_user'}</Text>
              </Space>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            initialValues={draft}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="jerry" autoComplete="username" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' },
                  ]}
                >
                  <Input placeholder="jerry@example.com" autoComplete="email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password placeholder="123456" autoComplete="new-password" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Repeat Password"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: '请再次输入密码' },
                    {
                      validator: (_, value) =>
                        !value || value === password
                          ? Promise.resolve()
                          : Promise.reject(new Error('两次输入的密码不一致')),
                    },
                  ]}
                >
                  <Input.Password placeholder="123456" autoComplete="new-password" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                >
                  <Input placeholder="Tom" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                >
                  <Input placeholder="Cat" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Twitter / Social Account"
              name="twitter"
            >
              <Input placeholder="@TomCat" />
            </Form.Item>

            <Form.Item label="Avatar URL" name="avatarUrl">
              <Input
                placeholder="粘贴头像图片地址，或使用下方上传组件"
                onChange={(event) => setAvatarUrl(event.target.value)}
              />
            </Form.Item>

            <Form.Item label="Upload Avatar">
              <Upload.Dragger
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to this area to upload</p>
                <p className="ant-upload-hint">上传后的图片会用于本地预览；如需提交到后端，建议填写可访问的头像 URL</p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item label="Notes" name="notes">
              <TextArea rows={6} placeholder="填写你的个人简介、阅读偏好或课程作业说明" />
            </Form.Item>

            <Space wrap>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
              >
                Register
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Cancel / Reset
              </Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}
