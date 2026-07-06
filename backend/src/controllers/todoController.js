const store = require('../models/todoStore');

const MAX_TITLE_LENGTH = 200;

function validateTitle(title) {
  if (typeof title !== 'string') return 'title is required and must be a string';
  const trimmed = title.trim();
  if (trimmed.length === 0) return 'title must not be empty';
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return `title must be ${MAX_TITLE_LENGTH} characters or fewer`;
  }
  return null;
}

function listTodos(req, res) {
  res.json({ data: store.getAll() });
}

function getTodo(req, res) {
  const todo = store.getById(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'todo not found' });
  }
  res.json({ data: todo });
}

function createTodo(req, res) {
  const { title } = req.body || {};
  const validationError = validateTitle(title);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  const todo = store.create({ title: title.trim() });
  res.status(201).json({ data: todo });
}

function updateTodo(req, res) {
  const { id } = req.params;
  const existing = store.getById(id);
  if (!existing) {
    return res.status(404).json({ error: 'todo not found' });
  }

  const updates = {};
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    const validationError = validateTitle(req.body.title);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    updates.title = req.body.title.trim();
  }
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'completed')) {
    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }
    updates.completed = req.body.completed;
  }

  const updated = store.update(id, updates);
  res.json({ data: updated });
}

function toggleTodo(req, res) {
  const updated = store.toggle(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'todo not found' });
  }
  res.json({ data: updated });
}

function deleteTodo(req, res) {
  const existed = store.delete(req.params.id);
  if (!existed) {
    return res.status(404).json({ error: 'todo not found' });
  }
  res.status(204).send();
}

module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  validateTitle
};
