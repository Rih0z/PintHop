export interface Env {
  MONGODB_URI?: string;
  JWT_SECRET?: string;
  CORS_ORIGIN?: string;
}

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: ['https://bb16b80e.pinthop-frontend.pages.dev', 'https://e8428aa3.pinthop-frontend.pages.dev', 'https://c7395f1f.pinthop-frontend.pages.dev', 'http://localhost:3000'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/', (c) => {
  return c.json({ status: 'success', message: 'PintHop API is running' });
});

// Auth endpoints
app.post('/api/v1/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    
    if (!username || !email || !password) {
      return c.json({ 
        status: 'error', 
        message: 'Username, email and password are required' 
      }, 400);
    }

    // For testing, just return success without actual user creation
    const mockUser = {
      _id: 'mock-user-id',
      username,
      email,
      createdAt: new Date().toISOString()
    };

    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };

    return c.json({ 
      status: 'success',
      data: { user: mockUser, tokens: mockTokens }
    }, 201);
  } catch (error) {
    return c.json({ 
      status: 'error', 
      message: 'Registration failed' 
    }, 500);
  }
});

app.post('/api/v1/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ 
        status: 'error', 
        message: 'Username and password are required' 
      }, 400);
    }

    // For testing, return mock success
    const mockUser = {
      _id: 'mock-user-id',
      username,
      email: 'mock@example.com',
      createdAt: new Date().toISOString()
    };

    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };

    return c.json({ 
      status: 'success',
      data: { user: mockUser, tokens: mockTokens }
    });
  } catch (error) {
    return c.json({ 
      status: 'error', 
      message: 'Login failed' 
    }, 500);
  }
});

app.get('/api/v1/auth/check-availability', async (c) => {
  const username = c.req.query('username');
  const email = c.req.query('email');
  
  const result: { username?: boolean; email?: boolean } = {};
  
  if (username) {
    // For testing, always return available unless it's "admin"
    result.username = username !== 'admin';
  }
  
  if (email) {
    // For testing, always return available unless it's "admin@example.com"
    result.email = email !== 'admin@example.com';
  }
  
  return c.json({
    status: 'success',
    data: result
  });
});

// Other endpoints stub
app.get('/api/v1/breweries', (c) => {
  return c.json([]);
});

app.post('/api/v1/auth/logout', (c) => {
  return c.json({ 
    status: 'success',
    message: 'Logged out successfully' 
  });
});

export default app;