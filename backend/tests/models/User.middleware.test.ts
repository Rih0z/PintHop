/**
 * User Model Middleware Execution Test for 100% Coverage
 * This test specifically targets the pre-save middleware to achieve complete coverage
 */

import bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('User Model Middleware Execution for 100% Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Clear module cache
    Object.keys(require.cache).forEach(key => {
      if (key.includes('User.ts') || key.includes('mongoose')) {
        delete require.cache[key];
      }
    });
  });

  it('should achieve 100% coverage by executing pre-save middleware', async () => {
    // Mock mongoose with a sophisticated mock that allows middleware execution
    jest.doMock('mongoose', () => {
      const actualMongoose = jest.requireActual('mongoose');
      
      class MockDocument {
        [key: string]: any;
        
        constructor(data: any) {
          Object.assign(this, data);
          this._id = new actualMongoose.Types.ObjectId();
          this.isNew = true;
          this.createdAt = new Date();
          this.updatedAt = new Date();
          this._modifiedPaths = Object.keys(data);
        }
        
        isModified(path: string) {
          return this._modifiedPaths.includes(path);
        }
        
        markModified(path: string) {
          if (!this._modifiedPaths.includes(path)) {
            this._modifiedPaths.push(path);
          }
        }
        
        async save() {
          // Execute pre-save middleware
          const schema = (this.constructor as any).schema;
          if (schema && schema._preSaveMiddleware) {
            for (const middleware of schema._preSaveMiddleware) {
              await new Promise((resolve, reject) => {
                middleware.call(this, (err?: Error) => {
                  if (err) reject(err);
                  else resolve(undefined);
                });
              });
            }
          }
          return this;
        }
      }
      
      class MockSchema extends actualMongoose.Schema {
        _preSaveMiddleware: Array<Function> = [];
        
        constructor(definition: any, options: any) {
          super(definition, options);
        }
        
        pre(event: string, fn: Function) {
          if (event === 'save') {
            this._preSaveMiddleware.push(fn);
          }
          return super.pre(event, fn);
        }
      }
      
      const mockModel = jest.fn().mockImplementation((name: string, schema: any) => {
        function Model(this: any, data: any) {
          MockDocument.call(this, data);
        }
        
        Model.prototype = Object.create(MockDocument.prototype);
        Model.prototype.constructor = Model;
        Model.schema = schema;
        Model.modelName = name;
        Model.collection = { name: name.toLowerCase() + 's' };
        
        return Model;
      });
      
      return {
        ...actualMongoose,
        Schema: MockSchema,
        model: mockModel
      };
    });
    
    // Now import the User model - this will execute the schema definition and register middleware
    const User = require('../../src/models/User').default;
    
    // Verify the model and schema were created
    expect(User).toBeDefined();
    expect(User.schema).toBeDefined();
    expect(User.schema.methods.comparePassword).toBeDefined();
    
    // Test comparePassword method (covers lines 48-49)
    const testDoc = { password: 'hashedpass' };
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
    const compareResult = await User.schema.methods.comparePassword.call(testDoc, 'plainpass');
    expect(bcrypt.compare).toHaveBeenCalledWith('plainpass', 'hashedpass');
    expect(compareResult).toBe(true);
    
    // Now test the pre-save middleware by creating and saving a user
    // This should execute lines 39-45
    
    // Test case 1: Password not modified (line 38-39)
    const user1 = new User({
      username: 'user1',
      email: 'user1@test.com',
      password: 'originalpass'
    });
    
    // Clear the modified paths to simulate password not being modified
    user1._modifiedPaths = ['username', 'email']; // Password not in modified paths
    
    await user1.save();
    
    // Password should not have been hashed because it wasn't modified
    expect(user1.password).toBe('originalpass');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    
    // Test case 2: Password modified (lines 39-41)
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_newpass');
    
    const user2 = new User({
      username: 'user2',
      email: 'user2@test.com',
      password: 'newpass'
    });
    
    // Ensure password is in modified paths
    user2._modifiedPaths = ['username', 'email', 'password'];
    
    await user2.save();
    
    // Password should have been hashed
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 14);
    expect(user2.password).toBe('hashed_newpass');
    
    // Test case 3: Error handling (lines 42-45)
    jest.clearAllMocks();
    const testError = new Error('Hashing failed');
    (bcrypt.hash as jest.Mock).mockRejectedValue(testError);
    
    const user3 = new User({
      username: 'user3',
      email: 'user3@test.com',
      password: 'errorpass'
    });
    
    user3._modifiedPaths = ['username', 'email', 'password'];
    
    // This should trigger the error handling in the middleware
    await expect(user3.save()).rejects.toThrow('Hashing failed');
    expect(bcrypt.hash).toHaveBeenCalledWith('errorpass', 14);
    
    // Test model export (lines 51-52)
    expect(User.modelName).toBe('User');
    expect(typeof User).toBe('function');
  });

  it('should cover all remaining edge cases', () => {
    const User = require('../../src/models/User').default;
    
    // Test the UserDocument interface coverage
    const userData = {
      username: 'edgetest',
      email: 'edge@test.com',
      password: 'edgepass',
      friends: []
    };
    
    const user = new User(userData);
    
    // Test all properties defined in the interface
    expect(user.username).toBe('edgetest');
    expect(user.email).toBe('edge@test.com');
    expect(user.password).toBe('edgepass');
    expect(user.friends).toEqual([]);
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    
    // Test that comparePassword method exists
    expect(typeof user.comparePassword).toBe('function');
  });
});