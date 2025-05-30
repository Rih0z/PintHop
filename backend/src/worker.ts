import { Hono } from 'hono';
import { cors } from 'hono/cors';

// For now, create a simple Hono app without complex route imports
// We'll adapt the existing Express routes later

export interface Env {
  MONGODB_URI: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    // 簡単なテストユーザー認証（本番では MongoDB を使用）
    const testUsers = [
      { username: 'testuser', password: 'test123456', email: 'test@pinthop.com' },
      { username: 'alice', password: 'alice123456', email: 'alice@pinthop.com' },
      { username: 'bob', password: 'bob123456', email: 'bob@pinthop.com' }
    ];
    
    const user = testUsers.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // 簡単なJWTトークン（本番では適切なJWT実装を使用）
    const token = btoa(JSON.stringify({ 
      username: user.username, 
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24時間
    }));
    
    return c.json({
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.post('/api/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    
    // 簡単な登録応答（本番では MongoDB を使用）
    if (!username || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const token = btoa(JSON.stringify({ 
      username, 
      email,
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
    
    return c.json({
      token,
      user: { username, email }
    });
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

app.get('/api/auth/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }
    
    const token = authHeader.substring(7);
    const decoded = JSON.parse(atob(token));
    
    if (decoded.exp < Date.now()) {
      return c.json({ error: 'Token expired' }, 401);
    }
    
    return c.json({
      user: {
        username: decoded.username,
        email: decoded.email
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Basic API endpoints
app.get('/api/breweries', (c) => {
  return c.json({ message: 'Breweries endpoint - coming soon' });
});

app.get('/api/checkins', (c) => {
  return c.json({ message: 'Checkins endpoint - coming soon' });
});

app.get('/api/presence', (c) => {
  return c.json({ message: 'Presence endpoint - coming soon' });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;