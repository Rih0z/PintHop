/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ブルワリー/クラフトビールの雰囲気を反映した配色
        'primary': '#F59E0B', // アンバー系
        'secondary': '#78350F', // 濃い茶色
        'accent': '#10B981', // ホップグリーン
      },
    },
  },
  plugins: [],
}
