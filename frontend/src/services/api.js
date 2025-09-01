import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Add a request interceptor to inject the JWT token into every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const loginUser = (userData) => API.post('/auth/login', userData);
export const registerUser = (userData) => API.post('/auth/register', userData);

// Tasks API calls
export const fetchTasks = () => API.get('/tasks');
export const fetchTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) => API.patch(`/tasks/${id}/status`, { status });

// AI Assist API call
export const getAISuggestion = (title) => API.post('/ai/suggest', { title });