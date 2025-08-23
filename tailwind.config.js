/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tiktok-pink": "#FF0050",
        "tiktok-blue": "#25F4EE",
        "tiktok-black": "#161823",
      },
      backgroundImage: {
        "gradient-tiktok": "linear-gradient(135deg, #FF0050 0%, #25F4EE 100%)",
        "gradient-card":
          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
      },
    },
  },
  plugins: [],
};
