/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        baseblack: "var(--baseblack)",
        basewhite: "var(--basewhite)",
        bgblackcolor: "var(--bgblackcolor)",
        "variable-collection-gray1": "var(--variable-collection-gray1)",
      },
      fontFamily: {
        "button-s-regular": "var(--button-s-regular-font-family)",
        "default-bold-subheadline":
          "var(--default-bold-subheadline-font-family)",
      },
    },
  },
  plugins: [],
};
