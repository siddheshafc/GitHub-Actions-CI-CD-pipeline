export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.title}" as ${
            todo.completed ? 'not completed' : 'completed'
          }`}
        />
        <span>{todo.title}</span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="delete-btn"
      >
        &times;
      </button>
    </li>
  );
}
