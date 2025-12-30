/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#1C1C1E",
        surfaceSecondary: "#2C2C2E",
        accent: "#007AFF",
        accentSecondary: "#5856D6",
        textPrimary: "#FFFFFF",
        textSecondary: "#8E8E93",
        textTertiary: "#636366",
        success: "#30D158",
        warning: "#FF9F0A",
        error: "#FF453A",
      },
    },
  },
  plugins: [],
};
