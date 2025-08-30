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
      loadTasks();
     
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await updateTask(id, taskData);
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
    setAiSuggestion(suggestion);};
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

    if (!task && aiSuggestion) 
      
    setIsModalOpen(true);
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
  title={editingTask ? 'Edit Task' : 'Create Task'}
  open={isModalOpen}
  onCancel={() => {
    setIsModalOpen(false);
    setEditingTask(null);
    setAiSuggestion(''); // Clear suggestion when modal closes
  }}
  footer={null}
  width={600}
>
  <TaskForm
    task={editingTask}
    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
    onCancel={() => {
      setIsModalOpen(false);
      setEditingTask(null);
      setAiSuggestion(''); // Clear suggestion when modal closes
    }}
    aiSuggestion={!editingTask ? aiSuggestion : ''} // Only pass for new tasks
  />
</Modal>
    </div>
  );
};

export default Dashboard;