import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';

export interface Env {
  MONGODB_URI: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  USERS_KV: KVNamespace;
  BREWERIES_KV: KVNamespace;
  PRESENCE_KV: KVNamespace;
  CHECKINS_KV: KVNamespace;
  FRIENDS_KV: KVNamespace;
}

interface User {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    privacy: {
      shareLocation: boolean;
      shareActivity: boolean;
      allowFriendRequests: boolean;
    };
    notifications: {
      friendNearby: boolean;
      friendCheckin: boolean;
      newFollower: boolean;
    };
  };
}

interface Brewery {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  tags?: string[];
  rating?: number;
  priceLevel?: number;
}

interface Presence {
  userId: string;
  username: string;
  breweryId: string;
  breweryName: string;
  checkInTime: string;
  estimatedDuration?: number; // in minutes
  status: 'active' | 'planned' | 'completed';
  isPublic: boolean;
  message?: string;
}

interface CheckIn {
  id: string;
  userId: string;
  username: string;
  breweryId: string;
  breweryName: string;
  timestamp: string;
  rating?: number;
  note?: string;
  photos?: string[];
  isPublic: boolean;
}

interface Friend {
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
}

const app = new Hono<{ Bindings: Env }>();

// Security headers
app.use('/*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// CORS
app.use('/*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://67515bf9.pinthop.pages.dev',
      'https://fc9d96f0.pinthop.pages.dev',
      'https://2b5d782f.pinthop.pages.dev',
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

// Helper: Get user from token
async function getUserFromToken(c: any): Promise<any> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== AUTH ENDPOINTS ==========

// Register
app.post('/api/auth/register', async (c) => {
  try {
    const { username, email, password } = await c.req.json();
    const env = c.env;
    
    // Validation
    if (!username || !email || !password) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return c.json({ 
        error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' 
      }, 400);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }
    
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    // Check existing
    const existingUserByUsername = await env.USERS_KV.get(`user:${username}`);
    if (existingUserByUsername) {
      return c.json({ error: 'Username already exists' }, 409);
    }
    
    const existingUserByEmail = await env.USERS_KV.get(`email:${email}`);
    if (existingUserByEmail) {
      return c.json({ error: 'Email already registered' }, 409);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with default preferences
    const user: User = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        privacy: {
          shareLocation: true,
          shareActivity: true,
          allowFriendRequests: true
        },
        notifications: {
          friendNearby: true,
          friendCheckin: true,
          newFollower: true
        }
      }
    };
    
    // Save user
    await env.USERS_KV.put(`user:${username}`, JSON.stringify(user));
    await env.USERS_KV.put(`email:${email.toLowerCase()}`, username);
    
    // Generate token
    const payload = {
      sub: username,
      email: email.toLowerCase(),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
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

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    const env = c.env;
    
    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }
    
    let userData: string | null = null;
    let actualUsername = username;
    
    if (username.includes('@')) {
      const storedUsername = await env.USERS_KV.get(`email:${username.toLowerCase()}`);
      if (storedUsername) {
        actualUsername = storedUsername;
        userData = await env.USERS_KV.get(`user:${storedUsername}`);
      }
    } else {
      userData = await env.USERS_KV.get(`user:${username}`);
    }
    
    if (!userData) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const user: User = JSON.parse(userData);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
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
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get current user
app.get('/api/auth/me', async (c) => {
  const user = await getUserFromToken(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const userData = await c.env.USERS_KV.get(`user:${user.sub}`);
  if (!userData) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  const fullUser: User = JSON.parse(userData);
  const { password, ...userWithoutPassword } = fullUser;
  
  return c.json({ user: userWithoutPassword });
});

// ========== BREWERY ENDPOINTS ==========

// Get all breweries
app.get('/api/breweries', async (c) => {
  try {
    // For now, return Seattle breweries from static data
    const seattleBreweries = [
      {
        id: "1",
        name: "Fremont Brewing",
        address: "1050 N 34th St",
        city: "Seattle",
        state: "WA",
        zip: "98103",
        country: "USA",
        latitude: 47.6493,
        longitude: -122.3444,
        phone: "(206) 420-2407",
        website: "https://www.fremontbrewing.com",
        tags: ["dog-friendly", "outdoor-seating", "food-trucks"],
        rating: 4.5,
        priceLevel: 2
      },
      {
        id: "2",
        name: "Stoup Brewing",
        address: "1108 NW 52nd St",
        city: "Seattle",
        state: "WA",
        zip: "98107",
        country: "USA",
        latitude: 47.6659,
        longitude: -122.3701,
        phone: "(206) 457-5524",
        website: "https://www.stoupbrewing.com",
        tags: ["dog-friendly", "outdoor-seating", "games"],
        rating: 4.6,
        priceLevel: 2
      },
      {
        id: "3",
        name: "Cloudburst Brewing",
        address: "2116 Western Ave",
        city: "Seattle",
        state: "WA",
        zip: "98121",
        country: "USA",
        latitude: 47.6114,
        longitude: -122.3455,
        phone: "(206) 602-6061",
        website: "https://cloudburstbrew.com",
        tags: ["craft-focused", "rotating-taps"],
        rating: 4.7,
        priceLevel: 2
      }
    ];
    
    return c.json({ breweries: seattleBreweries });
  } catch (error) {
    console.error('Breweries fetch error:', error);
    return c.json({ error: 'Failed to fetch breweries' }, 500);
  }
});

// Get brewery by ID
app.get('/api/breweries/:id', async (c) => {
  const id = c.req.param('id');
  
  // Simplified for now
  const brewery = {
    id,
    name: "Test Brewery",
    address: "123 Test St",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    country: "USA",
    latitude: 47.6062,
    longitude: -122.3321
  };
  
  return c.json({ brewery });
});

// ========== PRESENCE ENDPOINTS ==========

// Get current presence at breweries
app.get('/api/presence', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get all presence entries (simplified - in production, use pagination)
    const presenceList: Presence[] = [];
    const presenceKeys = await c.env.PRESENCE_KV.list({ prefix: 'presence:' });
    
    for (const key of presenceKeys.keys) {
      const presenceData = await c.env.PRESENCE_KV.get(key.name);
      if (presenceData) {
        const presence: Presence = JSON.parse(presenceData);
        
        // Filter based on privacy settings
        if (presence.isPublic || presence.userId === user.sub) {
          presenceList.push(presence);
        }
      }
    }
    
    // Filter for active presence only
    const activePresence = presenceList.filter(p => p.status === 'active');
    
    return c.json({ presence: activePresence });
  } catch (error) {
    console.error('Presence fetch error:', error);
    return c.json({ error: 'Failed to fetch presence' }, 500);
  }
});

// Update presence (check-in)
app.post('/api/presence', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { breweryId, breweryName, estimatedDuration, message, isPublic = true } = await c.req.json();
    
    if (!breweryId || !breweryName) {
      return c.json({ error: 'Brewery information required' }, 400);
    }
    
    const presence: Presence = {
      userId: user.sub,
      username: user.sub,
      breweryId,
      breweryName,
      checkInTime: new Date().toISOString(),
      estimatedDuration: estimatedDuration || 60, // default 1 hour
      status: 'active',
      isPublic,
      message
    };
    
    // Store presence with TTL based on estimated duration
    const ttl = (estimatedDuration || 60) * 60; // convert minutes to seconds
    await c.env.PRESENCE_KV.put(
      `presence:${user.sub}`,
      JSON.stringify(presence),
      { expirationTtl: ttl }
    );
    
    // Also create a check-in record
    const checkIn: CheckIn = {
      id: `${user.sub}_${Date.now()}`,
      userId: user.sub,
      username: user.sub,
      breweryId,
      breweryName,
      timestamp: new Date().toISOString(),
      note: message,
      isPublic
    };
    
    await c.env.CHECKINS_KV.put(
      `checkin:${checkIn.id}`,
      JSON.stringify(checkIn)
    );
    
    return c.json({ 
      message: 'Checked in successfully',
      presence,
      checkIn
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return c.json({ error: 'Check-in failed' }, 500);
  }
});

// ========== CHECK-IN ENDPOINTS ==========

// Get user's check-ins
app.get('/api/checkins', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');
    
    // Get check-ins (simplified - in production, use proper indexing)
    const checkins: CheckIn[] = [];
    const checkinKeys = await c.env.CHECKINS_KV.list({ prefix: 'checkin:' });
    
    for (const key of checkinKeys.keys) {
      const checkinData = await c.env.CHECKINS_KV.get(key.name);
      if (checkinData) {
        const checkin: CheckIn = JSON.parse(checkinData);
        checkins.push(checkin);
      }
    }
    
    // Sort by timestamp (newest first)
    checkins.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply pagination
    const paginatedCheckins = checkins.slice(offset, offset + limit);
    
    return c.json({
      checkins: paginatedCheckins,
      total: checkins.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Check-ins fetch error:', error);
    return c.json({ error: 'Failed to fetch check-ins' }, 500);
  }
});

// ========== FRIENDS ENDPOINTS ==========

// Get friends list
app.get('/api/friends', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const friends: any[] = [];
    const friendKeys = await c.env.FRIENDS_KV.list({ prefix: `friends:${user.sub}:` });
    
    for (const key of friendKeys.keys) {
      const friendData = await c.env.FRIENDS_KV.get(key.name);
      if (friendData) {
        const friend: Friend = JSON.parse(friendData);
        if (friend.status === 'accepted') {
          // Get friend's user data
          const friendUserData = await c.env.USERS_KV.get(`user:${friend.friendId}`);
          if (friendUserData) {
            const friendUser: User = JSON.parse(friendUserData);
            friends.push({
              username: friendUser.username,
              email: friendUser.email,
              since: friend.createdAt
            });
          }
        }
      }
    }
    
    return c.json({ friends });
  } catch (error) {
    console.error('Friends fetch error:', error);
    return c.json({ error: 'Failed to fetch friends' }, 500);
  }
});

// Send friend request
app.post('/api/friends/request', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { username } = await c.req.json();
    if (!username) {
      return c.json({ error: 'Username required' }, 400);
    }
    
    // Check if user exists
    const targetUserData = await c.env.USERS_KV.get(`user:${username}`);
    if (!targetUserData) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Check if already friends
    const existingFriend = await c.env.FRIENDS_KV.get(`friends:${user.sub}:${username}`);
    if (existingFriend) {
      return c.json({ error: 'Friend request already exists' }, 409);
    }
    
    // Create friend request
    const friendRequest: Friend = {
      userId: user.sub,
      friendId: username,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Store for both users
    await c.env.FRIENDS_KV.put(
      `friends:${user.sub}:${username}`,
      JSON.stringify(friendRequest)
    );
    
    await c.env.FRIENDS_KV.put(
      `friends:${username}:${user.sub}`,
      JSON.stringify({
        ...friendRequest,
        userId: username,
        friendId: user.sub
      })
    );
    
    return c.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Friend request error:', error);
    return c.json({ error: 'Failed to send friend request' }, 500);
  }
});

// Accept friend request
app.put('/api/friends/accept/:username', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const friendUsername = c.req.param('username');
    
    // Get friend request
    const friendData = await c.env.FRIENDS_KV.get(`friends:${user.sub}:${friendUsername}`);
    if (!friendData) {
      return c.json({ error: 'Friend request not found' }, 404);
    }
    
    const friend: Friend = JSON.parse(friendData);
    friend.status = 'accepted';
    
    // Update both records
    await c.env.FRIENDS_KV.put(
      `friends:${user.sub}:${friendUsername}`,
      JSON.stringify(friend)
    );
    
    const reverseFriendData = await c.env.FRIENDS_KV.get(`friends:${friendUsername}:${user.sub}`);
    if (reverseFriendData) {
      const reverseFriend: Friend = JSON.parse(reverseFriendData);
      reverseFriend.status = 'accepted';
      await c.env.FRIENDS_KV.put(
        `friends:${friendUsername}:${user.sub}`,
        JSON.stringify(reverseFriend)
      );
    }
    
    return c.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend error:', error);
    return c.json({ error: 'Failed to accept friend request' }, 500);
  }
});

// ========== ROUTE ENDPOINTS ==========

// Get beer hopping routes
app.get('/api/routes', async (c) => {
  try {
    const user = await getUserFromToken(c);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get today's check-ins for the user
    const today = new Date().toISOString().split('T')[0];
    const userCheckins: CheckIn[] = [];
    
    const checkinKeys = await c.env.CHECKINS_KV.list({ prefix: 'checkin:' });
    for (const key of checkinKeys.keys) {
      const checkinData = await c.env.CHECKINS_KV.get(key.name);
      if (checkinData) {
        const checkin: CheckIn = JSON.parse(checkinData);
        if (checkin.userId === user.sub && checkin.timestamp.startsWith(today)) {
          userCheckins.push(checkin);
        }
      }
    }
    
    // Sort by timestamp
    userCheckins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return c.json({
      route: {
        date: today,
        stops: userCheckins.map(c => ({
          breweryId: c.breweryId,
          breweryName: c.breweryName,
          timestamp: c.timestamp
        })),
        totalStops: userCheckins.length
      }
    });
  } catch (error) {
    console.error('Routes fetch error:', error);
    return c.json({ error: 'Failed to fetch routes' }, 500);
  }
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