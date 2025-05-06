----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: feature-extension.md
ファイルパス: Prompts/feature-extension.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成

# 説明
PintHopアプリケーションの新機能開発や既存機能の拡張をサポートするためのプロンプトテンプレート。要件定義から実装計画、コード例までの一貫したガイダンスを提供します。
----

# PintHop 機能拡張プロンプト

あなたは経験豊富なソフトウェア開発者です。私はPintHopプロジェクトで新機能の追加や既存機能の拡張を行いたいと考えています。以下に提供する情報を基に、機能の設計、計画、実装についてのアドバイスとガイダンスを提供してください。

## 機能リクエスト情報

以下のフォーマットで機能リクエスト情報を提供します：

```
### 機能概要
[追加または拡張したい機能の簡潔な説明]

### 機能タイプ
[新機能/機能拡張/機能改善]

### 優先度
[高/中/低]

### ユースケース
[この機能がどのように使用されるかの説明]

### 期待される動作
[機能の詳細な動作仕様]

### 技術的な考慮事項
[実装に関連する技術的な詳細や制約]

### 関連する既存コンポーネント
[この機能に関連する既存のコンポーネントやモジュール]

### UI/UXの要件
[ユーザーインターフェースやユーザー体験に関する要件]
```

## あなたの支援内容

以上の情報を基に、以下のステップでの支援をお願いします：

1. **要件分析**
   - 機能要件の明確化と詳細化
   - 不明点や曖昧な部分の特定と質問
   - ユースケースの詳細化

2. **設計提案**
   - 推奨されるアーキテクチャまたは設計パターン
   - コンポーネント構造とデータフロー
   - データモデルの変更/追加案（必要な場合）
   - UI/UXデザインの提案（必要な場合）

3. **実装計画**
   - 実装ステップの詳細化
   - 必要なコンポーネントやモジュールのリスト
   - 既存コードへの変更点の特定
   - テスト戦略の提案

4. **実装ガイダンス**
   - 主要なコンポーネントのコード例
   - 既存コードの変更例
   - ベストプラクティスに基づくアドバイス
   - 潜在的な課題とその対策

5. **セキュリティと最適化**
   - セキュリティ上の考慮事項
   - パフォーマンス最適化の提案
   - スケーラビリティに関するアドバイス

## PintHop固有の考慮事項

PintHopプロジェクトには以下の技術スタックと設計原則があります。これらを考慮した提案を行ってください：

### 技術スタック

- **フロントエンド**: React 18 + TypeScript 5.0 + Tailwind CSS 3.0
- **バックエンド**: Node.js 18.x + Express 4.x
- **データベース**: MongoDB 7.0 (Atlas)
- **認証**: JWT（セキュアな実装）
- **地図**: Leaflet.js
- **ホスティング**: Netlify (フロントエンド) + rihobeer.com (バックエンド)
- **セキュリティツール**: Helmet.js, bcrypt, express-validator, DOMPurify

### アーキテクチャと設計原則

1. **コンポーネント設計**
   - 単一責任の原則に基づいたコンポーネント
   - プレゼンテーションコンポーネントとコンテナコンポーネントの分離
   - カスタムフックを用いたロジックの分離

2. **状態管理**
   - Context APIとReact Hooksを使用した状態管理
   - 状態の最小化と適切な粒度
   - サーバー状態とクライアント状態の明確な分離

3. **API設計**
   - RESTful原則に基づくAPIエンドポイント
   - 一貫したエラーハンドリングとレスポンスフォーマット
   - 適切な認証と認可チェック

4. **セキュリティ優先のアプローチ**
   - 「セキュリティファースト」の設計原則
   - 最小権限の原則
   - すべてのユーザー入力の検証
   - 機密データの適切な保護

5. **モバイルファーストの設計**
   - レスポンシブUIデザイン
   - タッチインターフェースの最適化
   - パフォーマンスと帯域幅の考慮

### プロジェクトのフェーズと優先事項

PintHopプロジェクトは以下のフェーズで実装されています。現在のフェーズと次のフェーズの優先事項を考慮した提案を行ってください：

1. **フェーズ0**: ドキュメント・プロンプト整備（現在の状態によって異なる）
2. **フェーズ1**: 基盤開発
   - ユーザーモデルとAPI
   - ブルワリーモデルとAPI
   - セキュアな認証システム
   - UI基本コンポーネント
3. **フェーズ2**: コア機能開発
   - ブルワリーデータベース構築
   - マップ機能実装
   - プレゼンス基本機能実装
4. **フェーズ3**: 機能拡張
   - タップリスト共有システム
   - イベント情報タブ
   - 拡張プレゼンス機能
5. **フェーズ4**: 体験拡張
   - バッジシステム
   - 地域達成率表示
   - モバイルアプリ基盤開発
6. **フェーズ5**: 地域拡大とAI導入
   - 地域拡大基盤
   - モバイルアプリ拡張
   - AI基盤構築
   - AI機能実装

## 機能拡張の例とテンプレート

### 機能タイプ別のアプローチ

#### 1. 新機能の追加

新機能の追加では、以下の点に注目して提案を行います：

- 既存のアーキテクチャとの整合性
- 他のコンポーネントとの干渉を最小限に
- 明確なインターフェースと責任範囲
- 適切なテスト戦略

#### 2. 既存機能の拡張

既存機能の拡張では、以下の点に注目して提案を行います：

- 既存コードへの変更の最小化
- 後方互換性の維持
- リファクタリングの機会の特定
- 段階的な実装アプローチ

#### 3. パフォーマンス最適化

パフォーマンス最適化では、以下の点に注目して提案を行います：

- ボトルネックの特定と分析
- 測定可能な改善目標
- ユーザー体験への影響
- トレードオフの明確化

### 例: 新機能実装計画の構造

```
# [機能名] 実装計画

## 1. 概要
[機能の簡潔な説明と目的]

## 2. 要件
[詳細な機能要件のリスト]

## 3. アーキテクチャ設計
[コンポーネント構造、データフロー、インターフェース設計]

## 4. データモデル
[新規または変更が必要なデータモデルの定義]

## 5. UI/UX設計
[ユーザーインターフェースとユーザー体験の詳細]

## 6. APIエンドポイント
[必要な新規または変更APIエンドポイントの定義]

## 7. 実装ステップ
[詳細な実装手順と優先順位]

## 8. テスト計画
[単体テスト、統合テスト、E2Eテストの戦略]

## 9. セキュリティ考慮事項
[セキュリティリスクとその対策]

## 10. パフォーマンス考慮事項
[パフォーマンスへの影響と最適化戦略]

## 11. コード例
[主要コンポーネントやAPIのコード例]
```

## フロントエンドコンポーネント構造の例

以下はPintHopプロジェクトのフロントエンドコンポーネント構造に準拠した実装例です：

### ページコンポーネント例（React + TypeScript）

```tsx
// src/pages/BreweryDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBreweryContext } from '../contexts/BreweryContext';
import { useAuthContext } from '../contexts/AuthContext';
import BreweryHeader from '../components/brewery/BreweryHeader';
import TapList from '../components/brewery/TapList';
import BreweryMap from '../components/map/BreweryMap';
import CheckInButton from '../components/presence/CheckInButton';
import FriendActivity from '../components/presence/FriendActivity';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

interface BreweryDetailParams {
  breweryId: string;
}

const BreweryDetailPage: React.FC = () => {
  const { breweryId } = useParams<BreweryDetailParams>();
  const { fetchBreweryById, currentBrewery, loading, error } = useBreweryContext();
  const { user } = useAuthContext();
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    if (breweryId) {
      fetchBreweryById(breweryId);
    }
  }, [breweryId, fetchBreweryById]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!currentBrewery) return <ErrorMessage message="Brewery not found" />;

  return (
    <div className="container mx-auto px-4 py-6">
      <BreweryHeader brewery={currentBrewery} />
      
      <div className="flex space-x-4 mt-6 border-b border-gray-200">
        <button
          className={`pb-2 ${tabIndex === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setTabIndex(0)}
        >
          Information
        </button>
        <button
          className={`pb-2 ${tabIndex === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setTabIndex(1)}
        >
          Tap List
        </button>
        <button
          className={`pb-2 ${tabIndex === 2 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setTabIndex(2)}
        >
          Map
        </button>
      </div>
      
      <div className="mt-6">
        {tabIndex === 0 && (
          <div className="space-y-4">
            <p className="text-gray-700">{currentBrewery.description}</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Details</h3>
              <p>Address: {currentBrewery.address}</p>
              <p>Hours: {currentBrewery.hours}</p>
              <p>Phone: {currentBrewery.phone}</p>
              <p>Website: <a href={currentBrewery.website} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{currentBrewery.website}</a></p>
            </div>
          </div>
        )}
        
        {tabIndex === 1 && (
          <TapList breweryId={breweryId} />
        )}
        
        {tabIndex === 2 && (
          <div className="h-80">
            <BreweryMap brewery={currentBrewery} />
          </div>
        )}
      </div>
      
      {user && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Activity</h3>
            <CheckInButton breweryId={breweryId} />
          </div>
          <FriendActivity breweryId={breweryId} />
        </div>
      )}
    </div>
  );
};

export default BreweryDetailPage;
```

### コンテキスト実装例

```tsx
// src/contexts/BreweryContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Brewery } from '../types/brewery';
import { apiClient } from '../utils/apiClient';

interface BreweryContextProps {
  breweries: Brewery[];
  currentBrewery: Brewery | null;
  loading: boolean;
  error: string | null;
  fetchBreweries: (filters?: Record<string, any>) => Promise<void>;
  fetchBreweryById: (id: string) => Promise<void>;
  clearCurrentBrewery: () => void;
}

const BreweryContext = createContext<BreweryContextProps | undefined>(undefined);

export const useBreweryContext = (): BreweryContextProps => {
  const context = useContext(BreweryContext);
  if (!context) {
    throw new Error('useBreweryContext must be used within a BreweryProvider');
  }
  return context;
};

interface BreweryProviderProps {
  children: ReactNode;
}

export const BreweryProvider: React.FC<BreweryProviderProps> = ({ children }) => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [currentBrewery, setCurrentBrewery] = useState<Brewery | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBreweries = useCallback(async (filters?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const response = await apiClient.get(`/breweries?${queryParams.toString()}`);
      setBreweries(response.data);
    } catch (err) {
      setError('Failed to fetch breweries. Please try again later.');
      console.error('Error fetching breweries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBreweryById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/breweries/${id}`);
      setCurrentBrewery(response.data);
    } catch (err) {
      setError('Failed to fetch brewery details. Please try again later.');
      console.error('Error fetching brewery details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentBrewery = useCallback(() => {
    setCurrentBrewery(null);
  }, []);

  const value = {
    breweries,
    currentBrewery,
    loading,
    error,
    fetchBreweries,
    fetchBreweryById,
    clearCurrentBrewery
  };

  return <BreweryContext.Provider value={value}>{children}</BreweryContext.Provider>;
};
```

## バックエンドAPI実装例

以下はPintHopプロジェクトのバックエンドAPI実装例です：

### ルートとコントローラーの実装例

```typescript
// src/routes/breweryRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { validateBreweryId, validateBreweryFilters } from '../middleware/validationMiddleware';
import * as breweryController from '../controllers/breweryController';

const router = express.Router();

// 公開エンドポイント
router.get('/', validateBreweryFilters, breweryController.getAllBreweries);
router.get('/:breweryId', validateBreweryId, breweryController.getBreweryById);

// 認証が必要なエンドポイント
router.post('/:breweryId/checkin', authenticate, validateBreweryId, breweryController.checkInToBrewery);
router.get('/:breweryId/taplist', validateBreweryId, breweryController.getBreweryTapList);
router.post('/:breweryId/taplist', authenticate, validateBreweryId, breweryController.updateTapList);

export default router;
```

```typescript
// src/controllers/breweryController.ts
import { Request, Response, NextFunction } from 'express';
import Brewery from '../models/Brewery';
import TapList from '../models/TapList';
import Presence from '../models/Presence';
import { AppError } from '../utils/errorHandler';

// すべてのブルワリーを取得
export const getAllBreweries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: Record<string, any> = {};
    
    // クエリパラメータからフィルターを構築
    if (req.query.name) {
      filters.name = { $regex: req.query.name as string, $options: 'i' };
    }
    
    if (req.query.city) {
      filters.city = { $regex: req.query.city as string, $options: 'i' };
    }
    
    if (req.query.tags) {
      filters.tags = { $in: (req.query.tags as string).split(',') };
    }
    
    // 位置情報に基づいた検索
    if (req.query.lat && req.query.lng && req.query.radius) {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string); // キロメートル単位
      
      filters.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // メートル単位に変換
        }
      };
    }
    
    // ページネーション
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const breweries = await Brewery.find(filters)
      .skip(skip)
      .limit(limit)
      .select('name city address location tags rating images openingHours')
      .sort(req.query.sort as string || 'name');
    
    const total = await Brewery.countDocuments(filters);
    
    res.status(200).json({
      status: 'success',
      results: breweries.length,
      total,
      page,
      limit,
      data: breweries
    });
  } catch (error) {
    next(new AppError('Error fetching breweries', 500));
  }
};

// ブルワリーの詳細を取得
export const getBreweryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brewery = await Brewery.findById(req.params.breweryId);
    
    if (!brewery) {
      return next(new AppError('Brewery not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: brewery
    });
  } catch (error) {
    next(new AppError('Error fetching brewery details', 500));
  }
};

// ブルワリーへのチェックイン
export const checkInToBrewery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    const userId = req.user.id;
    
    // ブルワリーの存在確認
    const brewery = await Brewery.findById(breweryId);
    if (!brewery) {
      return next(new AppError('Brewery not found', 404));
    }
    
    // 既存のチェックインを検索
    let presence = await Presence.findOne({ user: userId, brewery: breweryId, checkoutTime: null });
    
    if (presence) {
      // 既にチェックイン中の場合はエラー
      return next(new AppError('You are already checked in to this brewery', 400));
    }
    
    // 新しいチェックインを作成
    presence = await Presence.create({
      user: userId,
      brewery: breweryId,
      checkinTime: new Date(),
      visibility: req.body.visibility || 'friends', // デフォルト: 友達に公開
      note: req.body.note || ''
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        presence
      }
    });
  } catch (error) {
    next(new AppError('Error checking in to brewery', 500));
  }
};

// タップリストの取得
export const getBreweryTapList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    
    const tapList = await TapList.findOne({ brewery: breweryId })
      .populate('beers.beer')
      .sort('-updatedAt');
    
    if (!tapList) {
      return res.status(200).json({
        status: 'success',
        data: {
          beers: []
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: tapList
    });
  } catch (error) {
    next(new AppError('Error fetching tap list', 500));
  }
};

// タップリストの更新
export const updateTapList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { breweryId } = req.params;
    const userId = req.user.id;
    
    // ブルワリーの存在確認
    const brewery = await Brewery.findById(breweryId);
    if (!brewery) {
      return next(new AppError('Brewery not found', 404));
    }
    
    // ユーザーがこのブルワリーにチェックインしているか確認
    const presence = await Presence.findOne({ 
      user: userId, 
      brewery: breweryId, 
      checkoutTime: null 
    });
    
    if (!presence) {
      return next(new AppError('You must be checked in to update the tap list', 403));
    }
    
    // 新しいタップリストを作成または更新
    const tapList = await TapList.findOneAndUpdate(
      { brewery: breweryId },
      { 
        brewery: breweryId,
        beers: req.body.beers,
        updatedBy: userId,
        lastUpdateTime: new Date()
      },
      { 
        new: true, 
        upsert: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        tapList
      }
    });
  } catch (error) {
    next(new AppError('Error updating tap list', 500));
  }
};
```

## データモデル例

以下はPintHopプロジェクトのMongoDBデータモデル例です：

```typescript
// src/models/Brewery.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBrewery extends Document {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  location: {
    type: string;
    coordinates: number[];
  };
  website: string;
  phone: string;
  tags: string[];
  openingHours: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }[];
  images: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const brewerySchema = new Schema<IBrewery>(
  {
    name: {
      type: String,
      required: [true, 'A brewery must have a name'],
      trim: true,
      maxlength: [100, 'A brewery name must have less than 100 characters']
    },
    description: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'A brewery must have an address']
    },
    city: {
      type: String,
      required: [true, 'A brewery must have a city']
    },
    state: {
      type: String,
      required: [true, 'A brewery must have a state']
    },
    zipCode: {
      type: String
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        index: '2dsphere'
      }
    },
    website: {
      type: String,
      validate: {
        validator: function(v: string) {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    phone: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    openingHours: {
      type: [
        {
          day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          open: {
            type: String,
            validate: {
              validator: function(v: string) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
              },
              message: 'Please provide a valid time format (HH:MM)'
            }
          },
          close: {
            type: String,
            validate: {
              validator: function(v: string) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
              },
              message: 'Please provide a valid time format (HH:MM)'
            }
          },
          closed: {
            type: Boolean,
            default: false
          }
        }
      ],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// インデックスの作成
brewerySchema.index({ name: 1 });
brewerySchema.index({ city: 1 });
brewerySchema.index({ tags: 1 });
brewerySchema.index({ location: '2dsphere' });

// 仮想フィールド: タップリストへの参照
brewerySchema.virtual('tapList', {
  ref: 'TapList',
  foreignField: 'brewery',
  localField: '_id',
  justOne: true
});

// 仮想フィールド: 現在チェックインしているユーザー数
brewerySchema.virtual('currentCheckins', {
  ref: 'Presence',
  foreignField: 'brewery',
  localField: '_id',
  count: true,
  match: { checkoutTime: null }
});

const Brewery = mongoose.model<IBrewery>('Brewery', brewerySchema);

export default Brewery;
```

## 回答テンプレート

以下のテンプレートを使用して、機能拡張リクエストに対する回答を構成します：

```
# [機能名] 実装計画

## 1. 要件分析
[提供された機能リクエスト情報に基づいた詳細な要件分析]

## 2. 設計提案
[アーキテクチャ、データフロー、コンポーネント構造などの設計提案]

## 3. データモデル
[必要なデータモデルの変更または追加]

## 4. UI/UX設計
[ユーザーインターフェースとユーザー体験の提案]

## 5. APIエンドポイント
[新規または変更が必要なAPIエンドポイントの定義]

## 6. 実装ステップ
[具体的な実装手順とタイムライン]

## 7. セキュリティとパフォーマンス
[セキュリティ上の考慮事項とパフォーマンス最適化の提案]

## 8. コード例
[主要コンポーネントまたはエンドポイントのコード例]

## 9. テスト計画
[ユニットテスト、統合テスト、E2Eテストのアプローチ]

## 10. 検討すべき課題と対策
[実装中に発生する可能性のある課題とその対策]
```

## 質問と明確化

提供された情報が不十分な場合、以下のような質問を行い、要件を明確にします：

1. **ユースケースの詳細**
   - どのようなユーザーがこの機能を使用しますか？
   - ユーザーはこの機能をどのような状況で使用しますか？
   - この機能によってユーザーがどのような問題を解決できますか？

2. **技術的な要件**
   - 既存のコンポーネントやAPIとどのように統合しますか？
   - この機能には特定のパフォーマンス要件がありますか？
   - 特別なセキュリティ考慮事項がありますか？

3. **UI/UX要件**
   - この機能はどのように表示されるべきですか？
   - モバイルとデスクトップでの表示に違いはありますか？
   - ユーザーフィードバックをどのように提供しますか？

4. **実装の優先順位**
   - この機能のどの部分が最も重要ですか？
   - 段階的な実装アプローチは可能ですか？

5. **テストと評価**
   - この機能の成功をどのように測定しますか？
   - どのようなテストシナリオを考慮すべきですか？
