/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#262626",
        "custom-blue": "#d5e8eb",
        "leaflet-gray": "#cccccc",
        "leaflet-dark-gray": "#1e1e1e",
      },
    },
  },
  plugins: [],
};
