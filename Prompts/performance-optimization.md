----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: performance-optimization.md
ファイルパス: Prompts/performance-optimization.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成

# 説明
PintHopアプリケーションのパフォーマンス最適化を支援するためのプロンプトテンプレート。フロントエンド、バックエンド、データベース、ネットワーク通信などの各層におけるパフォーマンス問題の特定と最適化手法を提案します。
----

# PintHop パフォーマンス最適化プロンプト

あなたは経験豊富なパフォーマンスエンジニアです。私はPintHopプロジェクトのパフォーマンス最適化を行いたいと考えています。以下に提供する情報を基に、パフォーマンス問題の特定、分析、最適化についてのアドバイスとガイダンスを提供してください。

## パフォーマンス最適化リクエスト情報

以下のフォーマットでパフォーマンス最適化リクエスト情報を提供します：

```
### 対象領域
[フロントエンド/バックエンド/データベース/ネットワーク/アプリ全体]

### 観測されている問題
[パフォーマンス問題の説明（遅延、メモリ使用量、CPU使用率など）]

### 測定されたメトリクス
[具体的な測定値、ベンチマーク結果など]

### コードまたは設定情報
```コード
[最適化対象のコードや設定]
```

### 環境情報
[開発/テスト/本番環境の詳細]

### 目標
[達成したいパフォーマンス目標]
```

## あなたの支援内容

以上の情報を基に、以下のステップで支援をお願いします：

1. **パフォーマンス問題の分析**
   - 問題の正確な特定と根本原因の分析
   - パフォーマンスボトルネックの特定
   - 測定値の評価と解釈

2. **最適化提案**
   - 短期的な改善策（クイックウィン）
   - 長期的な最適化戦略
   - 優先順位付けとトレードオフの分析

3. **実装ガイダンス**
   - 最適化のための具体的なコード変更例
   - 設定の最適化例
   - ベストプラクティスに基づくアドバイス

4. **測定と検証**
   - パフォーマンス測定手法の提案
   - 最適化効果の検証方法
   - 継続的なパフォーマンスモニタリングの戦略

## PintHop固有の考慮事項

PintHopプロジェクトには以下の技術スタックと特性があります。これらを考慮した最適化提案を行ってください：

### 技術スタック

- **フロントエンド**: React 18 + TypeScript 5.0 + Tailwind CSS 3.0
- **バックエンド**: Node.js 18.x + Express 4.x
- **データベース**: MongoDB 7.0 (Atlas)
- **認証**: JWT（セキュアな実装）
- **地図**: Leaflet.js
- **ホスティング**: Netlify (フロントエンド) + rihobeer.com (バックエンド)
- **セキュリティツール**: Helmet.js, bcrypt, express-validator, DOMPurify

### アプリケーション特性

1. **位置情報の多用**
   - 地図表示と位置情報の更新
   - 近くのブルワリー検索
   - ユーザー位置の追跡

2. **リアルタイム通知**
   - 友達のチェックイン通知
   - プレゼンス情報の更新

3. **メディアコンテンツ**
   - ブルワリーの画像
   - タップリストの写真
   - ユーザープロフィール画像

4. **データ同期**
   - オフライン/オンライン切り替え時のデータ同期
   - バックグラウンドデータ更新

## 領域別のパフォーマンス最適化ガイド

### フロントエンドの最適化

#### Reactのパフォーマンス最適化

1. **不要な再レンダリングの削減**
   - メモ化（React.memo, useMemo, useCallback）
   - コンポーネント分割と最適化
   - 状態管理の最適化

```jsx
// 最適化前
const UserList = ({ users, onUserSelect }) => {
  return (
    <div>
      {users.map(user => (
        <UserItem 
          key={user.id} 
          user={user} 
          onSelect={() => onUserSelect(user.id)} 
        />
      ))}
    </div>
  );
};

// 最適化後
const UserList = ({ users, onUserSelect }) => {
  return (
    <div>
      {users.map(user => (
        <MemoizedUserItem 
          key={user.id} 
          user={user} 
          onSelect={onUserSelect} 
        />
      ))}
    </div>
  );
};

const UserItem = ({ user, onSelect }) => (
  <div onClick={() => onSelect(user.id)}>
    {user.name}
  </div>
);

const MemoizedUserItem = React.memo(UserItem);
```

2. **効率的な状態管理**
   - 状態の正規化
   - コンテキストの分割
   - 状態更新のバッチ処理

```jsx
// 最適化前
const [breweries, setBreweries] = useState([]);
const [selectedBrewery, setSelectedBrewery] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// 最適化後
const [state, setState] = useState({
  breweries: [],
  selectedBrewery: null,
  loading: false,
  error: null
});

// 更新時はバッチで
const updateState = (updates) => {
  setState(prev => ({ ...prev, ...updates }));
};
```

3. **仮想化による長いリストの最適化**
   - react-window や react-virtualized の使用
   - 無限スクロールの実装

```jsx
import { FixedSizeList as List } from 'react-window';

const BreweryList = ({ breweries }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <BreweryItem brewery={breweries[index]} />
    </div>
  );

  return (
    <List
      height={500}
      width="100%"
      itemCount={breweries.length}
      itemSize={80}
    >
      {Row}
    </List>
  );
};
```

#### コード分割とバンドル最適化

1. **動的インポートとコード分割**
   - React.lazy と Suspense の使用
   - ルートベースのコード分割

```jsx
import React, { Suspense, lazy } from 'react';

const BreweryDetail = lazy(() => import('./BreweryDetail'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/brewery/:id" element={<BreweryDetail />} />
      {/* その他のルート */}
    </Routes>
  </Suspense>
);
```

2. **バンドルサイズの削減**
   - 未使用コードの除去
   - ツリーシェイキングの活用
   - 大きな依存関係の最適化

```bash
# バンドル分析
npm run build -- --stats
npx webpack-bundle-analyzer ./build/bundle-stats.json
```

#### アセット最適化

1. **画像の最適化**
   - 適切なフォーマット (WebP, AVIF) の使用
   - 遅延読み込み
   - サイズに応じた画像提供

```jsx
const BreweryImage = ({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    loading="lazy" 
    width="300" 
    height="200"
    srcSet={`
      ${src}?w=300 300w,
      ${src}?w=600 600w,
      ${src}?w=900 900w
    `}
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);
```

2. **キャッシュ戦略**
   - 効果的なキャッシュヘッダー
   - サービスワーカーの活用
   - ローカルストレージの最適化

```javascript
// サービスワーカーの登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}
```

### Leaflet.jsの最適化

1. **マーカークラスタリング**
   - 多数のマーカーを効率的に表示
   - MarkerClusterGroup の活用

```javascript
import L from 'leaflet';
import 'leaflet.markercluster';

const map = L.map('map').setView([47.6062, -122.3321], 12);
const markers = L.markerClusterGroup();

// マーカーをクラスターに追加
breweries.forEach(brewery => {
  const marker = L.marker([brewery.lat, brewery.lng]);
  markers.addLayer(marker);
});

// クラスターをマップに追加
map.addLayer(markers);
```

2. **タイルの最適化**
   - 適切なズームレベルの設定
   - ビューポート外のタイル読み込み制限

```javascript
const map = L.map('map', {
  minZoom: 10,
  maxZoom: 18,
  maxBounds: [
    [47.5, -122.5], // 南西
    [47.7, -122.2]  // 北東
  ],
  maxBoundsViscosity: 1.0,
  preferCanvas: true
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  updateWhenIdle: true,
  updateWhenZooming: false
}).addTo(map);
```

### バックエンドの最適化

#### Express.jsの最適化

1. **ミドルウェアの最適化**
   - 適切な順序での配置
   - 不要なミドルウェアの除去

```javascript
// 最適化前: 全リクエストに認証チェック
app.use(authenticate);

// 最適化後: 必要なルートのみに認証チェック
app.use('/api/protected/*', authenticate);
```

2. **キャッシング戦略**
   - レスポンスキャッシング
   - 計算結果のキャッシング

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5分間キャッシュ

// キャッシュミドルウェア
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  
  if (cachedResponse) {
    return res.send(cachedResponse);
  }
  
  const originalSend = res.send;
  res.send = function(body) {
    cache.set(key, body);
    originalSend.call(this, body);
  };
  
  next();
};

// 読み取り専用エンドポイントにキャッシュを適用
app.get('/api/breweries', cacheMiddleware, breweryController.getAllBreweries);
```

3. **圧縮の最適化**
   - 適切な圧縮レベルの設定
   - 圧縮対象の選択

```javascript
const compression = require('compression');

// 圧縮ミドルウェア
app.use(compression({
  level: 6, // 圧縮レベル（1: 最速、9: 最高圧縮率）
  threshold: 1024, // 1KB以上のレスポンスのみ圧縮
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

#### 非同期処理の最適化

1. **Promise.all による並列処理**
   - 独立した非同期操作の並列実行

```javascript
// 最適化前: 順次処理
const getBreweryDetails = async (breweryId) => {
  const brewery = await Brewery.findById(breweryId);
  const tapList = await TapList.findOne({ brewery: breweryId });
  const checkins = await Presence.find({ 
    brewery: breweryId,
    checkoutTime: null
  });
  
  return { brewery, tapList, checkins };
};

// 最適化後: 並列処理
const getBreweryDetails = async (breweryId) => {
  const [brewery, tapList, checkins] = await Promise.all([
    Brewery.findById(breweryId),
    TapList.findOne({ brewery: breweryId }),
    Presence.find({ brewery: breweryId, checkoutTime: null })
  ]);
  
  return { brewery, tapList, checkins };
};
```

2. **ストリーミングレスポンス**
   - 大きなデータセットのストリーミング

```javascript
// 大きなデータセットのストリーミング
app.get('/api/breweries/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.write('{"breweries":[');
  
  let first = true;
  const cursor = Brewery.find().lean().cursor();
  
  cursor.on('data', (brewery) => {
    if (!first) {
      res.write(',');
    } else {
      first = false;
    }
    res.write(JSON.stringify(brewery));
  });
  
  cursor.on('end', () => {
    res.write(']}');
    res.end();
  });
});
```

### MongoDBの最適化

1. **インデックスの最適化**
   - 適切なインデックスの作成
   - 複合インデックスの利用
   - インデックスの効果分析

```javascript
// 頻繁に使用されるクエリのためのインデックス
brewerySchema.index({ name: 1 });
brewerySchema.index({ city: 1 });
brewerySchema.index({ tags: 1 });
brewerySchema.index({ location: '2dsphere' });

// 複合インデックス
brewerySchema.index({ city: 1, tags: 1 });

// テキスト検索のためのインデックス
brewerySchema.index({ name: 'text', description: 'text' });
```

2. **クエリの最適化**
   - プロジェクション（必要なフィールドのみ取得）
   - 効率的なフィルタリング
   - 適切なソート方法

```javascript
// 最適化前
const breweries = await Brewery.find({ city: 'Seattle' });

// 最適化後: 必要なフィールドのみ取得
const breweries = await Brewery.find(
  { city: 'Seattle' },
  { name: 1, address: 1, location: 1, rating: 1 }
);

// 高度なフィルタリングとソート
const breweries = await Brewery.find({
  city: 'Seattle',
  tags: { $in: ['IPA', 'Stout'] },
  rating: { $gte: 4 }
})
.sort({ rating: -1 })
.limit(10)
.lean(); // JSON変換を高速化
```

3. **アグリゲーションパイプラインの最適化**
   - 早期フィルタリング
   - 不要なステージの削減
   - インデックスの活用

```javascript
// 最適化前
const result = await Brewery.aggregate([
  { $match: { city: 'Seattle' } },
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// 最適化後: $matchを早期に配置
const result = await Brewery.aggregate([
  { $match: { city: 'Seattle' } }, // インデックスを活用
  { $project: { tags: 1 } }, // 必要なフィールドのみ
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

### ネットワーク通信の最適化

1. **APIレスポンスの最適化**
   - 不要なデータの削除
   - ページネーションの実装
   - 効率的なデータ形式

```javascript
// ページネーションの実装
const getBreweries = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const breweries = await Brewery.find()
    .skip(skip)
    .limit(limit)
    .select('name address location rating tags') // 必要なフィールドのみ
    .lean();
  
  const total = await Brewery.countDocuments();
  
  res.json({
    breweries,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
};
```

2. **バッチ処理とデータ圧縮**
   - 複数リクエストの一括処理
   - 効率的なデータ圧縮

```javascript
// 複数の操作を一括処理
app.post('/api/batch', async (req, res) => {
  const { operations } = req.body;
  const results = {};
  
  await Promise.all(operations.map(async op => {
    switch (op.type) {
      case 'getBrewery':
        results[op.id] = await Brewery.findById(op.breweryId)
          .select(op.fields || '');
        break;
      case 'getTapList':
        results[op.id] = await TapList.findOne({ brewery: op.breweryId });
        break;
      // その他の操作
    }
  }));
  
  res.json(results);
});
```

### メモリ管理の最適化

1. **メモリリークの防止**
   - イベントリスナーの適切な削除
   - 大きなオブジェクトの適切な処理

```javascript
// フロントエンド: コンポーネントのクリーンアップ
useEffect(() => {
  const handler = (event) => {
    // イベント処理
  };
  
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);

// バックエンド: ストリーム処理のメモリ管理
const processLargeFile = (filePath) => {
  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream(`${filePath}.processed`);
  
  readStream
    .pipe(someTransform)
    .pipe(writeStream)
    .on('finish', () => {
      console.log('Processing completed');
    });
};
```

2. **ガベージコレクションの最適化**
   - オブジェクトプールの使用
   - 一時オブジェクトの削減

```javascript
// オブジェクトプールの実装例
class Vector2Pool {
  constructor(initialSize = 100) {
    this.pool = Array(initialSize).fill().map(() => ({ x: 0, y: 0 }));
  }
  
  get() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return { x: 0, y: 0 };
  }
  
  release(vector) {
    vector.x = 0;
    vector.y = 0;
    this.pool.push(vector);
  }
}

// 使用例
const vectorPool = new Vector2Pool();

function calculateDistance(x1, y1, x2, y2) {
  const vec1 = vectorPool.get();
  const vec2 = vectorPool.get();
  
  vec1.x = x1;
  vec1.y = y1;
  vec2.x = x2;
  vec2.y = y2;
  
  const distance = Math.sqrt(
    Math.pow(vec2.x - vec1.x, 2) + 
    Math.pow(vec2.y - vec1.y, 2)
  );
  
  vectorPool.release(vec1);
  vectorPool.release(vec2);
  
  return distance;
}
```

## パフォーマンスモニタリングと測定

### フロントエンドパフォーマンスの測定

1. **Lighthouse と Web Vitals**
   - Core Web Vitals の測定と改善
   - パフォーマンススコアの向上

```javascript
// Web Vitalsの測定
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({ name: metric.name, value: metric.value });
  
  // 分析サーバーに送信
  navigator.sendBeacon('/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

2. **React Profiler の活用**
   - コンポーネントのレンダリング時間測定
   - 不要な再レンダリングの検出

```jsx
import { Profiler } from 'react';

const onRenderCallback = (
  id, // プロファイラーのID
  phase, // "mount"（最初のレンダー）か"update"（再レンダー）
  actualDuration, // レンダリングに費やした時間
  baseDuration, // メモ化なしの推定レンダリング時間
  startTime, // レンダリング開始時間
  commitTime // コミット完了時間
) => {
  console.log(`Component ${id} took ${actualDuration}ms to render`);
  // 分析サーバーに送信
};

const App = () => (
  <Profiler id="App" onRender={onRenderCallback}>
    <MainComponent />
  </Profiler>
);
```

### バックエンドパフォーマンスの測定

1. **リクエスト処理時間の測定**
   - ミドルウェアによる測定
   - パフォーマンスメトリクスの収集

```javascript
// リクエスト処理時間の測定ミドルウェア
const requestDuration = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    console.log(`${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    // メトリクスの記録（Prometheusなど）
  });
  
  next();
};

app.use(requestDuration);
```

2. **データベースクエリのプロファイリング**
   - クエリ実行時間の測定
   - 遅いクエリの特定

```javascript
// MongoDBクエリのプロファイリング
mongoose.set('debug', (collectionName, methodName, ...args) => {
  const start = process.hrtime();
  const query = args[0];
  
  const callback = args[args.length - 1];
  if (typeof callback === 'function') {
    args[args.length - 1] = function(err, result) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds * 1000 + nanoseconds / 1000000;
      
      console.log(`${collectionName}.${methodName} - ${duration.toFixed(2)}ms`);
      console.log('Query:', JSON.stringify(query));
      
      if (duration > 100) {
        // 遅いクエリのログ
        console.warn(`Slow query detected: ${collectionName}.${methodName}`);
      }
      
      callback(err, result);
    };
  }
});
```

## 一般的なパフォーマンス問題と解決策

### 1. ページ読み込み時間の長さ

**問題**: Webアプリケーションの初期読み込みに時間がかかる

**解決策**:
- コード分割と遅延ロード
- クリティカルパスの最適化
- アセット（画像、フォント、スタイルシート）の最適化
- キャッシング戦略の改善

### 2. APIレスポンス時間の遅さ

**問題**: APIリクエストの応答が遅い

**解決策**:
- データベースクエリの最適化
- インデックスの適切な設定
- キャッシングの導入
- 不要なデータの削除
- N+1クエリ問題の解決

### 3. 地図表示のパフォーマンス問題

**問題**: 多数のマーカーがある場合の地図表示が遅い

**解決策**:
- マーカークラスタリングの実装
- ビューポート内のマーカーのみ表示
- タイルの読み込み最適化
- ベクタータイルの使用検討

### 4. メモリ使用量の増加

**問題**: アプリケーションの長時間使用でメモリ使用量が増加

**解決策**:
- メモリリークの特定と修正
- 大きなオブジェクトの適切な破棄
- イベントリスナーの適切なクリーンアップ
- 不要なデータの保持を避ける

### 5. モバイルデバイスでのパフォーマンス低下

**問題**: モバイルデバイスでのパフォーマンスがデスクトップに比べて著しく低下

**解決策**:
- モバイル向けの最適化（画像サイズ、アニメーションの削減）
- ネットワーク帯域幅を考慮した設計
- バッテリー消費を最小限に抑える実装
- オフラインサポートの強化

## 回答テンプレート

以下のテンプレートを使用して、パフォーマンス最適化リクエストに対する回答を構成します：

```
# [対象領域] パフォーマンス最適化分析

## 1. 問題分析
[観測されている問題の分析と根本原因の特定]

## 2. パフォーマンスボトルネック
[特定されたボトルネックの詳細と影響]

## 3. 最適化提案
[短期的な改善策と長期的な最適化戦略]

## 4. 実装ガイダンス
[具体的なコード変更例や設定の最適化方法]

## 5. 測定と検証
[最適化効果の測定方法と期待される改善]

## 6. 追加の推奨事項
[予防的な対策やベストプラクティス]
```

## 質問と明確化

提供された情報が不十分な場合、以下のような質問を行い、問題の詳細を明確にします：

1. **問題の詳細**
   - パフォーマンス問題はどのような状況で発生しますか？
   - 問題は特定のユーザーやデバイスのみで発生しますか？
   - どのような方法で問題を測定しましたか？

2. **環境情報**
   - 開発環境と本番環境でパフォーマンスに違いはありますか？
   - サーバーやクライアントのスペックはどのようなものですか？
   - ネットワーク条件（帯域幅、レイテンシ）はどのようなものですか？

3. **使用パターン**
   - 問題が発生する際のユーザー行動は何ですか？
   - アプリケーションの典型的な使用パターンはどのようなものですか？
   - ピーク時の同時接続数やリクエスト数はどの程度ですか？

4. **既存の最適化**
   - これまでに試した最適化策はありますか？
   - 既存のキャッシュやCDNの利用状況はどうですか？
   - 現在の監視や測定の仕組みはどのようなものですか？
