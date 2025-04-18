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
                'fade-in': 'fadeIn 0.2s ease-in-out',
            },
            keyframes: {
                waveAnim: {
                    '0%, 100%': { height: '10%' },
                    '50%': { height: '100%' },
                },
                fadeIn: {
                    from: { opacity: 0, transform: 'scale(0.9)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
