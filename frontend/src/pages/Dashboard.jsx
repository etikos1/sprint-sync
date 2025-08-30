/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TaskKanban from '../components/TaskKanban';
import TaskForm from '../components/TaskForm';
import AIAssistant from '../components/AIAssistant';
import { fetchTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.data.data);
    } catch (error) {
      message.error('Failed to load tasks');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      message.success('Task created successfully');
      setIsModalOpen(false);
      setAiSuggestion('');
      loadTasks();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      if (!editingTask || !editingTask.id) {
        message.error('Cannot update task: No task ID found');
        return;
      }
      
      await updateTask(editingTask.id, taskData);
      message.success('Task updated successfully');
      setIsModalOpen(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      message.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const handleSuggestionGenerated = (suggestion) => {
    setAiSuggestion(suggestion);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (error) {
      message.error('Failed to update task status');
    }
  };

  const showModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    if (!editingTask) {
      setAiSuggestion('');
    }
  };

  // This function handles both create and update submissions
  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          New Task
        </Button>
        <div style={{ flex: 1, maxWidth: 400 }}>
          <AIAssistant onSuggestionGenerated={handleSuggestionGenerated} />
        </div>
      </div>

      <TaskKanban
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEdit={showModal}
        onDelete={handleDeleteTask}
      />

      <Modal
        title={editingTask ? `Edit Task: ${editingTask.title}` : 'Create New Task'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          aiSuggestion={!editingTask ? aiSuggestion : ''}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;