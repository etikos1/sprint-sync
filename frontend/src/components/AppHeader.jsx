/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Modal, Form, Input, message } from 'antd';
import { LogoutOutlined, UserOutlined, DashboardOutlined, BarChartOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Logged out successfully');
    window.location.href = '/login';
  };

  const handleProfileClick = () => {
    // Pre-fill the form with current user data
    profileForm.setFieldsValue({
      email: user.email,
      // Add more fields if available in your user object
    });
    setIsProfileModalVisible(true);
  };

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, email: values.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      message.success('Profile updated successfully!');
      setIsProfileModalVisible(false);
      
      // Refresh the page to reflect changes
      window.location.reload();
      
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelProfileModal = () => {
    setIsProfileModalVisible(false);
    profileForm.resetFields();
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: handleProfileClick,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0, marginRight: 40, color: '#1890ff' }}>SprintSync</h2>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none' }}
          />
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Button 
            type="text" 
            icon={<UserOutlined />}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>{user.email}</span>
          </Button>
        </Dropdown>
      </Header>

      {/* Profile Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined />
            Edit Profile
          </div>
        }
        open={isProfileModalVisible}
        onCancel={handleCancelProfileModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email address!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your email address" 
              size="large"
            />
          </Form.Item>

          {/* Add more fields as needed for your user profile */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: false, message: 'Please input your full name!' }]}
          >
            <Input 
              placeholder="Enter your full name" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Change Password"
            name="password"
            rules={[
              { required: false },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              placeholder="Enter new password (optional)" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: false },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm new password" 
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button 
              onClick={handleCancelProfileModal}
              style={{ marginRight: '8px' }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<EditOutlined />}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppHeader;