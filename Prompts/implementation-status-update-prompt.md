----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: implementation-status-update-prompt.md
ファイルパス: Prompts/implementation-status-update-prompt.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成
- 2025-04-20 Koki Riho アーティファクト出力指示の追加
- 2025-04-21 Koki Riho 既存リソース確認プロセスの追加と重複作業防止の強化
- 2025-04-21 AI Assistant GitHubディレクトリ構造に基づく成果物管理の追加
- 2025-04-27 Koki Riho ディレクトリ構造の完全記載指示の追加

# 説明
PintHopプロジェクトの実装状況を更新し、他の開発者やAIに引き継ぐためのプロンプトです。既存リソースの確認と重複作業の防止を重視し、更新した内容はアーティファクトとして出力します。また、GitHubディレクトリ構造に基づいた成果物管理を行います。
----

# PintHop 実装状況更新プロンプト (GitHubディレクトリ構造反映版)

あなたはPintHopプロジェクトの開発者です。実装状況を更新し、他の開発者やAIに適切に引き継ぐために、既存の`implementation-status.md`ファイルを更新してください。**更新した内容はアーティファクトとして出力してください。**

## 既存リソース確認の重要性

PintHopプロジェクトでは、作業の重複を避け、一貫性を保つために、新しいドキュメントやコードを作成する前に必ず既存のリソースを確認することが重要です。`implementation-status.md`はプロジェクト全体の成果物を追跡する中心的なドキュメントであり、常に最新の情報を反映させる必要があります。

## 更新手順

1. 現在の実装状況ドキュメント (`Document/jp/implementation-status.md`) の内容を確認する
2. **新たなドキュメントやコードを作成する前に、既存の類似成果物の有無を確認する**
3. **既存のドキュメントやコードを活用できる場合は、新規作成ではなく更新・拡張を優先する**
4. 最新の作業内容に基づいて更新を行う
5. 以下のテンプレートに従って情報を整理する
6. 更新日と更新内容を更新履歴に記録する
7. **成果物一覧をGitHubディレクトリ構造に基づいて整理する（一切省略せずに列挙）**
8. **更新した内容をアーティファクトとして出力する**

## 既存リソースの確認方法

1. **ドキュメント一覧の確認**:
   - `implementation-status.md` の「成果物一覧」セクションで既存のドキュメントを確認
   - `Document/jp/` ディレクトリ内のファイルを調査

2. **プロンプト一覧の確認**:
   - `Prompts/` ディレクトリ内のファイルを調査

3. **コードベースの確認**:
   - `frontend/src/` と `backend/src/` ディレクトリを調査
   - 類似機能やコンポーネントの実装有無を確認

4. **設定ファイルの確認**:
   - `config/` ディレクトリ内のファイルを調査

5. **キーワード検索**:
   ```bash
   # ドキュメント内の検索
   grep -r "検索キーワード" Document/jp/
   
   # プロンプト内の検索
   grep -r "検索キーワード" Prompts/
   
   # ソースコード内の検索
   grep -r "検索キーワード" frontend/src/ backend/src/
   
   # 設定ファイル内の検索
   grep -r "検索キーワード" config/
   ```

## テンプレート

以下のテンプレートに従って実装状況を更新してください：

```markdown
----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: implementation-status.md
ファイルパス: Document/jp/implementation-status.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-19

# 更新履歴
- 2025-04-19 Koki Riho 初版作成
- 2025-04-19 Koki Riho ドキュメントヘッダー追加
- 2025-04-19 Koki Riho フェーズ0の進捗更新
- [本日の日付] [あなたの名前] [更新内容の簡潔な説明]

# 説明
PintHopアプリケーションの現在の実装状況を追跡するドキュメント。実装フェーズ、完了した作業、進行中の作業、および次のステップについて概要を説明します。
----

# PintHop 実装状況

## 現在の実装フェーズ
[現在のフェーズを記載（例: フェーズ0: ドキュメント・プロンプト整備）]

## 完了した作業
- [これまでに完了した主要な作業項目をリスト形式で記載]
- [新たに完了した作業を追加]

## 現在取り組んでいる作業
- [現在進行中の作業項目をリスト形式で記載]
- [優先度順に並べることを推奨]

## 次のステップ
1. [次に予定している作業ステップを番号付きリストで記載]
2. [短期的なタスクから中期的なタスクへの順序で記載]

## 実装進捗の詳細
### [現在のフェーズ]: [フェーズ名]
- **スプリント [ID]**: [スプリント名] ([状態: 完了/進行中/予定])
  - タスク完了率: [進捗率]%
  - 成果物: [完了した成果物のリスト]
  - 作業中: [進行中の作業項目]

### 次期フェーズの準備状況
[次期フェーズへの移行準備状況を記載]

## 成果物一覧（GitHubリポジトリ構造）

### ドキュメント
#### Document/jp/
- [Document/jp/ディレクトリ内のドキュメントファイルを一覧表示]
- [最近追加・更新されたドキュメントを強調]

### プロンプト
#### Prompts/
- [Prompts/ディレクトリ内のプロンプトファイルを一覧表示]
- [最近追加・更新されたプロンプトを強調]

### ソースコード成果物
#### frontend/src/
- [frontend/src/ディレクトリ内の主要なソースコードファイル/ディレクトリを一覧表示]
- [最近追加・更新されたソースコードを強調]

#### backend/src/
- [backend/src/ディレクトリ内の主要なソースコードファイル/ディレクトリを一覧表示]
- [最近追加・更新されたソースコードを強調]

### 設定ファイル
#### config/
- [config/ディレクトリ内の設定ファイルを一覧表示]
- [最近追加・更新された設定ファイルを強調]

## 懸案事項とリスク
- [現在認識されている懸案事項やリスクを箇条書きで記載]
- [対応策がある場合は簡潔に追記]

## 使用予定の技術スタック
- **フロントエンド**: [使用技術バージョンを含めて記載]
- **バックエンド**: [使用技術バージョンを含めて記載]
- **データベース**: [使用技術バージョンを含めて記載]
- [その他の技術スタック]

## 実装の概要と特記事項
[プロジェクトの概要と、実装において特に留意すべき事項を記載]

## タイムライン
- **フェーズ0**: [期間] - [状態]
- **フェーズ1**: [期間] - [状態]
- **フェーズ2**: [期間] - [状態]
- [以降のフェーズ]
```

## 更新内容の反映方法

以下の情報を明確に反映してください：

1. **作業の進捗状況**:
   - 完了したタスクを「完了した作業」セクションに移動
   - 新たに開始したタスクを「現在取り組んでいる作業」に追加
   - タスク完了率の更新

2. **フェーズやスプリントの状態更新**:
   - 完了したスプリントの状態を「完了」に変更
   - 新たに開始したスプリントの情報を追加
   - フェーズの移行があった場合は「現在の実装フェーズ」を更新

3. **新たな懸案事項やリスク**:
   - 新たに発見された懸案事項やリスクを追加
   - 解決された懸案事項は削除または解決済みとして記載

4. **タイムラインの調整**:
   - 実際の進捗に合わせてタイムラインを調整
   - 遅延または前倒しが発生した場合はその理由を簡潔に記載

5. **成果物一覧の更新**:
   - 新たに作成または更新したドキュメントを一覧に追加
   - 新たに作成または更新したプロンプトを一覧に追加
   - 新たに作成または更新したソースコードを一覧に追加
   - 新たに作成または更新した設定ファイルを一覧に追加
   - 各ファイルを適切なGitHubディレクトリ構造に配置
   - 最近の変更が一目でわかるようにする

## GitHubディレクトリ構造の管理

プロジェクトは以下のようなディレクトリ構造で整理します（例）：

```
PintHop/
├── Document/
│   └── jp/
│       ├── implementation-plan.md
│       ├── project-structure.md
│       └── （その他ファイルを一切省略せずに列挙）
├── Prompts/
│   ├── implementation-start.md
│   ├── code-review.md
│   └── （その他ファイルを一切省略せずに列挙）
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── （その他ディレクトリ/ファイルを一切省略せずに列挙）
├── backend/
│   └── src/
│       ├── routes/
│       ├── models/
│       └── （その他ディレクトリ/ファイルを一切省略せずに列挙）
└── config/
    ├── ci-cd-configuration.yml
    ├── code-quality.json
    └── （その他ファイルを一切省略せずに列挙）
```

**重要な指示**:
- ディレクトリ構造を記載する際は、**一切省略せずに全てのファイルを完全に記載**してください。
- `...` などの省略記号を使用せず、実在する全てのファイルを明示的に記載してください。
- 新しいファイルを追加する際は、適切なディレクトリに配置し、`implementation-status.md`の「成果物一覧」セクションのディレクトリ構造にも**省略せずに追加**してください。
- ディレクトリが空の場合は空であることを明示してください。
- 各ディレクトリ内のファイルは必ず全て列挙してください。

例えば、以下のように完全な構造を記載します：

```
frontend/
└── src/
    ├── components/
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── SignupForm.tsx
    │   │   └── PasswordResetForm.tsx
    │   ├── beer/
    │   │   ├── BeerCard.tsx
    │   │   ├── BeerList.tsx
    │   │   └── BeerSearch.tsx
    │   └── common/
    │       ├── Header.tsx
    │       ├── Footer.tsx
    │       └── Navigation.tsx
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── LoginPage.tsx
    │   └── SignupPage.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useBeer.ts
    └── utils/
        ├── api.ts
        └── validators.ts
```

## 引き継ぎ情報の充実

他の開発者やAIが作業を引き継ぐために特に重要な情報を含めてください：

1. **最近の決定事項**:
   - 設計や実装における重要な決定事項
   - 変更された要件や優先順位

2. **ドキュメントについて**:
   - 関連する他のドキュメントへの参照
   - 詳細な設計情報や決定事項が記録されている場所
   - 更新すべきドキュメント情報

3. **環境情報**:
   - 開発環境やツールの変更点
   - アクセス方法や認証情報の管理場所

4. **注意点と課題**:
   - 実装時に特に注意すべき技術的な課題
   - 未解決の問題や検討中の項目

## 具体的な更新例

```markdown
## 完了した作業
- 実装計画書の分析と詳細化完了
- プロジェクト構造定義書の作成完了
- データベーススキーマ定義書の作成完了
- API仕様書の作成完了
- セキュリティポリシードキュメントの作成完了
- セットアップ手順書の作成完了
- UI/UXフロー設計書の作成完了
- テスト計画書の作成完了
- スプリント計画書の作成完了
- Gitワークフロー規約の作成完了
- インシデント対応計画の作成完了  <- 新しく完了した作業

## 現在取り組んでいる作業
- プロンプト整備（実装開始/引き継ぎプロンプト、セキュリティレビュープロンプト、整合性確認プロンプト）
- デプロイメント手順書の作成
- リポジトリ初期設定の準備
- セキュリティチェックリストの作成  <- 新しく追加された作業

## 成果物一覧（GitHubリポジトリ構造）
### ドキュメント
#### Document/jp/
1. implementation-plan.md: 実装計画書
2. project-structure.md: プロジェクト構造定義書
3. database-schema.md: データベーススキーマ定義書
4. api-document.md: API仕様書
5. setup-guide.md: セットアップ手順書 ← 最近更新
6. security-policy.md: セキュリティポリシードキュメント

### プロンプト
#### Prompts/
1. debugging.md: バグ修正・デバッグ支援プロンプト
2. security-review.md: セキュリティレビュープロンプト ← 新規追加
```

## アーティファクト出力手順

更新した実装状況は、以下の方法でアーティファクトとして出力してください：

1. artifacts機能を使用して出力
2. type は `text/markdown` を指定
3. title は `PintHop 実装状況 (更新版)` を指定
4. content には更新した実装状況ドキュメントの全文を含める

## 留意事項

- 更新は事実に基づき、正確に記載してください
- 完了したタスクと進行中のタスクを明確に区別してください
- 次のステップは具体的かつ実行可能な形で記載してください
- プロジェクト全体の状況が把握できるよう、各セクションをバランスよく更新してください
- 日付形式（YYYY-MM-DD）や命名規則など、既存のドキュメント形式を維持してください
- **新しいドキュメントやコードを作成する前に、必ず既存の成果物を確認してください**
- **既存の成果物と重複する内容は作成せず、既存のものを更新・拡張してください**
- **実装状況ドキュメントには、すべての成果物（ドキュメントとソースコード）を漏れなく記録してください**
- **関連する既存ドキュメントがある場合は、新規作成ではなく、既存ドキュメントの更新を優先してください**
- **成果物は常にGitHubのディレクトリ構造に従って整理し、記録してください**
- **新しいディレクトリやファイルを作成する場合は、既存の命名規則に従ってください**
- **ディレクトリ構造は一切省略せず、全てのファイルを完全に記載してください**

このプロンプトに従って実装状況を更新し、アーティファクトとして出力することで、プロジェクトの継続性を確保し、効率的な引き継ぎを実現しましょう。また、リソースの効率的な活用と一貫性のある開発環境の維持に貢献しましょう。
