module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Světlé téma
        primary: {
          DEFAULT: '#7d9b69',
          dark: '#4e6a4d',
          light: '#c3d5ae',
          background: '#f3f8e8',
        },
        // Tmavé téma
        'primary-dark': {
          DEFAULT: '#4e6a4d',
          dark: '#2d3e23',
          light: '#7d9b69',
          background: '#1a1d1a',
        },
      },
    },
  },
  plugins: [],
}