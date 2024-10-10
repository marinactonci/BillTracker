"use client";

import React, { useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Typography,
  Space,
  Flex,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EditOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  joinDate: string;
  avatarUrl: string;
}

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    occupation: "Software Developer",
    joinDate: "15-01-2024",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue(profile);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setProfile({ ...profile, ...values });
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-[84vh] bg-gray-100">
      <div className="container mx-auto p-12">
        <Card
          className="w-full h-full shadow-sm"
          title={
            <Space className="w-full justify-between">
              <Title level={3}>User Profile</Title>
              <Button icon={<EditOutlined />} onClick={showModal}>
                Edit Profile
              </Button>
            </Space>
          }
        >
          <Flex align="start" gap="large">
            <Avatar size={128} src={profile.avatarUrl} />
            <Flex vertical gap="middle">
              <Space>
                <UserOutlined />
                <Text strong>{profile.name}</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text>{profile.email}</Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text>{profile.phone}</Text>
              </Space>
              <Space>
                <EnvironmentOutlined />
                <Text>{profile.address}</Text>
              </Space>
              <Space>
                <WalletOutlined />
                <Text>{profile.occupation}</Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text>
                  Joined on {new Date(profile.joinDate).toLocaleDateString()}
                </Text>
              </Space>
            </Flex>
          </Flex>
        </Card>
      </div>

      <Modal
        title="Edit Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="occupation" label="Occupation">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
