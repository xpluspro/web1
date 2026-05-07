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

export default function ProfilePage({ profile, onSaveProfile }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [submitting, setSubmitting] = useState(false);
  const firstName = Form.useWatch('firstName', form);
  const lastName = Form.useWatch('lastName', form);
  const twitter = Form.useWatch('twitter', form);

  useEffect(() => {
    form.setFieldsValue(profile);
    setAvatarUrl(profile.avatarUrl);
  }, [form, profile]);

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
      await onSaveProfile({ ...values, avatarUrl });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    form.setFieldsValue(profile);
    setAvatarUrl(profile.avatarUrl);
  }

  return (
    <Card>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Space orientation="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Text className="page-kicker">My Profile</Text>
              <Title level={2}>个人信息与注册页</Title>
              <Text type="secondary">
                该页面会调用后端用户注册接口，将新用户保存到数据库，随后可在登录页使用该账号登录。
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
            initialValues={profile}
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
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
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
                  rules={[{ required: true, message: '请输入名字' }]}
                >
                  <Input placeholder="Tom" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: '请输入姓氏' }]}
                >
                  <Input placeholder="Cat" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Twitter / Social Account"
              name="twitter"
              rules={[{ required: true, message: '请输入社交账号' }]}
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
                Register & Save
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
