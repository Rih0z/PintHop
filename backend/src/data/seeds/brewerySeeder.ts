/**
 * プロジェクト: PintHop
 * ファイルパス: backend/src/data/seeds/brewerySeeder.ts
 * 
 * 作成者: Koki Riho
 * 作成日: 2025-05-04 00:00:00
 * 
 * 更新履歴:
 * - 2025-05-04 00:00:00 Koki Riho 初期作成
 * - 2025-05-05 00:00:00 Koki Riho 複数のJSONファイルに対応
 * - 2025-05-05 00:00:00 Koki Riho 州・地域階層構造に対応
 * - 2025-05-05 12:00:00 Koki Riho メタデータオブジェクトと新しいJSONファイル形式に対応
 * - 2025-05-05 15:00:00 Koki Riho データベーススキーマ定義書に合わせて修正
 *
 * 説明:
 * ブルワリーのシードデータをMongoDBに格納するためのスクリプト
 * breweries/ディレクトリ内の州ディレクトリと、その中の地域JSONファイルを読み込みます
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import Brewery from '../../models/Brewery';
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

// シードデータの読み込みと保存
const seedBreweries = async () => {
  try {
    // ブルワリーコレクションをクリア
    await Brewery.deleteMany({});
    logger.info('Existing brewery data cleared');

    // breweries ディレクトリのパス
    const breweriesBaseDir = path.join(__dirname, '../breweries');
    
    // breweries ディレクトリが存在するか確認
    if (!fs.existsSync(breweriesBaseDir)) {
      logger.error(`Directory not found: ${breweriesBaseDir}`);
      return;
    }

    // 州ディレクトリの一覧を取得
    const stateDirs = fs.readdirSync(breweriesBaseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    if (stateDirs.length === 0) {
      logger.warn('No state directories found in the breweries directory');
      return;
    }

    let totalBreweries = 0;
    let totalFiles = 0;

    // 各州ディレクトリを処理
    for (const stateDir of stateDirs) {
      const statePath = path.join(breweriesBaseDir, stateDir);
      
      // 州ディレクトリ内のJSONファイルを取得
      const regionFiles = fs.readdirSync(statePath)
        .filter(file => file.endsWith('.json'));
      
      if (regionFiles.length === 0) {
        logger.warn(`No JSON files found in ${stateDir} directory`);
        continue;
      }

      logger.info(`Processing ${stateDir} state with ${regionFiles.length} region files...`);
      
      // 各地域JSONファイルを処理
      for (const regionFile of regionFiles) {
        const filePath = path.join(statePath, regionFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const jsonData = JSON.parse(fileContent);
          
          // 新しいJSON形式に対応（メタデータとbreweries配列）
          const breweries = jsonData.breweries || jsonData;
          
          if (!Array.isArray(breweries)) {
            logger.warn(`Warning: ${stateDir}/${regionFile} does not contain a valid breweries array`);
            continue;
          }
          
          // 各ブルワリーのデータを処理してデータベースに挿入
          for (const brewery of breweries) {
            // 既存のブルワリーを検索
            const existingBrewery = await Brewery.findOne({ 
              $or: [
                { breweryId: brewery.breweryId },
                { slug: brewery.slug }
              ] 
            });
            
            if (existingBrewery) {
              // 既存のブルワリーを更新
              logger.debug(`Updating brewery: ${brewery.name}`);
              await Brewery.updateOne({ breweryId: brewery.breweryId }, brewery);
            } else {
              // 新しいブルワリーを追加
              logger.debug(`Adding new brewery: ${brewery.name}`);
              await Brewery.create(brewery);
            }
          }
          
          logger.info(`${breweries.length} breweries from ${stateDir}/${regionFile} processed successfully`);
          totalBreweries += breweries.length;
          totalFiles++;
        } catch (error) {
          logger.error(`Error processing ${stateDir}/${regionFile}:`, error);
        }
      }
    }

    logger.info(`Total: ${totalBreweries} breweries seeded from ${totalFiles} files across ${stateDirs.length} states`);
  } catch (err) {
    logger.error('Error seeding brewery data:', err);
  }
};

// シード実行
const runSeeder = async () => {
  await connectDB();
  await seedBreweries();
  
  // 完了後に接続を閉じる
  mongoose.connection.close();
  logger.info('Database connection closed');
};

// スクリプトを実行
runSeeder();