const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `request failed with status ${res.status}`);
  }

  return body.data;
}

export const api = {
  list: () => request('/api/todos'),
  create: (title) =>
    request('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id, updates) =>
    request(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  toggle: (id) => request(`/api/todos/${id}/toggle`, { method: 'PATCH' }),
  remove: (id) => request(`/api/todos/${id}`, { method: 'DELETE' })
};
