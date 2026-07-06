import { useEffect, useState, useCallback } from 'react';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import { api } from './api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.list();
      setTodos(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  async function handleAdd(title) {
    try {
      const created = await api.create(title);
      setTodos((prev) => [...prev, created]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      const updated = await api.toggle(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <h1>Todo App for Github Actions CI/CD</h1>
      <AddTodo onAdd={handleAdd} />

      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
          <p className="summary">{remaining} tasks remaining</p>
        </>
      )}
    </main>
  );
}
