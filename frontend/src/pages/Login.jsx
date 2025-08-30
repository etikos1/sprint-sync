import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser, registerUser } from '../services/api';
//import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const onLogin = async (values) => {
    setLoading(true);
    setLoginError('');
    try {
      const response = await loginUser(values);
      
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      message.success('Login successful!');
     window.location.href = '/';
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      
      // Specific error messages for better user experience
      if (errorMessage.includes('Invalid') || errorMessage.includes('invalid')) {
        setLoginError('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage.includes('Not authorized') || errorMessage.includes('Unauthorized')) {
        setLoginError('Authentication failed. Please try logging in again.');
      } else if (errorMessage.includes('User not found')) {
        setLoginError('No account found with this email. Please register first.');
      } else {
        setLoginError('Login failed. Please try again later.');
      }
      
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    setLoading(true);
    setRegisterError('');
    try {
      const response = await registerUser(values);
      
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      message.success('Registration successful!');
      window.location.href = '/';
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      
      // Specific error messages for better user experience
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        setRegisterError('An account with this email already exists. Please login instead.');
      } else if (errorMessage.includes('email') && errorMessage.includes('required')) {
        setRegisterError('Please provide a valid email address.');
      } else if (errorMessage.includes('password') && errorMessage.includes('required')) {
        setRegisterError('Please provide a password.');
      } else {
        setRegisterError('Registration failed. Please try again with different credentials.');
      }
      
      message.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Clear errors when switching tabs
    setLoginError('');
    setRegisterError('');
  };

  const items = [
    {
      key: 'login',
      label: 'Login',
      children: (
        <Form onFinish={onLogin} layout="vertical">
          {/* Login Error Alert */}
          {loginError && (
            <Alert
              message={loginError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setLoginError('')}
            />
          )}
          
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Please input your email address!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email address" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: 'Register',
      children: (
        <Form onFinish={onRegister} layout="vertical">
          {/* Registration Error Alert */}
          {registerError && (
            <Alert
              message={registerError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setRegisterError('')}
            />
          )}
          
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Please input your email address!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email address" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Create a password" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            SprintSync
          </div>
        } 
        style={{ 
          width: 400, 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <Tabs 
          items={items} 
          defaultActiveKey="login"
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
        />
      </Card>
    </div>
  );
};

export default Login;