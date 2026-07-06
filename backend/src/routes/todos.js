const express = require('express');
const {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

router.get('/', listTodos);
router.get('/:id', getTodo);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
