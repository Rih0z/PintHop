/**
 * Modern Design System for PintHop
 * Based on color psychology and persona analysis
 * Inspired by Netflix/Uber design principles
 */

// Modern Color Palette based on color psychology
export const modernColors = {
  // Primary - Optimistic & Energetic (Appeals to millennials)
  primary: {
    50: '#FFF8E1',   // Light cream
    100: '#FFECB3',  // Soft gold
    200: '#FFD54F',  // Bright gold
    300: '#FFCA28',  // Primary gold
    400: '#FFC107',  // Strong gold
    500: '#FFB300',  // Deep gold
    600: '#FFA000',  // Rich gold
    700: '#FF8F00',  // Dark gold
    800: '#FF6F00',  // Burnt gold
    900: '#E65100',  // Deep orange
  },
  
  // Neutral - Professional & Clean (Like Netflix/Uber)
  neutral: {
    0: '#FFFFFF',     // Pure white
    50: '#FAFAFA',    // Off white
    100: '#F5F5F5',   // Light gray
    200: '#EEEEEE',   // Gray 200
    300: '#E0E0E0',   // Gray 300
    400: '#BDBDBD',   // Gray 400
    500: '#9E9E9E',   // Gray 500
    600: '#757575',   // Gray 600
    700: '#616161',   // Gray 700
    800: '#424242',   // Gray 800
    900: '#212121',   // Almost black
    950: '#121212',   // True dark (Netflix dark)
  },
  
  // Accent - Trust & Stability (Appeals to health-conscious users)
  accent: {
    green: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      400: '#66BB6A',  // Success/Health
      500: '#4CAF50',
      600: '#43A047',
    },
    blue: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      400: '#42A5F5',  // Information
      500: '#2196F3',
      600: '#1E88E5',
    },
    red: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      400: '#EF5350',  // Alert/High ABV
      500: '#F44336',
      600: '#E53935',
    }
  },
  
  // Semantic colors for health-conscious features
  health: {
    lowCalorie: '#66BB6A',    // Green for healthy
    moderate: '#FFB300',      // Amber for moderate
    highCalorie: '#FF7043',   // Orange-red for high
    lowABV: '#81C784',        // Light green for session beers
    highABV: '#FF8A65',       // Orange for strong beers
  },
  
  // Social features
  social: {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    untappd: '#FFC000',
  }
};

// Modern Typography (Netflix/Uber inspired)
export const modernTypography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
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
    '7xl': '4.5rem',   // 72px
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  }
};

// Modern Spacing System (8pt grid like Uber)
export const modernSpacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// Modern Shadows (Subtle like Netflix)
export const modernShadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 8px 10px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 12px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Elevation shadows (Material Design inspired)
  elevation: {
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
  }
};

// Border Radius (Modern, slightly rounded)
export const modernBorderRadius = {
  none: '0',
  sm: '0.25rem',     // 4px
  base: '0.375rem',  // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
  
  // Component specific
  button: '0.5rem',      // 8px
  card: '1rem',          // 16px
  modal: '1.25rem',      // 20px
  input: '0.5rem',       // 8px
};

// Animation (Smooth like Uber)
export const modernAnimations = {
  duration: {
    instant: '50ms',
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms',
    lazy: '750ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  
  // Predefined animations
  fadeIn: 'fadeIn 250ms ease-out',
  fadeOut: 'fadeOut 250ms ease-in',
  slideUp: 'slideUp 350ms cubic-bezier(0, 0, 0.2, 1)',
  slideDown: 'slideDown 350ms cubic-bezier(0, 0, 0.2, 1)',
  scaleIn: 'scaleIn 250ms cubic-bezier(0, 0, 0.2, 1)',
  scaleOut: 'scaleOut 250ms cubic-bezier(0.4, 0, 1, 1)',
};

// Breakpoints for responsive design
export const modernBreakpoints = {
  xs: '375px',    // iPhone SE
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Wide screen
};

// Z-index scale
export const modernZIndex = {
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
  max: 9999,
};

// Component-specific styles
export const modernComponents = {
  button: {
    base: {
      borderRadius: modernBorderRadius.button,
      fontWeight: modernTypography.fontWeight.medium,
      transition: `all ${modernAnimations.duration.fast} ${modernAnimations.easing.easeOut}`,
      fontSize: modernTypography.fontSize.base,
      padding: `${modernSpacing[2.5]} ${modernSpacing[5]}`,
      minHeight: '44px', // iOS touch target
    },
    sizes: {
      sm: {
        fontSize: modernTypography.fontSize.sm,
        padding: `${modernSpacing[2]} ${modernSpacing[4]}`,
        minHeight: '36px',
      },
      md: {
        fontSize: modernTypography.fontSize.base,
        padding: `${modernSpacing[2.5]} ${modernSpacing[5]}`,
        minHeight: '44px',
      },
      lg: {
        fontSize: modernTypography.fontSize.lg,
        padding: `${modernSpacing[3]} ${modernSpacing[6]}`,
        minHeight: '52px',
      },
    },
    variants: {
      primary: {
        backgroundColor: modernColors.primary[500],
        color: modernColors.neutral[950],
        boxShadow: modernShadows.sm,
        '&:hover': {
          backgroundColor: modernColors.primary[600],
          boxShadow: modernShadows.md,
        },
        '&:active': {
          backgroundColor: modernColors.primary[700],
          boxShadow: modernShadows.xs,
        },
      },
      secondary: {
        backgroundColor: modernColors.neutral[100],
        color: modernColors.neutral[900],
        border: `1px solid ${modernColors.neutral[300]}`,
        '&:hover': {
          backgroundColor: modernColors.neutral[200],
          borderColor: modernColors.neutral[400],
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: modernColors.neutral[700],
        '&:hover': {
          backgroundColor: modernColors.neutral[100],
        },
      },
    },
  },
  
  card: {
    base: {
      backgroundColor: modernColors.neutral[0],
      borderRadius: modernBorderRadius.card,
      boxShadow: modernShadows.base,
      overflow: 'hidden',
      transition: `all ${modernAnimations.duration.base} ${modernAnimations.easing.easeOut}`,
    },
    interactive: {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: modernShadows.lg,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
  },
  
  input: {
    base: {
      borderRadius: modernBorderRadius.input,
      fontSize: modernTypography.fontSize.base,
      padding: `${modernSpacing[3]} ${modernSpacing[4]}`,
      minHeight: '44px',
      backgroundColor: modernColors.neutral[50],
      border: `1px solid ${modernColors.neutral[300]}`,
      transition: `all ${modernAnimations.duration.fast} ${modernAnimations.easing.easeOut}`,
      '&:focus': {
        borderColor: modernColors.primary[500],
        backgroundColor: modernColors.neutral[0],
        outline: 'none',
        boxShadow: `0 0 0 3px ${modernColors.primary[500]}20`,
      },
    },
  },
};

// Mobile-first utilities
export const mobileFirst = {
  // Touch targets
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
  },
  
  // Safe areas for iOS
  safeArea: {
    paddingTop: 'env(safe-area-inset-top)',
    paddingRight: 'env(safe-area-inset-right)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
  },
  
  // Thumb-friendly zones
  thumbZone: {
    bottom: modernSpacing[16], // 64px from bottom
    sides: modernSpacing[4],   // 16px from sides
  },
};

// Export utility function for responsive values
export const responsive = <T extends Record<string, any>>(values: {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) => values;

// CSS-in-JS helper for modern gradients
export const modernGradients = {
  // Brand gradients
  primary: `linear-gradient(135deg, ${modernColors.primary[400]} 0%, ${modernColors.primary[600]} 100%)`,
  secondary: `linear-gradient(135deg, ${modernColors.neutral[100]} 0%, ${modernColors.neutral[200]} 100%)`,
  
  // Health gradients
  healthy: `linear-gradient(135deg, ${modernColors.accent.green[400]} 0%, ${modernColors.accent.green[600]} 100%)`,
  moderate: `linear-gradient(135deg, ${modernColors.primary[400]} 0%, ${modernColors.primary[600]} 100%)`,
  caution: `linear-gradient(135deg, ${modernColors.accent.red[400]} 0%, ${modernColors.accent.red[600]} 100%)`,
  
  // Overlay gradients (Netflix-style)
  darkOverlay: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)`,
  lightOverlay: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)`,
  
  // Social gradients
  instagram: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
};

export default {
  colors: modernColors,
  typography: modernTypography,
  spacing: modernSpacing,
  shadows: modernShadows,
  borderRadius: modernBorderRadius,
  animations: modernAnimations,
  breakpoints: modernBreakpoints,
  zIndex: modernZIndex,
  components: modernComponents,
  mobileFirst,
  gradients: modernGradients,
};