import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.jsx';
import { api } from '../api.js';

vi.mock('../api.js', () => ({
  api: {
    list: vi.fn(),
    create: vi.fn(),
    toggle: vi.fn(),
    remove: vi.fn()
  }
}));

const sampleTodo = {
  id: '1',
  title: 'Buy milk',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z'
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('App', () => {
  it('shows the empty state when there are no todos', async () => {
    api.list.mockResolvedValue([]);
    render(<App />);
    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders todos returned from the API', async () => {
    api.list.mockResolvedValue([sampleTodo]);
    render(<App />);
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('1 task(s) remaining')).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    api.list.mockResolvedValue([]);
    api.create.mockResolvedValue({ ...sampleTodo, id: '2', title: 'Walk dog' });
    render(<App />);

    await waitFor(() => expect(api.list).toHaveBeenCalled());

    const input = screen.getByLabelText(/new todo title/i);
    await userEvent.type(input, 'Walk dog');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(await screen.findByText('Walk dog')).toBeInTheDocument();
    expect(api.create).toHaveBeenCalledWith('Walk dog');
  });

  it('shows a validation error for an empty title without calling the API', async () => {
    api.list.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => expect(api.list).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/enter a task/i);
    expect(api.create).not.toHaveBeenCalled();
  });

  it('toggles a todo as completed', async () => {
    api.list.mockResolvedValue([sampleTodo]);
    api.toggle.mockResolvedValue({ ...sampleTodo, completed: true });
    render(<App />);

    const checkbox = await screen.findByRole('checkbox');
    await userEvent.click(checkbox);

    await waitFor(() => expect(api.toggle).toHaveBeenCalledWith('1'));
    expect(await screen.findByText('0 task(s) remaining')).toBeInTheDocument();
  });

  it('deletes a todo', async () => {
    api.list.mockResolvedValue([sampleTodo]);
    api.remove.mockResolvedValue(null);
    render(<App />);

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await userEvent.click(deleteBtn);

    await waitFor(() => expect(api.remove).toHaveBeenCalledWith('1'));
    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('shows an error message when the initial load fails', async () => {
    api.list.mockRejectedValue(new Error('network error'));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('network error');
  });
});
