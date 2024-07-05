/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#800020', // Add your custom color here
        lightBeige: '#F7E7CE',
        customColor1: "rgb(243,237,217)",
        customColor2: "rgb(214,238,214)",
        bgColor: "rgb(243,237,217)",
        cardBg: "rgb(247,236,217)",
        organizationBg: "rgb(243,230,230)",
        textColor: "rgb(48,63,88)",
        softBeige:"rgb(247,231,206)",
        gray:"rgb(88,89,83)",
        lightPink:"rgb(250,242,230)",
        darkRed:"rgb(130,0,0)",
        lightRose:"rgb(254,251,248)"
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',  
          'scrollbar-width': 'none', 
        },
      })
    }
  ],
}
