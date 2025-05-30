/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/services/socket.ts
 *
 * 作成者: Koki Riho
 * 作成日: 2025-05-26
 *
 * 更新履歴:
 * - 2025-05-26 Koki Riho 初期作成
 *
 * 説明:
 * Socket.IOクライアントの設定とイベント管理
 */

import { io, Socket } from 'socket.io-client';
import { Presence } from '../types/presence';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  // プレゼンス更新
  updatePresence(data: {
    status?: 'online' | 'away' | 'offline';
    location?: { type: 'Point'; coordinates: [number, number] };
    breweryId?: string;
    visibility?: 'everyone' | 'friends' | 'none';
  }): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('presence:update', data);
  }

  // プレゼンス更新のリスナー
  onPresenceUpdate(callback: (data: {
    userId: string;
    username: string;
    presence: Presence;
  }) => void): void {
    this.socket?.on('presence:updated', callback);
  }

  // プレゼンスオフラインのリスナー
  onPresenceOffline(callback: (data: {
    userId: string;
    username: string;
  }) => void): void {
    this.socket?.on('presence:offline', callback);
  }

  // ブルワリーのプレゼンスを監視
  watchBrewery(breweryId: string): void {
    this.socket?.emit('brewery:watch', breweryId);
  }

  // ブルワリーの監視を解除
  unwatchBrewery(breweryId: string): void {
    this.socket?.emit('brewery:unwatch', breweryId);
  }

  // ブルワリーのプレゼンスリストリスナー
  onBreweryPresenceList(callback: (presences: Presence[]) => void): void {
    this.socket?.on('brewery:presence:list', callback);
  }

  // チェックイン作成
  createCheckin(data: {
    breweryId: string;
    location?: { type: 'Point'; coordinates: [number, number] };
  }): void {
    this.socket?.emit('checkin:create', data);
  }

  // チェックイン成功リスナー
  onCheckinSuccess(callback: (data: { presence: Presence }) => void): void {
    this.socket?.on('checkin:create:success', callback);
  }

  // チェックインエラーリスナー
  onCheckinError(callback: (error: string) => void): void {
    this.socket?.on('checkin:create:error', callback);
  }

  // イベントリスナーの削除
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();