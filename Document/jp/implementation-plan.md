----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: implementation-plan.md
ファイルパス: Document/jp/implementation-plan.md
作成者: Koki Riho
作成日: 2025-04-21
最終更新: 2025-04-27

# 更新履歴
- 2025-04-21 Claude Assistant 初版を更新、specification.mdとの整合性確保
- 2025-04-21 Claude Assistant フェーズ定義の統一、タブ構造の修正、タイムライン調整
- 2025-04-27 Claude Assistant フェーズ0の開発環境構築参照をSetup/Phase0.mdに更新

# 説明
PintHopアプリケーションの実装計画とセキュリティ対策を定義するドキュメント。フェーズごとの実装ステップとセキュリティ対策を詳述し、1人での効率的な開発運用体制を提案。
----

# PintHop 統合実装セキュリティ計画書

## 1. 概要

PintHopは「偶然の出会い」と「ビアホッピング体験の共有」に焦点を当てたコミュニティ形成プラットフォームです。本計画書では、リアルタイムプレゼンス共有とルート共有を核心機能として、セキュリティを重視した1人での効率的運用が可能な段階的実装アプローチを概説します。

※ ビール発見・評価機能はNextPint（https://github.com/Rih0z/NextPint）で提供

## 2. プロジェクト概要

### 2.1 核心体験
- **偶然の出会い**: リアルタイムプレゼンス共有による自然な合流機会の創出
- **ビアホッピング体験の共有**: ルート共有とコミュニティでのビアホッピング体験

### 2.2 技術スタック
- **フロントエンド**: React 18 + TypeScript 5.0 + Tailwind CSS 3.0
- **バックエンド**: Node.js 18.x + Express 4.x
- **データベース**: MongoDB 7.0 (Atlas)
- **認証**: JWT（セキュアな実装）
- **地図**: Leaflet.js
- **ホスティング**: Netlify (フロントエンド) + rihobeer.com (バックエンド)
- **セキュリティツール**: Helmet.js, bcrypt, express-validator, DOMPurify

## 3. プロジェクト構造

PintHopプロジェクトは以下のファイル構造で整理します:

```
PintHop/
├── Document/
│   └── jp/
│       ├── Code-rule.md             # 既存のコーディング規則
│       ├── specification.md         # 既存の仕様書
│       ├── implementation-plan.md   # 実装計画書
│       ├── project-structure.md     # プロジェクト構造定義書
│       ├── database-schema.md       # データベーススキーマ定義書
│       ├── api-document.md          # API仕様書
│       ├── setup-guide.md           # セットアップ手順書
│       ├── deployment-document.md   # デプロイメント手順書
│       ├── security-policy.md       # セキュリティポリシー
│       ├── security-checklist.md    # セキュリティチェックリスト
│       ├── incident-response.md     # インシデント対応計画
│       ├── git-workflow.md          # Gitワークフロー規約
│       ├── ui-ux-flow.md            # UI/UXフロー設計書
│       ├── test-plan.md             # テスト計画書
│       └── sprint-plan.md           # スプリント計画書
│       └── Setup/
│           └── Phase0.md            # フェーズ0環境構築手順
│
├── Prompts/
│   ├── implementation-start.md      # 実装開始時のプロンプト
│   ├── implementation-handover.md   # 実装状況引き継ぎプロンプト
│   ├── debugging.md                 # バグ修正・デバッグ支援プロンプト
│   ├── code-review.md              # コードレビュープロンプト
│   ├── security-review.md          # セキュリティレビュープロンプト
│   ├── feature-extension.md        # 機能拡張プロンプト
│   ├── performance-optimization.md # パフォーマンス最適化プロンプト
│   └── test-creation.md            # テスト作成支援プロンプト
│
├── frontend/                        # フロントエンドソースコード
│
└── backend/                         # バックエンドソースコード
    └── scripts/                     # 運用自動化スクリプト
```

## 4. 実装フェーズ

### 4.1 フェーズ0: マイクロMVP（1-2ヶ月）
最初のステップとして、リアルタイム存在共有とシアトル限定ブルワリーマップの最小限実装を行います。詳細なフェーズ0の計画はphase0-implementation-plan.mdを参照してください。

#### 4.1.1 マイルストーン
1. **Week 1-2**: 基本インフラ・ドキュメントの整備
   - 開発環境の構築（詳細手順はDocument/jp/Setup/Phase0.mdを参照）
   - 基本ドキュメントの整備
   - セキュリティポリシードキュメント

2. **Week 3-4**: シアトル限定ブルワリーマップ基盤
   - JSONベースのブルワリーデータ構築
   - マップ表示の基本実装
   - レビューサイト評価の統合表示

3. **Week 5-6**: リアルタイム存在共有の基盤
   - 友達接続の基本機能
   - 位置情報共有の基本機能
   - 基本的なプライバシー設定

4. **Week 7-8**: 統合・テスト・リリース
   - 機能統合と結合テスト
   - マイクロMVPのリリース
   - 初期ユーザーフィードバック収集

#### 4.1.2 セキュリティドキュメント詳細

以下のセキュリティ関連ドキュメントを重点的に作成します：

1. **security-policy.md**
   - セキュリティの基本方針
   - 責任範囲の明確化
   - ユーザーデータ保護ポリシー
   - セキュリティ更新方針

2. **security-checklist.md**
   - 開発段階でのチェック項目
   - デプロイ前チェック項目
   - 定期的な運用チェック項目
   - サードパーティ製品の安全性検証方法

3. **incident-response.md**
   - インシデント分類と対応レベル
   - 対応手順と連絡体制
   - 復旧手順
   - 事後分析と再発防止

#### 4.1.3 プロンプト整備計画

実装効率向上と安全な開発のため、以下のプロンプトを重点的に整備します：

1. **実装開始/引き継ぎプロンプト** (最優先)
   - 新機能実装・引き継ぎをスムーズに行うためのテンプレート
   - セキュリティ要件を含む実装ガイダンス

2. **security-review.md** (新規追加・高優先)
   - セキュリティ観点でのコードレビュー
   - 潜在的な脆弱性の検出
   - セキュリティベストプラクティスの提案

3. **その他支援プロンプト**
   - バグ修正・デバッグ支援
   - 機能拡張
   - テスト作成支援
   - パフォーマンス最適化

### 4.2 フェーズ1: コアMVP（2-3ヶ月）
マイクロMVP完了後、プレゼンス機能の強化と基本的なルート共有機能の実装を行います。

#### 4.2.1 マイルストーン
1. **Week 1-2**: 開発環境強化と拡張計画
   - リポジトリ整備と開発環境調整
   - 拡張機能の詳細設計
   - **セキュリティ強化**: 開発環境の分離と保護

2. **Week 3-6**: コアデータモデルとバックエンド実装
   - ユーザーモデルとAPI
   - ブルワリーモデルとAPI
   - **セキュアな認証システム**
     - JWTトークン実装（短期有効期限+更新機能）
     - パスワードのbcryptハッシュ化
     - 認証レート制限実装

3. **Week 7-10**: フロントエンド基盤実装
   - UI基本コンポーネント
   - 認証画面
   - 5タブナビゲーション構造（タイムライン、マップ、ブルワリー検索、イベント、プロフィール）
   - **セキュリティ強化**:
     - 入力検証とサニタイゼーション
     - CSRFトークン対策

4. **Week 11-12**: 初期統合とデプロイ
   - フロントエンド・バックエンド統合
   - 初期デプロイ（デプロイメント手順書に従う）
   - 基本機能テスト
   - **セキュリティテスト**: 初期脆弱性スキャン実施

### 4.3 フェーズ2: ソーシャル拡張（3-4ヶ月）
グループプレゼンス機能とルート作成・共有機能を実装します。このフェーズはフェーズ1の後半と一部並行して実施します。

#### 4.3.1 マイルストーン
1. **Week 1-4**: ブルワリーデータベース拡充
   - シアトル地域のブルワリーデータ拡充
   - 得意スタイル情報の追加
   - ブルワリー検索・フィルタリング機能強化
   - **セキュリティ強化**: データソースの検証と入力検証

2. **Week 5-8**: マップ機能拡張とグループプレゼンス
   - Leaflet.js最適化
   - グループプレゼンス機能
   - コンテキスト共有の実装
   - **セキュリティ強化**: グループ情報のアクセス制限

3. **Week 9-12**: ルート作成・共有機能
   - ルート作成インターフェース実装
   - リアルタイムルート進行共有機能
   - 友達のルート参加表示
   - **セキュリティ強化**: 詳細なプライバシー設定と情報共有制御

4. **Week 13-16**: コミュニティ活動の可視化
   - 地域ブルワリー訪問達成率計算ロジック
   - コミュニティ活動の視覚化コンポーネント
   - ルート完走率とコミュニティ貢献度表示
   - **セキュリティ強化**: 集計データの匿名化

### 4.4 フェーズ3: 体験拡張（4-6ヶ月）
バッジシステムとコミュニティイベント機能を強化します。このフェーズはフェーズ2の後半と一部並行して実施します。

#### 4.4.1 マイルストーン
1. **Week 1-4**: バッジシステム導入
   - バッジデータモデル実装
   - ルート完走バッジ
   - ブルワリー訪問バッジ
   - コミュニティ貢献バッジ
   - **セキュリティ強化**: バッジ付与の不正防止

2. **Week 5-8**: コミュニティ情報共有システム
   - 写真アップロード機能
   - 混雑度情報共有UI
   - リアルタイム更新機能
   - **セキュリティ強化**: 画像処理のセキュリティ対策とメタデータ除去

3. **Week 9-12**: イベント情報タブ
   - イベントモデル実装
   - イベント表示機能
   - イベント検索機能
   - **セキュリティ強化**: イベント参加権限管理

4. **Week 13-16**: ビアホッピング支援機能
   - ルート推薦機能
   - グループでの訪問計画統合
   - 自然な合流機能の改善
   - **セキュリティ強化**: コンテキスト認識プライバシーコントロール

5. **Week 17-20**: コミュニティ投稿機能
   - 簡易投稿フロー実装
   - ルート体験共有機能の最適化
   - コミュニティコメント機能の実装
   - **セキュリティ強化**: コンテンツモデレーション基盤

### 4.5 フェーズ4: 地域拡大（6-12ヶ月）
複数都市への展開基盤とモバイルアプリの開発を行います。このフェーズはフェーズ3の後半と一部並行して実施します。

#### 4.5.1 マイルストーン
1. **Month 1-2**: 複数都市展開基盤
   - 地域データ拡張システム
   - 地域切替インターフェース
   - 複数地域データの最適化
   - **セキュリティ強化**: 地域別データアクセス制御

2. **Month 3-4**: JSONベースのブルワリーデータ管理システム
   - データ更新インターフェース
   - データ検証システム
   - コミュニティ貢献型編集ワークフロー
   - **セキュリティ強化**: データアクセス権限と検証フロー

3. **Month 5-6**: 旅行者モード実装
   - 旅行計画機能
   - 地域ガイド機能
   - オフラインデータアクセス
   - **セキュリティ強化**: 地域データのセキュアな保存

4. **Month 7-8**: モバイルアプリ基盤開発
   - React Native環境構築
   - 共通コンポーネント実装
   - コア機能移植
   - **セキュリティ強化**: モバイル固有のセキュリティ対策実装

5. **Month 9-10**: AI機能初期実装
   - ルート最適化AI試験導入
   - コミュニティマッチングシステム基盤構築
   - 混雑予測システムの初期実装
   - **セキュリティ強化**: AI処理のセキュリティ対策

6. **Month 11-12**: 国際コミュニティ構築
   - 言語サポート拡張
   - 国際的なインターフェース調整
   - 地域間連携機能
   - **セキュリティ強化**: 国際的なデータ保護対応

### 4.6 フェーズ5: AIアシスタント（12-18ヶ月）
AIによる入力支援とパーソナライズ推薦エンジンを実装します。このフェーズはフェーズ4の後半と一部並行して実施します。

#### 4.6.1 マイルストーン
1. **Month 1-3**: AI支援機能の全面導入
   - 自然言語ルート検索
   - コミュニティ活動アシスタント
   - プレゼンス情報自動更新
   - **セキュリティ強化**: AI入力検証と異常検知

2. **Month 4-6**: ルート最適化システムの全面展開
   - ルート推薦精度向上
   - リアルタイム最適化処理
   - 混雑度予測との統合
   - **セキュリティ強化**: 最適化処理の入力検証

3. **Month 7-9**: パーソナライズ推薦エンジン
   - 個人のコミュニティ嗜好モデル
   - コンテキスト考慮のルート提案機能
   - 動的な出会い推薦アルゴリズム
   - **セキュリティ強化**: 推薦アルゴリズムのプライバシー保護

4. **Month 10-12**: 友達グループの共通好み分析
   - グループ嗜好モデル
   - 共通興味発見機能
   - グループ推薦機能
   - **セキュリティ強化**: グループデータの匿名化処理

5. **Month 13-15**: 会話型インターフェース
   - ルート選びのAIアシスタント
   - 質問回答形式でのコミュニティ活動ガイド
   - 初心者向けビアホッピングガイダンス
   - **セキュリティ強化**: 会話データの保護と限定的保存

6. **Month 16-18**: AIシステム統合と最適化
   - 各AIコンポーネントの統合
   - パフォーマンス最適化
   - 学習モデルの定期更新システム
   - **セキュリティ強化**: AI総合セキュリティレビュー

### 4.7 フェーズ間の並行実施とタイムライン調整

各フェーズは部分的に並行して実施し、全体の開発期間を最適化します。特に以下の点に注意して実施します：

1. **全体期間の最適化**: 全体の開発期間を約12-15ヶ月に収めるため、フェーズ間の並行実施を計画
2. **リソース効率化**: 1人での効率的な開発を実現するため、機能ごとの優先順位を明確化
3. **フィードバック反映**: 各フェーズの初期段階でユーザーフィードバックを収集し、後続フェーズの計画に反映
4. **柔軟な調整**: 開発進捗や市場状況に応じて、フェーズ間の優先順位と並行実施計画を柔軟に調整

#### 並行実施計画図

```
月数: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
     |--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
F0:  |==|==|
F1:     |==|==|==|
F2:        |==|==|==|==|
F3:              |==|==|==|==|==|==|
F4:                    |==|==|==|==|==|==|==|==|==|
F5:                             |==|==|==|==|==|==|==|==|==|
```

## 5. セキュリティ方針と対策

### 5.1 セキュリティドキュメント整備

以下のドキュメントを作成し、セキュリティ基盤を強化します：

1. **security-policy.md**
   - 基本方針: セキュリティファーストの設計原則
   - 責任範囲: 開発者・運用者・ユーザーの責任明確化
   - データ保護ポリシー: 個人情報保護方針と技術的対策

2. **security-checklist.md**
   - 開発時チェックリスト
   - デプロイ前チェックリスト
   - 定期的な監査チェックリスト

3. **incident-response.md**
   - インシデント分類と優先度
   - 対応手順と連絡体制
   - 復旧計画と事後分析手順

また、セキュリティレビュー用の専用プロンプトを作成し、開発全体でセキュリティを強化します。

### 5.2 アプリケーションセキュリティ対策

#### 5.2.1 認証・認可システム

- **JWT実装の強化**
  - トークン有効期限: アクセストークン(15分)、リフレッシュトークン(7日)
  - トークンローテーション: リフレッシュトークン使用時に新規発行
  - JWTペイロード最小化: 必要最小限の情報のみ格納

- **パスワード管理**
  - bcryptによるハッシュ化(コスト係数14以上)
  - パスワード強度ポリシー実装(最低8文字、英数字記号混在)
  - アカウントロックアウト(5回連続失敗で10分間ロック)

- **多要素認証** (フェーズ2以降)
  - メール/SMS確認コード

#### 5.2.2 入力検証とサニタイゼーション

- **サーバーサイド検証**
  - Express-validatorによる全APIエンドポイントの入力検証
  - MongoDBインジェクション対策(型チェック実施)
  - NoSQLインジェクション対策($whereオペレータ制限)

- **フロントエンド検証**
  - React-hook-formによるフォーム検証
  - 投稿内容のサニタイゼーション(DOMPurify使用)

#### 5.2.3 APIセキュリティ

- **レート制限**
  - Express-rate-limitによる制限(IP別、認証ユーザー別)
  - 認証エンドポイント: 10req/5min
  - 一般エンドポイント: 100req/min

- **CORS設定**
  - 許可オリジン明示設定
  - クレデンシャル付きリクエスト許可を最小限に

- **セキュリティヘッダー**
  - Helmet.jsによる自動設定
  - CSP(Content-Security-Policy)の適切な設定

### 5.3 インフラセキュリティ対策

#### 5.3.1 サーバーセキュリティ

- **rihobeer.comサーバー強化**
  - UFWファイアウォール設定
    ```bash
    # SSHとWebのみ許可
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw enable
    ```
  
  - SSHセキュリティ
    ```bash
    # /etc/ssh/sshd_configを編集
    PermitRootLogin no
    PasswordAuthentication no
    PubkeyAuthentication yes
    ```

  - 自動更新有効化
    ```bash
    sudo apt install unattended-upgrades
    sudo dpkg-reconfigure unattended-upgrades
    ```

#### 5.3.2 Nginxセキュリティ設定

- **セキュリティヘッダー**
  ```nginx
  # /etc/nginx/sites-available/pinthoに追加
  server {
      # 既存設定...
      
      # セキュリティヘッダー
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Referrer-Policy "strict-origin-when-cross-origin" always;
      add_header Content-Security-Policy "default-src 'self'; script-src 'self'; img-src 'self' data: https://api.mapbox.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.mapbox.com wss://api.pinthop.com;" always;
      
      # SSL設定
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_prefer_server_ciphers on;
      ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
  }
  ```

- **サーバー情報非表示**
  ```nginx
  # /etc/nginx/nginx.confに追加
  server_tokens off;
  ```

#### 5.3.3 証明書と暗号化

- **Let's Encryptの自動更新確認**
  ```bash
  # 証明書の自動更新テスト
  sudo certbot renew --dry-run
  
  # クーロンジョブ確認
  sudo systemctl status certbot.timer
  ```

- **データベース接続の暗号化**
  - MongoDB接続文字列にSSL有効化パラメータ追加
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pinthop?retryWrites=true&w=majority&ssl=true
  ```

### 5.4 データセキュリティ対策

#### 5.4.1 センシティブデータ保護

- **個人情報保護方針**
  - 位置情報: ユーザー同意取得後のみ使用、詳細なトラッキングは保存しない
  - プライバシー設定: デフォルトは制限的に(friends-onlyが初期設定)
  - 位置履歴: 詳細な履歴は30日間のみ保持

- **環境変数と機密情報管理**
  - 開発環境: dotenv使用
  - 本番環境: 環境変数の安全な保存と暗号化
    ```bash
    # 暗号化された環境変数ファイル作成
    sudo apt install gpg
    gpg --symmetric --cipher-algo AES256 .env
    ```

#### 5.4.2 バックアップ戦略

- **自動バックアップ設定**
  ```bash
  # /var/www/pinthop/scripts/backup.shを作成
  #!/bin/bash
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_DIR=/var/backups/pinthop
  mkdir -p $BACKUP_DIR
  
  # 環境変数のバックアップ
  cp /var/www/pinthop/.env $BACKUP_DIR/.env_$TIMESTAMP
  
  # MongoDB Atlasからのバックアップ (月1回のみ、自動バックアップに依存)
  if [ $(date +%d) = "01" ]; then
    mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/db_$TIMESTAMP
  fi
  
  # Netlify設定のバックアップ
  curl -H "Authorization: Bearer $NETLIFY_TOKEN" https://api.netlify.com/api/v1/sites/$SITE_ID > $BACKUP_DIR/netlify_$TIMESTAMP.json
  
  # 30日以上前のバックアップを削除
  find $BACKUP_DIR -type f -mtime +30 -delete
  ```

- **クーロンジョブ設定**
  ```bash
  # 毎日午前3時に実行
  echo "0 3 * * * /var/www/pinthop/scripts/backup.sh >> /var/log/pinthop/backups.log 2>&1" | sudo tee -a /etc/crontab
  ```

### 5.5 セキュリティ強化ロードマップ

各フェーズでのセキュリティ実装を段階的に行います：

#### 5.5.1 フェーズ1までに実装
- 基本的な認証システム
- HTTPS完全実装
- 基本的な入力検証
- エラーログ監視

#### 5.5.2 フェーズ2までに実装
- レート制限
- Helmet.jsによるセキュリティヘッダー
- 自動バックアップシステム
- 基本的な監視システム

#### 5.5.3 フェーズ3までに実装
- 多要素認証オプション
- ユーザー権限管理の強化
- 完全な自動化監視システム
- 定期的な脆弱性スキャン

#### 5.5.4 フェーズ4以降で実装
- 高度なデータ暗号化
- セキュリティインシデント自動検出
- APIゲートウェイの検討
- セキュリティ監査の実施

## 6. データモデル詳細

specification.mdとの整合性を確保するため、主要データモデルを詳細に記述します。

### 6.1 ユーザーモデル
```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ハッシュ化
  name: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  privacySettings: {
    locationSharing: { type: String, enum: ['everyone', 'friends', 'none'], default: 'friends' },
    activitySharing: { type: String, enum: ['everyone', 'friends', 'none'], default: 'friends' },
    profileVisibility: { type: String, enum: ['everyone', 'friends', 'none'], default: 'everyone' }
  },
  lastLocation: {
    breweryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    timestamp: Date,
    sharingEnabled: { type: Boolean, default: true }
  },
  badges: [{
    type: { type: String, enum: ['style', 'brewery', 'region', 'seasonal', 'certification'] },
    name: String,
    description: String,
    iconUrl: String,
    earnedAt: Date,
    progress: Number, // 進捗率（0-100%）
    metadata: Object // バッジ固有のメタデータ
  }],
  preferences: {
    favoriteStyles: [String],
    dislikedStyles: [String],
    flavorPreferences: {
      hoppy: Number, // 1-5のスケール
      malty: Number,
      bitter: Number,
      sweet: Number,
      sour: Number,
      fruity: Number,
      spicy: Number
    },
    notificationSettings: {
      friendActivity: Boolean,
      nearbyFriends: Boolean,
      events: Boolean,
      taplistUpdates: Boolean
    }
  },
  stats: {
    breweriesVisited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' }],
    beersCheckedIn: Number,
    stylesTried: [String],
    totalCheckins: Number,
    regionsCompleted: [{
      regionName: String,
      completionRate: Number,
      completedAt: Date
    }],
    badgesEarned: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.2 ブルワリーモデル
```javascript
const brewerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    formatted: String
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      untappd: String
    }
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
  images: {
    logo: String,
    banner: String,
    interior: [String],
    exterior: [String]
  },
  description: String,
  founded: Number, // 設立年
  ratings: {
    untappd: Number,
    rateBeer: Number,
    beerConnoisseur: Number,
    googleReviews: Number,
    averageRating: Number // 総合平均
  },
  specialtyStyles: [{
    style: String,
    confidence: Number, // 0-1のスコア（得意度）
    basedOn: String // 'ratings'、'awards'、'brewer_info'など
  }],
  flags: {
    isMicrobrewery: Boolean,
    isBrewpub: Boolean,
    hasFood: Boolean,
    familyFriendly: Boolean,
    dogFriendly: Boolean,
    hasOutdoorSeating: Boolean,
    hasTours: Boolean
  },
  awards: [{
    name: String,
    beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
    beerName: String, // ビール名の冗長保存（クエリ最適化）
    competition: String,
    year: Number,
    category: String,
    level: { type: String, enum: ['local', 'regional', 'national', 'international'] },
    medal: { type: String, enum: ['gold', 'silver', 'bronze', 'honorable', 'other'] }
  }],
  taplistHistory: [{
    timestamp: Date,
    beers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: String,
    reliability: Number // 0-1のスコア
  }],
  activeUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkInTime: Date,
    visible: Boolean // プライバシー設定に基づく
  }],
  visitStats: {
    totalVisits: Number,
    uniqueVisitors: Number,
    popularTimes: {
      monday: [Number], // 24時間の時間別人気度（0-100）
      tuesday: [Number],
      wednesday: [Number],
      thursday: [Number],
      friday: [Number],
      saturday: [Number],
      sunday: [Number]
    }
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  region: {
    name: String, // 「Seattle」「Portland」など
    category: String // 「Washington」「Oregon」など
  },
  metadata: {
    isVerified: Boolean,
    lastUpdated: Date,
    dataSource: String,
    attributionRequired: Boolean,
    attributionText: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.3 ビールモデル
```javascript
const beerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery', required: true },
  breweryName: String, // 冗長保存（クエリ最適化）
  style: {
    primary: { type: String, required: true },
    secondary: String,
    bjcpCategory: String,
    bjcpSubcategory: String
  },
  abv: Number, // アルコール度数
  ibu: Number, // 苦味指数
  srm: Number, // 色の指標
  og: Number, // 初期比重
  fg: Number, // 最終比重
  description: String,
  ingredients: {
    malts: [String],
    hops: [{
      name: String,
      useCase: String, // 'bittering', 'aroma', 'dual'
      amount: String
    }],
    yeast: String,
    adjuncts: [String]
  },
  flavorProfile: {
    hoppy: Number, // 1-5のスケール
    malty: Number,
    bitter: Number,
    sweet: Number,
    sour: Number,
    fruity: Number,
    spicy: Number
  },
  packaging: [{
    type: { type: String, enum: ['draft', 'bottle', 'can', 'crowler', 'growler'] },
    size: String,
    available: Boolean
  }],
  images: {
    primary: String,
    label: String,
    pour: [String]
  },
  ratings: {
    untappd: Number,
    rateBeer: Number,
    beerConnoisseur: Number,
    averageRating: Number, // プラットフォーム内平均評価
    totalRatings: Number
  },
  awards: [{
    name: String,
    competition: String,
    year: Number,
    category: String,
    level: { type: String, enum: ['local', 'regional', 'national', 'international'] },
    medal: { type: String, enum: ['gold', 'silver', 'bronze', 'honorable', 'other'] }
  }],
  seasonal: {
    isLimited: Boolean,
    seasonalType: { type: String, enum: ['spring', 'summer', 'fall', 'winter', 'limited', 'year-round'] },
    availableFrom: Date,
    availableTo: Date
  },
  foodPairings: [String],
  availability: {
    isPermanent: Boolean,
    currentlyAvailable: Boolean,
    lastSeen: Date,
    confidence: Number // 0-1のスコア（現在提供中の確信度）
  },
  metadata: {
    isVerified: Boolean,
    lastUpdated: Date,
    dataSource: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.4 タップリストモデル
```javascript
const taplistSchema = new mongoose.Schema({
  brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery', required: true },
  breweryName: String, // 冗長保存（クエリ最適化）
  beers: [{
    beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
    beerName: String, // ビール名
    tapNumber: Number,
    notes: String, // 「新登場」「残りわずか」などの注記
    price: {
      amount: Number,
      currency: String,
      size: String // ピント、ハーフなど
    }
  }],
  timestamp: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photo: {
    url: String,
    ocrProcessed: Boolean,
    processedText: String
  },
  verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reliabilityScore: Number, // 0-1のスコア
  isActive: { type: Boolean, default: true },
  expirationDate: Date, // 自動的な「鮮度切れ」日時
  metadata: {
    deviceInfo: String,
    geoLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    ipAddress: String // ハッシュ化
  }
});
```

### 6.5 ビール体験モデル
```javascript
const beerExperienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
  beerName: String, // ビール名（未知のビールの場合もあり）
  brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
  breweryName: String,
  timestamp: { type: Date, default: Date.now },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    name: String,
    address: String
  },
  rating: {
    overall: Number, // 1-5のスケール
    components: {
      appearance: Number,
      aroma: Number,
      flavor: Number,
      mouthfeel: Number,
      overall: Number
    }
  },
  comment: String,
  photos: [{
    url: String,
    caption: String,
    timestamp: Date
  }],
  flavorProfile: {
    hoppy: Number, // 1-5のスケール
    malty: Number,
    bitter: Number,
    sweet: Number,
    sour: Number,
    fruity: Number,
    spicy: Number
  },
  tags: [String], // 「お気に入り」「もう一度飲みたい」などのユーザータグ
  visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'friends' },
  serving: { type: String, enum: ['draft', 'bottle', 'can', 'cask', 'other'] },
  checkin: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkin' },
  metadata: {
    deviceInfo: String,
    appVersion: String
  }
});
```

### 6.6 チェックインモデル
```javascript
const checkinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery', required: true },
  breweryName: String, // 冗長保存（クエリ最適化）
  timestamp: { type: Date, default: Date.now },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  status: { type: String, enum: ['active', 'departed', 'expired'] },
  plannedDuration: Number, // 分単位の予定滞在時間
  actualDuration: Number, // 分単位の実際の滞在時間
  visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'friends' },
  beerExperiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BeerExperience' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 一緒にいる友達
  photos: [{
    url: String,
    caption: String,
    timestamp: Date
  }],
  comment: String,
  mood: String,
  contextTags: [String], // 「休日」「誕生日」「アフターワーク」などのコンテキストタグ
  metadata: {
    deviceInfo: String,
    appVersion: String,
    deviceBattery: Number // チェックイン時のバッテリーレベル（位置情報共有の判断に使用）
  }
});
```

### 6.7 イベントモデル
```javascript
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
  breweryName: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      formatted: String
    }
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizerName: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeZone: String,
  recurrence: {
    type: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'] },
    interval: Number,
    endDate: Date
  },
  category: { type: String, enum: ['tasting', 'release', 'festival', 'class', 'meeting', 'competition', 'other'] },
  images: {
    banner: String,
    gallery: [String]
  },
  featuredBeers: [{
    beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
    beerName: String,
    description: String
  }],
  ticketInfo: {
    required: Boolean,
    price: Number,
    currency: String,
    purchaseUrl: String
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['attending', 'interested', 'declined'] },
    responseTime: Date
  }],
  visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
  tags: [String],
  metadata: {
    source: String,
    externalId: String,
    lastUpdated: Date,
    verified: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.8 バッジモデル
```javascript
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['style', 'brewery', 'region', 'seasonal', 'certification', 'achievement'] },
  category: String, // カテゴリ分類
  iconUrl: { type: String, required: true },
  criteria: {
    type: { type: String, enum: ['count', 'percentage', 'specific', 'custom'] },
    targetValue: Number, // 達成に必要な値
    comparisonOperator: { type: String, enum: ['equal', 'greater_than', 'less_than', 'in_list'] },
    dataPoint: String, // 何をカウントするか（例：'styles_tried', 'breweries_visited'）
    specificValues: [String], // 特定の値リスト（例：特定のスタイルなど）
    region: String, // 地域固有のバッジの場合
    customLogic: String // 複雑な条件のための説明
  },
  tiers: [{
    name: String,
    targetValue: Number,
    iconUrl: String
  }],
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'very_rare', 'legendary'] },
  seasonalAvailability: {
    isLimited: Boolean,
    startDate: Date,
    endDate: Date
  },
  revealCondition: { type: String, enum: ['visible', 'hidden', 'progress_visible'] },
  relatedBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 6.9 通知モデル
```javascript
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: [
    'friend_request', 'friend_accepted', 'nearby_friend', 
    'checkin', 'taplist_update', 'event_reminder', 
    'badge_earned', 'comment', 'mention', 'system'
  ]},
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  data: {
    title: String,
    body: String,
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sourceUserName: String,
    brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
    breweryName: String,
    beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
    beerName: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventName: String,
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    badgeName: String,
    link: String,
    image: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    distance: Number, // メートル単位の距離（近くの友達通知など）
    additionalData: Object
  },
  deliveryStatus: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  pushSent: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  inAppSent: { type: Boolean, default: true }
});
```

### 6.10 地域モデル
```javascript
const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  state: String,
  type: { type: String, enum: ['city', 'metro', 'county', 'state', 'province', 'country'] },
  boundaries: {
    type: { type: String, default: 'Polygon' },
    coordinates: [[[Number]]] // GeoJSON Polygon
  },
  center: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  breweries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' }],
  breweryCount: Number,
  popularStyles: [{
    style: String,
    count: Number,
    rating: Number
  }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  image: {
    banner: String,
    thumbnail: String
  },
  description: String,
  statistics: {
    averageRating: Number,
    topRatedBrewery: {
      brewery: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
      breweryName: String,
      rating: Number
    },
    topRatedBeer: {
      beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
      beerName: String,
      rating: Number
    },
    userVisits: Number,
    userUnique: Number
  },
  metadata: {
    active: Boolean,
    priority: Number, // 表示優先順位
    lastUpdated: Date,
    dataSource: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 7. 1人運用のための自動化と監視

### 7.1 自動化システム

#### 7.1.1 デプロイ自動化

- **GitHubアクションによるCI/CD**
  ```yaml
  # .github/workflows/deploy.yml 例
  name: Deploy Application
  
  on:
    push:
      branches:
        - main
  
  jobs:
    deploy-frontend:
      runs-on: ubuntu-latest
      steps:
        # Netlifyへのデプロイ手順
    
    deploy-backend:
      runs-on: ubuntu-latest
      steps:
        # SSH経由でバックエンドデプロイ
        - name: Deploy to backend
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.SSH_HOST }}
            username: ${{ secrets.SSH_USERNAME }}
            key: ${{ secrets.SSH_PRIVATE_KEY }}
            script: |
              cd /var/www/pinthop
              git pull
              npm ci
              pm2 restart pinthop-api
  ```

- **バックエンドデプロイスクリプト**
  ```bash
  # /var/www/pinthop/scripts/deploy.shを作成
  #!/bin/bash
  cd /var/www/pinthop
  git pull
  npm ci
  pm2 restart pinthop-api
  
  # Webhookで呼び出し可能に(GitHub Actionsから呼び出し)
  ```

#### 7.1.2 依存関係自動更新

- **Renovatebotの設定**
  ```json
  // renovate.json
  {
    "extends": [
      "config:base"
    ],
    "packageRules": [
      {
        "updateTypes": ["minor", "patch"],
        "automerge": true
      }
    ],
    "vulnerabilityAlerts": {
      "enabled": true,
      "labels": ["security"]
    }
  }
  ```

### 7.2 監視システム

#### 7.2.1 ログ監視

- **ログローテーション設定**
  ```bash
  # /etc/logrotate.d/pinthopapiを作成
  /var/log/pinthop/*.log {
      daily
      missingok
      rotate 14
      compress
      delaycompress
      notifempty
      create 0640 www-data adm
  }
  ```

- **エラーログアラート設定**
  ```bash
  # /var/www/pinthop/scripts/log-alert.shを作成
  #!/bin/bash
  ERRORS=$(grep -i "error\|exception\|fail" /var/log/pinthop/api.log | tail -100)
  if [ ! -z "$ERRORS" ]; then
    echo "$ERRORS" | mail -s "PintHop API Error Alert" your-email@example.com
  fi
  
  # 1時間ごとに実行
  echo "0 * * * * /var/www/pinthop/scripts/log-alert.sh" | sudo tee -a /etc/crontab
  ```

#### 7.2.2 アップタイム監視

- **UptimeRobotの無料プランを利用**
  - API・フロントエンドの定期的なヘルスチェック
  - ダウン時のメール通知設定

- **ヘルスチェックエンドポイント**
  ```javascript
  // バックエンドに実装
  router.get('/health', async (req, res) => {
    try {
      // データベース接続確認
      await mongoose.connection.db.admin().ping();
      
      res.status(200).json({
        status: 'UP',
        time: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'DOWN',
        error: error.message,
        time: new Date().toISOString()
      });
    }
  });
  ```

### 7.3 更新とメンテナンス

- **定期的なメンテナンス自動化**
  ```bash
  # /var/www/pinthop/scripts/maintenance.shを作成
  #!/bin/bash
  
  # システム更新
  sudo apt update && sudo apt upgrade -y
  
  # Npm依存関係の脆弱性チェック
  cd /var/www/pinthop
  npm audit
  
  # 使われていないパッケージのクリーンアップ
  sudo apt autoremove -y
  
  # MongoDB古いログのクリーンアップ
  find /var/log/mongodb -type f -name "*.log.*" -mtime +30 -delete
  
  # Nginxアクセスログ集計（アクセス解析）
  YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
  grep "$YESTERDAY" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -nr | head -20 > /var/log/pinthop/popular_endpoints_$YESTERDAY.log
  
  echo "Maintenance completed on $(date)" >> /var/log/pinthop/maintenance.log
  ```

- **週1回のメンテナンスを設定**
  ```bash
  echo "0 2 * * 0 /var/www/pinthop/scripts/maintenance.sh >> /var/log/pinthop/maintenance.log 2>&1" | sudo tee -a /etc/crontab
  ```

## 8. セットアップとデプロイ計画

詳細はsetup-guide.mdとdeployment-document.mdを参照してください。フェーズ0の開発環境構築については、Document/jp/Setup/Phase0.mdに詳細な手順が記載されています。

## 9. リスク管理

各フェーズごとのリスクと軽減策については、phase0-implementation-plan.mdなど各フェーズの実装計画書に詳細に記載されています。

## 10. AI支援開発アプローチ

将来的なAI支援開発については、specification.mdの「2. AI自動化計画」セクションを参照してください。

## 11. 次のステップ

1. フェーズ0（マイクロMVP）の開始（詳細はphase0-implementation-plan.mdを参照）
   - 基本インフラの整備（Document/jp/Setup/Phase0.mdに手順を記載）
   - シアトル限定ブルワリーマップ基盤の構築
   - リアルタイム存在共有の基本機能実装
   - 初期テストとフィードバック収集

2. セキュリティ基盤の整備
   - セキュリティチェックリストの作成
   - インシデント対応計画の作成
   - セキュリティレビュープロンプトの作成

3. 開発環境の準備
   - 必要ツールのインストール
   - 開発用サーバーの設定
   - セキュアな環境変数管理の設定

4. 初期リポジトリの作成
   - 基本ディレクトリ構造の設定
   - 初期セキュリティ対策の実装
   - 初期コミット準備

5. 自動化スクリプトの準備
   - バックアップスクリプトの作成
   - デプロイスクリプトの作成
   - 監視スクリプトの作成
