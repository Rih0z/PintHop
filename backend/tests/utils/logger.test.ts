// Import the actual logger module (not mocked)
const loggerModule = jest.requireActual('../../src/utils/logger');
const logger = loggerModule.logger || loggerModule.default;

describe('Logger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
  };

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation()
    };
  });

  afterEach(() => {
    // Restore console methods
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
    consoleSpy.warn.mockRestore();
    jest.clearAllMocks();
  });

  describe('info method', () => {
    it('should call console.log with message', () => {
      const message = 'Test info message';
      logger.info(message);
      expect(consoleSpy.log).toHaveBeenCalledWith(message);
    });

    it('should call console.log with message and optional parameters', () => {
      const message = 'Test info message';
      const param1 = { test: 'data' };
      const param2 = 123;
      logger.info(message, param1, param2);
      expect(consoleSpy.log).toHaveBeenCalledWith(message, param1, param2);
    });
  });

  describe('error method', () => {
    it('should call console.error with message', () => {
      const message = 'Test error message';
      logger.error(message);
      expect(consoleSpy.error).toHaveBeenCalledWith(message);
    });

    it('should call console.error with message and optional parameters', () => {
      const message = 'Test error message';
      const error = new Error('test error');
      logger.error(message, error);
      expect(consoleSpy.error).toHaveBeenCalledWith(message, error);
    });
  });

  describe('warn method', () => {
    it('should call console.warn with message', () => {
      const message = 'Test warning message';
      logger.warn(message);
      expect(consoleSpy.warn).toHaveBeenCalledWith(message);
    });

    it('should call console.warn with message and optional parameters', () => {
      const message = 'Test warning message';
      const data = { warning: 'data' };
      logger.warn(message, data);
      expect(consoleSpy.warn).toHaveBeenCalledWith(message, data);
    });
  });

  describe('debug method', () => {
    it('should call console.log with debug prefix in non-production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const message = 'Test debug message';
      logger.debug(message);
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG]', message);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should call console.log with debug prefix and optional parameters in non-production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      const message = 'Test debug message';
      const data = { debug: 'info' };
      logger.debug(message, data);
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG]', message, data);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not call console.log in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const message = 'Test debug message';
      logger.debug(message);
      expect(consoleSpy.log).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('exports', () => {
    it('should export logger as named export', () => {
      expect(logger).toBeDefined();
      expect(typeof logger).toBe('object');
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.debug).toBeDefined();
    });

    it('should export logger as default export', () => {
      const defaultLogger = jest.requireActual('../../src/utils/logger').default;
      expect(defaultLogger).toBe(logger);
    });

    it('should export named logger that equals default export', () => {
      const actualModule = jest.requireActual('../../src/utils/logger');
      const namedLogger = actualModule.logger;
      const defaultLogger = actualModule.default;
      expect(namedLogger).toBe(defaultLogger);
    });
  });

  describe('function types', () => {
    it('should have all required methods with correct types', () => {
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });

  describe('debug method edge cases', () => {
    it('should handle debug in test environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      const message = 'Test debug in test env';
      logger.debug(message);
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG]', message);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle debug in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const message = 'Test debug in dev env';
      logger.debug(message);
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG]', message);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle debug with undefined NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;
      
      const message = 'Test debug with undefined env';
      logger.debug(message);
      expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG]', message);
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('parameter handling', () => {
    it('should handle multiple parameters of different types', () => {
      const message = 'Test message';
      const stringParam = 'string';
      const numberParam = 42;
      const objectParam = { key: 'value' };
      const arrayParam = [1, 2, 3];
      
      logger.info(message, stringParam, numberParam, objectParam, arrayParam);
      expect(consoleSpy.log).toHaveBeenCalledWith(message, stringParam, numberParam, objectParam, arrayParam);
    });

    it('should handle no optional parameters', () => {
      const message = 'Test message only';
      logger.warn(message);
      expect(consoleSpy.warn).toHaveBeenCalledWith(message);
    });

    it('should handle null and undefined parameters', () => {
      const message = 'Test with null/undefined';
      logger.error(message, null, undefined);
      expect(consoleSpy.error).toHaveBeenCalledWith(message, null, undefined);
    });
  });
});