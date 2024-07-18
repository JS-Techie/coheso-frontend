import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/theme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input|dropdown|modal|card|dropdown|table|image|avatar|checkbox|modal|date-picker).js'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
