/**
 * PintHop Design System
 * ビールカルチャーにインスパイアされたデザイントークン
 */

export const colors = {
  // ビールの泡をイメージした色
  foam: {
    50: '#FFFEF7',   // ほぼ白い泡
    100: '#FFF8E1',  // クリーミーな泡
    200: '#FFECB3',  // 黄金の泡
    300: '#FFE082',  // 濃い泡
  },
  
  // ビールの色彩
  beer: {
    // ライトビール（ピルスナー、ラガー）
    light: {
      300: '#FFD54F',  // 薄い黄金
      400: '#FFCA28',  // 黄金
      500: '#FFC107',  // 濃い黄金
    },
    // アンバー/エール
    amber: {
      300: '#FFB74D',  // ライトアンバー
      400: '#FFA726',  // アンバー
      500: '#FF9800',  // ディープアンバー
      600: '#FB8C00',  // ダークアンバー
      700: '#F57C00',  // ブラウンエール
    },
    // ダークビール（スタウト、ポーター）
    dark: {
      700: '#5D4037',  // ブラウン
      800: '#4E342E',  // ダークブラウン
      900: '#3E2723',  // スタウト
      950: '#1A0E0A',  // インペリアルスタウト
    }
  },
  
  // ホップの緑
  hop: {
    300: '#AED581',  // 若いホップ
    400: '#9CCC65',  // フレッシュホップ
    500: '#8BC34A',  // 成熟ホップ
    600: '#7CB342',  // ドライホップ
    700: '#689F38',  // ダークホップ
  },
  
  // 背景色（醸造所の雰囲気）
  brewery: {
    50: '#FAFAFA',   // 明るい壁
    100: '#F5F5F5',  // タップルームの壁
    800: '#424242',  // 薄暗い醸造所
    900: '#212121',  // 夜の醸造所
    950: '#0A0A0A',  // 地下貯蔵庫
  },
  
  // セマンティックカラー
  semantic: {
    success: '#7CB342',  // ホップグリーン
    warning: '#FFA726',  // アンバーアラート
    error: '#EF5350',    // 発酵失敗の赤
    info: '#42A5F5',     // 清涼な水色
  }
};

// アニメーション設定
export const animations = {
  // ビールを注ぐような滑らかな動き
  pour: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  // 泡が上がるような弾む動き
  bubble: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // グラスを持ち上げるような動き
  lift: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  // 乾杯の動き
  cheers: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // タイミング
  duration: {
    instant: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    pour: '800ms',  // ビールを注ぐ時間
  }
};

// タイポグラフィ
export const typography = {
  fontFamily: {
    display: '"Bebas Neue", system-ui, sans-serif',  // ビールラベル風
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
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
  
  // ガラスモーフィズム
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

// カスタムプロパティを生成
export const generateCSSVariables = () => {
  const cssVars: string[] = [];
  
  // カラー変数
  Object.entries(colors).forEach(([category, shades]) => {
    if (typeof shades === 'object') {
      Object.entries(shades).forEach(([shade, value]) => {
        if (typeof value === 'string') {
          cssVars.push(`--color-${category}-${shade}: ${value};`);
        } else {
          Object.entries(value).forEach(([subShade, subValue]) => {
            cssVars.push(`--color-${category}-${shade}-${subShade}: ${subValue};`);
          });
        }
      });
    }
  });
  
  // アニメーション変数
  Object.entries(animations.duration).forEach(([name, value]) => {
    cssVars.push(`--duration-${name}: ${value};`);
  });
  
  return cssVars.join('\n  ');
};