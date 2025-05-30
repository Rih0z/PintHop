/**
 * Environment configuration tests
 */

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load valid environment configuration', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pinthop-test';
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.CORS_ORIGIN = 'http://localhost:3000';

    const { env } = require('../../src/config/env');

    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(5000);
    expect(env.MONGODB_URI).toBe('mongodb://localhost:27017/pinthop-test');
    expect(env.JWT_SECRET).toBe('test-secret-key-at-least-32-characters-long');
  });

  it('should throw error for missing required variables', () => {
    delete process.env.MONGODB_URI;

    expect(() => {
      require('../../src/config/env');
    }).toThrow('Missing required environment variables');
  });

  it('should throw error for invalid NODE_ENV', () => {
    process.env.NODE_ENV = 'invalid';

    expect(() => {
      require('../../src/config/env');
    }).toThrow('NODE_ENV must be one of: development, test, production');
  });

  it('should throw error for short JWT_SECRET', () => {
    process.env.JWT_SECRET = 'short';

    expect(() => {
      require('../../src/config/env');
    }).toThrow('JWT_SECRET must be at least 32 characters long');
  });

  it('should throw error for invalid PORT', () => {
    process.env.PORT = '99999';

    expect(() => {
      require('../../src/config/env');
    }).toThrow('PORT must be a valid number between 1 and 65535');
  });
});