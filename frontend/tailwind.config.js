/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors (Netflix/Uber inspired)
        primary: {
          50: '#FFF4E6',
          100: '#FFE4B8',
          200: '#FFD48A',
          300: '#FFC45C',
          400: '#FFB42E',
          500: '#FF6B35', // Main brand color
          600: '#E55A2B',
          700: '#CC4921',
          800: '#B23817',
          900: '#99270D',
        },
        // Dark Theme (Netflix-style)
        dark: {
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#424242',
          600: '#2D2D2D', // Secondary dark
          700: '#212121',
          800: '#1A1A1A', // Main dark
          900: '#121212', // Deepest dark
        },
        // Accent Colors
        accent: {
          gold: '#FFD700',
          blue: '#003566',
          success: '#28A745',
          warning: '#FFC107',
          danger: '#DC3545',
        },
        // Semantic Colors
        beer: {
          50: '#FEF7E6',
          100: '#FDECC0',
          200: '#FBE19A',
          300: '#F9D674',
          400: '#F7CB4E',
          500: '#F5C028', // Beer golden
          600: '#E0AC24',
          700: '#CC9720',
          800: '#B7831C',
          900: '#A36F18',
        },
        // Health-conscious colors (persona-based)
        health: {
          low: '#66BB6A',      // Good health (green)
          moderate: '#FFB300', // Moderate (amber)
          high: '#FF7043',     // Poor health (orange-red)
          lowABV: '#81C784',   // Session beers
          highABV: '#FF8A65',  // Strong beers
        },
        // Modern neutrals (Netflix-inspired)
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#121212',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.15)',
        'strong': '0 10px 40px 0 rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    // Add custom utilities for mobile optimization
    function({ addUtilities, addComponents }) {
      // Mobile-first utilities
      const mobileUtilities = {
        // Safe area utilities for iOS
        '.safe-area-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.safe-area-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.safe-area-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.safe-area-inset': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-right': 'env(safe-area-inset-right)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
        },
        // Touch targets (minimum 44px for iOS)
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        // Glass morphism effects
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(0, 0, 0, 0.3)',
        },
        // Text truncation utilities
        '.line-clamp-1': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      }
      
      // Modern component styles
      const modernComponents = {
        '.modern-card': {
          'background': 'rgba(255, 255, 255, 0.9)',
          'backdrop-filter': 'blur(10px)',
          'border-radius': '1rem',
          'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'transition': 'all 0.25s ease-out',
        },
        '.modern-button': {
          'padding': '0.625rem 1.25rem',
          'border-radius': '0.5rem',
          'font-weight': '500',
          'transition': 'all 0.15s ease-out',
          'min-height': '44px',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.modern-input': {
          'padding': '0.75rem 1rem',
          'border-radius': '0.5rem',
          'border': '1px solid #E0E0E0',
          'min-height': '44px',
          'transition': 'all 0.15s ease-out',
          'background': '#FAFAFA',
          '&:focus': {
            'border-color': '#FFB300',
            'background': '#FFFFFF',
            'outline': 'none',
            'box-shadow': '0 0 0 3px rgba(255, 179, 0, 0.1)',
          },
        },
      }
      
      addUtilities(mobileUtilities, ['responsive'])
      addComponents(modernComponents)
    }
  ],
}
