# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PintHop is a beer hopping and serendipitous encounter platform focused on:
- "Serendipitous encounters" - natural meetups through real-time presence sharing
- "Beer hopping experience" - sharing brewery hopping routes and community building

Beer discovery features ("Find your next pint") have been moved to [NextPint](https://github.com/Rih0z/NextPint).

Currently in Phase 0 (minimal presence MVP) development, focusing on Seattle brewery data.

## Architecture

**Frontend**: `/frontend`
- React 18.2.0 + TypeScript 5.1.6 + Tailwind CSS 3.3.3
- **2025 UI/UX Stack**: Framer Motion + Modern Design System + Glassmorphism
- Leaflet.js for map functionality with 3D markers and spatial design
- JWT-based authentication with AuthContext
- Real-time presence updates via PresenceContext
- **Modern UI Features**: Dark Mode First, Bold Typography, AI-Enhanced UX

**Backend**: `/backend`
- Node.js 18.x + Express 4.18.2 + MongoDB 7.0
- Socket.IO for real-time features
- RESTful API with `/api/v1` prefix
- JWT authentication

**Data Structure**:
- JSON-based brewery data in `/backend/src/data/breweries/`
- MongoDB models: User, Brewery, Beer, Checkin, Presence

## Key Commands

### Backend Development
```bash
cd backend
npm run dev      # Start development server with nodemon
npm run build    # TypeScript compilation
npm run lint     # ESLint checks
npm test         # Run Jest tests
npm run seed     # Seed brewery data to MongoDB
```

### Frontend Development
```bash
cd frontend
npm start        # Start development server (port 3000)
npm run build    # Production build
npm test         # Run tests
```

### Common Development Tasks
```bash
# Run a single test file
npm test -- path/to/test.test.ts

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## Testing Approach

- Unit tests use Jest for both frontend and backend
- Frontend components tested with React Testing Library
- Test files follow naming pattern: `*.test.ts` or `*.test.tsx` for backend, `test_*.tsx` for frontend components
- Run tests before committing changes

## Git Workflow

- Branch naming: `feature/`, `bugfix/`, `refactor/` prefixes
- Commit format: `[type]: description` where type is feat/fix/docs/style/refactor/test/chore
- Create PR for all changes to main branch
- Self-review checklist before merging

## Security Considerations

- Never commit `.env` files or secrets
- Use environment variables for sensitive configuration
- JWT tokens for authentication
- Input validation on all API endpoints
- CORS configuration required

## Current Implementation Status

Phase 0 features implemented:
- Basic authentication API
- **NEW**: Full user registration system with KV storage
- **NEW**: Real-time form validation and availability checking
- **NEW**: bcrypt password hashing and secure JWT authentication
- Brewery CRUD operations with random brewery endpoint
- Presence tracking system
- Check-in functionality
- Map display with brewery markers
- Timeline view for presence updates

### Latest Deployment Information

- **Backend API**: https://pinthop-api.riho-dare.workers.dev
- **Frontend (最新)**: https://fc573c6a.pinthop-frontend.pages.dev
- **KV Namespace ID**: fa659b1141e5435eb905680ccdc69aff
- **Preview KV ID**: a43b7a10469c44439935de0e976aab95

**注意**: フロントエンドURLは各デプロイで変更されます。本番環境では固定カスタムドメインの設定が必要です。

### 動作確認済みテストアカウント
```
✅ ユーザー名: alice
   メール: alice@example.com
   パスワード: alice123456

✅ ユーザー名: realuser2025
   メール: realuser2025@example.com
   パスワード: RealTest123!@#
```

**2025-06-11更新**: 
- Login.tsxページのテストクレデンシャル表示を修正
- 無効だった`testuser/test123456`を削除
- 動作確認済みの`alice`と`realuser2025`アカウントのみ表示
- 両アカウントでログイン成功、ダッシュボードリダイレクトも正常動作を確認済み

### 🎨 2024-2025 UI/UX完全リニューアル完了 (2025-06-11)

すべてのReactコンポーネントが最新の2024-2025 UI/UXトレンドに完全準拠するよう全面的に再設計・実装されました：

#### 実装済み2025年版機能

1. **Dark Mode First Design (完全実装)**
   - 全コンポーネントでダークモードを最優先設計
   - 82.7%のユーザー嗜好に基づく実装
   - 自動テーマ検出とシームレス切り替え

2. **Glassmorphism Effects (全面適用)**
   - backdrop-filter: blur()を使用した透明感のあるUI
   - 半透明背景とマイクロリフレクション効果
   - 奥行きと素材感を表現するモダンデザイン

3. **Bold Typography with Variable Fonts**
   - Inter, Montserrat等のVariable Fonts使用
   - 極太フォントウェイト（800-900）でインパクト重視
   - レスポンシブタイポグラフィスケール

4. **AI-Enhanced Features (全機能)**
   - 検索とレコメンデーション機能にAI統合
   - リアルタイム入力バリデーション
   - パーソナリティスコア分析システム
   - AI関連度スコアによるコンテンツ最適化

5. **3D & Spatial Design**
   - perspective効果による立体的UI要素
   - 3D回転アニメーションとトランスフォーム
   - 空間的なレイアウトとDepth効果

6. **Modern Skeuomorphism**
   - 物理的質感を表現するボタンとアバター
   - inset shadowとborder効果
   - タッチ時の押下フィードバック

7. **Advanced Micro-interactions**
   - Framer Motionによるspring animationシステム
   - ホバー、タップ時の細かな反応
   - 状態変化時のスムーズなトランジション

#### 更新されたコンポーネント (Version 3.0)

- **Pages**: Login.tsx, Dashboard.tsx, Map.tsx, Register.tsx, BrewerySearch.tsx, Events.tsx, Profile.tsx
- **Components**: ModernComponents.tsx (共通UIライブラリ)
- **Design System**: modern-design-system.ts, design-system.ts

#### 技術スタック詳細

```typescript
// 2025年版 技術構成
- React 18.2.0 + TypeScript 5.1.6
- Framer Motion (アニメーション)
- Tailwind CSS 3.3.3 (ユーティリティCSS)
- CSS Custom Properties (カラーシステム)
- Variable Fonts (Inter, Montserrat)
- Glassmorphism CSS (backdrop-filter)
- 3D Transforms (perspective, rotateY/X)
```

## Environment Setup

Both frontend and backend require `.env` files (see `.env.example` in each directory):
- MongoDB connection string
- JWT secret
- API URLs and ports
- CORS origins

## Important Notes

- API versioning: Currently using `/api/` prefix (migration to `/api/v1/` planned)
- Brewery data uses object structure for review sites (not simple numbers)
- Logger utility available for consistent logging
- Extensive Japanese documentation in `/Document/jp/`

## Deployment Guidelines

When deploying to Cloudflare or any production environment:

1. **Complete all work before GitHub push**: Ensure all features are fully implemented and tested
2. **Build and deploy in Claude environment**: Always build and verify the application works correctly before deployment
3. **Security check before push**: Review all changes for security vulnerabilities:
   - No hardcoded secrets or API keys
   - No exposed sensitive endpoints
   - Proper authentication on all routes
   - No console.logs with sensitive data
   - Environment variables properly configured

### Deployment Commands

**Note**: This project does NOT use GitHub Actions for deployment. Use the following commands:

#### Backend Deployment (Cloudflare Workers)
```bash
cd backend
npm run deploy  # または npx wrangler deploy
```

#### Frontend Deployment (Cloudflare Pages)
```bash
cd frontend
npm run build
npm run deploy  # このコマンドでCloudflare Pagesにデプロイ
```

#### Important Deployment Notes
- **Manual deployment only**: GitHub pushはコードの保存のみ、自動デプロイはされない
- **Always build before deploy**: `npm run build`を実行してから`npm run deploy`
- **Cache issues**: デプロイ後はブラウザキャッシュをクリア（Ctrl+Shift+R）
- **Verify deployment**: デプロイ後は必ず本番環境で動作確認

#### URL固定設定（重要）
**問題**: Cloudflare PagesはデプロイごとにランダムなプレビューURLを生成するため、バックエンドのCORS設定で毎回新しいURLを追加する必要がある

**現在の状況**: 
- 各デプロイで新しいURL（例：https://d14ab9e4.pinthop-frontend.pages.dev）が生成される
- これによりCORS設定の更新とバックエンドの再デプロイが必要
- 本番環境での継続的な利用に支障をきたす

**解決策**: カスタムドメインの設定
1. **独自ドメインの取得**: 例 `pinthop.com` または `app.pinthop.com`
2. **Cloudflare DNS設定**: ドメインをCloudflare Pagesに紐付け
3. **固定URL使用**: 以下の固定URLを設定
   - **Frontend 本番URL**: `https://app.pinthop.com` (カスタムドメイン)
   - **Backend API URL**: `https://pinthop-api.riho-dare.workers.dev` (既に固定)

**設定手順**:
1. Cloudflareダッシュボード → Pages → pinthop-frontend
2. Custom domains タブ → Add custom domain
3. ドメイン入力 → DNS設定の確認
4. バックエンドのCORS設定をカスタムドメインに更新:
   ```typescript
   const allowedOrigins = [
     'https://app.pinthop.com',  // 本番カスタムドメイン（最優先）
     'https://pinthop-frontend.pages.dev',  // バックアップ
     'http://localhost:3000',  // 開発環境
   ];
   ```

**ベストプラクティス**:
- プレビューURLは開発・テスト用のみ使用
- 本番利用は必ずカスタムドメインを使用
- CORS設定にはカスタムドメインを最優先で配置
- デプロイ時のURL変更による中断を防ぐ

## Security Implementation (Updated 2025-01-05)

### Current Security Measures

1. **JWT Implementation**
   - Using `hono/jwt` for proper token signing and verification
   - Tokens include expiration time (exp), issued at (iat), and not before (nbf) claims
   - Token validation checks expiration on every request

2. **CORS Configuration**
   - Restricted to specific allowed origins only
   - No wildcard (`*`) origins permitted
   - Production domain and localhost only

3. **Security Headers**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `Referrer-Policy: strict-origin-when-cross-origin`

4. **Environment Variables**
   - All secrets stored in environment variables
   - Test user credentials configurable via env vars
   - JWT secret must be set in Cloudflare dashboard

5. **Input Validation**
   - Email format validation
   - Password minimum length (8 characters)
   - Required field validation

### Secure Implementation Files

- `backend/src/worker-secure.ts` - Production-ready Worker with security enhancements
- `backend/wrangler.toml` - Cloudflare configuration file
- `backend/.env.secure.example` - Example environment variables
- `backend/security-setup.md` - Detailed security setup guide

### Important Security Notes

- **Never expose API endpoints in public documentation**
- **Always use worker-with-registration.ts for production deployments**
- **Change all default passwords and secrets before production**
- **Review security-setup.md and registration-setup.md before deployment**
- **Use Cloudflare's secret management for sensitive data**
- **KV storage now used for user registration data**
- **bcryptjs used for password hashing (saltRounds: 10)**

### New Registration System Architecture

- **Storage**: Cloudflare KV (replacing MongoDB for user data)
- **Security**: bcryptjs password hashing + JWT tokens
- **Validation**: Real-time username/email availability checking
- **UX**: Modern registration form with progressive enhancement
- **API Endpoints**:
  - `POST /api/auth/register` - User registration
  - `GET /api/auth/check-username/:username` - Username availability
  - `GET /api/auth/check-email/:email` - Email availability

## Development Workflow Guidelines

### 1. 作業完了時のGitHub追加
- すべての作業が完了したら必ずGitHubに変更を追加（git add, commit, push）すること
- コミットメッセージは明確で意味のあるものにする
- 未完成の機能はコミットしない

### 2. ビルドとデプロイ
- 作業が完了したらClaude環境でビルドしてデプロイすること
- フロントエンド: `npm run build` → Cloudflare Pagesへデプロイ
- バックエンド: `npx wrangler deploy` → Cloudflare Workersへデプロイ

### 3. デプロイ先の記載
- READMEにデプロイ先のURLを記載すること
- 現在の本番環境URL:
  - Frontend: https://bb16b80e.pinthop-frontend.pages.dev
  - Backend API: https://pinthop-api.riho-dare.workers.dev

### 4. セキュリティチェック
- GitHubへのプッシュ前に必ずセキュリティ上の問題がないか確認すること:
  - APIキーやシークレットがハードコードされていないか
  - .envファイルがgitignoreに含まれているか
  - デバッグ用のconsole.logが残っていないか
  - 認証が必要なエンドポイントに適切な保護があるか

### 5. ドキュメントの更新
- 実装を変更したらそれに合わせてドキュメントも更新すること
- 特に以下のドキュメントに注意:
  - README.md - デプロイURL、セットアップ手順
  - API仕様書 - エンドポイントの変更
  - このCLAUDE.md - 新機能や重要な変更

### 6. 本番環境へのデプロイ
- 必ずURLが固定の本番環境にデプロイするようにして
- Cloudflare Pagesのプロジェクト名を固定: `pinthop-frontend`
- Cloudflare Workersの名前を固定: `pinthop-api`

### 7. API通信の確保
- フロントエンドとバックエンドの通信が必ず成功するように固定のAPIを指定して
- Frontend .env:
  ```
  REACT_APP_API_URL=https://pinthop-api.riho-dare.workers.dev
  ```
- Backend CORS設定に必ずフロントエンドのURLを含める

## 🎨 2025年版デザインガイドライン

### 2024-2025 UI/UXトレンド準拠原則

#### 1. Dark Mode First Design
- **優先度**: すべてのデザインはダークモードを最初に設計
- **実装**: `data-theme="dark"`をデフォルトとし、ライトモードは後付け
- **コントラスト**: WCAG AAA準拠の高コントラスト比を維持

#### 2. Glassmorphism実装標準
```css
/* 標準Glassmorphismスタイル */
.glass-effect {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(26, 26, 26, 0.9); /* ダーク */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

#### 3. Bold Typography with Variable Fonts
- **ヘッダー**: Inter Display、フォントウェイト800-900
- **本文**: Inter、フォントウェイト400-600  
- **サイズスケール**: 2.25rem(36px)から1rem(16px)の極端なスケール
- **Letter Spacing**: タイトルは-0.025em、本文は0

#### 4. Modern Icon System
- **ライブラリ**: react-icons (Heroicons優先)
- **使用禁止**: 絵文字は一切使用しない
- **サイズ**: 16px, 20px, 24px, 32pxの標準サイズ
- **カラー**: CSS Custom Propertiesで動的カラー対応

```tsx
// 2025年版アイコン実装例
import { HiSparkles, HiLocationMarker, HiUsers } from 'react-icons/hi';

<HiSparkles 
  className="w-6 h-6" 
  style={{ color: 'var(--color-primary-400)' }}
  aria-label="AI機能"
/>
```

#### 5. AI-Enhanced UX パターン
- **検索**: リアルタイム候補表示と関連度スコア
- **レコメンデーション**: パーソナライズされたコンテンツ提案
- **バリデーション**: AI支援による入力チェック
- **スコアリング**: ユーザー行動に基づく動的スコア表示

#### 6. 3D & Spatial Design実装
```css
/* 3D効果の標準実装 */
.spatial-element {
  transform: perspective(1000px) rotateX(10deg);
  transition: transform 0.3s ease;
}

.spatial-element:hover {
  transform: perspective(1000px) rotateX(15deg) scale(1.05);
}
```

#### 7. Modern Skeuomorphism
- **深度表現**: inset shadowとborder-radiusでの質感
- **タッチフィードバック**: 押下時の視覚的変化
- **素材感**: グラデーションと影による立体感

### アクセシビリティ標準
- **キーボードナビゲーション**: 全機能対応
- **スクリーンリーダー**: ARIA属性の完全実装  
- **カラーコントラスト**: WCAG AAA Level対応
- **フォーカス表示**: 明確な視覚的フィードバック

## SOLID原則の確認

### 実装時のSOLID原則チェックリスト

1. **Single Responsibility Principle (SRP)**
   - 各クラス/モジュールは単一の責任を持つ
   - 変更理由は1つだけであるべき
   - 例: AuthContextは認証のみ、PresenceContextはプレゼンスのみを扱う

2. **Open/Closed Principle (OCP)**
   - 拡張に対して開いているが、修正に対して閉じている
   - 新機能追加時に既存コードを変更しない
   - インターフェースや抽象クラスを使用

3. **Liskov Substitution Principle (LSP)**
   - 派生クラスは基底クラスと置換可能
   - インターフェースの契約を守る
   - 例: IBeerRepository実装はすべて同じ動作を保証

4. **Interface Segregation Principle (ISP)**
   - クライアントが使わないメソッドに依存させない
   - 大きなインターフェースより小さな特化したものを
   - 例: ICheckinService, IPresenceServiceなど機能別に分離

5. **Dependency Inversion Principle (DIP)**
   - 高レベルモジュールは低レベルモジュールに依存しない
   - 両方とも抽象に依存すべき
   - 依存性注入(DI)を活用

### プロジェクトでの実装例

- **Services層**: インターフェース定義により抽象に依存
- **Repository層**: データアクセスの詳細を隠蔽
- **Context**: 各コンテキストは単一の関心事に集中
- **Components**: 再利用可能で単一責任を持つコンポーネント設計