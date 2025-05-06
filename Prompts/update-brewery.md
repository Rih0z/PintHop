# ブルワリー情報収集・更新プロンプト

## 概要
このプロンプトは、特定の州や地域のブルワリー情報を収集し、PintHopアプリケーションで使用するJSONファイルを作成または更新するためのものです。収集したデータは自動的にMongoDBにインポートできる形式で保存されます。

## JSONファイル構造

```json
{
  "_metadata": {
    "filePath": "backend/src/data/breweries/[州名]/[地域名].json",
    "author": "[作成者名]",
    "createdAt": "[作成日: YYYY-MM-DD]",
    "updatedAt": "[更新日: YYYY-MM-DD]",
    "description": "[地域名]地域のブルワリーデータ",
    "version": "1.0",
    "source": "AI収集 (Claude 3.7 Sonnet)"
  },
  "breweries": [
    {
      "breweryId": "一意のID (例: 'fremont-brewing-seattle')",
      "name": "ブルワリー名",
      "slug": "url-friendly-name",
      "address": {
        "street": "住所",
        "city": "市区町村",
        "state": "州",
        "zipCode": "郵便番号",
        "country": "国名",
        "formattedAddress": "整形済み住所"
      },
      "location": {
        "type": "Point",
        "coordinates": [経度, 緯度]
      },
      "region": "地域名 (例: 'Seattle')",
      "contact": {
        "phone": "電話番号",
        "email": "メールアドレス",
        "website": "Webサイト"
      },
      "businessHours": {
        "monday": { "open": "開店時間", "close": "閉店時間" },
        "tuesday": { "open": "開店時間", "close": "閉店時間" },
        "wednesday": { "open": "開店時間", "close": "閉店時間" },
        "thursday": { "open": "開店時間", "close": "閉店時間" },
        "friday": { "open": "開店時間", "close": "閉店時間" },
        "saturday": { "open": "開店時間", "close": "閉店時間" },
        "sunday": { "open": "開店時間", "close": "閉店時間" }
      },
      "description": "ブルワリーの説明",
      "ratings": {
        "untappd": {
          "score": 評価スコア,
          "url": "Untappdページ"
        },
        "rateBeer": {
          "score": 評価スコア,
          "url": "RateBeerページ"
        },
        "beerAdvocate": {
          "score": 評価スコア,
          "url": "BeerAdvocateページ"
        },
        "aggregateScore": 総合評価スコア
      },
      "specialtyStyles": [
        {
          "style": "ビアスタイル名",
          "rating": 評価スコア,
          "confidence": 信頼度
        },
        ...
      ],
      "signatureBeers": ["代表的なビール1", "代表的なビール2", ...],
      "awards": [
        {
          "name": "受賞名",
          "year": 受賞年,
          "category": "カテゴリー",
          "beerName": "ビール名",
          "medal": "Gold/Silver/Bronze/Honorable Mention/Other"
        },
        ...
      ],
      "photos": ["写真URL1", "写真URL2", ...],
      "lastUpdated": "最終更新日時 (ISO 8601形式, 例: '2025-05-05T12:00:00Z')",
      "isActive": true/false,
      "flags": {
        "isMicrobrewery": true/false,
        "isBrewpub": true/false,
        "hasFood": true/false,
        "familyFriendly": true/false,
        "dogFriendly": true/false
      }
    }
  ]
}
```

## 使用方法

### 新しい地域のブルワリー情報を収集する場合
以下の形式でリクエストしてください：

```
ユーザーへの質問
ユーザーに収集したい地域について聞いてください。
指定された地域のブルワリー情報を収集して、JSONファイルを作成してください。
ユーザーにデータは以下に保存するように指示してください。
"backend/src/data/breweries/州名/地域名.json"
```

例: 「ワシントン州のシアトル地域のブルワリー情報を収集して、JSONファイルを作成してください。」

### 既存のJSONファイルを更新する場合
既存のJSONファイルの内容を提供し、以下の形式でリクエストしてください：

```
以下のJSONファイルを更新してください。最新の情報を反映し、不足しているブルワリーがあれば追加してください。

[既存のJSONファイル内容]
```

## 情報収集ガイドライン

AIは以下の手順でブルワリー情報を収集します：

1. 指定された州と地域のブルワリーリストを検索
2. 各ブルワリーについて詳細情報を収集
3. 評価情報（Untappd、RateBeer、BeerAdvocateなど）を検索
4. 位置情報（緯度、経度）を特定
5. ビアスタイルや代表的なビールの情報を収集
6. 収集した情報を指定されたJSON形式に整形

## データ整合性確認事項

- すべての必須フィールドが入力されていること
  - `breweryId` (必須・一意): `[slug]-[city.toLowerCase()]`の形式で生成
  - `name` (必須)
  - `location.coordinates` (必須)
  - `region` (必須): 文字列形式（例: "Seattle"）
- `slug`はURL対応の小文字、ハイフン区切りで正しく生成されていること
- 緯度・経度は正確な値であること
- 電話番号、住所は正しいフォーマットであること
- 評価スコアは適切な範囲内であること（例: Untappdは0-5の範囲）
- すべてのURLが正しい形式であること
- `specialtyStyles`は必ずオブジェクト配列形式であること、各アイテムには`style`、`rating`、`confidence`を含めること
- `awards`の各アイテムには必要な構造を含めること
- `lastUpdated`はISO 8601形式の日時であること

## 既存データの変換ガイドライン

既存のデータを新しいスキーマに変換する場合は、以下の点に注意してください：

1. **breweryIdの生成**:
   ```javascript
   // 例: fremont-brewingのslugとseattleの都市名から生成
   breweryId = `${slug}-${address.city.toLowerCase()}`
   ```

2. **フィールド名の変換**:
   - `zip` → `zipCode`
   - `formatted` → `formattedAddress`

3. **specialtyStylesの変換**:
   文字列配列から適切なオブジェクト配列に変換
   ```javascript
   // 変換例
   specialtyStyles: existingStyles.map(style => ({
     style: style,
     rating: 4.0,  // デフォルト値または収集した評価
     confidence: 0.8  // デフォルト値または収集した信頼度
   }))
   ```

4. **region形式の変換**:
   オブジェクト形式から文字列形式に変換
   ```javascript
   // 変換例
   region: existingRegion.name || existingRegion
   ```

## 注意事項

- 情報が見つからない場合、該当フィールドはnullまたは空の配列に設定
- 評価情報は最新のものを反映
- 社会的に問題のある情報は含めない
- 著作権を侵害する可能性のある長文の説明文は避ける
- データ量が多い場合は、10-15件ごとにファイルを分割
- ファイル名は「地域名.json」の形式（例: seattle.json）

## 更新履歴管理

ファイルを更新する場合は、以下を行ってください：
- メタデータの `updatedAt` フィールドを現在の日付に更新
- 既存のブルワリー情報を確認し、変更があれば更新
- 新しいブルワリーを追加
- 閉店したブルワリーは `isActive` フィールドを `false` に設定

## サンプル出力

```json
{
  "_metadata": {
    "filePath": "backend/src/data/breweries/washington/seattle.json",
    "author": "Claude AI",
    "createdAt": "2025-05-05",
    "updatedAt": "2025-05-05",
    "description": "シアトル地域のブルワリーデータ",
    "version": "1.0",
    "source": "AI収集 (Claude 3.7 Sonnet)"
  },
  "breweries": [
    {
      "breweryId": "fremont-brewing-seattle",
      "name": "Fremont Brewing Company",
      "slug": "fremont-brewing",
      "address": {
        "street": "1050 N 34th St",
        "city": "Seattle",
        "state": "WA",
        "zipCode": "98103",
        "country": "USA",
        "formattedAddress": "1050 N 34th St, Seattle, WA 98103"
      },
      "location": {
        "type": "Point",
        "coordinates": [-122.3465, 47.6494]
      },
      "region": "Seattle",
      "contact": {
        "phone": "(206) 420-2407",
        "email": "info@fremontbrewing.com",
        "website": "https://www.fremontbrewing.com"
      },
      "businessHours": {
        "monday": { "open": "11:00", "close": "21:00" },
        "tuesday": { "open": "11:00", "close": "21:00" },
        "wednesday": { "open": "11:00", "close": "21:00" },
        "thursday": { "open": "11:00", "close": "21:00" },
        "friday": { "open": "11:00", "close": "22:00" },
        "saturday": { "open": "11:00", "close": "22:00" },
        "sunday": { "open": "11:00", "close": "21:00" }
      },
      "description": "Fremont Brewing is a family-owned craft brewery founded in 2009. They're known for their sustainable practices and high-quality beers.",
      "ratings": {
        "untappd": {
          "score": 4.1,
          "url": "https://untappd.com/FreemontBrewingCompany"
        },
        "rateBeer": {
          "score": 4.2,
          "url": "https://www.ratebeer.com/brewers/fremont-brewing-company/10615/"
        },
        "beerAdvocate": {
          "score": 4.3,
          "url": "https://www.beeradvocate.com/beer/profile/20680/"
        },
        "aggregateScore": 4.2
      },
      "specialtyStyles": [
        {
          "style": "IPA",
          "rating": 4.3,
          "confidence": 0.9
        },
        {
          "style": "Bourbon Barrel-Aged Stouts",
          "rating": 4.5,
          "confidence": 0.95
        },
        {
          "style": "Hazy IPA",
          "rating": 4.2,
          "confidence": 0.85
        }
      ],
      "signatureBeers": [
        "Interurban IPA",
        "Sky Kraken Hazy Pale Ale",
        "Lush IPA",
        "B-Bomb (Bourbon Barrel Aged Winter Ale)"
      ],
      "awards": [
        {
          "name": "Great American Beer Festival",
          "year": 2023,
          "category": "American-Style India Pale Ale",
          "beerName": "Interurban IPA",
          "medal": "Gold"
        },
        {
          "name": "Washington Beer Awards",
          "year": 2024,
          "category": "Imperial Stout",
          "beerName": "B-Bomb",
          "medal": "Gold"
        }
      ],
      "photos": [
        "https://example.com/photos/fremont-brewing-1.jpg",
        "https://example.com/photos/fremont-brewing-2.jpg"
      ],
      "lastUpdated": "2025-05-05T12:00:00Z",
      "isActive": true,
      "flags": {
        "isMicrobrewery": true,
        "isBrewpub": true,
        "hasFood": false,
        "familyFriendly": true,
        "dogFriendly": true
      }
    }
  ]
}
```

## brewerySeeder.tsの対応

このJSONファイルをデータベースにインポートするためには、brewerySeeder.tsを以下のように修正して、メタデータオブジェクトに対応させる必要があります：

```typescript
// JSONファイルを処理
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Brewery } from '../models/Brewery';
import config from '../config/db';

const seedBreweries = async () => {
  try {
    // MongoDBに接続
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected');
    
    // breweriesディレクトリのパス
    const breweriesDir = path.join(__dirname, '../data/breweries');
    
    // 各州ディレクトリをループ
    const stateDirs = fs.readdirSync(breweriesDir);
    for (const stateDir of stateDirs) {
      const statePath = path.join(breweriesDir, stateDir);
      
      // ディレクトリのみを処理
      if (!fs.statSync(statePath).isDirectory()) continue;
      
      // 各地域ファイルをループ
      const regionFiles = fs.readdirSync(statePath);
      for (const regionFile of regionFiles) {
        if (!regionFile.endsWith('.json')) continue;
        
        // JSONファイルを読み込み
        const filePath = path.join(statePath, regionFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        
        // メタデータとブルワリー配列の分離
        const breweries = jsonData.breweries || jsonData;
        
        // breweries が配列かどうか確認
        if (!Array.isArray(breweries)) {
          console.warn(`Warning: ${stateDir}/${regionFile} does not contain a valid breweries array`);
          continue;
        }
        
        console.log(`Processing ${stateDir}/${regionFile}: ${breweries.length} breweries`);
        
        // 各ブルワリーを処理
        for (const brewery of breweries) {
          // 既存のブルワリーを確認
          const existingBrewery = await Brewery.findOne({ breweryId: brewery.breweryId });
          
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
      }
    }
    
    console.log('Brewery seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding breweries:', err);
    process.exit(1);
  }
};

seedBreweries();
```

## 自動化戦略

### 定期的なデータ更新
1. **月次更新**: 毎月1回、評価スコア、営業時間、写真などの情報を更新
2. **四半期更新**: 3ヶ月ごとに新規ブルワリーの追加と閉店ブルワリーのステータス更新

### 自動化フロー
1. **データ収集ステップ**:
   - Web検索によるブルワリーリスト収集
   - 各ブルワリーのWebサイトとSNSからの情報抽出
   - レビューサイト（Untappdなど）からの評価収集
   - 前回のデータとの比較

2. **データ検証ステップ**:
   - 必須フィールドの確認
   - 位置情報の正確性検証
   - 評価スコアの範囲検証
   - データベーススキーマとの互換性確認

3. **データベース更新ステップ**:
   - 既存ブルワリーの情報更新
   - 新規ブルワリーの追加
   - 閉店ブルワリーの非アクティブ化

### CI/CDパイプライン統合
```yaml
# .github/workflows/brewery-update.yml
name: Update Brewery Data

on:
  schedule:
    - cron: '0 0 1 * *'  # 毎月1日の午前0時に実行
  workflow_dispatch:     # 手動実行も可能

jobs:
  update-breweries:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run brewery data update
        run: node scripts/updateBreweries.js
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          
      - name: Commit and push changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "Auto-update brewery data"
          file_pattern: backend/src/data/breweries/**/*.json
```

## トラブルシューティング

- 位置情報が取得できない場合: Google Maps APIなどの別のサービスを利用
- 評価情報が見つからない場合: nullに設定して後で手動で追加
- JSONファイルが大きすぎる場合: 地域を細分化してファイルを分割
- データの重複がある場合: `breweryId`をキーにして重複チェックを実施
- APIレート制限に達した場合: 適切な待機時間を設定し再試行

## breweryIdの生成アルゴリズム

`breweryId`を既存のデータから生成する場合、以下のアルゴリズムを使用します：

```javascript
function generateBreweryId(brewery) {
  // slugがない場合は名前から生成
  const slug = brewery.slug || brewery.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // 英数字、スペース、ハイフン以外を削除
    .replace(/\s+/g, '-')          // スペースをハイフンに変換
    .replace(/-+/g, '-')           // 連続するハイフンを一つにまとめる
    .trim();
  
  // 都市名を小文字に変換
  const city = brewery.address.city.toLowerCase();
  
  // breweryIdを生成
  return `${slug}-${city}`;
}
```

このアルゴリズムを使用すると、一意のID `fremont-brewing-seattle` のような形式で生成されます。
