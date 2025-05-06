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
import dotenv from 'dotenv';
import Brewery from '../../models/Brewery';

// 環境変数の読み込み
dotenv.config();

// MongoDBに接続
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// シードデータの読み込みと保存
const seedBreweries = async () => {
  try {
    // ブルワリーコレクションをクリア
    await Brewery.deleteMany({});
    console.log('Existing brewery data cleared');

    // breweries ディレクトリのパス
    const breweriesBaseDir = path.join(__dirname, '../breweries');
    
    // breweries ディレクトリが存在するか確認
    if (!fs.existsSync(breweriesBaseDir)) {
      console.error(`Directory not found: ${breweriesBaseDir}`);
      return;
    }

    // 州ディレクトリの一覧を取得
    const stateDirs = fs.readdirSync(breweriesBaseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    if (stateDirs.length === 0) {
      console.log('No state directories found in the breweries directory');
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
        console.log(`No JSON files found in ${stateDir} directory`);
        continue;
      }

      console.log(`Processing ${stateDir} state with ${regionFiles.length} region files...`);
      
      // 各地域JSONファイルを処理
      for (const regionFile of regionFiles) {
        const filePath = path.join(statePath, regionFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const jsonData = JSON.parse(fileContent);
          
          // 新しいJSON形式に対応（メタデータとbreweries配列）
          const breweries = jsonData.breweries || jsonData;
          
          if (!Array.isArray(breweries)) {
            console.warn(`Warning: ${stateDir}/${regionFile} does not contain a valid breweries array`);
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
              console.log(`Updating brewery: ${brewery.name}`);
              await Brewery.updateOne({ breweryId: brewery.breweryId }, brewery);
            } else {
              // 新しいブルワリーを追加
              console.log(`Adding new brewery: ${brewery.name}`);
              await Brewery.create(brewery);
            }
          }
          
          console.log(`${breweries.length} breweries from ${stateDir}/${regionFile} processed successfully`);
          totalBreweries += breweries.length;
          totalFiles++;
        } catch (error) {
          console.error(`Error processing ${stateDir}/${regionFile}:`, error);
        }
      }
    }

    console.log(`Total: ${totalBreweries} breweries seeded from ${totalFiles} files across ${stateDirs.length} states`);
  } catch (err) {
    console.error('Error seeding brewery data:', err);
  }
};

// シード実行
const runSeeder = async () => {
  await connectDB();
  await seedBreweries();
  
  // 完了後に接続を閉じる
  mongoose.connection.close();
  console.log('Database connection closed');
};

// スクリプトを実行
runSeeder();