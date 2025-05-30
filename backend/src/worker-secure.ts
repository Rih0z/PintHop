import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';

export interface Env {
  MONGODB_URI: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  // テスト用環境変数
  TEST_USER_1_USERNAME?: string;
  TEST_USER_1_PASSWORD?: string;
  TEST_USER_1_EMAIL?: string;
  TEST_USER_2_USERNAME?: string;
  TEST_USER_2_PASSWORD?: string;
  TEST_USER_2_EMAIL?: string;
  TEST_USER_3_USERNAME?: string;
  TEST_USER_3_PASSWORD?: string;
  TEST_USER_3_EMAIL?: string;
}

const app = new Hono<{ Bindings: Env }>();

// セキュリティヘッダーの追加
app.use('/*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// CORS設定 - 本番環境では環境変数から取得
app.use('/*', cors({
  origin: (origin) => {
    // Cloudflare Pagesのドメインとローカル開発環境のみ許可
    const allowedOrigins = [
      'https://67515bf9.pinthop.pages.dev',
      'http://localhost:3000'
    ];
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 認証エンドポイント
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const env = c.env;
    
    // テストユーザーの認証（環境変数から取得）
    const testUsers = [
      {
        username: env.TEST_USER_1_USERNAME || 'testuser',
        password: env.TEST_USER_1_PASSWORD || 'test123456',
        email: env.TEST_USER_1_EMAIL || 'test@pinthop.com'
      },
      {
        username: env.TEST_USER_2_USERNAME || 'alice',
        password: env.TEST_USER_2_PASSWORD || 'alice123456',
        email: env.TEST_USER_2_EMAIL || 'alice@pinthop.com'
      },
      {
        username: env.TEST_USER_3_USERNAME || 'bob',
        password: env.TEST_USER_3_PASSWORD || 'bob123456',
        email: env.TEST_USER_3_EMAIL || 'bob@pinthop.com'
      }
    ];
    
    const user = testUsers.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // 適切なJWTトークンの生成
    const payload = {
      sub: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24時間
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };
    
    const token = await sign(payload, env.JWT_SECRET);
    
    return c.json({
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    // エラー詳細を本番環境では隠蔽
    const errorMessage = c.env.NODE_ENV === 'development' 
      ? `Login error: ${error}` 
      : 'Login failed';
    return c.json({ error: errorMessage }, 500);
  }
});

app.post('/api/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    const env = c.env;
    
    // 入力検証
    if (!username || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // メールアドレスの簡易検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }
    
    // パスワード強度の簡易チェック
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    const payload = {
      sub: username,
      email: email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };
    
    const token = await sign(payload, env.JWT_SECRET);
    
    return c.json({
      token,
      user: { username, email }
    });
  } catch (error) {
    const errorMessage = c.env.NODE_ENV === 'development' 
      ? `Registration error: ${error}` 
      : 'Registration failed';
    return c.json({ error: errorMessage }, 500);
  }
});

app.get('/api/auth/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }
    
    const token = authHeader.substring(7);
    const env = c.env;
    
    // JWTトークンの検証
    const payload = await verify(token, env.JWT_SECRET);
    
    // トークンの有効期限チェック
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: 'Token expired' }, 401);
    }
    
    return c.json({
      user: {
        username: payload.sub,
        email: payload.email
      }
    });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// APIエンドポイント
app.get('/api/breweries', (c) => {
  return c.json({ message: 'Breweries endpoint - coming soon' });
});

app.get('/api/checkins', (c) => {
  return c.json({ message: 'Checkins endpoint - coming soon' });
});

app.get('/api/presence', (c) => {
  return c.json({ message: 'Presence endpoint - coming soon' });
});

// 404ハンドラー
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// エラーハンドラー
app.onError((err, c) => {
  // 本番環境ではエラー詳細を隠蔽
  if (c.env.NODE_ENV !== 'development') {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
  console.error(`${err}`);
  return c.json({ error: err.message }, 500);
});

export default app;