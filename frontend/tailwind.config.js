/** @type {import('tailwindcss').Config} */
 export default {
  content: [
   "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // adjust if needed
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }, // adjust height
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite", // duration + easing
      },
    },
  },
  plugins: [],
}