import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';

jest.mock('../src/models/User');

const mockUser = { id: 'u1', username: 'test', email: 't@example.com', comparePassword: jest.fn() };

(User.findOne as jest.Mock).mockResolvedValue(null);
(User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

describe('POST /api/v1/auth/register', () => {
  it('test_register_validData_createsUser', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    const res = await request(app).post('/api/v1/auth/register').send({ username: 'test', email: 't@example.com', password: 'pass' });
    expect(res.status).toBe(201);
    expect(res.body.tokens).toBeDefined();
  });
});

describe('POST /api/v1/auth/login', () => {
  it('test_login_validCredentials_returnsTokens', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ ...mockUser, comparePassword: jest.fn().mockResolvedValue(true) });
    const res = await request(app).post('/api/v1/auth/login').send({ email: 't@example.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.tokens).toBeDefined();
  });
});
