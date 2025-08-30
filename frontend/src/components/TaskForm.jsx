import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const TaskForm = ({ task, onSubmit, onCancel, aiSuggestion }) => { 
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      form.setFieldsValue(task);
    } else if (aiSuggestion) {
      form.setFieldsValue({
        description: aiSuggestion
      });
    }
  }, [task, aiSuggestion, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (task) {
        await onSubmit(task.id, values);
      } else {
        await onSubmit(values);
      }
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input task title!' }]}>
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={4} placeholder="Enter task description" />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select>
          <Option value="BACKLOG">To Do</Option>
          <Option value="IN_PROGRESS">In Progress</Option>
          <Option value="REVIEW">Review</Option>
          <Option value="COMPLETED">Done</Option>
        </Select>
      </Form.Item>

      <Form.Item name="totalMinutes" label="Time Logged (minutes)">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            {task ? 'Update' : 'Create'} Task
          </Button>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;