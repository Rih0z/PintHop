/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/socket/index.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 *
 * 説明:
 * Socket.IOサーバーの設定とイベントハンドラー
 */

import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from '../utils/logger';
import Presence from '../models/Presence';
import User from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export const initializeSocketServer = (httpServer: HttpServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // 認証ミドルウェア
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
      if (!decoded.sub) {
        return next(new Error('Invalid token'));
      }

      const user = await User.findById(decoded.sub).select('username');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = decoded.sub;
      socket.username = user.username;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // 接続ハンドラー
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User ${socket.username} (${socket.userId}) connected`);

    // ユーザーをルームに参加させる（自分のIDと友達のプレゼンスを受信するため）
    socket.join(`user:${socket.userId}`);

    // プレゼンス更新イベント
    socket.on('presence:update', async (data: {
      status?: 'online' | 'away' | 'offline';
      location?: { type: 'Point'; coordinates: [number, number] };
      breweryId?: string;
      visibility?: 'everyone' | 'friends' | 'none';
    }) => {
      try {
        // プレゼンスを更新
        const presence = await Presence.findOneAndUpdate(
          { user: socket.userId },
          {
            ...data,
            lastUpdated: new Date(),
            socketId: socket.id
          },
          { upsert: true, new: true }
        ).populate('brewery', 'name location');

        // 友達にプレゼンス更新を通知
        // TODO: 友達リストの実装後、友達のみに通知するように変更
        socket.broadcast.emit('presence:updated', {
          userId: socket.userId,
          username: socket.username,
          presence
        });

        // 更新成功を送信元に通知
        socket.emit('presence:update:success', presence);
      } catch (error) {
        logger.error('Presence update error:', error);
        socket.emit('presence:update:error', 'Failed to update presence');
      }
    });

    // ブルワリーのプレゼンスを監視
    socket.on('brewery:watch', async (breweryId: string) => {
      socket.join(`brewery:${breweryId}`);
      
      // 現在のプレゼンスリストを送信
      const presences = await Presence.find({ brewery: breweryId })
        .populate('user', 'username')
        .populate('brewery', 'name');
      
      socket.emit('brewery:presence:list', presences);
    });

    // ブルワリーの監視を解除
    socket.on('brewery:unwatch', (breweryId: string) => {
      socket.leave(`brewery:${breweryId}`);
    });

    // チェックインイベント
    socket.on('checkin:create', async (data: {
      breweryId: string;
      location?: { type: 'Point'; coordinates: [number, number] };
    }) => {
      try {
        // チェックインと同時にプレゼンスを更新
        const presence = await Presence.findOneAndUpdate(
          { user: socket.userId },
          {
            status: 'online',
            brewery: data.breweryId,
            location: data.location,
            lastUpdated: new Date(),
            socketId: socket.id
          },
          { upsert: true, new: true }
        ).populate('brewery', 'name location');

        // ブルワリーにいる人に通知
        io.to(`brewery:${data.breweryId}`).emit('brewery:checkin', {
          userId: socket.userId,
          username: socket.username,
          breweryId: data.breweryId,
          timestamp: new Date()
        });

        socket.emit('checkin:create:success', { presence });
      } catch (error) {
        logger.error('Checkin create error:', error);
        socket.emit('checkin:create:error', 'Failed to create checkin');
      }
    });

    // 切断ハンドラー
    socket.on('disconnect', async () => {
      logger.info(`User ${socket.username} (${socket.userId}) disconnected`);

      // プレゼンスをオフラインに更新
      try {
        await Presence.findOneAndUpdate(
          { user: socket.userId },
          {
            status: 'offline',
            lastUpdated: new Date(),
            socketId: null
          }
        );

        // 友達に切断を通知
        socket.broadcast.emit('presence:offline', {
          userId: socket.userId,
          username: socket.username
        });
      } catch (error) {
        logger.error('Disconnect error:', error);
      }
    });
  });

  return io;
};