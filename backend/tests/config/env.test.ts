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
    // Store original env variables
    const originalMongoDB = process.env.MONGODB_URI;
    const originalJWTSecret = process.env.JWT_SECRET;
    const originalJWTExpires = process.env.JWT_EXPIRES_IN;
    const originalJWTRefreshExpires = process.env.JWT_REFRESH_EXPIRES_IN;
    const originalCorsOrigin = process.env.CORS_ORIGIN;
    
    // Remove required variables
    delete process.env.MONGODB_URI;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.JWT_REFRESH_EXPIRES_IN;
    delete process.env.CORS_ORIGIN;
    
    // Clear require cache
    delete require.cache[require.resolve('../../src/config/env')];
    
    expect(() => {
      require('../../src/config/env');
    }).toThrow(/Missing required environment variables/);
    
    // Restore original env variables
    if (originalMongoDB) process.env.MONGODB_URI = originalMongoDB;
    if (originalJWTSecret) process.env.JWT_SECRET = originalJWTSecret;
    if (originalJWTExpires) process.env.JWT_EXPIRES_IN = originalJWTExpires;
    if (originalJWTRefreshExpires) process.env.JWT_REFRESH_EXPIRES_IN = originalJWTRefreshExpires;
    if (originalCorsOrigin) process.env.CORS_ORIGIN = originalCorsOrigin;
  });

  it('should throw error for invalid NODE_ENV', () => {
    // Set all required vars except NODE_ENV is invalid
    process.env.NODE_ENV = 'invalid';
    process.env.PORT = '5000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pinthop-test';
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    delete require.cache[require.resolve('../../src/config/env')];

    expect(() => {
      require('../../src/config/env');
    }).toThrow('NODE_ENV must be one of: development, test, production');
  });

  it('should throw error for short JWT_SECRET', () => {
    // Set all required vars except JWT_SECRET is too short
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pinthop-test';
    process.env.JWT_SECRET = 'short';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    delete require.cache[require.resolve('../../src/config/env')];

    expect(() => {
      require('../../src/config/env');
    }).toThrow('JWT_SECRET must be at least 32 characters long');
  });

  it('should throw error for invalid PORT', () => {
    // Set all required vars except PORT is invalid
    process.env.NODE_ENV = 'test';
    process.env.PORT = '99999';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pinthop-test';
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    delete require.cache[require.resolve('../../src/config/env')];

    expect(() => {
      require('../../src/config/env');
    }).toThrow('PORT must be a valid number between 1 and 65535');
  });

  it('should test reset method for coverage', () => {
    // Clear cache first to ensure clean state
    delete require.cache[require.resolve('../../src/config/env')];
    
    // Set valid environment
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pinthop-test';
    process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.CORS_ORIGIN = 'http://localhost:3000';

    // Import after setting env vars
    const envModule = require('../../src/config/env');
    
    // Call reset function to cover line 26
    expect(() => {
      envModule.resetEnvValidator();
    }).not.toThrow();
    
    // Access env again to ensure it still works
    expect(envModule.env).toBeDefined();
  });
});