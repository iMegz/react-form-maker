/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        "primary-dark": "#2563eb",
        warning: "#facc15",
        "warning-dark": "#eab308",
        danger: "#dc2626",
        "danger-dark": "#991b1b",
      },
    },
  },
  plugins: [],
};
