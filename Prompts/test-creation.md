----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: test-creation.md
ファイルパス: Prompts/test-creation.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成

# 説明
PintHopアプリケーションの各コンポーネントに対する効果的なテストの作成を支援するためのプロンプトテンプレート。ユニットテスト、統合テスト、E2Eテストなど様々なテストタイプの設計と実装をガイドします。
----

# PintHop テスト作成支援プロンプト

あなたは経験豊富なテストエンジニアです。私はPintHopプロジェクトの様々なコンポーネントに対するテストを作成する必要があります。以下に提供する情報を基に、適切なテスト戦略、テストケース、テストコードの実装を提案してください。

## テスト作成リクエスト情報

以下のフォーマットでテスト作成リクエスト情報を提供します：

```
### テスト対象
[コンポーネント名/関数名/機能名]

### テスト対象コード
```コード
[テスト対象のコードまたは仕様]
```

### テストタイプ
[ユニットテスト/統合テスト/E2Eテスト/その他]

### 優先テスト項目
[特に重視すべきテスト項目やシナリオ]

### 既存のテスト
[既存のテストがある場合はその概要]

### 環境情報
[テスト環境に関する情報]
```

## あなたの支援内容

以上の情報を基に、以下のステップで支援をお願いします：

1. **テスト戦略の提案**
   - 最適なテストアプローチの特定
   - テストの範囲と優先順位の設定
   - 必要なテストタイプ（ユニット/統合/E2E）の決定

2. **テストケースの設計**
   - 主要なテストケースのリスト作成
   - エッジケースと例外ケースの特定
   - テストデータの提案

3. **テストコードの実装**
   - テストフレームワークを活用したテストコードの提供
   - テストのセットアップと実行方法の説明
   - モックとスタブの実装例

4. **テストの品質向上**
   - テストカバレッジの最適化
   - テストのメンテナンス性向上のためのベストプラクティス
   - テスト自動化の提案

## PintHop固有の考慮事項

PintHopプロジェクトには以下の技術スタックと特性があります。これらを考慮したテスト提案を行ってください：

### 技術スタック

- **フロントエンド**: React 18 + TypeScript 5.0 + Tailwind CSS 3.0
  - テストツール: Jest, React Testing Library, Cypress
- **バックエンド**: Node.js 18.x + Express 4.x
  - テストツール: Jest, Supertest
- **データベース**: MongoDB 7.0 (Atlas)
  - テストツール: MongoDB Memory Server
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

3. **認証と認可**
   - JWTベースの認証システム
   - 細かなアクセス制御

4. **データ同期**
   - オフライン/オンライン切り替え時のデータ同期
   - バックグラウンドデータ更新

## テストタイプ別のアプローチ

### フロントエンドのユニットテスト（Jest + React Testing Library）

1. **コンポーネントのレンダリングテスト**
   - コンポーネントが正しくレンダリングされることを確認
   - プロップスの変更に応じた表示の変化をテスト
   - 条件付きレンダリングのテスト

```jsx
// BreweryCard.test.tsx
import { render, screen } from '@testing-library/react';
import BreweryCard from './BreweryCard';

describe('BreweryCard', () => {
  const mockBrewery = {
    id: '1',
    name: 'Test Brewery',
    address: '123 Test St',
    city: 'Seattle',
    rating: 4.5,
    image: 'test.jpg'
  };

  test('renders brewery information correctly', () => {
    render(<BreweryCard brewery={mockBrewery} />);
    
    expect(screen.getByText('Test Brewery')).toBeInTheDocument();
    expect(screen.getByText('123 Test St, Seattle')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
  });

  test('displays "No rating" when rating is not provided', () => {
    const breweryWithoutRating = { ...mockBrewery, rating: undefined };
    render(<BreweryCard brewery={breweryWithoutRating} />);
    
    expect(screen.getByText('No rating')).toBeInTheDocument();
  });
});
```

2. **ユーザーインタラクションのテスト**
   - クリック、入力などのイベントハンドリングのテスト
   - フォーム送信のテスト
   - エラー状態の表示テスト

```jsx
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('submits the form with username and password', async () => {
    render(<LoginForm onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('displays validation errors', async () => {
    render(<LoginForm onLogin={mockLogin} />);
    
    // Empty form submission
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});
```

3. **カスタムフックのテスト**
   - フックの動作と状態変化をテスト
   - 副作用とクリーンアップのテスト

```jsx
// useBrewerySearch.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import useBrewerySearch from './useBrewerySearch';
import { mockBreweryApi } from '../__mocks__/api';

// APIをモック
jest.mock('../api', () => ({
  getBreweries: jest.fn()
}));

describe('useBrewerySearch', () => {
  beforeEach(() => {
    mockBreweryApi.getBreweries.mockClear();
  });

  test('returns initial state', () => {
    const { result } = renderHook(() => useBrewerySearch());
    
    expect(result.current.breweries).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('fetches breweries on search', async () => {
    const mockBreweries = [{ id: '1', name: 'Test Brewery' }];
    mockBreweryApi.getBreweries.mockResolvedValue(mockBreweries);
    
    const { result, waitForNextUpdate } = renderHook(() => useBrewerySearch());
    
    act(() => {
      result.current.searchBreweries('Seattle');
    });
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.breweries).toEqual(mockBreweries);
    expect(mockBreweryApi.getBreweries).toHaveBeenCalledWith({ city: 'Seattle' });
  });

  test('handles error case', async () => {
    const error = new Error('API error');
    mockBreweryApi.getBreweries.mockRejectedValue(error);
    
    const { result, waitForNextUpdate } = renderHook(() => useBrewerySearch());
    
    act(() => {
      result.current.searchBreweries('Seattle');
    });
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch breweries');
    expect(result.current.breweries).toEqual([]);
  });
});
```

4. **コンテキストとプロバイダーのテスト**
   - コンテキストの状態と更新をテスト
   - プロバイダーのラッピング

```jsx
// AuthContext.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { mockLoginApi } from '../__mocks__/api';

// APIをモック
jest.mock('../api', () => ({
  login: jest.fn()
}));

// テスト用コンシューマーコンポーネント
const TestConsumer = () => {
  const { user, login, logout, error } = useAuth();
  
  return (
    <div>
      {user ? (
        <>
          <div data-testid="user-info">
            {user.email}
          </div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>
          Login
        </button>
      )}
      {error && <div data-testid="error">{error}</div>}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    mockLoginApi.login.mockClear();
    localStorage.clear();
  });

  test('provides authentication state and functions', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockToken = 'test-token';
    
    mockLoginApi.login.mockResolvedValue({ user: mockUser, token: mockToken });
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    // 初期状態ではユーザーは未ログイン
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    
    // ログインボタンをクリック
    fireEvent.click(screen.getByText('Login'));
    
    // ログイン処理後、ユーザー情報が表示される
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com');
      expect(localStorage.getItem('token')).toBe(mockToken);
    });
    
    // ログアウトボタンをクリック
    fireEvent.click(screen.getByText('Logout'));
    
    // ログアウト後、ユーザー情報が非表示になる
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('handles login error', async () => {
    const error = new Error('Invalid credentials');
    mockLoginApi.login.mockRejectedValue(error);
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Authentication failed');
    });
  });
});
```

### Leaflet.jsコンポーネントのテスト

1. **地図コンポーネントのテスト**
   - Leaflet依存のモック化
   - 地図初期化と設定のテスト

```jsx
// BreweryMap.test.tsx
import { render, screen } from '@testing-library/react';
import BreweryMap from './BreweryMap';

// Leafletのモック
jest.mock('leaflet', () => {
  const originalModule = jest.requireActual('leaflet');
  
  return {
    ...originalModule,
    map: jest.fn(() => ({
      setView: jest.fn().mockReturnThis(),
      remove: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    })),
    marker: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      bindPopup: jest.fn().mockReturnThis(),
      setLatLng: jest.fn(),
      remove: jest.fn()
    })),
    tileLayer: jest.fn(() => ({
      addTo: jest.fn()
    })),
    icon: jest.fn(() => ({}))
  };
});

describe('BreweryMap', () => {
  const mockBreweries = [
    {
      id: '1',
      name: 'Brewery 1',
      location: { coordinates: [-122.3321, 47.6062] }
    },
    {
      id: '2',
      name: 'Brewery 2',
      location: { coordinates: [-122.3421, 47.6162] }
    }
  ];

  beforeEach(() => {
    // DOMにmapコンテナを追加
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    document.body.appendChild(mapDiv);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('initializes map with correct settings', () => {
    render(<BreweryMap breweries={mockBreweries} center={[47.6062, -122.3321]} />);
    
    expect(L.map).toHaveBeenCalledWith('map', expect.any(Object));
    expect(L.tileLayer).toHaveBeenCalledWith(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      expect.any(Object)
    );
  });

  test('adds markers for each brewery', () => {
    render(<BreweryMap breweries={mockBreweries} center={[47.6062, -122.3321]} />);
    
    expect(L.marker).toHaveBeenCalledTimes(mockBreweries.length);
    
    mockBreweries.forEach((brewery, index) => {
      expect(L.marker).toHaveBeenNthCalledWith(
        index + 1,
        [brewery.location.coordinates[1], brewery.location.coordinates[0]],
        expect.any(Object)
      );
    });
  });

  test('cleans up on unmount', () => {
    const { unmount } = render(
      <BreweryMap breweries={mockBreweries} center={[47.6062, -122.3321]} />
    );
    
    const mockMap = L.map.mock.results[0].value;
    
    unmount();
    
    expect(mockMap.remove).toHaveBeenCalled();
  });
});
```

### バックエンドのユニットテスト（Jest）

1. **APIコントローラーのテスト**
   - ルートハンドラの動作をテスト
   - リクエスト/レスポンスのモック
   - エラーハンドリングのテスト

```javascript
// breweryController.test.js
const { getAllBreweries, getBreweryById } = require('./breweryController');
const Brewery = require('../models/Brewery');
const httpMocks = require('node-mocks-http');

// モデルのモック
jest.mock('../models/Brewery');

describe('Brewery Controller', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBreweries', () => {
    test('returns all breweries with success status', async () => {
      const mockBreweries = [
        { id: '1', name: 'Brewery 1' },
        { id: '2', name: 'Brewery 2' }
      ];
      
      // find()のモック実装
      Brewery.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBreweries)
      });
      
      Brewery.countDocuments.mockResolvedValue(2);
      
      await getAllBreweries(req, res, next);
      
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        status: 'success',
        results: 2,
        total: 2,
        page: 1,
        limit: 20,
        data: mockBreweries
      });
    });

    test('handles filters from query parameters', async () => {
      req.query = { name: 'Test', city: 'Seattle', page: '2', limit: '10' };
      
      Brewery.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });
      
      Brewery.countDocuments.mockResolvedValue(0);
      
      await getAllBreweries(req, res, next);
      
      expect(Brewery.find).toHaveBeenCalledWith(
        expect.objectContaining({
          name: { $regex: 'Test', $options: 'i' },
          city: { $regex: 'Seattle', $options: 'i' }
        })
      );
    });

    test('handles database errors', async () => {
      const error = new Error('Database error');
      Brewery.find.mockImplementation(() => {
        throw error;
      });
      
      await getAllBreweries(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Error fetching breweries');
      expect(next.mock.calls[0][0].statusCode).toBe(500);
    });
  });

  describe('getBreweryById', () => {
    test('returns brewery by ID', async () => {
      const mockBrewery = { id: '1', name: 'Test Brewery' };
      req.params = { breweryId: '1' };
      
      Brewery.findById.mockResolvedValue(mockBrewery);
      
      await getBreweryById(req, res, next);
      
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        status: 'success',
        data: mockBrewery
      });
    });

    test('returns 404 for non-existent brewery', async () => {
      req.params = { breweryId: 'nonexistent' };
      
      Brewery.findById.mockResolvedValue(null);
      
      await getBreweryById(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Brewery not found');
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });
});
```

2. **モデルとバリデーションのテスト**
   - スキーマのバリデーションをテスト
   - 仮想プロパティとメソッドのテスト

```javascript
// Brewery.test.js
const mongoose = require('mongoose');
const Brewery = require('./Brewery');

describe('Brewery Model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Brewery.deleteMany({});
  });

  test('creates a brewery with valid fields', async () => {
    const breweryData = {
      name: 'Test Brewery',
      description: 'A test brewery',
      address: '123 Test St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      location: {
        type: 'Point',
        coordinates: [-122.3321, 47.6062]
      },
      tags: ['IPA', 'Stout']
    };
    
    const brewery = new Brewery(breweryData);
    const savedBrewery = await brewery.save();
    
    expect(savedBrewery._id).toBeDefined();
    expect(savedBrewery.name).toBe(breweryData.name);
    expect(savedBrewery.city).toBe(breweryData.city);
    expect(savedBrewery.location.coordinates).toEqual(breweryData.location.coordinates);
    expect(savedBrewery.tags).toEqual(expect.arrayContaining(breweryData.tags));
  });

  test('fails for brewery without required name', async () => {
    const breweryWithoutName = new Brewery({
      address: '123 Test St',
      city: 'Seattle',
      state: 'WA',
      location: {
        type: 'Point',
        coordinates: [-122.3321, 47.6062]
      }
    });
    
    let error;
    try {
      await breweryWithoutName.save();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  test('validates website URL format', async () => {
    const breweryWithInvalidUrl = new Brewery({
      name: 'Test Brewery',
      address: '123 Test St',
      city: 'Seattle',
      state: 'WA',
      location: {
        type: 'Point',
        coordinates: [-122.3321, 47.6062]
      },
      website: 'invalid-url'
    });
    
    let error;
    try {
      await breweryWithInvalidUrl.save();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.website).toBeDefined();
  });
});
```

3. **認証とJWTのテスト**
   - トークン生成と検証をテスト
   - 認証ミドルウェアのテスト

```javascript
// authMiddleware.test.js
const { authenticate } = require('./authMiddleware');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { AppError } = require('../utils/errorHandler');

// JWTのモック
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('passes with valid token in Authorization header', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    req.headers.authorization = 'Bearer valid-token';
    
    jwt.verify.mockReturnValue({ sub: mockUser.id });
    
    authenticate(req, res, next);
    
    expect(jwt.verify).toHaveBeenCalledWith(
      'valid-token',
      process.env.JWT_SECRET,
      expect.any(Object)
    );
    expect(req.user).toEqual({ id: mockUser.id });
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  test('returns 401 when no token is provided', () => {
    authenticate(req, res, next);
    
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Authentication required');
  });

  test('returns 401 when token format is invalid', () => {
    req.headers.authorization = 'InvalidFormat';
    
    authenticate(req, res, next);
    
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid token format');
  });

  test('returns 401 when token verification fails', () => {
    req.headers.authorization = 'Bearer invalid-token';
    
    jwt.verify.mockImplementation(() => {
      throw new Error('Token verification failed');
    });
    
    authenticate(req, res, next);
    
    expect(jwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid or expired token');
  });
});
```

### 統合テスト（Supertest）

1. **APIエンドポイントの統合テスト**
   - エンドツーエンドのリクエスト/レスポンスフローをテスト
   - データベース操作を含むテスト

```javascript
// breweryRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Brewery = require('../models/Brewery');
const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');

describe('Brewery Routes', () => {
  let testBrewery;
  let authToken;
  
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // テストユーザーの作成
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    
    // 認証トークンの生成
    authToken = generateToken(testUser._id);
    
    // テストブルワリーの作成
    testBrewery = await Brewery.create({
      name: 'Integration Test Brewery',
      description: 'A brewery for integration tests',
      address: '123 Test St',
      city: 'Seattle',
      state: 'WA',
      location: {
        type: 'Point',
        coordinates: [-122.3321, 47.6062]
      },
      tags: ['IPA', 'Stout']
    });
  });

  afterAll(async () => {
    await Brewery.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/breweries', () => {
    test('returns all breweries', async () => {
      const response = await request(app)
        .get('/api/breweries')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toBeDefined();
    });

    test('filters breweries by city', async () => {
      const response = await request(app)
        .get('/api/breweries?city=Seattle')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].city).toBe('Seattle');
    });
  });

  describe('GET /api/breweries/:id', () => {
    test('returns brewery by ID', async () => {
      const response = await request(app)
        .get(`/api/breweries/${testBrewery._id}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data._id).toBe(testBrewery._id.toString());
      expect(response.body.data.name).toBe(testBrewery.name);
    });

    test('returns 404 for non-existent brewery', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/breweries/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Brewery not found');
    });
  });

  describe('POST /api/breweries/:id/checkin', () => {
    test('creates a new check-in when authenticated', async () => {
      const response = await request(app)
        .post(`/api/breweries/${testBrewery._id}/checkin`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ visibility: 'public' })
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.presence).toBeDefined();
      expect(response.body.data.presence.brewery.toString()).toBe(testBrewery._id.toString());
    });

    test('returns 401 when not authenticated', async () => {
      const response = await request(app)
        .post(`/api/breweries/${testBrewery._id}/checkin`)
        .send({ visibility: 'public' })
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Authentication required');
    });
  });
});
```

### End-to-End (E2E) テスト（Cypress）

1. **ユーザーフローのE2Eテスト**
   - 実際のブラウザ環境での動作をテスト
   - 複数ページにまたがるユーザーフローをテスト

```javascript
// cypress/integration/brewery_search.spec.js
describe('Brewery Search', () => {
  beforeEach(() => {
    // 各テスト前にホームページを訪問
    cy.visit('/');
  });

  it('allows searching for breweries by city', () => {
    // 検索フォームに入力
    cy.get('[data-testid=search-input]').type('Seattle');
    cy.get('[data-testid=search-button]').click();
    
    // 結果が表示されることを確認
    cy.get('[data-testid=brewery-card]').should('have.length.greaterThan', 0);
    
    // 結果に「Seattle」が含まれることを確認
    cy.get('[data-testid=brewery-city]').each(($city) => {
      expect($city.text()).to.include('Seattle');
    });
  });

  it('shows brewery details when clicking on a brewery card', () => {
    // 検索を実行
    cy.get('[data-testid=search-input]').type('Seattle');
    cy.get('[data-testid=search-button]').click();
    
    // 最初のブルワリーカードをクリック
    cy.get('[data-testid=brewery-card]').first().click();
    
    // 詳細ページに遷移したことを確認
    cy.url().should('include', '/brewery/');
    
    // 詳細情報が表示されることを確認
    cy.get('[data-testid=brewery-name]').should('be.visible');
    cy.get('[data-testid=brewery-address]').should('be.visible');
    cy.get('[data-testid=brewery-description]').should('be.visible');
  });

  it('shows brewery location on the map', () => {
    // 検索を実行してブルワリーを選択
    cy.get('[data-testid=search-input]').type('Seattle');
    cy.get('[data-testid=search-button]').click();
    cy.get('[data-testid=brewery-card]').first().click();
    
    // 「Map」タブをクリック
    cy.get('[data-testid=map-tab]').click();
    
    // 地図が表示されることを確認
    cy.get('#map').should('be.visible');
    
    // マーカーが表示されることを確認（Leafletのマーカー要素）
    cy.get('.leaflet-marker-icon').should('be.visible');
  });
});
```

2. **認証フローのE2Eテスト**
   - ログイン/ログアウトプロセスのテスト
   - 認証状態に基づく機能テスト

```javascript
// cypress/integration/auth.spec.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    // 各テスト前にログイン状態をリセット
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('allows users to register a new account', () => {
    // ユニークなメールアドレスを生成
    const email = `test${Date.now()}@example.com`;
    const password = 'Password123!';
    
    // 登録ページに移動
    cy.get('[data-testid=register-link]').click();
    
    // フォームに入力
    cy.get('[data-testid=name-input]').type('Test User');
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    cy.get('[data-testid=confirm-password-input]').type(password);
    
    // 登録ボタンをクリック
    cy.get('[data-testid=register-button]').click();
    
    // 登録成功後、ログイン状態になることを確認
    cy.get('[data-testid=user-profile]').should('be.visible');
    cy.get('[data-testid=user-profile]').should('contain', 'Test User');
  });

  it('allows users to login with existing credentials', () => {
    // 事前に登録済みのテストアカウントを使用
    const email = 'existing@example.com';
    const password = 'Password123!';
    
    // ログインページに移動
    cy.get('[data-testid=login-link]').click();
    
    // フォームに入力
    cy.get('[data-testid=email-input]').type(email);
    cy.get('[data-testid=password-input]').type(password);
    
    // ログインボタンをクリック
    cy.get('[data-testid=login-button]').click();
    
    // ログイン成功後、ユーザープロフィールが表示されることを確認
    cy.get('[data-testid=user-profile]').should('be.visible');
  });

  it('displays error message for invalid credentials', () => {
    // ログインページに移動
    cy.get('[data-testid=login-link]').click();
    
    // 不正な認証情報を入力
    cy.get('[data-testid=email-input]').type('wrong@example.com');
    cy.get('[data-testid=password-input]').type('WrongPassword');
    
    // ログインボタンをクリック
    cy.get('[data-testid=login-button]').click();
    
    // エラーメッセージが表示されることを確認
    cy.get('[data-testid=error-message]').should('be.visible');
    cy.get('[data-testid=error-message]').should('contain', 'Invalid credentials');
  });

  it('allows users to logout', () => {
    // 事前にログイン
    cy.login('existing@example.com', 'Password123!');
    
    // ログアウトボタンをクリック
    cy.get('[data-testid=user-menu]').click();
    cy.get('[data-testid=logout-button]').click();
    
    // ログアウト後、ログインリンクが表示されることを確認
    cy.get('[data-testid=login-link]').should('be.visible');
  });

  it('redirects to login for protected routes', () => {
    // プロフィールページ（保護されたルート）に直接アクセス
    cy.visit('/profile');
    
    // ログインページにリダイレクトされることを確認
    cy.url().should('include', '/login');
    cy.get('[data-testid=login-form]').should('be.visible');
  });
});
```

## テストカバレッジの最適化

### 1. テストカバレッジの測定
Jest でテストカバレッジを測定する設定例：

```javascript
// jest.config.js
module.exports = {
  // ...その他の設定
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.{js,ts}',
    '!src/reportWebVitals.js',
    '!src/serviceWorker.{js,ts}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  }
};
```

### 2. テストの優先順位付け
最小限のテストで最大の効果を得るための優先順位：

1. **ビジネスロジック**
   - 認証、ブルワリー検索、チェックイン機能など
   - 複雑な計算や状態管理を含むコンポーネント

2. **エラーが発生しやすい箇所**
   - フォーム処理
   - 非同期操作
   - 外部APIとの統合

3. **頻繁に変更される部分**
   - 活発に開発中の機能
   - リファクタリング予定のコード

### 3. 効果的なモックとスタブ
テストの孤立性と速度を高めるためのモック戦略：

```javascript
// apiClient.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  get: async (endpoint, params = {}) => {
    const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return response.data;
  },
  
  post: async (endpoint, data = {}) => {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return response.data;
  },
  
  // 他のメソッド...
};

// __mocks__/apiClient.js (自動モック)
export const apiClient = {
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  // 他のメソッド...
};

// テストでの使用例
jest.mock('../utils/apiClient');
import { apiClient } from '../utils/apiClient';

test('fetches data from API', async () => {
  // このテスト用にモックの実装を設定
  apiClient.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Test' }] });
  
  // テスト対象のコードを実行
  const result = await fetchData();
  
  // アサーション
  expect(apiClient.get).toHaveBeenCalledWith('/endpoint');
  expect(result).toEqual([{ id: 1, name: 'Test' }]);
});
```

## テストデータとフィクスチャ

### 1. テストデータファイル
再利用可能なテストデータの作成：

```javascript
// fixtures/breweries.js
export const breweryFixtures = {
  validBrewery: {
    id: '1',
    name: 'Test Brewery',
    description: 'A test brewery for unit tests',
    address: '123 Test St',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    location: {
      type: 'Point',
      coordinates: [-122.3321, 47.6062]
    },
    website: 'https://test-brewery.com',
    phone: '555-123-4567',
    tags: ['IPA', 'Stout', 'Pilsner'],
    openingHours: [
      { day: 'Monday', open: '16:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '16:00', close: '22:00', closed: false },
      // その他の曜日...
    ],
    images: ['test-image-1.jpg', 'test-image-2.jpg'],
    rating: 4.5
  },
  
  breweryList: [
    // 複数のブルワリーオブジェクト
  ],
  
  // 特殊なケース
  breweryWithoutImage: {
    // 画像のないブルワリー
  },
  
  breweryWithSpecialHours: {
    // 特殊な営業時間を持つブルワリー
  }
};

// fixtures/users.js
export const userFixtures = {
  validUser: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    // その他のフィールド
  },
  
  // 特殊なケース
  adminUser: {
    // 管理者権限を持つユーザー
  }
};
```

### 2. テスト用ヘルパー関数
テストをシンプルにするためのヘルパー関数：

```javascript
// testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { BreweryProvider } from '../contexts/BreweryContext';

// 全コンテキストプロバイダーでラップする関数
export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <BreweryProvider>
          {children}
        </BreweryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
};

// 認証状態をモックする関数
export const mockAuthState = (authState) => {
  const useAuthMock = jest.fn().mockReturnValue(authState);
  jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: () => useAuthMock()
  }));
  
  return useAuthMock;
};

// MongoDB Memory Serverの設定
export const setupMongoMemoryServer = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  return { mongod, uri };
};

// Cypressのカスタムコマンド
Cypress.Commands.add('login', (email, password) => {
  cy.window().then((window) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/login`,
      body: { email, password }
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token);
      window.localStorage.setItem('user', JSON.stringify(response.body.user));
    });
  });
  
  cy.visit('/');
});
```

## 回答テンプレート

以下のテンプレートを使用して、テスト作成リクエストに対する回答を構成します：

```
# [テスト対象] テスト実装計画

## 1. テスト戦略
[提案されるテストアプローチと優先順位]

## 2. テストケース
[主要なテストケースと考慮すべきエッジケースのリスト]

## 3. テストコード
[テスト実装例とコードスニペット]

## 4. モックとスタブ
[テストに必要なモックとスタブの実装方法]

## 5. テストデータ
[テストに使用するデータセットとフィクスチャ]

## 6. テスト実行方法
[テストの実行方法と結果の解釈]

## 7. テストカバレッジ
[期待されるテストカバレッジとその測定方法]

## 8. 継続的インテグレーション
[CIパイプラインへの統合方法]
```

## 質問と明確化

提供された情報が不十分な場合、以下のような質問を行い、要件を明確にします：

1. **テスト対象の詳細**
   - このコンポーネント/機能の主な責任は何ですか？
   - どのような入力と出力が期待されますか？
   - 既知のエッジケースや特殊なシナリオはありますか？

2. **依存関係と統合**
   - このコンポーネントはどのような外部サービスやAPIに依存していますか？
   - 他のコンポーネントとどのように統合されていますか？
   - モックすべき外部依存関係は何ですか？

3. **テスト環境**
   - テストはどの環境で実行されますか？（ローカル、CI/CD、本番前環境など）
   - テスト実行に必要な特別な設定や前提条件はありますか？
   - 既存のテスト基盤やユーティリティはありますか？

4. **テスト優先度**
   - 最も重要なテストシナリオは何ですか？
   - 最もリスクの高い部分はどこですか？
   - テストの時間や範囲に制約はありますか？
