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
      animation: {
        "fade-in": "fade-in 0.8s forwards ease-in-out",
        "enter-from-top": "enter-from-top 0.5s forwards ease-in-out",
        expand: "expand 0.3s forwards ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "enter-from-top": {
          "0%": {
            transform: "translateY(-20px)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
        expand: {
          "0%": { "grid-template-rows": "0fr" },
          "100% ": { "grid-template-rows": "1fr" },
        },
      },
    },
  },
  plugins: [],
};
