/** @type {import('tailwindcss').Config} */
module.exports = {
  // Escanea todos los archivos en la carpeta 'app' y 'components'
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
       colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: "var(--primary)",
      accent: "var(--accent)",
      card: "var(--card)",
    },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(-100%) translateY(-50%)" },
          "100%": { transform: "translateX(calc(100vw - 120px)) translateY(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "cart-flash": {
          "0%, 100%": { 
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          },
          "50%": { 
            boxShadow: "0 0 40px 5px rgba(255, 165, 0, 0.6), 0 25px 50px -12px rgb(0 0 0 / 0.25)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 1.5s ease-in-out",
        "fade-in": "fade-in 0.5s ease-out",
        "wiggle": "wiggle 0.3s ease-in-out infinite",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "cart-flash": "cart-flash 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};
