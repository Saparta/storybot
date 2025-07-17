export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2ba7d0',
        secondary: '#793200',
        accent: '#ffeace',
        muted: '#8f7158',
      },
      fontFamily: {
        mono: ['"Source Code Pro"', 'monospace'],
        sans: ['"Fira Sans Condensed"', 'sans-serif'],
        body: ['Khula', 'sans-serif'],
      },
    },
  },
  plugins: [],
}