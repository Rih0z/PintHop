# SOLID原則適用ガイドライン

## 1. Single Responsibility Principle (単一責任の原則)

### 適用例: BeerService

```typescript
// Before: Controller had too many responsibilities
export const getBeerController = async (req, res) => {
  // Database queries
  // Business logic  
  // Response formatting
  // Error handling
}

// After: Separated concerns
- BeerService: Business logic and data operations
- BeerController: HTTP request/response handling
- IBeerService: Contract definition
```

### ディレクトリ構造

```
backend/src/
├── api/
│   ├── controllers/    # HTTP層 (Request/Response)
│   ├── middlewares/    # 横断的関心事
│   └── routes/         # ルーティング定義
├── services/           # ビジネスロジック層
│   └── interfaces/     # サービスインターフェース
├── models/             # データモデル層
├── repositories/       # データアクセス層
└── utils/             # ユーティリティ関数
```

## 2. Open/Closed Principle (開放閉鎖の原則)

### 適用例: 新しいビール検索条件の追加

```typescript
// インターフェースで拡張可能な設計
interface BeerFilter {
  style?: string;
  minRating?: number;
  maxRating?: number;
  awardWinning?: boolean;
  search?: string;
  brewery?: string;
  // 新しいフィルタ条件を追加しても既存コードを変更不要
}
```

## 3. Liskov Substitution Principle (リスコフの置換原則)

### 適用例: サービスインターフェース

```typescript
interface IBeerService {
  findBeers(filter: BeerFilter, sort: BeerSort, pagination: PaginationOptions): Promise<PaginationResult<IBeer>>;
}

// 実装クラスは完全にインターフェースを満たす
class BeerService implements IBeerService {
  // 同じシグネチャで実装
}

class MockBeerService implements IBeerService {
  // テスト用の実装も同じ契約を守る
}
```

## 4. Interface Segregation Principle (インターフェース分離の原則)

### 適用例: 特化したインターフェース

```typescript
// 分離されたインターフェース
interface IBeerQueryService {
  findBeers(...): Promise<...>;
  findBeerById(...): Promise<...>;
}

interface IBeerExperienceService {
  createOrUpdateExperience(...): Promise<...>;
}

interface IBeerAnalyticsService {
  getRecommendations(...): Promise<...>;
  getTrendingBeers(...): Promise<...>;
}
```

## 5. Dependency Inversion Principle (依存性逆転の原則)

### 適用例: コントローラーの依存性注入

```typescript
// 抽象に依存
class BeerController {
  constructor(private beerService: IBeerService) {}
}

// テスト時にモックを注入可能
const mockService = new MockBeerService();
const controller = new BeerController(mockService);
```

## リファクタリング戦略

### 1. レイヤー分離
- **Presentation Layer**: Controllers, Routes
- **Business Layer**: Services, Business Logic
- **Data Layer**: Models, Repositories
- **Infrastructure Layer**: Database, External APIs

### 2. 責任の明確化
- Controllers: HTTPリクエスト/レスポンスの処理のみ
- Services: ビジネスロジックとオーケストレーション
- Repositories: データアクセスの抽象化
- Models: データ構造とバリデーション

### 3. テスタビリティの向上
- 依存性注入によるモックの容易化
- 単体テストの独立性確保
- インターフェースによる契約の明確化

## 実装済みサービス

### 1. BeerService (完了)
- **Interface**: `IBeerService`
- **Implementation**: `BeerService`
- **Repository**: `BeerRepository` + `IBeerRepository`
- **Controller**: `beerController.ts` (リファクタリング済み)

### 2. TaplistService (完了)
- **Interface**: `ITaplistService`
- **Implementation**: `TaplistService`
- **Features**: OCR処理、ビール紐付け、検証システム
- **Controller**: 未リファクタリング

### 3. CheckinService (完了)
- **Interface**: `ICheckinService`
- **Implementation**: `CheckinService`
- **Features**: チェックイン管理、統計、フレンドアクティビティ
- **Controller**: `checkinController.ts` (リファクタリング済み)

### 4. PresenceService (完了)
- **Interface**: `IPresenceService`
- **Implementation**: `PresenceService`
- **Features**: 位置情報ベース検索、リアルタイム通知、統計
- **Controller**: `presenceController.ts` (リファクタリング済み)

## 次のステップ

### 未リファクタリングのコントローラー
1. **AuthController**: 認証関連の処理をAuthServiceに分離
2. **BreweryController**: 既にBeerServiceを利用しているが、専用のBreweryServiceが必要

### リポジトリパターンの拡張
- CheckinRepository
- PresenceRepository
- TaplistRepository
- BreweryRepository

### 依存性注入の改善
現在はコントローラー内でサービスを直接インスタンス化しているが、DIコンテナの導入を検討:
```typescript
// 将来的な改善案
export class CheckinController {
  constructor(
    private checkinService: ICheckinService,
    private logger: ILogger
  ) {}
}
```