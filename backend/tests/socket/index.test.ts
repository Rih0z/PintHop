import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { initializeSocketServer } from '../../src/socket/index';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';
import logger from '../../src/utils/logger';
import Presence from '../../src/models/Presence';
import User from '../../src/models/User';

// Mock dependencies
jest.mock('socket.io');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/env');
jest.mock('../../src/utils/logger');
jest.mock('../../src/models/Presence');
jest.mock('../../src/models/User');

const MockedSocketServer = SocketServer as jest.MockedClass<typeof SocketServer>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedEnv = env as jest.Mocked<typeof env>;
const mockedLogger = logger as jest.Mocked<typeof logger>;
const MockedPresence = Presence as jest.MockedClass<typeof Presence>;
const MockedUser = User as jest.MockedClass<typeof User>;

describe('Socket Server', () => {
  let mockHttpServer: HttpServer;
  let mockSocketServer: any;
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockHttpServer = {} as HttpServer;
    
    mockSocket = {
      handshake: {
        auth: { token: 'valid-token' }
      },
      id: 'socket123',
      userId: 'user123',
      username: 'testuser',
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      on: jest.fn(),
      broadcast: {
        emit: jest.fn()
      }
    };

    mockSocketServer = {
      use: jest.fn(),
      on: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

    MockedSocketServer.mockImplementation(() => mockSocketServer);
    
    mockedEnv.CORS_ORIGIN = 'http://localhost:3000';
    mockedEnv.JWT_SECRET = 'test-secret';
  });

  describe('initializeSocketServer', () => {
    it('should create and configure socket server with correct options', () => {
      const result = initializeSocketServer(mockHttpServer);

      expect(MockedSocketServer).toHaveBeenCalledWith(mockHttpServer, {
        cors: {
          origin: 'http://localhost:3000',
          credentials: true
        },
        transports: ['websocket', 'polling']
      });
      expect(result).toBe(mockSocketServer);
    });

    it('should setup authentication middleware', () => {
      initializeSocketServer(mockHttpServer);

      expect(mockSocketServer.use).toHaveBeenCalled();
      const authMiddleware = mockSocketServer.use.mock.calls[0][0];
      expect(typeof authMiddleware).toBe('function');
    });

    it('should setup connection event handler', () => {
      initializeSocketServer(mockHttpServer);

      expect(mockSocketServer.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('Authentication middleware', () => {
    let authMiddleware: Function;
    let nextCallback: jest.Mock;

    beforeEach(() => {
      initializeSocketServer(mockHttpServer);
      authMiddleware = mockSocketServer.use.mock.calls[0][0];
      nextCallback = jest.fn();
    });

    it('should authenticate valid token successfully', async () => {
      const mockUser = { _id: 'user123', username: 'testuser' };
      
      mockedJwt.verify.mockReturnValue({ sub: 'user123' } as any);
      MockedUser.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await authMiddleware(mockSocket, nextCallback);

      expect(mockedJwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(MockedUser.findById).toHaveBeenCalledWith('user123');
      expect(mockSocket.userId).toBe('user123');
      expect(mockSocket.username).toBe('testuser');
      expect(nextCallback).toHaveBeenCalledWith();
    });

    it('should reject connection when token is missing', async () => {
      mockSocket.handshake.auth.token = undefined;

      await authMiddleware(mockSocket, nextCallback);

      expect(nextCallback).toHaveBeenCalledWith(new Error('Authentication error'));
    });

    it('should reject connection when token is invalid', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware(mockSocket, nextCallback);

      expect(nextCallback).toHaveBeenCalledWith(new Error('Authentication error'));
    });

    it('should reject connection when token has no sub field', async () => {
      mockedJwt.verify.mockReturnValue({} as any);

      await authMiddleware(mockSocket, nextCallback);

      expect(nextCallback).toHaveBeenCalledWith(new Error('Invalid token'));
    });

    it('should reject connection when user is not found', async () => {
      mockedJwt.verify.mockReturnValue({ sub: 'user123' } as any);
      MockedUser.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await authMiddleware(mockSocket, nextCallback);

      expect(nextCallback).toHaveBeenCalledWith(new Error('User not found'));
    });
  });

  describe('Connection event handlers', () => {
    let connectionHandler: Function;

    beforeEach(() => {
      initializeSocketServer(mockHttpServer);
      connectionHandler = mockSocketServer.on.mock.calls[0][1];
    });

    it('should log user connection and join user room', () => {
      connectionHandler(mockSocket);

      expect(mockedLogger.info).toHaveBeenCalledWith(
        `User ${mockSocket.username} (${mockSocket.userId}) connected`
      );
      expect(mockSocket.join).toHaveBeenCalledWith(`user:${mockSocket.userId}`);
    });

    it('should setup all socket event handlers', () => {
      connectionHandler(mockSocket);

      const eventHandlers = mockSocket.on.mock.calls.map((call: any) => call[0]);
      expect(eventHandlers).toContain('presence:update');
      expect(eventHandlers).toContain('brewery:watch');
      expect(eventHandlers).toContain('brewery:unwatch');
      expect(eventHandlers).toContain('checkin:create');
      expect(eventHandlers).toContain('disconnect');
    });

    describe('presence:update handler', () => {
      let presenceUpdateHandler: Function;

      beforeEach(() => {
        connectionHandler(mockSocket);
        const onCalls = mockSocket.on.mock.calls;
        presenceUpdateHandler = onCalls.find((call: any) => call[0] === 'presence:update')[1];
      });

      it('should update presence and broadcast to friends', async () => {
        const presenceData = {
          status: 'online' as const,
          location: { type: 'Point' as const, coordinates: [40.7128, -74.0060] },
          breweryId: 'brewery123',
          visibility: 'everyone' as const
        };

        const mockPresence = {
          _id: 'presence123',
          ...presenceData,
          user: mockSocket.userId
        };

        MockedPresence.findOneAndUpdate = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPresence)
        });

        await presenceUpdateHandler(presenceData);

        expect(MockedPresence.findOneAndUpdate).toHaveBeenCalledWith(
          { user: mockSocket.userId },
          {
            ...presenceData,
            lastUpdated: expect.any(Date),
            socketId: mockSocket.id
          },
          { upsert: true, new: true }
        );

        expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('presence:updated', {
          userId: mockSocket.userId,
          username: mockSocket.username,
          presence: mockPresence
        });

        expect(mockSocket.emit).toHaveBeenCalledWith('presence:update:success', mockPresence);
      });

      it('should handle presence update errors gracefully', async () => {
        const presenceData = {
          status: 'online' as const,
          breweryId: 'brewery123'
        };

        MockedPresence.findOneAndUpdate = jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        });

        await presenceUpdateHandler(presenceData);

        expect(mockedLogger.error).toHaveBeenCalledWith('Presence update error:', expect.any(Error));
        expect(mockSocket.emit).toHaveBeenCalledWith('presence:update:error', 'Failed to update presence');
      });
    });

    describe('brewery:watch handler', () => {
      let breweryWatchHandler: Function;

      beforeEach(() => {
        connectionHandler(mockSocket);
        const onCalls = mockSocket.on.mock.calls;
        breweryWatchHandler = onCalls.find((call: any) => call[0] === 'brewery:watch')[1];
      });

      it('should join brewery room and send current presence list', async () => {
        const breweryId = 'brewery123';
        const mockPresences = [
          { _id: 'presence1', user: { username: 'user1' }, brewery: { name: 'Test Brewery' } },
          { _id: 'presence2', user: { username: 'user2' }, brewery: { name: 'Test Brewery' } }
        ];

        MockedPresence.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockPresences)
          })
        });

        await breweryWatchHandler(breweryId);

        expect(mockSocket.join).toHaveBeenCalledWith(`brewery:${breweryId}`);
        expect(MockedPresence.find).toHaveBeenCalledWith({ brewery: breweryId });
        expect(mockSocket.emit).toHaveBeenCalledWith('brewery:presence:list', mockPresences);
      });
    });

    describe('brewery:unwatch handler', () => {
      let breweryUnwatchHandler: Function;

      beforeEach(() => {
        connectionHandler(mockSocket);
        const onCalls = mockSocket.on.mock.calls;
        breweryUnwatchHandler = onCalls.find((call: any) => call[0] === 'brewery:unwatch')[1];
      });

      it('should leave brewery room', () => {
        const breweryId = 'brewery123';

        breweryUnwatchHandler(breweryId);

        expect(mockSocket.leave).toHaveBeenCalledWith(`brewery:${breweryId}`);
      });
    });

    describe('checkin:create handler', () => {
      let checkinCreateHandler: Function;

      beforeEach(() => {
        connectionHandler(mockSocket);
        const onCalls = mockSocket.on.mock.calls;
        checkinCreateHandler = onCalls.find((call: any) => call[0] === 'checkin:create')[1];
      });

      it('should create checkin and update presence', async () => {
        const checkinData = {
          breweryId: 'brewery123',
          location: { type: 'Point' as const, coordinates: [40.7128, -74.0060] }
        };

        const mockPresence = {
          _id: 'presence123',
          user: mockSocket.userId,
          brewery: checkinData.breweryId,
          status: 'online'
        };

        MockedPresence.findOneAndUpdate = jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockPresence)
        });

        await checkinCreateHandler(checkinData);

        expect(MockedPresence.findOneAndUpdate).toHaveBeenCalledWith(
          { user: mockSocket.userId },
          {
            status: 'online',
            brewery: checkinData.breweryId,
            location: checkinData.location,
            lastUpdated: expect.any(Date),
            socketId: mockSocket.id
          },
          { upsert: true, new: true }
        );

        expect(mockSocketServer.to).toHaveBeenCalledWith(`brewery:${checkinData.breweryId}`);
        expect(mockSocketServer.emit).toHaveBeenCalledWith('brewery:checkin', {
          userId: mockSocket.userId,
          username: mockSocket.username,
          breweryId: checkinData.breweryId,
          timestamp: expect.any(Date)
        });

        expect(mockSocket.emit).toHaveBeenCalledWith('checkin:create:success', { presence: mockPresence });
      });

      it('should handle checkin creation errors', async () => {
        const checkinData = {
          breweryId: 'brewery123'
        };

        MockedPresence.findOneAndUpdate = jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        });

        await checkinCreateHandler(checkinData);

        expect(mockedLogger.error).toHaveBeenCalledWith('Checkin create error:', expect.any(Error));
        expect(mockSocket.emit).toHaveBeenCalledWith('checkin:create:error', 'Failed to create checkin');
      });
    });

    describe('disconnect handler', () => {
      let disconnectHandler: Function;

      beforeEach(() => {
        connectionHandler(mockSocket);
        const onCalls = mockSocket.on.mock.calls;
        disconnectHandler = onCalls.find((call: any) => call[0] === 'disconnect')[1];
      });

      it('should update presence to offline and notify friends', async () => {
        MockedPresence.findOneAndUpdate = jest.fn().mockResolvedValue({});

        await disconnectHandler();

        expect(mockedLogger.info).toHaveBeenCalledWith(
          `User ${mockSocket.username} (${mockSocket.userId}) disconnected`
        );

        expect(MockedPresence.findOneAndUpdate).toHaveBeenCalledWith(
          { user: mockSocket.userId },
          {
            status: 'offline',
            lastUpdated: expect.any(Date),
            socketId: null
          }
        );

        expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('presence:offline', {
          userId: mockSocket.userId,
          username: mockSocket.username
        });
      });

      it('should handle disconnect errors gracefully', async () => {
        MockedPresence.findOneAndUpdate = jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        });

        await disconnectHandler();

        expect(mockedLogger.error).toHaveBeenCalledWith('Disconnect error:', expect.any(Error));
      });
    });
  });

  describe('Error handling and edge cases', () => {
    let connectionHandler: Function;

    beforeEach(() => {
      initializeSocketServer(mockHttpServer);
      connectionHandler = mockSocketServer.on.mock.calls[0][1];
    });

    it('should handle missing socket properties gracefully', () => {
      const incompleteSocket = {
        handshake: { auth: {} },
        join: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),
        broadcast: { emit: jest.fn() }
      };

      // Should not throw when connecting with incomplete socket
      expect(() => connectionHandler(incompleteSocket)).not.toThrow();
    });

    it('should handle malformed presence data', async () => {
      connectionHandler(mockSocket);
      const presenceUpdateHandler = mockSocket.on.mock.calls.find(
        (call: any) => call[0] === 'presence:update'
      )[1];

      // Test with various malformed data
      await presenceUpdateHandler(null);
      await presenceUpdateHandler(undefined);
      await presenceUpdateHandler({});
      await presenceUpdateHandler({ invalidField: 'value' });

      // Should handle gracefully without throwing
      expect(MockedPresence.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should handle authentication edge cases', async () => {
      const authMiddleware = mockSocketServer.use.mock.calls[0][0];
      const nextCallback = jest.fn();

      // Test with various token scenarios
      mockSocket.handshake.auth.token = '';
      await authMiddleware(mockSocket, nextCallback);
      expect(nextCallback).toHaveBeenCalledWith(new Error('Authentication error'));

      jest.clearAllMocks();
      mockSocket.handshake.auth.token = null;
      await authMiddleware(mockSocket, nextCallback);
      expect(nextCallback).toHaveBeenCalledWith(new Error('Authentication error'));
    });
  });
});