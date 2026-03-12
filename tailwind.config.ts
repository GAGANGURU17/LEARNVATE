import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
      },
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#fff0db',
          200: '#ffe0b8',
          300: '#ffcc8a',
          400: '#ffb35c',
          500: '#FF9933',
          600: '#e67a19',
          700: '#bf5a0d',
          800: '#994008',
          900: '#7d3309',
        },
        navy: {
          50: '#f0f1fa',
          100: '#dde0f5',
          200: '#b8bceb',
          300: '#8e94d9',
          400: '#5a62c2',
          500: '#000080',
          600: '#000070',
          700: '#000060',
          800: '#000045',
          900: '#00002a',
        },
        igreen: {
          50: '#f0faf0',
          100: '#dcf5dc',
          200: '#b5e8b2',
          300: '#82d47d',
          400: '#4ab943',
          500: '#138808',
          600: '#107206',
          700: '#0c5a05',
          800: '#094504',
          900: '#063002',
        },
        primary: {
          50: '#fff8f0',
          100: '#fff0db',
          200: '#ffe0b8',
          300: '#ffcc8a',
          400: '#ffb35c',
          500: '#FF9933',
          600: '#e67a19',
          700: '#bf5a0d',
          800: '#994008',
          900: '#7d3309',
        },
        accent: {
          50: '#f0faf0',
          100: '#dcf5dc',
          200: '#b5e8b2',
          300: '#82d47d',
          400: '#4ab943',
          500: '#138808',
          600: '#107206',
          700: '#0c5a05',
          800: '#094504',
          900: '#063002',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'count-up': 'countUp 0.8s ease-out both',
        'card-lift': 'cardLift 0.3s ease-out',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 153, 51, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 153, 51, 0.4)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-6px) scale(1.01)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(255,153,51,0.3)' },
          '33%': { borderColor: 'rgba(19,136,8,0.3)' },
          '66%': { borderColor: 'rgba(0,0,128,0.3)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(255,153,51,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        'card-green': '0 8px 30px rgba(19,136,8,0.10), 0 4px 12px rgba(0,0,0,0.04)',
        'card-navy': '0 8px 30px rgba(0,0,128,0.10), 0 4px 12px rgba(0,0,0,0.04)',
        'glow-saffron': '0 0 30px rgba(255,153,51,0.25)',
        'glow-green': '0 0 30px rgba(19,136,8,0.20)',
        'glow-navy': '0 0 30px rgba(0,0,128,0.20)',
        'elevated': '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'nav': '0 2px 20px rgba(0,0,0,0.06)',
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};

export default config;
