import request from 'supertest';
import app from '../index';

describe('Health endpoint', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('Auth endpoints', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dupe@example.com', password: 'password123', name: 'Test' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dupe@example.com', password: 'password123', name: 'Test' });
    expect(res.status).toBe(409);
  });

  it('logs in with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'password123', name: 'Login Test' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});

describe('Protected routes', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('accepts authenticated requests', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'auth@example.com', password: 'password123', name: 'Auth Test' });
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${reg.body.token}`);
    expect(res.status).toBe(200);
  });
});
