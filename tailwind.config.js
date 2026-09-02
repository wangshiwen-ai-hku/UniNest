/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sketch: {
          paper: "#FAF7EE",
          notebook: "#FFFFFF",
          ink: "#1E293B",
          border: "#1E293B",
          yellow: "#FEF08A",
          green: "#DCFCE7",
          pink: "#FCE7F3",
          orange: "#FFEDD5",
          blue: "#E0F2FE",
        },
        uni: {
          hku: "#006F45",
          cuhk: "#761937",
          hkust: "#003366",
          polyu: "#A81E32",
          cityu: "#881337",
          hkbu: "#003C71",
          lingu: "#C62828",
          eduhk: "#00838F",
        }
      },
      boxShadow: {
        'sketch': '3px 3px 0px 0px #1E293B',
        'sketch-sm': '2px 2px 0px 0px #1E293B',
        'sketch-lg': '5px 5px 0px 0px #1E293B',
      },
    },
  },
  plugins: [],
};
