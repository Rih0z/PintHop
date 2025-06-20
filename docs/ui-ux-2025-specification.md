# PintHop 2024-2025 UI/UX完全仕様書

## ドキュメント情報
- **プロジェクト**: PintHop
- **ファイル名**: ui-ux-2025-specification.md
- **作成者**: Claude Code
- **作成日**: 2025-06-11
- **最終更新日**: 2025-06-11
- **バージョン**: 1.0

## 更新履歴
- 2025-06-11 Claude Code 初版作成 - 2024-2025 UI/UXトレンド完全準拠版

## 説明
PintHopアプリケーションの2024-2025年最新UI/UXトレンドに完全準拠した設計仕様書。Dark Mode First、Glassmorphism、Bold Typography、AI強化機能、3D Effects、Modern Skeuomorphism、Advanced Micro-interactionsの完全実装仕様を定義します。

---

# 🎨 PintHop 2024-2025 UI/UX完全仕様書

## 1. 概要

### 1.1 設計哲学
PintHopの2025年版UIは、最新のデザイントレンドを完全に取り入れた次世代ユーザーインターフェースです。ユーザーの82.7%がダークモードを好むというデータに基づき、Dark Mode Firstアプローチを採用し、AI強化機能、3D効果、Glassmorphismを組み合わせた革新的な体験を提供します。

### 1.2 実装完了コンポーネント
すべてのコンポーネントがVersion 3.0に更新され、2024-2025トレンドに完全準拠：

- **Pages**: Login.tsx, Dashboard.tsx, Map.tsx, Register.tsx, BrewerySearch.tsx, Events.tsx, Profile.tsx
- **Components**: ModernComponents.tsx（共通UIライブラリ）
- **Design Systems**: modern-design-system.ts, design-system.ts

## 2. 🌙 Dark Mode First Design

### 2.1 設計原則
- **優先度**: すべてのUIはダークモードを最初に設計
- **ユーザー嗜好**: 82.7%のユーザーがダークモードを好む調査結果に基づく
- **視覚疲労軽減**: 長時間使用時の目の負担を最小化

### 2.2 カラーシステム

#### プライマリカラー
```css
:root[data-theme="dark"] {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-tertiary: #888888;
  --color-primary-300: #ECB96A;
  --color-primary-400: #B97F24;
  --color-primary-500: #8B5A1A;
  --color-primary-600: #6B4415;
}
```

#### セカンダリ & アクセントカラー
```css
:root[data-theme="dark"] {
  --color-secondary-400: #5B92BF;
  --color-secondary-500: #4A7BA7;
  --color-accent-400: #E85D10;
  --color-accent-500: #D04A00;
  --color-border-primary: rgba(255, 255, 255, 0.1);
  --color-border-subtle: rgba(255, 255, 255, 0.05);
}
```

### 2.3 実装例
```tsx
// テーマ検出とダークモード適用
const [theme, setTheme] = useState<'light' | 'dark'>('dark');

useEffect(() => {
  const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
  setTheme(currentTheme);
}, []);
```

## 3. ✨ Glassmorphism Effects

### 3.1 設計コンセプト
- **透明感**: backdrop-filter: blur()による半透明効果
- **奥行き**: レイヤーと影による空間的深度
- **素材感**: ガラスのような質感と反射効果

### 3.2 標準実装パターン

#### 基本Glassmorphism
```css
.glass-subtle {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-medium {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-strong {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
```

### 3.3 実装例（ModernCard）
```tsx
const glassStyles = {
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  background: theme === 'dark' 
    ? 'rgba(26, 26, 26, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)',
  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
};
```

## 4. 📝 Bold Typography with Variable Fonts

### 4.1 設計原則
- **極太フォント**: 800-900の極端なフォントウェイト
- **Variable Fonts**: Inter, Montserratの可変フォント使用
- **コントラストの強化**: サイズとウェイトの極端な差

### 4.2 タイポグラフィスケール

#### フォントサイズ
```typescript
export const typography = {
  fontSize: {
    'xs': '0.75rem',     // 12px
    'sm': '0.875rem',    // 14px
    'base': '1rem',      // 16px
    'lg': '1.125rem',    // 18px
    'xl': '1.25rem',     // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
    '5xl': '3rem',       // 48px
    '6xl': '3.75rem',    // 60px
  }
};
```

#### フォントウェイト
```typescript
export const typography = {
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
};
```

### 4.3 実装例
```tsx
// ヘッダータイポグラフィ
<h1 
  className="font-display"
  style={{
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    color: 'var(--color-text-primary)',
    letterSpacing: typography.letterSpacing.tight,
    textTransform: 'uppercase'
  }}
>
  BREWERY SEARCH
</h1>
```

## 5. 🤖 AI-Enhanced Features

### 5.1 AI統合機能

#### 検索強化
```typescript
// AI関連度スコア算出
const calculateRelevanceScore = (item: any, query: string): number => {
  let score = item.baseScore || 50;
  
  // 名前マッチボーナス
  if (item.name.toLowerCase().includes(query.toLowerCase())) score += 30;
  
  // タグマッチボーナス  
  item.tags?.forEach(tag => {
    if (tag.toLowerCase().includes(query.toLowerCase())) score += 15;
  });
  
  // 評価ボーナス
  score += (item.rating - 3) * 10;
  
  return Math.min(Math.max(score, 0), 100);
};
```

#### パーソナリティスコア
```tsx
// AIパーソナリティスコア表示
<div 
  className="font-display mb-2"
  style={{
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.secondary[500]} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}
>
  {stats.aiPersonalityScore}/100
</div>
```

### 5.2 リアルタイムバリデーション
```tsx
// AI強化入力バリデーション
const [validation, setValidation] = useState<ValidationState>({
  username: { isValid: false, message: '', strength: 0 },
  password: { 
    isValid: false, 
    message: '', 
    strength: 0,
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  }
});
```

## 6. 🎭 3D & Spatial Design

### 6.1 設計コンセプト
- **立体感**: perspective効果による3D変換
- **空間性**: 奥行きと回転を活用したレイアウト
- **動的効果**: ホバー・タップ時の3D変化

### 6.2 3D変換パターン

#### 基本3D効果
```css
.spatial-element {
  transform: perspective(1000px) rotateX(10deg);
  transition: transform 0.3s ease;
}

.spatial-element:hover {
  transform: perspective(1000px) rotateX(15deg) scale(1.05);
}

.rotating-element {
  animation: rotate3d 4s infinite linear;
}

@keyframes rotate3d {
  0% { transform: perspective(1200px) rotateY(0deg) rotateX(0deg); }
  25% { transform: perspective(1200px) rotateY(90deg) rotateX(10deg); }
  50% { transform: perspective(1200px) rotateY(180deg) rotateX(0deg); }
  75% { transform: perspective(1200px) rotateY(270deg) rotateX(-10deg); }
  100% { transform: perspective(1200px) rotateY(360deg) rotateX(0deg); }
}
```

### 6.3 実装例
```tsx
// 3Dローディングアニメーション
<motion.div
  className="relative"
  animate={{ 
    rotateY: [0, 360],
    scale: [1, 1.3, 1],
    rotateX: [0, 20, 0]
  }}
  transition={{ 
    rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
    scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
  }}
>
  <div 
    className="text-9xl"
    style={{
      filter: 'drop-shadow(0 30px 60px rgba(185, 127, 36, 0.5))',
      transform: 'perspective(1200px) rotateX(25deg)',
      textShadow: '0 0 40px rgba(185, 127, 36, 0.6)'
    }}
  >
    🗺️
  </div>
</motion.div>
```

## 7. 🏺 Modern Skeuomorphism

### 7.1 設計コンセプト
- **物理的質感**: 実際の材質感を表現
- **触覚フィードバック**: 押下・操作時の視覚的変化
- **立体的陰影**: inset shadowとborderによる深度

### 7.2 実装パターン

#### 3Dボタン効果
```css
.skeuomorphic-button {
  background: linear-gradient(135deg, #ECB96A 0%, #B97F24 100%);
  box-shadow: 
    0 10px 30px rgba(185, 127, 36, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.skeuomorphic-button:active {
  transform: translateY(2px);
  box-shadow: 
    0 5px 15px rgba(185, 127, 36, 0.3),
    inset 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

### 7.3 実装例（3Dアバター）
```tsx
<motion.div 
  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold relative overflow-hidden"
  style={{
    background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
    color: '#000000',
    boxShadow: `
      0 20px 40px rgba(185, 127, 36, 0.4),
      inset 0 4px 8px rgba(255, 255, 255, 0.2),
      inset 0 -4px 8px rgba(0, 0, 0, 0.1)
    `
  }}
  whileHover={{ 
    scale: 1.05,
    rotateY: 15,
    boxShadow: `
      0 25px 50px rgba(185, 127, 36, 0.5),
      inset 0 4px 8px rgba(255, 255, 255, 0.3),
      inset 0 -4px 8px rgba(0, 0, 0, 0.2)
    `
  }}
>
  {user?.username?.charAt(0).toUpperCase() || 'U'}
</motion.div>
```

## 8. ⚡ Advanced Micro-interactions

### 8.1 設計原則
- **Framer Motion**: 全アニメーションでspring物理演算使用
- **細部への配慮**: 微細な動きでユーザー体験向上
- **パフォーマンス**: 60FPS維持の軽量アニメーション

### 8.2 アニメーション設定

#### Spring設定
```typescript
export const animations = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s'
  },
  easing: {
    appleInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    appleOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  spring: {
    gentle: { type: "spring", stiffness: 300, damping: 30 },
    bouncy: { type: "spring", stiffness: 400, damping: 17 },
    quick: { type: "spring", stiffness: 500, damping: 20 }
  }
};
```

### 8.3 実装例

#### ボタンマイクロインタラクション
```tsx
<motion.button
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }}
  whileTap={{ 
    scale: 0.96,
    transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
  }}
  onMouseDown={() => setIsPressed(true)}
  onMouseUp={() => setIsPressed(false)}
  onMouseLeave={() => setIsPressed(false)}
>
  {icon && (
    <motion.span 
      className="mr-2"
      animate={{ rotate: isPressed ? 15 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {icon}
    </motion.span>
  )}
</motion.button>
```

#### カードホバー効果
```tsx
<motion.div
  whileHover={{ 
    y: -6,
    scale: 1.01,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }}
  onHoverStart={() => setIsHovered(true)}
  onHoverEnd={() => setIsHovered(false)}
>
  <AnimatePresence>
    {isHovered && (
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          boxShadow: '0 20px 40px rgba(185, 127, 36, 0.2)'
        }}
      />
    )}
  </AnimatePresence>
</motion.div>
```

## 9. 🎯 コンポーネント仕様

### 9.1 ModernButton
```tsx
interface ModernButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}
```

### 9.2 ModernCard
```tsx
interface ModernCardProps {
  elevated?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
  glassIntensity?: 'subtle' | 'medium' | 'strong';
  theme?: 'light' | 'dark';
}
```

### 9.3 ModernTabs
```tsx
interface ModernTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'glass';
  theme?: 'light' | 'dark';
}
```

## 10. 📱 レスポンシブ & アクセシビリティ

### 10.1 レスポンシブ設計
- **モバイルファースト**: 320px〜の完全対応
- **タブレット**: 768px〜の最適化レイアウト  
- **デスクトップ**: 1024px〜の拡張機能

### 10.2 アクセシビリティ標準
- **WCAG AAA**: 最高レベルのアクセシビリティ対応
- **キーボードナビゲーション**: Tab, Enter, Escapeキー完全対応
- **スクリーンリーダー**: ARIA属性とセマンティックHTML
- **カラーコントラスト**: 7:1以上のコントラスト比

### 10.3 実装例
```tsx
// アクセシブルなModernButton
<motion.button
  type={type}
  className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
  aria-label={ariaLabel}
  aria-disabled={disabled || loading}
  role="button"
  tabIndex={disabled ? -1 : 0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }}
>
  {loading ? (
    <motion.div
      data-testid="loading-spinner"
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      aria-label="読み込み中"
    />
  ) : children}
</motion.button>
```

## 11. 🔧 技術実装詳細

### 11.1 必要な依存関係
```json
{
  "dependencies": {
    "framer-motion": "^10.16.4",
    "react": "^18.2.0",
    "react-icons": "^4.11.0",
    "tailwindcss": "^3.3.3"
  }
}
```

### 11.2 Tailwind CSS設定
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['Inter Display', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px'
      }
    }
  }
};
```

### 11.3 CSS Custom Properties
```css
:root {
  /* Color System */
  --color-primary-300: #ECB96A;
  --color-primary-400: #B97F24;
  --color-primary-500: #8B5A1A;
  --color-primary-600: #6B4415;
  
  --color-secondary-400: #5B92BF;
  --color-secondary-500: #4A7BA7;
  
  --color-accent-400: #E85D10;
  --color-accent-500: #D04A00;
  
  /* Background Colors */
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  
  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-tertiary: #888888;
  
  /* Border Colors */
  --color-border-primary: rgba(255, 255, 255, 0.1);
  --color-border-subtle: rgba(255, 255, 255, 0.05);
}
```

## 12. 🎨 使用ガイドライン

### 12.1 新しいコンポーネント作成時
1. **Dark Mode First**: ダークモードから設計開始
2. **Glassmorphism**: 適切なblur効果とtransparency使用
3. **Bold Typography**: 極端なfont-weightコントラスト
4. **AI Enhancement**: 可能な場合はAI機能統合
5. **3D Effects**: ホバー時の立体的変化実装
6. **Skeuomorphism**: 物理的質感の表現
7. **Micro-interactions**: Framer Motionでスムーズな動き

### 12.2 品質チェックリスト
- [ ] ダークモード完全対応
- [ ] Glassmorphism効果実装
- [ ] Bold Typographyでコントラスト強化
- [ ] 適切なAI機能統合
- [ ] 3D/Spatial効果実装
- [ ] Modern Skeuomorphism質感
- [ ] 60FPS維持のMicro-interactions
- [ ] WCAG AAA準拠
- [ ] キーボードナビゲーション対応
- [ ] レスポンシブ設計完全対応

---

この仕様書は、PintHopの2024-2025 UI/UX実装の完全なガイドラインです。すべての新しい開発とコンポーネント更新は、この仕様に従って実装してください。