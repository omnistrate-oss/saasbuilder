/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "var(--purple-50)",
          200: "var(--purple-200)",
          600: "var(--purple-600)",
          700: "var(--purple-700)",
          900: "var(--purple-900)",
        },

        gray: {
          50: "var(--gray-50)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
        },

        success: {
          50: "var(--success-50)",
          200: "var(--success-200)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
        },

        error: {
          50: "var(--error-50)",
          200: "var(--error-200)",
          700: "var(--error-700)",
        },
      },
    },
  },
  plugins: [],
};
