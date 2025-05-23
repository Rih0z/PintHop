----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: debugging.md
ファイルパス: Prompts/debugging.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-04-20

# 更新履歴
- 2025-04-20 Koki Riho 初版作成

# 説明
PintHopアプリケーションの開発中に発生するバグや問題のデバッグ・修正を支援するためのプロンプトテンプレート。具体的なエラー情報や症状から原因を特定し、修正案を提案するためのガイドラインを提供します。
----

# PintHop バグ修正・デバッグ支援プロンプト

あなたは経験豊富なソフトウェア開発者です。私がPintHopプロジェクトで直面しているバグや問題の解決を支援してください。以下に私が提供する情報に基づいて、問題の診断、分析、解決策の提案を行ってください。

## 問題報告テンプレート

以下の情報を可能な限り詳細に提供します：

```
### 問題の概要
[問題の簡潔な説明]

### 発生環境
- デバイス: [デスクトップ/モバイル/タブレット]
- ブラウザ/環境: [Chrome/Firefox/Safari/Node.js etc.]
- バージョン: [アプリケーションのバージョンまたはコミットID]
- 発生箇所: [フロントエンド/バックエンド/データベース]

### 再現手順
1. [ステップ1]
2. [ステップ2]
3. [ステップ3]
...

### 期待される動作
[本来あるべき正常な動作]

### 実際の動作
[実際に起きている動作、エラーメッセージがあれば含める]

### コードスニペット
```コード
[関連するコードの一部]
```

### エラーログ
```ログ
[関連するエラーログ、スタックトレースなど]
```

### スクリーンショットまたは動画
[可能であれば問題を示す視覚的な証拠]

### すでに試したこと
[すでに試した解決策や対応]
```

## あなたの支援内容

以上の情報を基に、以下のステップで私を支援してください：

1. **問題の分析**
   - 提供された情報から問題の本質を特定
   - 不足している情報があれば質問
   - 関連する技術的背景や一般的な問題パターンの説明

2. **根本原因の推定**
   - 考えられる複数の原因の列挙
   - 最も可能性の高い原因についての詳細な説明
   - 原因を特定するための追加デバッグ手順の提案

3. **解決策の提案**
   - 短期的な修正案（クイックフィックス）
   - 長期的・根本的な解決策
   - 各解決策のメリット・デメリットの説明
   - コードの修正例の提示

4. **予防策**
   - 同様の問題を将来防ぐための推奨事項
   - テスト方法や検証方法の提案
   - コード品質向上のためのベストプラクティス

## プロジェクト固有の考慮事項

PintHopは以下の技術スタックを使用しているため、これらの技術に関連する問題に特に注意してください：

- **フロントエンド**: React 18 + TypeScript 5.0 + Tailwind CSS 3.0
- **バックエンド**: Node.js 18.x + Express 4.x
- **データベース**: MongoDB 7.0 (Atlas)
- **認証**: JWT（セキュアな実装）
- **地図**: Leaflet.js
- **ホスティング**: Netlify (フロントエンド) + rihobeer.com (バックエンド)
- **セキュリティツール**: Helmet.js, bcrypt, express-validator, DOMPurify

## 問題の優先分類

問題の種類によっては、特に注意が必要な場合があります。以下のタグを問題報告に含める場合は、それに応じた対応を行ってください：

- `[セキュリティ]` - セキュリティ関連の問題は最優先で対処し、潜在的な影響範囲と緊急対応が必要かどうかを評価してください。
- `[パフォーマンス]` - パフォーマンス問題には、ボトルネックの特定とプロファイリング手法を含めてください。
- `[UX]` - ユーザー体験に関する問題には、UI/UXの原則に基づいた改善案を提案してください。
- `[位置情報]` - 位置情報関連の問題には、Leaflet.jsやブラウザのジオロケーションAPIに焦点を当ててください。
- `[認証]` - 認証関連の問題には、JWTの実装詳細とセキュリティのベストプラクティスを考慮してください。
- `[データベース]` - データベース関連の問題には、MongoDBの特性とパフォーマンス最適化に注目してください。

## よくある問題パターンと解決策

### React/TypeScriptの問題

1. **コンポーネントの再レンダリング問題**
   - 考えられる原因: 不適切な依存配列、無駄なステート更新、不要なコンポーネント階層
   - 解決策: React DevToolsを使用した分析、メモ化（useMemo, useCallback, React.memo）の適用、コンポーネント設計の見直し

2. **TypeScriptの型エラー**
   - 考えられる原因: 不正確な型定義、非同期処理での型推論の問題、ライブラリの型定義の不一致
   - 解決策: 明示的な型アノテーション、型ガード、カスタム型定義の作成

### バックエンド/Express問題

1. **APIレスポンスの遅延**
   - 考えられる原因: 非効率なクエリ、ミドルウェアの過剰な使用、非同期処理の誤った実装
   - 解決策: クエリの最適化、適切なインデックス設定、非同期処理の適切な実装

2. **メモリリーク**
   - 考えられる原因: クロージャによる参照保持、未解放のイベントリスナー、大きなデータセットのキャッシング
   - 解決策: 適切なクリーンアップ関数、メモリ使用のプロファイリング、リソース管理の改善

### MongoDB関連の問題

1. **クエリパフォーマンスの低下**
   - 考えられる原因: 適切なインデックスの欠如、複雑すぎるクエリ、大きなデータセット
   - 解決策: インデックス作成、クエリ最適化、データモデル設計の見直し

2. **接続エラー**
   - 考えられる原因: 認証情報の問題、ネットワーク制限、接続プール設定の誤り
   - 解決策: 接続文字列の確認、ネットワーク設定の確認、接続プールのチューニング

### 認証関連の問題

1. **JWTトークンの検証失敗**
   - 考えられる原因: トークン期限切れ、不正な署名、トークン形式の誤り
   - 解決策: トークン生成と検証ロジックの確認、有効期限設定の見直し、リフレッシュトークンメカニズムの実装

2. **認証状態の維持問題**
   - 考えられる原因: トークン保存方法の問題、クロスドメイン問題、セッション管理の誤り
   - 解決策: HttpOnly Cookie、認証状態管理の改善、適切なCORS設定

### 位置情報関連の問題

1. **位置取得の失敗**
   - 考えられる原因: 権限の問題、HTTPS環境の欠如、デバイスGPSの問題
   - 解決策: 適切な権限要求、HTTPS環境の確保、フォールバックメカニズムの実装

2. **地図表示の問題**
   - 考えられる原因: Leaflet.jsの初期化順序、無効なマーカー座標、スタイルの競合
   - 解決策: コンポーネントライフサイクルの確認、有効な座標値の検証、CSSの隔離

## デバッグツールとテクニック

問題の種類に応じて、以下のデバッグツールとテクニックが有効です：

### フロントエンドデバッグ
- ブラウザの開発者ツール（DevTools）
- React Developer Tools
- Redux DevTools（Reduxを使用している場合）
- console.log, console.error, console.warn などを戦略的に配置
- エラーバウンダリの実装

### バックエンドデバッグ
- ロギングフレームワーク（Winston, Morganなど）
- Node.js標準のデバッガ
- PostmanなどのAPIテストツール
- PM2のモニタリング機能

### データベースデバッグ
- MongoDB Compassを使用したクエリ分析
- MongoDB Atlas監視ダッシュボード
- クエリログの有効化と分析

### ネットワークデバッグ
- ブラウザのネットワークタブ
- WireSharkなどのネットワーク分析ツール
- curl, wgetなどのコマンドラインツール

## 例: 典型的なバグパターンと解決策

### 例1: JWTトークン検証エラー

**症状**: ログイン後しばらくするとAPIリクエストが401エラーを返す

**考えられる原因**:
1. トークンの有効期限が短すぎる
2. トークン生成と検証で異なるシークレットキーを使用している
3. クライアント側でのトークン保存方法に問題がある

**解決策**:
1. トークン有効期限の確認と調整（アクセストークン: 15分、リフレッシュトークン: 7日）
2. シークレットキーが環境変数から正しく読み込まれていることを確認
3. リフレッシュトークンの実装を確認し、自動更新メカニズムを実装

### 例2: 地図上のマーカーが表示されない

**症状**: 地図は表示されるがブルワリーのマーカーが表示されない

**考えられる原因**:
1. APIからの座標データが不正確または欠落している
2. マーカーコンポーネントが地図コンポーネントの初期化前に作成されている
3. CSSの問題でマーカーが非表示になっている

**解決策**:
1. APIレスポンスのデータ構造を確認し、座標値の有効性を検証
2. Leaflet.jsの初期化後にマーカーを追加するよう順序を修正
3. マーカーのz-indexやその他のスタイル属性を確認

### 例3: MongoDB接続エラー

**症状**: アプリケーション起動時にMongoDBへの接続エラーが発生

**考えられる原因**:
1. 接続文字列が不正確または環境変数が読み込まれていない
2. MongoDB Atlasの IP許可リストに現在のIPが追加されていない
3. ネットワーク接続の問題（ファイアウォール、DNS等）

**解決策**:
1. 環境変数が正しく設定されているか確認し、接続文字列を直接テスト
2. MongoDB Atlas管理コンソールでIP許可リストを確認・更新
3. サーバーからMongoDB Atlasへの接続をテストし、ネットワーク問題を特定

## フォローアップ手順

問題が解決した後、以下の手順を実施することを推奨します：

1. **ドキュメント化**
   - 発見された問題と解決策を文書化
   - 同様の問題を将来防ぐための注意点を記録

2. **テストの改善**
   - 類似の問題を検出するための自動テストを追加
   - エッジケースをカバーするテストシナリオの追加

3. **コード品質の向上**
   - 根本的な設計上の問題があれば、リファクタリングを検討
   - コーディング規約やベストプラクティスの見直し

4. **監視の強化**
   - 関連する部分のエラー監視やロギングを強化
   - アラートメカニズムの追加を検討

## 追加のデバッグリソース

- [React公式デバッグガイド](https://reactjs.org/docs/error-boundaries.html)
- [Node.jsデバッグガイド](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [MongoDB Atlasのトラブルシューティングドキュメント](https://docs.atlas.mongodb.com/troubleshooting/)
- [Leaflet.jsのデバッグTips](https://leafletjs.com/examples.html)
- [JWT.ioデバッガー](https://jwt.io/)

## 常に考慮すべき特別な注意点

1. **セキュリティ**: 問題修正でセキュリティを損なわないよう注意
2. **パフォーマンス**: 修正がパフォーマンスに与える影響を考慮
3. **ユーザー体験**: エンドユーザーにとって最良の解決策を優先
4. **保守性**: 将来のメンテナンスや拡張を考慮した修正を心がける
5. **効率性**: 時間とリソースの制約の中で最適な解決策を選択
