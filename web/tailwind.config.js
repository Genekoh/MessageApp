const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
        },
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: colors.black,
            white: colors.white,
            gunmetal: "#2C363F",
            blush: "#E75A7C",
            ivory: "#F2F5EA",
            timberwolf: "#D6DBD2",
            laurelgreen: "#BBC7A4",
        },
    },
    plugins: [],
};
