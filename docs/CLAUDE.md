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
- Leaflet.js for map functionality
- JWT-based authentication with AuthContext
- Real-time presence updates via PresenceContext

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
- **Frontend**: https://fc9d96f0.pinthop.pages.dev
- **KV Namespace ID**: fa659b1141e5435eb905680ccdc69aff
- **Preview KV ID**: a43b7a10469c44439935de0e976aab95

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

## Design Guidelines

### Icon Usage
- **絵文字の使用禁止**: 絵文字は一切使用しない
- **react-iconsライブラリを使用**: すべてのアイコンはreact-iconsから選択する
- **アイコンライブラリの選択**:
  - React Icons (react-icons): https://react-icons.github.io/react-icons/
  - 利用可能なアイコンセット: Feather, Heroicons, Lucide, Material Design, Font Awesome等
- **一貫性の維持**: 同じプロジェクト内では同じアイコンセットを使用する
- **アクセシビリティ**: アイコンには適切なaria-labelやtitleを設定する

### Implementation Example
```tsx
import { FaBeer, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { HiLocationMarker, HiClock } from 'react-icons/hi';
import { IoMdPeople, IoMdTime } from 'react-icons/io';

// 使用例
<FaBeer className="w-5 h-5 text-amber-500" aria-label="ビール" />
<FaMapMarkerAlt className="w-4 h-4 text-red-500" aria-label="位置" />
<FaUsers className="w-6 h-6 text-blue-500" aria-label="ユーザー" />
```

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