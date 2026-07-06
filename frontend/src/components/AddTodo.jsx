import { useState } from 'react';

const MAX_LENGTH = 200;

export default function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Task must be ${MAX_LENGTH} characters or fewer`);
      return;
    }
    setError('');
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo title"
      />
      <button type="submit">Add</button>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
    </form>
  );
}
