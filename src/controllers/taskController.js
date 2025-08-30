// src/controllers/taskController.js
import prisma from '../config/database.js';

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id, // Ensure user can only access their own tasks
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ data: task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'BACKLOG', // Default status
        userId: req.user.id, // Link task to the authenticated user
      },
    });

    res.status(201).json({ message: 'Task created successfully', data: task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const { title, description, status, totalMinutes } = req.body || {};

    // First, verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (totalMinutes !== undefined) data.totalMinutes = totalMinutes;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    res.json({ message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // First, verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// @desc    Update a task's status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = parseInt(req.params.id);
    const allowedStatuses = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // First, verify the task belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId: req.user.id },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    res.json({ message: 'Task status updated successfully', data: updatedTask });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};