/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#262626",
        "custom-white": "#ffffff",
      },
    },
  },
  plugins: [],
};
