/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                wave: 'waveAnim 1s infinite ease-in-out',
            },
            keyframes: {
                waveAnim: {
                    '0%, 100%': { height: '10%' },
                    '50%': { height: '100%' },
                },
            },
        },
    },
    plugins: [],
};
