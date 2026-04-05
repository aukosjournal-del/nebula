/**
 * Atmospheric Logic Design System
 * Fusing Slite's structural rigor with Ready's organic warmth
 */

export const alTokens = {
  // Color Palette
  colors: {
    // Primary (Slite DNA - Structure)
    primary: {
      dark: '#1A1A1B',
      light: '#2A2A2B',
    },

    // Organic Background (Ready DNA - Warmth)
    background: {
      organic: '#F9F7F2',
      paper: '#FFFFFF',
      card: 'rgba(255, 255, 255, 0.7)',
    },

    // Accent System (Emotional Contrast)
    accent: {
      cyan: '#06B6D4',
      purple: '#A78BFA',
      amber: '#F59E0B',
    },

    // Semantic Colors
    semantic: {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#06B6D4',
    },

    // Text Colors
    text: {
      primary: '#1A1A1B',
      secondary: '#6B7280',
      muted: '#9CA3AF',
      light: '#D1D5DB',
    },

    // Border Colors
    border: {
      subtle: 'rgba(0, 0, 0, 0.05)',
      light: 'rgba(0, 0, 0, 0.1)',
      strong: 'rgba(0, 0, 0, 0.2)',
    },
  },

  // Spacing System (Slite 8px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Border Radius
  radius: {
    none: '0',
    subtle: '8px',
    standard: '12px',
    organic: '16px',
    pill: '9999px',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      serif: '"Georgia", serif',
      mono: '"Monaco", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Shadow System
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 4px 12px rgba(0, 0, 0, 0.08)',
    md: '0 12px 24px rgba(0, 0, 0, 0.12)',
    lg: '0 20px 40px rgba(0, 0, 0, 0.15)',
    xl: '0 30px 60px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(6, 182, 212, 0.4)',
    'glow-purple': '0 0 20px rgba(167, 139, 250, 0.4)',
  },

  // Animation/Transition Easing
  animation: {
    easing: {
      // Ready organic feel (cubic-bezier for smooth, natural motion)
      fluid: 'cubic-bezier(0.22, 1, 0.36, 1)',
      // Slite precision (fast, snappy)
      rigor: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Spring physics (bouncy, delightful)
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '600ms',
    },
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    dropdown: '1000',
    sticky: '1010',
    fixed: '1020',
    modal: '1030',
    popover: '1040',
    tooltip: '1050',
  },

  // Breakpoints (Mobile-first)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component-specific tokens
  components: {
    breathingCard: {
      padding: '24px', // 3 * 8px
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      hoverRotation: '-0.5deg',
      hoverScale: 1.0,
      hoverTranslateY: '-4px',
      shadowHover: '0 20px 40px rgba(0, 0, 0, 0.04)',
    },
    button: {
      padding: '10px 24px', // py-2.5 px-6
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      hoverScale: 1.02,
      transitionDuration: '300ms',
    },
    input: {
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      borderWidth: '1px',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      focusBorderColor: '#06B6D4',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
  },
} as const;

// Export TypeScript types for strict typing
export type ALToken = typeof alTokens;
