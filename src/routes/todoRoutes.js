const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const { validateTodo } = require('../middleware/validation');

router.use(protect); // Protect all routes

router.route('/')
  .get(getAllTodos)
  .post(validateTodo, createTodo);

router.route('/:id')
  .put(validateTodo, updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

module.exports = router;