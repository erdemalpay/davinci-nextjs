const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    plugin(
      function ({ addUtilities, theme, e }) {
        const values = theme("colCount");

        var utilities = Object.entries(values).map(([key, value]) => {
          return {
            [`.${e(`col-count-${key}`)}`]: { columnCount: `${value}` },
          };
        });

        addUtilities(utilities);
      },
      {
        theme: {
          colCount: {
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
          },
        },
      }
    ),
  ],
};
