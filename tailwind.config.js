/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Keeping existing shadcn settings
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        // Adding your custom theme
        'primary-bg': '#1b1b1b', // Warmer dark background
        'secondary-bg': '#262626', // Lighter dark for contrast
        'primary-text': '#f2f2f2', // Warmer white for readability
        'secondary-text': '#c0c0c0', // Improved contrast for secondary text
        'muted-text': '#d9d9d9', // Muted text for subtlety
        'accent-red': '#ff5252', // Red for CTAs
        'accent-blue': '#5a9bf5', // Blue for secondary actions
        'accent-green': '#00e676', // Green for success
        'hover-red': '#ff6e6e', // Hover state for red accents
        'hover-blue': '#6ba8ff', // Hover state for blue accents
        'hover-green': '#33ff99', // Hover state for green accents
      },
      fontFamily: {
        // Adding your custom fonts
        sans: ['Montserrat', 'sans-serif'], // Body text
        poppins: ['Poppins', 'sans-serif'], // Headings
        roboto: ['Roboto', 'sans-serif'], // Special sections
      },
    },
  },
  plugins: [import('tailwindcss-animate')],
};
