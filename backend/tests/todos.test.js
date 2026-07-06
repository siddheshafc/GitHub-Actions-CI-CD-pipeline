const request = require('supertest');
const createApp = require('../src/app');
const store = require('../src/models/todoStore');

const app = createApp();

beforeEach(() => {
  store.reset();
});

describe('GET /health', () => {
  it('returns 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/todos', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns todos sorted by creation order', async () => {
    await request(app).post('/api/todos').send({ title: 'first' });
    await request(app).post('/api/todos').send({ title: 'second' });

    const res = await request(app).get('/api/todos');
    expect(res.body.data.map((t) => t.title)).toEqual(['first', 'second']);
  });
});

describe('POST /api/todos', () => {
  it('creates a todo with valid title', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'Buy milk' });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ title: 'Buy milk', completed: false });
    expect(res.body.data.id).toBeDefined();
  });

  it('trims whitespace from the title', async () => {
    const res = await request(app).post('/api/todos').send({ title: '  spaced  ' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('spaced');
  });

  it('rejects an empty title', async () => {
    const res = await request(app).post('/api/todos').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/empty/);
  });

  it('rejects a missing title', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.status).toBe(400);
  });

  it('rejects a non-string title', async () => {
    const res = await request(app).post('/api/todos').send({ title: 123 });
    expect(res.status).toBe(400);
  });

  it('rejects a title over the max length', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'a'.repeat(201) });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/200 characters/);
  });
});

describe('GET /api/todos/:id', () => {
  it('returns a single todo', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'find me' });
    const res = await request(app).get(`/api/todos/${created.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('find me');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/api/todos/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/todos/:id', () => {
  it('updates the title', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'old' });
    const res = await request(app)
      .put(`/api/todos/${created.body.data.id}`)
      .send({ title: 'new' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('new');
  });

  it('updates the completed flag', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'task' });
    const res = await request(app)
      .put(`/api/todos/${created.body.data.id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it('rejects a non-boolean completed value', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'task' });
    const res = await request(app)
      .put(`/api/todos/${created.body.data.id}`)
      .send({ completed: 'yes' });
    expect(res.status).toBe(400);
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app).put('/api/todos/nope').send({ title: 'x' });
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/todos/:id/toggle', () => {
  it('flips the completed flag', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'toggle me' });
    const first = await request(app).patch(`/api/todos/${created.body.data.id}/toggle`);
    expect(first.body.data.completed).toBe(true);

    const second = await request(app).patch(`/api/todos/${created.body.data.id}/toggle`);
    expect(second.body.data.completed).toBe(false);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).patch('/api/todos/nope/toggle');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes an existing todo', async () => {
    const created = await request(app).post('/api/todos').send({ title: 'bye' });
    const res = await request(app).delete(`/api/todos/${created.body.data.id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/api/todos/${created.body.data.id}`);
    expect(getRes.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete('/api/todos/nope');
    expect(res.status).toBe(404);
  });
});

describe('unmatched API route', () => {
  it('returns a JSON 404', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not found');
  });
});
