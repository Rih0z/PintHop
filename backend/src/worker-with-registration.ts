import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';

export interface Env {
  MONGODB_URI: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  USERS_KV: KVNamespace;
}

interface User {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
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

// CORS設定
app.use('/*', cors({
  origin: (origin) => {
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

// ユーザー登録エンドポイント
app.post('/api/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    const env = c.env;
    
    // 入力検証
    if (!username || !email || !password) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    // ユーザー名の検証（英数字とアンダースコアのみ、3-20文字）
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return c.json({ 
        error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' 
      }, 400);
    }
    
    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }
    
    // パスワード強度チェック
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    // パスワードに少なくとも1つの数字と1つの文字が含まれているかチェック
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return c.json({ 
        error: 'Password must contain at least one letter and one number' 
      }, 400);
    }
    
    // 既存ユーザーのチェック（ユーザー名）
    const existingUserByUsername = await env.USERS_KV.get(`user:${username}`);
    if (existingUserByUsername) {
      return c.json({ error: 'Username already exists' }, 409);
    }
    
    // 既存ユーザーのチェック（メール）
    const existingUserByEmail = await env.USERS_KV.get(`email:${email}`);
    if (existingUserByEmail) {
      return c.json({ error: 'Email already registered' }, 409);
    }
    
    // パスワードのハッシュ化
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // ユーザーデータの作成
    const user: User = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // KVストレージに保存
    await env.USERS_KV.put(`user:${username}`, JSON.stringify(user));
    await env.USERS_KV.put(`email:${email.toLowerCase()}`, username); // メールでの検索用
    
    // JWTトークンの生成
    const payload = {
      sub: username,
      email: email.toLowerCase(),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24時間
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };
    
    const token = await sign(payload, env.JWT_SECRET);
    
    return c.json({
      token,
      user: {
        username,
        email: email.toLowerCase()
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// ログインエンドポイント
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const env = c.env;
    
    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }
    
    // ユーザー名またはメールでログイン可能
    let userData: string | null = null;
    let actualUsername = username;
    
    // メールアドレスでのログインチェック
    if (username.includes('@')) {
      const storedUsername = await env.USERS_KV.get(`email:${username.toLowerCase()}`);
      if (storedUsername) {
        actualUsername = storedUsername;
        userData = await env.USERS_KV.get(`user:${storedUsername}`);
      }
    } else {
      // ユーザー名でのログイン
      userData = await env.USERS_KV.get(`user:${username}`);
    }
    
    if (!userData) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const user: User = JSON.parse(userData);
    
    // パスワードの検証
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // JWTトークンの生成
    const payload = {
      sub: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
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
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// 認証確認エンドポイント
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

// ユーザー名の利用可能性チェック
app.get('/api/auth/check-username/:username', async (c) => {
  try {
    const username = c.req.param('username');
    const env = c.env;
    
    // ユーザー名の形式チェック
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return c.json({ 
        available: false, 
        error: 'Invalid username format' 
      });
    }
    
    const existingUser = await env.USERS_KV.get(`user:${username}`);
    
    return c.json({ 
      available: !existingUser,
      username 
    });
  } catch (error) {
    console.error('Username check error:', error);
    return c.json({ error: 'Failed to check username' }, 500);
  }
});

// メールの利用可能性チェック
app.get('/api/auth/check-email/:email', async (c) => {
  try {
    const email = c.req.param('email');
    const env = c.env;
    
    // メールの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        available: false, 
        error: 'Invalid email format' 
      });
    }
    
    const existingUser = await env.USERS_KV.get(`email:${email.toLowerCase()}`);
    
    return c.json({ 
      available: !existingUser,
      email: email.toLowerCase() 
    });
  } catch (error) {
    console.error('Email check error:', error);
    return c.json({ error: 'Failed to check email' }, 500);
  }
});

// 404ハンドラー
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// エラーハンドラー
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;