/**
 * PintHop Design System
 * UI/UX仕様書に基づくデザイントークン
 */

export const colors = {
  // 2024-2025 UI/UXトレンド対応: Dark Mode First + プライマリカラーパレット
  primary: {
    50: '#FDF8F3',   // プライマリカラーの最も薄い色
    100: '#FAF0E4',  // 薄い琥珀色
    200: '#F3D5A7',  // ライト琥珀色
    300: '#ECB96A',  // ミディアム琥珀色
    400: '#D39E47',  // 琥珀色のミディアム
    500: '#B97F24',  // プライマリカラー: 琥珀色/ビール色
    600: '#9E6B1F',  // ダーク琥珀色
    700: '#835619',  // より濃い琥珀色
    800: '#684214',  // ディープ琥珀色
    900: '#4D2E0F',  // 最も濃い琥珀色
  },
  
  // セカンダリカラー: 深い青
  secondary: {
    50: '#F0F4F8',   // 最も薄い青
    100: '#E1E9F0',  // 薄い青
    200: '#B3CCE0',  // ライト青
    300: '#85AFCF',  // ミディアム青
    400: '#5692BF',  // ミディアム深い青
    500: '#2B5797',  // セカンダリカラー: 深い青
    600: '#244B82',  // より濃い青
    700: '#1D3F6D',  // ディープ青
    800: '#163358',  // 非常に濃い青
    900: '#0F2743',  // 最も濃い青
  },
  
  // アクセントカラー: オレンジ
  accent: {
    50: '#FFF4F0',   // 最も薄いオレンジ
    100: '#FEE8DF',  // 薄いオレンジ
    200: '#FDC5A6',  // ライトオレンジ
    300: '#FCA26D',  // ミディアムオレンジ
    400: '#F17F34',  // より明るいオレンジ
    500: '#E85D10',  // アクセントカラー: オレンジ
    600: '#C54F0E',  // ダークオレンジ
    700: '#A2410C',  // より濃いオレンジ
    800: '#7F330A',  // ディープオレンジ
    900: '#5C2508',  // 最も濃いオレンジ
  },
  
  // ニュートラルカラー
  neutral: {
    50: '#F9F7F2',   // バックグラウンドカラー: オフホワイト
    100: '#F5F3ED',  // 非常に薄いグレー
    200: '#E8E5DC',  // 薄いグレー
    300: '#DAD6CB',  // ライトグレー
    400: '#ADA59B',  // ミディアムグレー
    500: '#807A70',  // グレー
    600: '#666259',  // ダークグレー
    700: '#4D4A42',  // より濃いグレー
    800: '#333333',  // テキストカラー: ダークグレー
    900: '#1A1814',  // 最も濃いグレー
  },
  
  // ステータスカラー
  status: {
    success: '#4CAF50',   // 成功
    warning: '#FFC107',   // 警告
    error: '#F44336',     // エラー
    info: '#2196F3',      // 情報
  },
  
  // 2024-2025 Dark Mode First デザイン
  dark: {
    // ベースダークカラー
    bg: {
      primary: '#0a0a0a',     // メインBackground
      secondary: '#111111',   // カード、セクション
      tertiary: '#1a1a1a',    // 階層化された背景
      elevated: '#1f1f1f',    // モーダル、ポップアップ
    },
    
    // ダークモードテキスト
    text: {
      primary: '#ffffff',     // メインテキスト
      secondary: '#b3b3b3',   // セカンダリテキスト
      tertiary: '#808080',    // 三次テキスト
      disabled: '#4d4d4d',    // 無効状態
    },
    
    // ダークモードボーダー・線
    border: {
      primary: '#333333',     // 主要ボーダー
      secondary: '#262626',   // セカンダリボーダー
      subtle: '#1a1a1a',      // 微細なライン
    },
    
    // ダークモード用プライマリ（ビール色を暗背景用に調整）
    primary: {
      100: '#B97F24',  // より明るい琥珀色（Dark背景での視認性向上）
      200: '#D39E47',  // さらに明るい琥珀色
      300: '#ECB96A',  // Light琥珀色（ダークモード用）
    },
    
    // ダークモード用セカンダリ（青色を暗背景用に調整）
    secondary: {
      100: '#5692BF',  // より明るい青
      200: '#85AFCF',  // さらに明るい青
      300: '#B3CCE0',  // Light青（ダークモード用）
    }
  },
  
  // ライトモード設定（従来の設定を保持）
  light: {
    bg: {
      primary: '#F9F7F2',     // オフホワイト
      secondary: '#FFFFFF',   // 純白
      tertiary: '#F5F3ED',    // 非常に薄いグレー
      elevated: '#FFFFFF',    // 白（モーダル等）
    },
    
    text: {
      primary: '#333333',     // ダークグレー（メイン）
      secondary: '#666259',   // ダークグレー（セカンダリ）
      tertiary: '#807A70',    // グレー（三次）
      disabled: '#ADA59B',    // ライトグレー（無効）
    },
    
    border: {
      primary: '#E8E5DC',     // 薄いグレー
      secondary: '#DAD6CB',   // ライトグレー
      subtle: '#F5F3ED',      // 非常に薄いグレー
    }
  }
};

// 2024-2025 Micro-interactions & Animations トレンド対応
export const animations = {
  // ビールテーマアニメーション（既存）
  pour: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  bubble: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  lift: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cheers: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // 2024年トレンド: 高度なマイクロインタラクション
  easing: {
    // Apple-style easings
    appleIn: 'cubic-bezier(0.4, 0, 1, 1)',
    appleOut: 'cubic-bezier(0, 0, 0.2, 1)',
    appleInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Material Design 3 easings
    materialStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    materialDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    materialAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    
    // カスタム・プレミアム感
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // タイミング（2024年最適化）
  duration: {
    instant: '50ms',    // より高速な反応
    fast: '150ms',      // 高速インタラクション
    normal: '250ms',    // 標準アニメーション
    slow: '400ms',      // ゆったりとした動き
    slower: '600ms',    // 重要な状態変化
    pour: '800ms',      // ビールを注ぐ時間
    loading: '1200ms',  // ローディングアニメーション
  },
  
  // マイクロインタラクション・パターン
  microInteractions: {
    // ホバーエフェクト
    hover: {
      scale: 'scale(1.02)',
      lift: 'translateY(-2px)',
      glow: 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    
    // プレス・タップ
    press: {
      scale: 'scale(0.98)',
      subtle: 'scale(0.995)',
    },
    
    // フォーカス
    focus: {
      ring: '0 0 0 3px rgba(185, 127, 36, 0.5)',
      glow: '0 0 20px rgba(185, 127, 36, 0.3)',
    },
    
    // 状態変化
    success: {
      bounce: 'scale(1.1)',
      checkmark: 'rotate(360deg) scale(1.1)',
    }
  },
  
  // Loading・Progress アニメーション
  loading: {
    spin: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      iteration: 'infinite',
    },
    pulse: {
      name: 'pulse', 
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite',
    },
    bounce: {
      name: 'bounce',
      duration: '1s',
      timing: 'ease-in-out',
      iteration: 'infinite',
    }
  }
};

// 2024-2025 Bold Typography トレンド対応
export const typography = {
  fontFamily: {
    // Variable Fonts 採用（2024年トレンド）
    display: '"Inter Variable", "Montserrat Variable", system-ui, sans-serif',  // ヒーロー・大見出し用
    heading: '"Inter Variable", "Montserrat", system-ui, sans-serif',           // 見出し用
    body: '"Inter Variable", "Open Sans", system-ui, sans-serif',               // 本文用（可読性重視）
    accent: '"Nunito Sans Variable", "Nunito Sans", system-ui, sans-serif',     // アクセント用
    mono: '"JetBrains Mono", "SF Mono", monospace',                             // コード・技術表示用
  },
  
  // クランプによるレスポンシブタイポグラフィ（2024年ベストプラクティス）
  fontSize: {
    xs: '0.75rem',           // 12px - 極小テキスト
    sm: '0.875rem',          // 14px - 小テキスト  
    base: '1rem',            // 16px - 本文
    lg: '1.125rem',          // 18px - 見出し4
    xl: '1.25rem',           // 20px - 見出し3
    '2xl': 'clamp(1.5rem, 4vw, 2rem)',      // 24-32px - 見出し2（レスポンシブ）
    '3xl': 'clamp(1.875rem, 5vw, 2.5rem)',  // 30-40px - 見出し1（レスポンシブ）
    '4xl': 'clamp(2.25rem, 6vw, 3.5rem)',   // 36-56px - 大見出し（レスポンシブ）
    '5xl': 'clamp(3rem, 8vw, 4.5rem)',      // 48-72px - ヒーロータイトル（レスポンシブ）
    '6xl': 'clamp(3.75rem, 10vw, 6rem)',    // 60-96px - ビッグヒーロー（レスポンシブ）
    
    // 新規追加: Bold Typography トレンド
    hero: 'clamp(4rem, 12vw, 8rem)',        // 64-128px - スーパーヒーロー
    display: 'clamp(5rem, 15vw, 10rem)',    // 80-160px - ディスプレイサイズ
  },
  
  fontWeight: {
    light: 300,
    normal: 400,        // 通常テキスト
    medium: 500,        // 中間
    semibold: 600,      // セミボールド
    bold: 700,          // ボールド
    extrabold: 800,     // エクストラボールド（2024年トレンド）
    black: 900,         // ブラック（2024年トレンド - "Big, Bold, Capitalized"）
  },
  
  // レタースペーシング（可読性向上）
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em', 
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // ラインハイト（読みやすさ最適化）
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
};

// 影とエフェクト
export const effects = {
  // ガラスの影
  glassShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  // ビールグラスの光沢
  glassGlow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
  // 泡のテクスチャ
  foamTexture: 'radial-gradient(circle at 20% 80%, transparent 30%, rgba(255, 255, 255, 0.1) 70%)',
  
  // ボックスシャドウ
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // 2024-2025 Glassmorphism トレンド（Apple macOS Big Sur, Microsoft Fluent Design準拠）
  glassmorphism: {
    // ライトモード用
    light: {
      subtle: {
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      medium: {
        backdropFilter: 'blur(16px)',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
      },
      strong: {
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 16px 50px 0 rgba(31, 38, 135, 0.55)',
      }
    },
    
    // ダークモード用
    dark: {
      subtle: {
        backdropFilter: 'blur(10px)',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      medium: {
        backdropFilter: 'blur(16px)',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
      },
      strong: {
        backdropFilter: 'blur(20px)',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 16px 50px 0 rgba(0, 0, 0, 0.5)',
      }
    },
    
    // ビール・琥珀色グラス効果
    amber: {
      subtle: {
        backdropFilter: 'blur(12px)',
        background: 'rgba(185, 127, 36, 0.1)',
        border: '1px solid rgba(185, 127, 36, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(185, 127, 36, 0.2)',
      },
      medium: {
        backdropFilter: 'blur(16px)',
        background: 'rgba(185, 127, 36, 0.15)',
        border: '1px solid rgba(185, 127, 36, 0.3)',
        boxShadow: '0 12px 40px 0 rgba(185, 127, 36, 0.3)',
      }
    }
  },
  
  // 従来のガラス効果（下位互換）
  glass: {
    light: 'backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.1);',
    dark: 'backdrop-filter: blur(10px); background-color: rgba(0, 0, 0, 0.3);',
    amber: 'backdrop-filter: blur(10px); background-color: rgba(255, 152, 0, 0.1);',
  }
};

// スペーシング
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

// ボーダー半径
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',    // 円形
  glass: '1.5rem',   // グラスの丸み
};

// ブレークポイント
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
  loading: 90,
};

// グラデーション
export const gradients = {
  // ビールの色グラデーション
  pilsner: `linear-gradient(180deg, ${colors.foam[100]} 0%, ${colors.beer.light[400]} 100%)`,
  ipa: `linear-gradient(180deg, ${colors.foam[100]} 0%, ${colors.beer.amber[500]} 100%)`,
  stout: `linear-gradient(180deg, ${colors.foam[200]} 0%, ${colors.beer.dark[900]} 100%)`,
  
  // 背景グラデーション
  sunset: `linear-gradient(135deg, ${colors.beer.amber[600]} 0%, ${colors.beer.dark[800]} 100%)`,
  taproom: `linear-gradient(180deg, ${colors.brewery[900]} 0%, ${colors.brewery[950]} 100%)`,
  
  // ホバーエフェクト
  glassShine: `linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
};

// 2024-2025 Dark Mode First CSS変数生成
export const generateCSSVariables = () => {
  const lightVars: string[] = [];
  const darkVars: string[] = [];
  
  // ライトモード変数
  lightVars.push('/* Light Mode Variables */');
  lightVars.push('color-scheme: light;');
  
  // ダークモード変数  
  darkVars.push('/* Dark Mode Variables */');
  darkVars.push('color-scheme: dark;');
  
  // 基本カラー変数（ライト・ダーク両方）
  Object.entries(colors).forEach(([category, shades]) => {
    if (typeof shades === 'object' && category !== 'dark' && category !== 'light') {
      Object.entries(shades).forEach(([shade, value]) => {
        if (typeof value === 'string') {
          lightVars.push(`--color-${category}-${shade}: ${value};`);
          darkVars.push(`--color-${category}-${shade}: ${value};`);
        }
      });
    }
  });
  
  // ライトモード専用変数
  if (colors.light) {
    Object.entries(colors.light).forEach(([category, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        lightVars.push(`--color-${category}-${shade}: ${value};`);
      });
    });
  }
  
  // ダークモード専用変数
  if (colors.dark) {
    Object.entries(colors.dark).forEach(([category, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        darkVars.push(`--color-${category}-${shade}: ${value};`);
      });
    });
  }
  
  // アニメーション変数（共通）
  Object.entries(animations.duration).forEach(([name, value]) => {
    lightVars.push(`--duration-${name}: ${value};`);
    darkVars.push(`--duration-${name}: ${value};`);
  });
  
  // Typography変数（共通）
  Object.entries(typography.fontSize).forEach(([size, value]) => {
    lightVars.push(`--font-size-${size}: ${value};`);
    darkVars.push(`--font-size-${size}: ${value};`);
  });
  
  return `
:root {
  ${lightVars.join('\n  ')}
}

@media (prefers-color-scheme: dark) {
  :root {
    ${darkVars.join('\n    ')}
  }
}

[data-theme="light"] {
  ${lightVars.join('\n  ')}
}

[data-theme="dark"] {
  ${darkVars.join('\n  ')}
}
`;
};

// 2024-2025 トレンド対応ユーティリティ関数
export const getGlassmorphismStyles = (variant: 'light' | 'dark' | 'amber', intensity: 'subtle' | 'medium' | 'strong' = 'medium') => {
  const glass = effects.glassmorphism[variant];
  if (variant === 'amber') {
    return glass[intensity === 'strong' ? 'medium' : intensity];
  }
  return glass[intensity];
};

export const getBoldTypography = (size: 'hero' | 'display' | '6xl' | '5xl' | '4xl', weight: 'bold' | 'extrabold' | 'black' = 'extrabold') => {
  return {
    fontSize: typography.fontSize[size],
    fontWeight: typography.fontWeight[weight],
    fontFamily: typography.fontFamily.display,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  };
};

export const getMicroInteraction = (type: 'hover' | 'press' | 'focus' | 'success', property: string) => {
  return animations.microInteractions[type][property];
};