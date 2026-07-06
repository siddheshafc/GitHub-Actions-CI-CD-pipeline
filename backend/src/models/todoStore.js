const { v4: uuidv4 } = require('uuid');

class TodoStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.todos = new Map();
  }

  getAll() {
    return Array.from(this.todos.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }

  getById(id) {
    return this.todos.get(id) || null;
  }

  create({ title }) {
    const now = new Date().toISOString();
    const todo = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  update(id, updates) {
    const existing = this.todos.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };
    this.todos.set(id, updated);
    return updated;
  }

  toggle(id) {
    const existing = this.todos.get(id);
    if (!existing) return null;
    return this.update(id, { completed: !existing.completed });
  }

  delete(id) {
    return this.todos.delete(id);
  }
}


module.exports = new TodoStore();
module.exports.TodoStore = TodoStore;
