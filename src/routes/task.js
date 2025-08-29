// src/routes/task.js
import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All task routes are protected and require a valid JWT
router.use(protect);

router.route('/')
  .get(getTasks)    // GET /api/tasks
  .post(createTask); // POST /api/tasks

router.route('/:id')
  .get(getTask)     // GET /api/tasks/:id
  .put(updateTask)  // PUT /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

router.route('/:id/status')
  .patch(updateTaskStatus); // PATCH /api/tasks/:id/status

export default router;