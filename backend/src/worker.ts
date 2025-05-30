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

// Basic API endpoints
app.get('/api/breweries', (c) => {
  return c.json({ message: 'Breweries endpoint - coming soon' });
});

app.get('/api/auth/health', (c) => {
  return c.json({ message: 'Auth endpoint - coming soon' });
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