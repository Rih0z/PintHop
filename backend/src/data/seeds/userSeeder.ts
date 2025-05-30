/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/data/seeds/userSeeder.ts
 * 
 * 作成者: AI Assistant
 * 作成日: 2025-05-30
 * 
 * 説明:
 * テストユーザーのシードデータをMongoDBに格納するためのスクリプト
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import User from '../../models/User';
import logger from '../../utils/logger';

// MongoDBに接続
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully for seeding');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// テストユーザーのシードデータ
const testUsers = [
  {
    username: 'testuser',
    email: 'test@pinthop.com',
    password: 'test123456',
    firstName: 'Test',
    lastName: 'User',
    preferences: {
      favoriteStyles: ['IPA', 'Lager'],
      privacy: {
        shareLocation: true,
        shareActivity: true,
        allowFriendRequests: true
      }
    }
  },
  {
    username: 'alice',
    email: 'alice@pinthop.com',
    password: 'alice123456',
    firstName: 'Alice',
    lastName: 'Johnson',
    preferences: {
      favoriteStyles: ['Stout', 'Porter'],
      privacy: {
        shareLocation: true,
        shareActivity: true,
        allowFriendRequests: true
      }
    }
  },
  {
    username: 'bob',
    email: 'bob@pinthop.com',
    password: 'bob123456',
    firstName: 'Bob',
    lastName: 'Smith',
    preferences: {
      favoriteStyles: ['Pale Ale', 'Wheat Beer'],
      privacy: {
        shareLocation: true,
        shareActivity: true,
        allowFriendRequests: true
      }
    }
  }
];

// シードデータの読み込みと保存
const seedUsers = async () => {
  try {
    // ユーザーコレクションをクリア（テストユーザーのみ）
    await User.deleteMany({ 
      $or: [
        { email: { $in: testUsers.map(u => u.email) } },
        { username: { $in: testUsers.map(u => u.username) } }
      ]
    });
    logger.info('Existing test user data cleared');

    // 各テストユーザーを作成
    for (const userData of testUsers) {
      // パスワードをハッシュ化
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // ユーザーを作成
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      logger.info(`Test user created: ${userData.username} (${userData.email})`);
    }

    logger.info(`Total: ${testUsers.length} test users seeded successfully`);
    
    // テストユーザー情報を表示（パスワードは表示しない）
    console.log('\n🧪 Test Users Created:');
    console.log('================================');
    testUsers.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log('--------------------------------');
    });
    console.log('\n⚠️  Test credentials are stored securely.');
    console.log('Please refer to documentation for login information.\n');
    
  } catch (err) {
    logger.error('Error seeding user data:', err);
  }
};

// シード実行
const runSeeder = async () => {
  await connectDB();
  await seedUsers();
  
  // 完了後に接続を閉じる
  mongoose.connection.close();
  logger.info('Database connection closed');
};

// スクリプトを実行
runSeeder();