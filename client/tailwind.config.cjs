/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
    themes: [
      "light",
      "dark",
      "bumblebee",
      "valentine",
      "halloween",
      "forest",
      "aqua",
      "lofi",
      "black",
      "dracula",
      "night",
      "winter",
    ],
  },
  plugins: [require("daisyui")],
};
