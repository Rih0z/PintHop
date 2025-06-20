----
# ドキュメント情報
プロジェクト: PintHop
ファイル名: ui-ux-flow-2025.md
ファイルパス: Document/jp/ui-ux-flow-2025.md
作成者: Koki Riho (https://github.com/Rih0z)
作成日: 2025-06-11
最終更新日: 2025-06-11
バージョン: 2.0

# 更新履歴
- 2025-06-11 Koki Riho 2024-2025 UI/UXトレンドに完全対応した新版作成

# 説明
PintHopアプリケーションの2024-2025年UI/UXトレンドに完全準拠したユーザーインターフェースとユーザー体験の設計を定義するドキュメント。Dark Mode First、Bold Typography、Glassmorphism、Micro-interactions等の最新トレンドを全面採用。
----

# PintHop UI/UXフロー設計書 2025

## 1. エグゼクティブサマリー

### 1.1 トレンド適用戦略

PintHopは**ソーシャル・ビールアプリ**として、2024-2025年UI/UXトレンド調査報告書に基づき、以下のトレンドを採用します：

**必須採用（Phase 1）**
- **Dark Mode First**: ユーザーの82.7%が使用、バッテリー30-60%削減
- **Bold Typography**: Variable Fonts採用、読みやすさ+34%向上
- **基本的Micro-interactions**: エンゲージメント+52%向上

**高推奨（Phase 2）**
- **Glassmorphism**: 視覚的階層+45%、モダン感+67%向上
- **Modern Skeuomorphism**: ビールグラス・ボタンでの直感性向上

**選択的採用（Phase 3）**
- **3D & Spatial Design**: ビールグラスの3D表現、没入感+63%
- **AI-Driven Personalization**: 将来的な実装準備

### 1.2 ビジョン

「偶然の出会い」と「自然な友達とのつながり」を、**2024年最先端のUI/UX**で実現するビアホッピングプラットフォーム。ダークモードファースト設計により長時間使用でも目が疲れにくく、Glassmorphismによる高級感のある体験を提供します。

## 2. 2025年版デザイン原則

### 2.1 Dark Mode First原則

1. **ダークモードをデフォルト設定**:
   - システム設定に従うが、初回起動時はダークモード
   - ライトモードは手動切り替えオプション
   - OLED画面でのバッテリー効率最適化

2. **ダークモード最適化カラー**:
   - 純黒(#000000)ではなく、やや明るい黒(#0a0a0a)を使用
   - コントラスト比の最適化（WCAG AAA準拠）
   - 琥珀色のアクセントカラーがダークモードで映える設計

### 2.2 Bold Typography原則

1. **Variable Fontsの全面採用**:
   - Inter Variable (100-900 weight)
   - Montserrat Variable (100-900 weight)
   - レスポンシブフォントサイズ（clamp関数使用）

2. **"Big, Bold, and Capitalized"**:
   - ヒーロータイトル: clamp(4rem, 12vw, 8rem)
   - 見出し: 800-900のフォントウェイト使用
   - 強調テキストには大文字使用

### 2.3 Glassmorphism原則

1. **階層的透明度**:
   - カード: backdrop-filter: blur(16px)
   - モーダル: backdrop-filter: blur(20px)
   - 背景透明度: rgba(255,255,255,0.1-0.2)

2. **ボーダーとシャドウ**:
   - 半透明ボーダー: 1px solid rgba(255,255,255,0.2)
   - ソフトシャドウ: 0 8px 32px rgba(31,38,135,0.37)

## 3. 2025年版デザインシステム

### 3.1 カラーパレット（Dark Mode First）

#### ダークモード（デフォルト）
```css
/* 背景色 */
--bg-primary: #0a0a0a;      /* メイン背景 */
--bg-secondary: #111111;    /* カード背景 */
--bg-tertiary: #1a1a1a;     /* 階層化背景 */
--bg-elevated: #1f1f1f;     /* モーダル・ポップアップ */

/* テキスト色 */
--text-primary: #ffffff;    /* メインテキスト */
--text-secondary: #b3b3b3;  /* セカンダリテキスト */
--text-tertiary: #808080;   /* 補助テキスト */
--text-disabled: #4d4d4d;   /* 無効状態 */

/* ブランドカラー（ダークモード調整済み） */
--primary-100: #B97F24;     /* 琥珀色（明るめ） */
--primary-200: #D39E47;     /* より明るい琥珀色 */
--primary-300: #ECB96A;     /* 最も明るい琥珀色 */

--secondary-100: #5692BF;   /* 明るい青 */
--secondary-200: #85AFCF;   /* より明るい青 */
--secondary-300: #B3CCE0;   /* 最も明るい青 */

--accent: #E85D10;          /* アクセントオレンジ */
```

#### ライトモード（オプション）
```css
/* 背景色 */
--bg-primary: #F9F7F2;      /* オフホワイト */
--bg-secondary: #FFFFFF;    /* 純白 */
--bg-tertiary: #F5F3ED;     /* 薄いグレー */
--bg-elevated: #FFFFFF;     /* 白 */

/* テキスト色 */
--text-primary: #333333;    /* ダークグレー */
--text-secondary: #666259;  /* ミディアムグレー */
--text-tertiary: #807A70;   /* ライトグレー */
--text-disabled: #ADA59B;   /* 薄いグレー */
```

### 3.2 タイポグラフィ（Bold Typography）

```css
/* Variable Fonts */
--font-display: 'Inter Variable', system-ui;
--font-heading: 'Inter Variable', system-ui;
--font-body: 'Inter Variable', system-ui;
--font-accent: 'Nunito Sans Variable', system-ui;

/* レスポンシブフォントサイズ */
--font-size-hero: clamp(4rem, 12vw, 8rem);      /* 64-128px */
--font-size-display: clamp(3rem, 8vw, 6rem);    /* 48-96px */
--font-size-h1: clamp(2.25rem, 6vw, 4.5rem);    /* 36-72px */
--font-size-h2: clamp(1.875rem, 5vw, 3rem);     /* 30-48px */
--font-size-h3: clamp(1.5rem, 4vw, 2rem);       /* 24-32px */
--font-size-body: 1rem;                         /* 16px */
--font-size-small: 0.875rem;                    /* 14px */

/* フォントウェイト */
--font-weight-black: 900;    /* 最大の太さ */
--font-weight-bold: 800;     /* 太字 */
--font-weight-semibold: 600; /* セミボールド */
--font-weight-normal: 400;   /* 通常 */
--font-weight-light: 300;    /* 細字 */
```

### 3.3 Glassmorphism効果

```css
/* Glass効果のバリエーション */
.glass-subtle {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-medium {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.45);
}

.glass-strong {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 16px 50px 0 rgba(31, 38, 135, 0.55);
}

/* ビール・琥珀色グラス効果 */
.glass-amber {
  backdrop-filter: blur(16px);
  background: rgba(185, 127, 36, 0.15);
  border: 1px solid rgba(185, 127, 36, 0.3);
  box-shadow: 0 12px 40px 0 rgba(185, 127, 36, 0.3);
}
```

### 3.4 Micro-interactions

```css
/* 基本トランジション */
--duration-instant: 50ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

/* イージング */
--ease-apple: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* インタラクション効果 */
.interactive {
  transition: all var(--duration-fast) var(--ease-apple);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.interactive:active {
  transform: scale(0.98);
}
```

## 4. 画面構造（2025年版）

### 4.1 グローバルレイアウト

#### ナビゲーション構造
- **Bottom Navigation**: 5タブ構成（モバイルファースト）
- **Glassmorphismエフェクト**: 半透明の背景でコンテンツが透けて見える
- **ジェスチャー対応**: スワイプでタブ切り替え

```
┌─────────────────────────────┐
│      ステータスバー          │ Dark Mode
├─────────────────────────────┤
│                             │
│      メインコンテンツ        │ Glassmorphism
│      （スクロール可能）      │ カード
│                             │
├─────────────────────────────┤
│  🏠  🗺️  🔍  📅  👤      │ Bottom Nav
└─────────────────────────────┘
```

### 4.2 主要画面リスト

1. **タイムライン** （デフォルトタブ）
2. **マップ**
3. **ブルワリー検索**
4. **イベント**
5. **プロフィール**

## 5. 各画面の詳細設計（2025年版）

### 5.1 タイムライン画面

#### デザイン
- **Dark Mode背景**: #0a0a0a
- **アクティビティカード**: Glassmorphism効果
- **タイポグラフィ**: Bold見出し（800 weight）
- **アニメーション**: カード出現時のフェードイン＋スライドアップ

#### レイアウト
```
┌─────────────────────────────┐
│  TIMELINE                   │ ← 48px Bold (800)
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [Glass Card]            │ │ ← Glassmorphism
│ │ 👤 Alice                │ │
│ │ Fremont Brewingに       │ │
│ │ チェックイン             │ │
│ │ 🕐 5分前                │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [Glass Card]            │ │
│ │ 👥 Bob & Carol          │ │
│ │ 新しいルートを開始       │ │
│ │ 🍺 Seattle Beer Tour    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

#### インタラクション
- **プルダウン更新**: 弾性アニメーション
- **カードタップ**: スケール0.98→詳細へ展開
- **ロングプレス**: ハプティックフィードバック＋メニュー表示
- **スワイプ**: 左右でアクション表示

### 5.2 マップ画面

#### デザイン
- **ダークモードマップ**: Mapbox Dark Style
- **マーカー**: Glassmorphismポップアップ
- **3D効果**: ビル・地形の立体表示（オプション）
- **リアルタイムアニメーション**: 友達の移動をスムーズに表示

#### レイアウト
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │ 🔍 検索バー (Glass)     │ │
│ └─────────────────────────┘ │
│                             │
│      🗺️ ダークマップ         │
│      📍 友達マーカー         │
│      🍺 ブルワリーマーカー    │
│                             │
│ ┌─────────────────────────┐ │
│ │ 近くのブルワリー (Glass) │ │
│ │ ・Fremont Brewing       │ │
│ │ ・Stoup Brewing         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

#### Modern Skeuomorphism要素
- **現在地ボタン**: 物理的な押し込み感
- **ズームコントロール**: 立体的なボタンデザイン
- **マーカー**: ビールグラスの3D表現

### 5.3 ブルワリー詳細画面

#### デザイン
- **ヒーロー画像**: フルブリード表示
- **情報カード**: 多層Glassmorphism
- **3Dビールグラス**: CSS 3D Transform
- **マイクロアニメーション**: 全要素に適用

#### レイアウト
```
┌─────────────────────────────┐
│ [ヒーロー画像]              │
│ ┌─────────────────────────┐ │
│ │ FREMONT BREWING         │ │ ← 72px Black (900)
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ コミュニティ情報 (Glass) │ │
│ │ 👥 友達3人が滞在中      │ │
│ │ 🚶 2つのルートが通過中   │ │
│ │ 📊 混雑度: 中           │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ [3Dビールグラス表示]     │ │
│ │  回転可能な3Dモデル     │ │
│ └─────────────────────────┘ │
│                             │
│ [チェックイン] [ルート参加]  │ ← Glassmorphismボタン
└─────────────────────────────┘
```

### 5.4 チェックインフロー（低摩擦設計）

#### ステップ1: ワンタップ基本チェックイン
```
┌─────────────────────────────┐
│ チェックイン (Glass Modal)   │
│                             │
│ 📍 Fremont Brewing         │
│                             │
│ プライバシー:               │
│ [友達のみ ▼]               │ ← デフォルト
│                             │
│ [チェックイン]              │ ← 大きなGlassボタン
└─────────────────────────────┘
```

#### ステップ2: オプション詳細（段階的表示）
```
┌─────────────────────────────┐
│ ✅ チェックイン完了！        │
│                             │
│ もっと追加しますか？         │
│ [📸 写真] [💬 コメント]     │
│ [🍺 ビール] [👥 グループ]   │
│                             │
│ [完了]                      │
└─────────────────────────────┘
```

### 5.5 プロフィール画面

#### デザイン
- **ヒーローセクション**: 大胆なタイポグラフィ
- **統計カード**: Glassmorphism＋数値アニメーション
- **バッジ**: 3D効果＋ホバー時の回転
- **セクション切り替え**: スムーズなタブアニメーション

#### レイアウト
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │  👤                     │ │
│ │  ALICE                  │ │ ← 48px Black (900)
│ │  PintHop Explorer       │ │
│ └─────────────────────────┘ │
│                             │
│ [統計] [バッジ] [履歴] [設定]│ ← Glassタブ
│                             │
│ ┌─────────────────────────┐ │
│ │ あなたの統計 (Glass)     │ │
│ │ 🏠 訪問: 23             │ │ ← カウントアップアニメ
│ │ 🍺 記録: 89             │ │
│ │ 🚶 ルート: 7            │ │
│ │ 👥 出会い: 15           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## 6. 高度なインタラクションパターン（2025年版）

### 6.1 Micro-interactions詳細

#### ボタンインタラクション
```css
.button-modern {
  /* 基本状態 */
  transform: translateZ(0);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* ホバー */
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px rgba(185, 127, 36, 0.3);
  }
  
  /* アクティブ */
  &:active {
    transform: scale(0.98);
  }
  
  /* 成功フィードバック */
  &.success {
    animation: bounce-success 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

@keyframes bounce-success {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

#### カードインタラクション
- **出現**: フェードイン＋下からスライド（stagger効果）
- **ホバー**: 軽い浮き上がり＋影の強調
- **タップ**: 押し込み効果
- **削除**: 横スワイプ＋フェードアウト

### 6.2 ローディング＆トランジション

#### スケルトンローディング（Glassmorphism版）
```css
.skeleton-glass {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  animation: shimmer 1.5s infinite;
}
```

#### ページトランジション
- **タブ切り替え**: 横スライド＋フェード
- **詳細画面**: 下から展開（iOS風）
- **モーダル**: ブラー強化＋スケールイン

### 6.3 ジェスチャー対応

1. **スワイプ**:
   - 左右: タブ切り替え、カードアクション
   - 上下: 更新、無限スクロール
   - ピンチ: マップズーム

2. **長押し**:
   - ハプティックフィードバック
   - コンテキストメニュー表示
   - プレビュー表示

3. **3D Touch/Force Touch**:
   - クイックアクション
   - プレビュー＆ポップ

## 7. レスポンシブ＆デバイス戦略（2025年版）

### 7.1 ブレークポイント
```css
/* モバイルファースト */
--mobile: 0px;        /* デフォルト */
--tablet: 768px;      /* iPadサイズ */
--desktop: 1024px;    /* デスクトップ */
--wide: 1440px;       /* ワイドスクリーン */
```

### 7.2 デバイス別最適化

#### スマートフォン（デフォルト）
- シングルカラム
- Bottom Navigation
- タッチ最適化（44px最小）
- Glassmorphism全面採用

#### タブレット
- 2カラムレイアウト可能
- サイドナビゲーション選択可
- マウス＋タッチ対応
- 拡張情報表示

#### デスクトップ
- マルチカラム
- ホバーエフェクト有効
- キーボードショートカット
- 高密度情報表示

## 8. パフォーマンス最適化（2025年版）

### 8.1 Dark Mode最適化
- **OLED最適化**: 純黒領域の最大化
- **コントラスト調整**: 目の疲労軽減
- **バッテリー節約**: 30-60%消費削減

### 8.2 アニメーション最適化
```css
/* GPU最適化 */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Reduced Motion対応 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.3 Glassmorphism最適化
- **条件付き適用**: 低性能デバイスでは簡略化
- **レイヤー制限**: 最大3層まで
- **blur値調整**: デバイス性能に応じて10-20px

## 9. アクセシビリティ（2025年版）

### 9.1 Dark Modeアクセシビリティ
- **高コントラストモード**: 自動対応
- **カラー調整**: 色覚多様性対応
- **明度調整**: ユーザー設定可能

### 9.2 Bold Typographyアクセシビリティ
- **可変フォントサイズ**: システム設定連動
- **最小サイズ保証**: 14px以上
- **行間調整**: 読みやすさ最適化

### 9.3 インタラクションアクセシビリティ
- **フォーカス表示**: 明確なアウトライン
- **キーボード対応**: 全機能アクセス可能
- **スクリーンリーダー**: 適切なARIA属性

## 10. 実装ロードマップ（2025年版）

### Phase 1: 基盤構築（即時実装）
1. **Dark Mode First実装**
2. **Bold Typography適用**
3. **基本Micro-interactions**
4. **レスポンシブ基盤**

### Phase 2: 体験向上（3-4ヶ月）
1. **Glassmorphism全面適用**
2. **高度なアニメーション**
3. **Modern Skeuomorphism**
4. **ジェスチャー対応**

### Phase 3: 先進機能（6-12ヶ月）
1. **3D & Spatial Design**
2. **AI-Driven Personalization準備**
3. **AR機能検討**
4. **音声UI検討**

## 11. 測定と成功指標

### 11.1 定量的指標
- **エンゲージメント**: セッション時間+30%
- **タスク完了率**: +25%向上
- **バッテリー消費**: -30%削減
- **ページロード**: 3秒以内

### 11.2 定性的指標
- **モダン感**: ユーザー調査で90%以上
- **使いやすさ**: NPS +20ポイント
- **ブランド認知**: プレミアム感向上

---

本ドキュメントは2024-2025年の最新UI/UXトレンドを完全に反映したPintHopの新しいデザイン仕様書です。継続的なユーザーフィードバックに基づいて更新されます。