----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: database-schema.md
ファイルパス: Document/jp/database-schema.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19
最終更新: 2025-04-21

# 更新履歴
- 2025-04-19 Koki Riho 初版作成
- 2025-04-21 Koki Riho セキュリティ考慮事項セクションを拡充

# 説明
PintHopアプリケーションで使用するMongoDBデータベースのスキーマを定義するドキュメント。各コレクションの構造、リレーション、インデックス、およびクエリ最適化戦略を詳細に説明します。
----

# PintHop データベーススキーマ定義書

## 1. 概要

本文書は、PintHopアプリケーションで使用するデータベースのスキーマを定義するものです。PintHopは「次の一杯を見つける」個人体験と「自然に友達とつながる」社会体験を同等に重視した、クラフトビール体験向上プラットフォームです。

## 2. データベース選定

- **データベース**: MongoDB 7.0
- **ホスティング**: MongoDB Atlas
- **接続方法**: Node.js MongoDB Driver

MongoDB を選択した理由：
- 柔軟なスキーマ設計（新機能追加に対応しやすい）
- 地理空間データのネイティブサポート（ブルワリーや友達の位置情報に最適）
- JSONデータとの親和性が高い（ブルワリーデータの管理に最適）
- 水平スケーリングのしやすさ

## 3. コレクション構造

### 3.1 ユーザーコレクション (users)

ユーザー情報を管理します。

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    displayName: String,
    bio: {
      type: String,
      maxlength: 500
    },
    avatar: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending'
    },
    since: {
      type: Date,
      default: Date.now
    }
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  badges: [{
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  privacySettings: {
    locationSharing: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'friends'
    },
    activitySharing: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'friends'
    },
    profileVisibility: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'everyone'
    }
  },
  preferences: {
    favoriteStyles: [String],
    favoriteBreweries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery'
    }],
    notifications: {
      friendNearby: {
        type: Boolean,
        default: true
      },
      newTaplist: {
        type: Boolean,
        default: true
      },
      friendCheckin: {
        type: Boolean,
        default: true
      },
      events: {
        type: Boolean,
        default: true
      }
    }
  },
  refreshToken: String,
  lastActivity: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'friends.user': 1 });
```

### 3.2 ブルワリーコレクション (breweries)

ブルワリー情報を管理します。基本的にJSONデータと同期されます。

```javascript
const brewerySchema = new mongoose.Schema({
  breweryId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    },
    formattedAddress: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  region: {
    type: String,
    required: true,
    index: true
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  ratings: {
    // 更新：単純な数値型からスコアとURLを含むオブジェクト型へ変更
    untappd: {
      score: Number,
      url: String
    },
    rateBeer: {
      score: Number,
      url: String
    },
    beerAdvocate: {
      score: Number,
      url: String
    },
    aggregateScore: Number
  },
  specialtyStyles: [{
    style: String,
    rating: Number,
    confidence: Number
  }],
  awards: [{
    name: String,
    year: Number,
    category: String,
    beerName: String,
    medal: {
      type: String,
      enum: ['Gold', 'Silver', 'Bronze', 'Honorable Mention', 'Other']
    }
  }],
  description: String,
  photos: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
brewerySchema.index({ location: '2dsphere' });
brewerySchema.index({ region: 1, name: 1 });
brewerySchema.index({ 'ratings.aggregateScore': -1 });
brewerySchema.index({ 'specialtyStyles.style': 1 });
```

### 3.3 ビールコレクション (beers)

ビール情報を管理します。

```javascript
const beerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery',
    required: true
  },
  style: {
    type: String,
    required: true,
    index: true
  },
  abv: Number,
  ibu: Number,
  description: String,
  ratings: {
    untappd: Number,
    rateBeer: Number,
    beerAdvocate: Number
  },
  awards: [{
    name: String,
    year: Number,
    category: String,
    medal: String
  }],
  seasonal: {
    type: Boolean,
    default: false
  },
  seasonalPeriod: {
    start: Date,
    end: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
beerSchema.index({ name: 1, brewery: 1 }, { unique: true });
beerSchema.index({ style: 1 });
beerSchema.index({ 'ratings.untappd': -1 });
```

### 3.4 タップリストコレクション (taplists)

ブルワリーの現在のタップリスト情報を管理します。

```javascript
const taplistSchema = new mongoose.Schema({
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery',
    required: true
  },
  beers: [{
    name: String,
    style: String,
    description: String,
    abv: Number,
    ibu: Number,
    price: String,
    servingSize: String
  }],
  photo: {
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processedText: String,
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  verifiedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
taplistSchema.index({ brewery: 1, createdAt: -1 });
taplistSchema.index({ 'photo.uploadedBy': 1 });
```

### 3.5 チェックインコレクション (checkins)

ユーザーのブルワリーへのチェックインを管理します。

```javascript
const checkinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery',
    required: true
  },
  checkinTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  checkoutTime: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'friends'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  beers: [{
    beer: {
      name: String,
      style: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    photo: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  companions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// インデックス
checkinSchema.index({ user: 1, checkinTime: -1 });
checkinSchema.index({ brewery: 1, checkinTime: -1 });
checkinSchema.index({ location: '2dsphere' });
checkinSchema.index({ status: 1 });
```

### 3.6 プレゼンスコレクション (presences)

リアルタイムのユーザー位置情報を管理します。

```javascript
const presenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['online', 'away', 'offline'],
    default: 'online'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number], // [longitude, latitude]
    accuracy: Number
  },
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  deviceInfo: {
    platform: String,
    browser: String,
    version: String
  },
  visibility: {
    type: String,
    enum: ['everyone', 'friends', 'none'],
    default: 'friends'
  },
  expiresAt: {
    type: Date,
    expires: 3600 // 1時間後に自動削除
  }
});

// インデックス
presenceSchema.index({ user: 1 }, { unique: true });
presenceSchema.index({ location: '2dsphere' });
presenceSchema.index({ brewery: 1 });
presenceSchema.index({ lastUpdated: 1 });
presenceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### 3.7 バッジコレクション (badges)

ユーザーが獲得可能なバッジを管理します。

```javascript
const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['brewery', 'beer', 'style', 'region', 'event', 'achievement'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['count', 'percentage', 'specific', 'duration', 'combination'],
      required: true
    },
    threshold: Number,
    targetId: String,
    region: String,
    style: String
  },
  icon: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
```

### 3.8 イベントコレクション (events)

ビール関連イベント情報を管理します。

```javascript
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brewery'
  },
  location: {
    address: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventType: {
    type: String,
    enum: ['tasting', 'release', 'festival', 'class', 'meetup', 'other'],
    default: 'other'
  },
  image: String,
  website: String,
  price: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['going', 'interested', 'not_going'],
      default: 'interested'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  region: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// インデックス
eventSchema.index({ startTime: 1 });
eventSchema.index({ brewery: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ region: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ tags: 1 });
```

### 3.9 ビール体験コレクション (beerexperiences)

ユーザーのビール体験を記録します。

```javascript
const beerExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  beer: {
    name: {
      type: String,
      required: true
    },
    style: String,
    brewery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery'
    }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String,
  photos: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  breweryVisit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkin'
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'friends'
  },
  tags: [String]
}, {
  timestamps: true
});

// インデックス
beerExperienceSchema.index({ user: 1, createdAt: -1 });
beerExperienceSchema.index({ 'beer.brewery': 1 });
beerExperienceSchema.index({ 'beer.style': 1 });
```

### 3.10 通知コレクション (notifications)

ユーザーへの通知を管理します。

```javascript
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['friend_request', 'friend_accepted', 'checkin', 'nearby', 'taplist', 'badge', 'event', 'mention', 'system'],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    brewery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brewery'
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    message: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30日後
  }
}, {
  timestamps: true
});

// インデックス
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
```

## 4. リレーション図

以下は、主要なコレクション間のリレーションを示しています。

```
User ────┬─── Friendship ───── User
         │
         ├─── Checkin ───┬─── Brewery
         │               │
         │               └─── BeerExperience
         │
         ├─── Presence ────── Brewery
         │
         ├─── Badge
         │
         ├─── Event
         │
         └─── Notification

Brewery ─┬─── Beer
         │
         ├─── Taplist
         │
         └─── Event
```

## 5. インデックス戦略

### 5.1 位置情報クエリの最適化

地理空間インデックスを活用して位置情報クエリを最適化します。

```javascript
// 近くのブルワリーを検索
db.breweries.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [userLongitude, userLatitude]
      },
      $maxDistance: 5000 // 5km以内
    }
  }
})

// 近くの友達を検索
db.presences.find({
  user: { $in: userFriendIds },
  visibility: { $in: ["everyone", "friends"] },
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [userLongitude, userLatitude]
      },
      $maxDistance: 1000 // 1km以内
    }
  }
})
```

### 5.2 タイムライン/フィードクエリの最適化

タイムラインのクエリは頻繁に実行されるため、適切なインデックスが重要です。

```javascript
// ユーザーの友達のチェックインを時系列順に取得
db.checkins.find({
  user: { $in: userFriendIds },
  visibility: { $in: ["public", "friends"] }
}).sort({ checkinTime: -1 }).limit(20)
```

### 5.3 複合インデックス

特定の検索パターンに合わせた複合インデックスを設定します。

```javascript
// ブルワリー + 評価スコアの複合インデックス
brewerySchema.index({ region: 1, 'ratings.aggregateScore': -1 });

// ユーザー + タイムスタンプの複合インデックス
checkinSchema.index({ user: 1, checkinTime: -1 });
```

## 6. データ移行と初期化

### 6.1 シードデータの構造

初期データ投入用のシードファイルは以下の構造で用意します。

- `backend/src/data/seeds/breweries.seed.js` - ブルワリー初期データ
- `backend/src/data/seeds/beers.seed.js` - ビール初期データ
- `backend/src/data/seeds/badges.seed.js` - バッジ初期データ
- `backend/src/data/seeds/users.seed.js` - テストユーザーデータ（開発環境のみ）

### 6.2 シード実行スクリプト

```javascript
// backend/src/data/seeds/index.js
const mongoose = require('mongoose');
const config = require('../../config/db');
const breweriesSeed = require('./breweries.seed');
const beersSeed = require('./beers.seed');
const badgesSeed = require('./badges.seed');
const usersSeed = require('./users.seed');

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected');

    // シードデータの実行
    await breweriesSeed();
    await beersSeed();
    await badgesSeed();
    
    if (process.env.NODE_ENV === 'development') {
      await usersSeed();
    }
    
    console.log('Seed data imported successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
```

## 7. データバックアップ戦略

### 7.1 MongoDB Atlasの自動バックアップ

MongoDB Atlasの自動バックアップ機能を利用してデータの定期バックアップを実施します。

- 日次バックアップ: 毎日午前2時に実行
- 保存期間: 7日間
- ポイントインタイムリカバリ: 有効

### 7.2 手動バックアップスクリプト

重要なデータに対しては、追加で手動バックアップスクリプトを用意します。

```bash
#!/bin/bash
# backend/scripts/backup.sh

# バックアップ日時
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/var/backups/pinthop

# バックアップディレクトリの作成
mkdir -p $BACKUP_DIR

# MongoDBバックアップの実行
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/db_$TIMESTAMP

# JSONデータのバックアップ
cp -r /var/www/pinthop/backend/src/data /var/backups/pinthop/data_$TIMESTAMP

# バックアップの圧縮
tar -czf $BACKUP_DIR/pinthop_backup_$TIMESTAMP.tar.gz $BACKUP_DIR/db_$TIMESTAMP $BACKUP_DIR/data_$TIMESTAMP

# 30日以上前のバックアップを削除
find $BACKUP_DIR -type f -name "pinthop_backup_*" -mtime +30 -delete
find $BACKUP_DIR -type d -name "db_*" -mtime +2 -exec rm -rf {} \;
find $BACKUP_DIR -type d -name "data_*" -mtime +2 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR/pinthop_backup_$TIMESTAMP.tar.gz"
```

## 8. パフォーマンスと最適化

### 8.1 クエリ最適化のガイドライン

- インデックスを適切に設定する
- 必要なフィールドのみ取得する（プロジェクション）
- ページネーションを活用する（`limit`と`skip`）
- 大量のデータをメモリにロードしない

### 8.2 コネクションプーリング

Node.jsからMongoDBへの接続は、コネクションプーリングを利用して効率化します。

```javascript
// backend/src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  mongoURI: process.env.MONGODB_URI
};
```

### 8.3 キャッシュ戦略

頻繁に変更されないデータ（ブルワリー情報など）はキャッシュを検討します。

```javascript
// In-memory LRUキャッシュの実装例
const LRU = require('lru-cache');
const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60 // 1時間
});

// ブルワリー取得関数
const getBreweryById = async (breweryId) => {
  const cacheKey = `brewery:${breweryId}`;
  
  // キャッシュ確認
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  // データベースから取得
  const brewery = await Brewery.findOne({ breweryId });
  
  // キャッシュに格納
  if (brewery) {
    cache.set(cacheKey, brewery);
  }
  
  return brewery;
};
```

## 9. セキュリティ考慮事項

### 9.1 データ検証と衛生化
MongoDBのインジェクション対策として、すべてのクエリパラメータを検証します。

```javascript
// 安全なクエリ例
const username = req.body.username;
const user = await User.findOne({ username });

// 危険なクエリ例（避けるべき）
const query = { $where: `this.username === '${req.body.username}'` };
const user = await User.findOne(query);
```

### 9.2 センシティブデータの保護
- **パスワードハッシュ化**: bcryptを使用し、コスト係数14以上を設定
- **パスワード強度ポリシー**: 最低8文字、英数字記号混在
- **位置情報の保護**: プライバシー設定に基づく厳格なアクセス制御
- **セッション情報**: MongoDBのTTLインデックスを使用した自動期限切れ

### 9.3 アクセス制御の詳細実装

```javascript
// ユーザーデータアクセス制御の例
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestingUser = req.user;
    
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // プライバシー設定に基づくアクセス制御
    const isFriend = requestingUser.friends.some(
      friend => friend.user.toString() === userId && friend.status === 'accepted'
    );
    
    let profileData;
    
    if (requestingUser._id.toString() === userId) {
      // 自分自身のプロフィール（すべての情報を表示）
      profileData = targetUser;
    } else if (isFriend && targetUser.privacySettings.profileVisibility === 'friends') {
      // 友達向けプロフィール
      profileData = {
        username: targetUser.username,
        profile: targetUser.profile,
        badges: targetUser.badges,
        // センシティブ情報は除外
      };
    } else if (targetUser.privacySettings.profileVisibility === 'everyone') {
      // 公開プロフィール
      profileData = {
        username: targetUser.username,
        profile: {
          displayName: targetUser.profile.displayName,
          avatar: targetUser.profile.avatar
        },
        // 最小限の情報のみ
      };
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(profileData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### 9.4 データベースレベルでの検証ルール
- Mongooseスキーマバリデーションの活用
- フィールド値の範囲と制約の明示的な設定
- MongoDB 4.0以降のトランザクション使用によるデータ整合性確保

### 9.5 データ暗号化戦略

- **転送中の暗号化**: HTTPS/TLSによる通信の暗号化
- **保存時の暗号化**: MongoDB Atlasの保存時暗号化機能の有効化
- **フィールドレベルの暗号化**:

```javascript
// フィールドレベル暗号化の実装例
const crypto = require('crypto');
const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY; // 環境変数から暗号化キーを取得

// 暗号化関数
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag
  };
};

// 復号化関数
const decrypt = (encryptedObj) => {
  const decipher = crypto.createDecipheriv(
    algorithm, 
    Buffer.from(secretKey, 'hex'), 
    Buffer.from(encryptedObj.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encryptedObj.authTag, 'hex'));
  let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// ユーザーモデルにセンシティブ情報を暗号化するミドルウェアを追加
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    // メールアドレスなどのセンシティブデータを暗号化
    const encryptedEmail = encrypt(this.email);
    this.encryptedEmail = encryptedEmail;
    // 検索用に通常のメールアドレスも保持
    this.email = this.email.toLowerCase();
  }
  next();
});
```

### 9.6 認証情報の安全な管理

- **JWTシークレット**: 十分な長さと複雑性を持つランダム生成キー
- **環境変数**: 本番環境の認証情報は環境変数として管理
- **アクセストークンの分離**: アクセストークンとリフレッシュトークンの分離保存

```javascript
// 認証ミドルウェアの実装例
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ユーザーID取得とトークン有効期限確認
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // トークンの発行時刻が最終パスワード変更時刻より前の場合は無効化
    // (パスワード変更後の古いトークン使用防止)
    if (decoded.iat < user.passwordChangedAt) {
      return res.status(401).json({ message: 'Token expired. Please login again' });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};
```

### 9.7 レートリミットとブルートフォース攻撃対策

```javascript
const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

// 認証エンドポイント用のレートリミッター
const authLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'rateLimits',
    expireTimeMs: 60 * 5 * 1000, // 5分
  }),
  windowMs: 5 * 60 * 1000, // 5分間
  max: 10, // IP毎に10リクエストまで
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again after 5 minutes.'
    }
  }
});

// ログイン試行失敗のカウントと一時的なアカウントロック機能
const loginFailureHandler = async (req, res, next) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return next(); // ユーザーが存在しない場合は次のミドルウェアへ
    
    // ロック状態の確認
    if (user.accountLocked && user.lockUntil > Date.now()) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account temporarily locked. Please try again later.',
          lockRemainingTime: Math.ceil((user.lockUntil - Date.now()) / 1000 / 60) // 残り分数
        }
      });
    }
    
    // ロック期限が切れていれば解除
    if (user.accountLocked && user.lockUntil <= Date.now()) {
      user.accountLocked = false;
      user.loginAttempts = 0;
      await user.save();
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

// ログイン失敗後の処理
const incrementLoginAttempts = async (user) => {
  // 最大試行回数
  const MAX_LOGIN_ATTEMPTS = 5;
  // ロック時間 (10分)
  const LOCK_TIME = 10 * 60 * 1000;
  
  // 試行回数を増加
  user.loginAttempts += 1;
  
  // 最大試行回数に達した場合、アカウントをロック
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.accountLocked = true;
    user.lockUntil = Date.now() + LOCK_TIME;
  }
  
  await user.save();
};
```

## 10. スケーリング考慮事項

### 10.1 シャーディング

将来的なデータ量増加に備えて、以下のコレクションはシャーディングの候補となります：

- `checkins` - ユーザーIDによるシャーディング
- `presences` - 地理的分散によるシャーディング
- `beerexperiences` - ユーザーIDによるシャーディング

### 10.2 インデックス管理

インデックスは定期的に評価し、使用頻度の低いインデックスは削除します。

```javascript
// インデックス使用状況の確認
db.breweries.aggregate([
  { $indexStats: {} }
]);
```

### 10.3 読み取り/書き込み分離

将来的にはリードレプリカを導入し、読み取りと書き込みの負荷を分散させます。

```javascript
// 読み取り専用操作のためのセカンダリ接続
const secondaryConnection = mongoose.createConnection(process.env.MONGODB_URI_SECONDARY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  readPreference: 'secondaryPreferred'
});

// 読み取り専用モデル
const ReadOnlyBrewery = secondaryConnection.model('Brewery', brewerySchema);
```

以上のデータベーススキーマ定義に基づいて、PintHopアプリケーションのデータ構造を実装していきます。
