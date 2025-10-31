/**
 * Responsive Design System
 * Enhanced breakpoints and utility classes for better mobile experience
 */

// Enhanced breakpoint system
export const breakpoints = {
  xs: '480px',   // Extra small devices (phones in portrait)
  sm: '640px',   // Small devices (phones in landscape)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (laptops)
  xl: '1280px',  // Extra large devices (desktops)
  '2xl': '1536px', // XXL devices (large desktops)
} as const;

// Responsive grid patterns
export const gridPatterns = {
  // Standard content grids
  signals: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  blueprints: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  expertise: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  stats: 'grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6',
  
  // Hero grids
  hero: 'grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8',
  features: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8',
  
  // Special layouts
  aboutTabs: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
  contactCards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
} as const;

// Enhanced spacing system
export const spacing = {
  // Container spacing
  container: 'px-4 sm:px-6 lg:px-8',
  containerWide: 'px-4 sm:px-6 lg:px-8 xl:px-12',
  
  // Section spacing
  sectionY: 'py-12 sm:py-16 lg:py-20',
  sectionYSmall: 'py-8 sm:py-12 lg:py-16',
  
  // Element spacing
  cardPadding: 'p-4 sm:p-6',
  cardPaddingLarge: 'p-6 sm:p-8',
  
  // Gaps
  gap: 'gap-4 sm:gap-6 lg:gap-8',
  gapSmall: 'gap-3 sm:gap-4',
  gapLarge: 'gap-6 sm:gap-8 lg:gap-12',
} as const;

// Typography responsive patterns
export const typography = {
  // Headings
  h1: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight',
  h2: 'text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight',
  h3: 'text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight',
  h4: 'text-lg sm:text-xl lg:text-2xl font-semibold',
  
  // Body text
  lead: 'text-lg sm:text-xl text-slate-600 leading-relaxed',
  body: 'text-base sm:text-lg text-slate-700 leading-relaxed',
  small: 'text-sm sm:text-base text-slate-600',
  
  // UI elements
  nav: 'text-sm sm:text-base font-medium',
  button: 'text-sm sm:text-base font-medium',
  caption: 'text-xs sm:text-sm text-slate-500',
} as const;

// Mobile-first card patterns
export const cardPatterns = {
  // Standard cards with better mobile spacing
  standard: `
    rounded-xl sm:rounded-2xl 
    bg-white 
    border border-black/10 
    shadow-sm hover:shadow-md 
    transition-all duration-300
    ${spacing.cardPadding}
  `,
  
  // Interactive cards with hover states
  interactive: `
    rounded-xl sm:rounded-2xl 
    bg-white 
    border border-black/10 
    shadow-sm hover:shadow-lg 
    hover:-translate-y-1 
    transition-all duration-300 
    cursor-pointer
    ${spacing.cardPadding}
    active:scale-95
  `,
  
  // Highlight cards
  highlight: `
    rounded-xl sm:rounded-2xl 
    bg-gradient-to-br from-blue-50 to-indigo-50 
    border border-blue-200 
    shadow-sm hover:shadow-md 
    transition-all duration-300
    ${spacing.cardPadding}
  `,
} as const;

// Touch-friendly interactive elements
export const interactive = {
  // Minimum touch target size (44px)
  touchTarget: 'min-h-[44px] min-w-[44px]',
  
  // Button patterns
  button: {
    small: 'px-3 py-2 sm:px-4 sm:py-2 text-sm min-h-[40px]',
    medium: 'px-4 py-2 sm:px-6 sm:py-3 text-base min-h-[44px]',
    large: 'px-6 py-3 sm:px-8 sm:py-4 text-lg min-h-[48px]',
  },
  
  // Link patterns with proper spacing
  link: 'inline-flex items-center gap-2 hover:gap-3 transition-all duration-200',
  
  // Form elements
  input: 'px-3 py-2 sm:px-4 sm:py-3 text-base min-h-[44px] rounded-lg',
} as const;

// Responsive utility functions
export const responsive = {
  // Check if screen size matches breakpoint
  isBreakpoint: (breakpoint: keyof typeof breakpoints) => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches;
  },
  
  // Get responsive class based on screen size
  getResponsiveClass: (classes: Record<string, string>) => {
    if (typeof window === 'undefined') return classes.default || '';
    
    for (const [breakpoint, className] of Object.entries(classes)) {
      if (breakpoint === 'default') continue;
      if (responsive.isBreakpoint(breakpoint as keyof typeof breakpoints)) {
        return className;
      }
    }
    
    return classes.default || '';
  },
} as const;

// Animation patterns optimized for mobile
export const animations = {
  // Reduced motion for mobile performance
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Stagger animations for lists
  stagger: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0 },
    },
  },
} as const;