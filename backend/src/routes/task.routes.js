const { Router } = require('express');
const taskController = require('../controllers/task.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.route('/')
  .post(taskController.createTask)
  .get(taskController.getTasks);

router.route('/:id')
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
