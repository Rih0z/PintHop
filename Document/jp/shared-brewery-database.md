---
# ドキュメント情報
プロジェクト: PintHop / NextPint 共有インフラ
ファイル名: shared-brewery-database.md
ファイルパス: Document/jp/shared-brewery-database.md
作成者: AI Assistant
作成日: 2025-05-30

# 更新履歴
- 2025-05-30 AI Assistant 初版作成

---

# 共有ブルワリーデータベース設計

## 概要

PintHop（コミュニティ・ビアホッピング）とNextPint（ビール発見・評価）の両アプリケーションから共通で利用できるブルワリーデータベースの設計案です。

## 共有データの範囲

### ブルワリー基本情報
- **識別情報**: ID、名前、別名
- **所在地**: 住所、座標（緯度・経度）、地域コード
- **営業情報**: 営業時間、定休日、連絡先
- **施設情報**: 座席数、駐車場、WiFi、ペット可否

### ブルワリー実績
- **受賞歴**: GABF、WBC、地域コンペティション等
- **得意スタイル**: 主力ビアスタイル、シグネチャービール
- **醸造規模**: 年間生産量、タップ数
- **歴史**: 創業年、重要な出来事

### 外部サービス連携
- **レビューサイト**: Yelp、Google Maps、Untappd等のID/URL
- **SNS**: Instagram、Facebook、Twitter等のハンドル
- **予約システム**: OpenTable等の連携情報

## アーキテクチャ案

### Option 1: マイクロサービスアプローチ
```
┌─────────────┐     ┌─────────────┐
│   PintHop   │     │  NextPint   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
         ┌───────▼────────┐
         │  Brewery API   │
         │  (独立サービス) │
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │    MongoDB     │
         └────────────────┘
```

**メリット**:
- 完全な独立性
- スケーラビリティ
- APIバージョニング管理が容易

**デメリット**:
- インフラコストが増加
- 運用複雑性

### Option 2: 共有データベースアプローチ
```
┌─────────────┐     ┌─────────────┐
│   PintHop   │     │  NextPint   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
         ┌───────▼────────┐
         │  共有MongoDB   │
         │ (breweries DB) │
         └────────────────┘
```

**メリット**:
- シンプルな構成
- 低コスト
- 高速アクセス

**デメリット**:
- 密結合のリスク
- スキーマ変更の影響が両アプリに及ぶ

### Option 3: GraphQL Federationアプローチ
```
┌─────────────┐     ┌─────────────┐
│   PintHop   │     │  NextPint   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
         ┌───────▼────────┐
         │ GraphQL Gateway│
         └───────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼─────┐           ┌───────▼──┐
│Brewery  │           │ Beer     │
│Service  │           │ Service  │
└─────────┘           └──────────┘
```

**メリット**:
- 柔軟なデータクエリ
- 段階的な移行が可能
- 各サービスの独立性維持

**デメリット**:
- 初期実装コスト
- 学習曲線

## データスキーマ設計

```typescript
interface SharedBrewery {
  // 基本情報
  _id: ObjectId;
  name: string;
  nameKana?: string;
  aliases?: string[];
  
  // 位置情報
  location: {
    address: string;
    city: string;
    prefecture: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // 営業情報
  businessHours: {
    [key: string]: { // 曜日
      open: string;
      close: string;
    };
  };
  closedDays?: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  
  // 施設情報
  facilities: {
    seatingCapacity?: number;
    parking?: boolean;
    wifi?: boolean;
    petFriendly?: boolean;
    foodService?: 'full' | 'limited' | 'none';
  };
  
  // 醸造情報
  brewingInfo: {
    established: number;
    annualProduction?: number;
    numberOfTaps?: number;
    specialtyStyles?: string[];
  };
  
  // 受賞歴
  awards?: Array<{
    competition: string;
    year: number;
    category: string;
    medal: 'gold' | 'silver' | 'bronze';
    beerName?: string;
  }>;
  
  // 外部サービス
  externalServices: {
    yelp?: { id: string; rating?: number; };
    google?: { placeId: string; rating?: number; };
    untappd?: { id: string; rating?: number; };
    tabelog?: { id: string; rating?: number; };
  };
  
  // メタデータ
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastVerified?: Date;
    dataSource?: string;
  };
}
```

## 実装優先度

### Phase 1: 基本実装（1-2週間）
- 共有MongoDBのセットアップ
- 基本的なCRUD API
- 両アプリからの接続確認

### Phase 2: データ移行（2-3週間）
- 既存データの統合・クレンジング
- 重複データの解決
- データ品質の向上

### Phase 3: 高度な機能（1ヶ月）
- キャッシュ層の実装
- GraphQL対応（オプション）
- 自動データ更新システム

## セキュリティ考慮事項

- **認証**: APIキーまたはJWT
- **権限管理**: 読み取り専用 vs 編集権限
- **レート制限**: APIアクセス制限
- **監査ログ**: データ変更の追跡

## 運用・保守

- **バックアップ**: 日次自動バックアップ
- **モニタリング**: アクセスログ、パフォーマンス監視
- **データ更新**: コミュニティからの貢献受付プロセス
- **バージョニング**: APIバージョン管理戦略