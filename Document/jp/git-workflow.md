---
# ドキュメント情報
プロジェクト: PintHop
ファイル名: git-workflow.md
ファイルパス: Document/jp/git-workflow.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成

# 説明
PintHopアプリケーションの開発におけるGitワークフロー規約を定義するドキュメント。ブランチ命名規則、コミットメッセージ形式、プルリクエスト手順、およびコードレビュープロセスについて詳細に説明します。
---

# PintHop Gitワークフロー規約

## 1. 概要

本文書はPintHopアプリケーションの開発におけるGitワークフロー規約を定義するものです。このワークフローは1人開発を効率的に進めながらも、将来的な拡張性や協業を考慮した設計になっています。PintHopでは、セキュリティを重視したクラフトビール体験向上プラットフォームの構築を目指しており、コード品質とセキュリティの確保にGitワークフローが重要な役割を果たします。

## 2. ブランチ戦略

### 2.1 ブランチモデル

PintHopプロジェクトでは、簡略化されたGitHub Flowをベースとしたブランチモデルを採用します。

- **main**: 本番環境にデプロイ可能な、安定したコードを含むブランチ
- **develop**: 開発中の機能が統合されるブランチ（オプション、複数人開発時に導入）
- **feature/bugfix/refactor ブランチ**: 機能開発やバグ修正のための作業ブランチ

### 2.2 ブランチ命名規則

作業ブランチは以下の命名規則に従います：

- `feature/機能名`: 新機能開発用ブランチ（例: `feature/user-authentication`）
- `bugfix/バグ名`: バグ修正用ブランチ（例: `bugfix/login-error`）
- `hotfix/問題名`: 緊急の修正用ブランチ（例: `hotfix/security-vulnerability`）
- `refactor/内容`: リファクタリング用ブランチ（例: `refactor/api-structure`）
- `docs/内容`: ドキュメント更新用ブランチ（例: `docs/api-documentation`）

命名における注意点：
- 小文字とハイフン（-）を使用（アンダースコアは使用しない）
- 簡潔かつ内容が分かるようにする
- 日本語より英語の使用を推奨

## 3. コミット規約

### 3.1 コミットメッセージ形式

コミットメッセージは以下の形式に従います：

```
[type]: 変更内容の簡潔な説明 (関連チケット番号)

変更の詳細な説明（必要な場合）
```

#### typeの種類:
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更のみ
- `style`: コードの意味に影響を与えない変更（スペース、フォーマット等）
- `refactor`: バグ修正や機能追加を含まないコードの変更
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更、依存関係の更新等

例：
```
feat: ユーザー認証機能の実装 (#123)

- JWT認証の実装
- パスワードのハッシュ化処理の追加
- ログイン/ログアウトAPIエンドポイントの作成
```

### 3.2 コミットの粒度

- 1つの論理的な変更につき1つのコミット
- 大きな機能は複数の小さなコミットに分割
- 作業中のコミットはローカルのみに留め、リモートにプッシュする前に整理

### 3.3 コミット前のチェックリスト

コミット前に以下を確認：
- コードスタイルが規約に準拠しているか
- テストが正常に動作するか
- セキュリティの問題がないか
- 不要なファイル（ログ、一時ファイル等）が含まれていないか
- 機密情報（APIキー、パスワード等）が含まれていないか

## 4. プルリクエストプロセス

### 4.1 プルリクエスト作成

1. 作業ブランチで開発を完了
2. main（または開発チーム導入時はdevelop）ブランチの最新の変更を取り込む
   ```bash
   git checkout feature/your-feature
   git pull origin main
   git rebase main  # または git merge main
   ```
3. コンフリクトがあれば解決
4. テストが正常に動作することを確認
5. GitHub上でプルリクエストを作成

### 4.2 プルリクエスト記述

プルリクエストには以下の情報を含めます：

```
## 概要
どのような変更を行ったか、簡潔に説明

## 変更内容
- 具体的な変更点をリスト形式で
- 特に重要な変更は詳細に

## 関連課題
関連するIssue番号や課題へのリンク

## スクリーンショット（UIの変更がある場合）
変更前と変更後の画面キャプチャ

## テスト
テスト済みの内容や確認方法

## チェックリスト
- [ ] コーディング規約に準拠している
- [ ] 新しいテストが追加されている
- [ ] すべてのテストが成功している
- [ ] セキュリティ上の問題がない
- [ ] ドキュメントが更新されている（必要な場合）
```

### 4.3 セルフレビュー

1人開発の場合でも、プルリクエスト前にセルフレビューを実施：
- コードの品質チェック
- 不要なコメントやデバッグコードの削除
- 命名の一貫性確認
- セキュリティチェック
- エラーハンドリングの確認

### 4.4 複数人開発時のコードレビュー

複数人開発に移行した場合：
- 少なくとも1人のレビュアーを指定
- レビューコメントに対応または議論
- 修正後に再レビュー依頼
- すべてのレビューコメントが解決されてからマージ

## 5. マージ戦略

### 5.1 マージ方法

以下のマージオプションを状況に応じて使用：

1. **マージコミット**（デフォルト）
   - 履歴を残したい場合
   - `git merge --no-ff feature/branch`

2. **スカッシュマージ**
   - 関連コミットを1つにまとめたい場合（履歴を整理）
   - GitHubの「Squash and merge」オプション

3. **リベース**
   - クリーンな履歴を維持したい場合
   - `git rebase main`の後に`git merge --ff-only`

### 5.2 マージ前の確認事項

- CI/CD検証が成功していること
- コードレビューが完了していること
- すべてのテストが成功していること
- コーディング規約に準拠していること
- コンフリクトが解決されていること

### 5.3 マージ後の作業

- マージされた作業ブランチは削除（`git branch -d feature/branch`）
- 必要に応じてデプロイを実行
- 関連するIssueをクローズ

## 6. リリース管理

### 6.1 バージョニング

セマンティックバージョニング（SemVer）を採用：

- **メジャーバージョン (X.0.0)**: 後方互換性のない変更
- **マイナーバージョン (0.X.0)**: 後方互換性のある機能追加
- **パッチバージョン (0.0.X)**: 後方互換性のあるバグ修正

### 6.2 リリースタグ

リリース時にGitタグを作成：

```bash
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

### 6.3 リリースノート

各リリースにはリリースノートを作成し、以下の情報を含める：

- バージョン番号と日付
- 新機能一覧
- バグ修正一覧
- 非互換性のある変更
- 依存関係の更新
- 既知の問題

## 7. CI/CD 連携

### 7.1 GitHub Actions

PintHopではGitHub Actionsを利用して以下の自動化を行います：

```yaml
# .github/workflows/ci.yml の例
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Security scan
        run: npm audit
```

### 7.2 デプロイ自動化

mainブランチへのマージ後、自動デプロイを設定：

```yaml
# .github/workflows/deploy.yml の例
name: Deploy

on:
  push:
    branches: [ main ]

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

## 8. トラブルシューティング

### 8.1 コンフリクト解決

コンフリクト発生時の基本的な解決手順：

1. コンフリクトのあるファイルを確認 `git status`
2. 各ファイルを開いて競合マーカー（`<<<<<<<`, `=======`, `>>>>>>>`)を探し、適切に編集
3. 編集後、変更をステージング `git add <ファイル名>`
4. コンフリクト解決後、継続操作（rebaseの場合は `git rebase --continue`、mergeの場合は `git merge --continue`）

### 8.2 リセットとリバート

誤ったコミットを処理する方法：

- 直前のコミットを修正： `git commit --amend`
- 複数のコミットを整理： `git rebase -i HEAD~3`（直近3コミットを対象）
- コミットを打ち消す（履歴を残す）： `git revert <コミットハッシュ>`
- ローカルの変更をリセット： `git reset --hard origin/main`

### 8.3 スタッシュの活用

作業の一時保存：

- 変更を一時保存： `git stash`
- 保存した変更を適用： `git stash pop`
- 保存一覧を表示： `git stash list`
- 特定の保存を適用： `git stash apply stash@{2}`

## 9. 1人開発の特別考慮事項

### 9.1 効率的なワークフロー

1人開発の場合、以下の簡略化されたワークフローも検討可能：

1. 機能ブランチを作成して開発
2. 適切に小さな単位でコミット
3. 機能完成後、セルフレビュー実施
4. mainブランチにマージ
5. 定期的なバックアップタグ作成 `git tag backup/YYYY-MM-DD`

### 9.2 品質維持のための自己規律

1人開発でも品質を維持するための習慣：

- 定期的なセルフコードレビュー
- コミット前のテスト実行
- セキュリティチェックリストの活用
- ドキュメントの継続的更新
- 将来のチーム開発を想定したコード解説コメント

### 9.3 文書化と記録の重視

1人開発では特に以下の文書化を重視：

- コミットメッセージの詳細化
- プルリクエスト説明の充実（セルフドキュメント）
- 設計決定の理由を記録
- 問題点や課題をIssueとして記録
- 進捗と次のステップを定期的に文書化

## 10. セキュリティ関連の考慮事項

### 10.1 セキュリティに関するブランチ戦略

セキュリティ修正に関するブランチ戦略：

- セキュリティ脆弱性の修正は `hotfix/security-*` ブランチで対応
- セキュリティ関連のコミットメッセージは具体的な脆弱性の詳細を記載しない
- 修正完了後、即座にmainブランチにマージ
- セキュリティパッチリリース後にのみ詳細を公開

### 10.2.機密情報の管理

機密情報の取り扱い：

- `.gitignore` に機密ファイルを追加
- 環境変数ファイル（`.env`）は決してバージョン管理しない
- `.env.example` に必要な変数名のみ含めたテンプレートを用意
- 誤ってコミットした機密情報は [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) を使って履歴から完全に削除

### 10.3 セキュリティ関連のコミットフック

pre-commitフックの活用：

```bash
#!/bin/sh
# .git/hooks/pre-commit

# APIキーや機密情報のチェック
if git diff --cached | grep -E '(API_KEY|SECRET|PASSWORD|TOKEN)'; then
  echo "警告: コミット内に機密情報が含まれている可能性があります"
  exit 1
fi

# セキュリティスキャン
npm audit
if [ $? -ne 0 ]; then
  echo "警告: npmパッケージに脆弱性が見つかりました"
  exit 1
fi

exit 0
```

## 11. GitHubリポジトリ設定

### 11.1 ブランチ保護ルール

mainブランチに対する保護ルール：

- 直接プッシュの禁止
- プルリクエスト必須
- ステータスチェック（CI/CDテスト）の成功要求
- 複数人開発の場合、レビュー承認必須

### 11.2 Issue・プルリクエストテンプレート

Issueテンプレート（`.github/ISSUE_TEMPLATE/bug-report.md`）：
```markdown
---
name: バグ報告
about: アプリケーションの問題を報告
---

## バグの説明
どのような問題が発生しているか明確に記述してください。

## 再現手順
1. '...' に移動
2. '....' をクリック
3. '....' までスクロール
4. エラーを確認

## 期待される動作
本来どのような動作になるべきか

## スクリーンショット
可能であれば、問題を説明するためのスクリーンショットを追加してください。

## 環境情報
- デバイス: [例: iPhone 13]
- OS: [例: iOS 15.4]
- ブラウザ: [例: Safari 15.4]
- アプリバージョン: [例: 1.0.0]
```

プルリクエストテンプレート（`.github/pull_request_template.md`）：
```markdown
## 概要
この変更の目的と内容を簡潔に説明してください。

## 変更内容
- 具体的な変更点をリスト形式で
- 特に重要な変更は詳細に

## 関連課題
関連するIssue番号や課題へのリンク

## スクリーンショット（UIの変更がある場合）
変更前と変更後の画面キャプチャ

## テスト
テスト済みの内容や確認方法

## チェックリスト
- [ ] コーディング規約に準拠している
- [ ] 新しいテストが追加されている
- [ ] すべてのテストが成功している
- [ ] セキュリティ上の問題がない
- [ ] ドキュメントが更新されている（必要な場合）
```

### 11.3 GitHub Actions自動化

ワークフロー設定（`.github/workflows/dependency-updates.yml`）：
```yaml
name: 依存関係の自動更新

on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日に実行
  workflow_dispatch:  # 手動実行も可能

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Update dependencies
        run: |
          npm update
          npm audit fix
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: '依存関係の自動更新'
          title: '依存関係の自動更新'
          body: |
            このPRは依存関係を自動的に更新します。
            
            更新内容:
            - npm依存関係の更新
            - セキュリティ脆弱性の修正
          branch: automation/dependency-updates
          base: main
```

## 12. まとめ

このGitワークフロー規約は、PintHopプロジェクトの開発全体を通して一貫した手法で作業を進めるためのガイドラインです。1人開発から始まり、将来的なチーム拡張にも対応できるよう設計されています。プロジェクトの進行に合わせて、このワークフロー自体も継続的に改善していきます。

最も重要なのは、コードの品質とセキュリティを確保しながら、効率的な開発を進めることです。本規約はガイドラインであり、状況に応じて柔軟に適用することが推奨されます。

---

最終更新日: 2025-04-19
