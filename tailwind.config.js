/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'up': 'cubic-bezier(0.8, 0, 1, 1)',
        'down': 'cubic-bezier(0, 0, 0.2, 1)'
      },
      keyframes: {
        small_bounce: {
            '0%, 100%': {
              transform: 'translateY(-5%)',
              transitionTimingFunction: 'up'
            },
            '50%': {
              transform: 'translateY(0)',
              transitionTimingFunction: 'down'
            }
        },
        pop_1: {
          '100%': {
            transform: 'translateY(0) translateX(0) rotate(180deg)',
            transitionTimingFunction: 'up',
            opacity: 0.0
          },
          '50%': {
            transform: 'translateY(-2rem) translateX(-3rem) rotate(160deg) scale(0.75)',
            transitionTimingFunction: 'down',
            opacity: 0.3
          },
          '0%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up'
          }
        },
        pop_2: {
          '100%': {
            transform: 'translateY(0) translateX(0) rotate(180deg)',
            transitionTimingFunction: 'up',
            opacity: 0.0
          },
          '50%': {
            transform: 'translateY(2rem) translateX(-3rem) rotate(120deg)',
            transitionTimingFunction: 'down',
            opacity: 0.3
          },
          '0%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up'
          }
        },
        pop_3: {
          '100%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up',
            opacity: 0.0
          },
          '50%': {
            transform: 'translateY(-2rem) translateX(3rem) rotate(45deg) scale(1.25)',
            transitionTimingFunction: 'down',
            opacity: 0.3
          },
          '0%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up'
          }
        },
        pop_4: {
          '100%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up',
            opacity: 0.0
          },
          '50%': {
            transform: 'translateY(2rem) translateX(3rem) rotate(180deg) scale(0.75)',
            transitionTimingFunction: 'down',
            opacity: 0.3
          },
          '0%': {
            transform: 'translateY(0) translateX(0)',
            transitionTimingFunction: 'up'
          }
        },
      },
      animation: {
        small_bounce: 'small_bounce 1s infinite',
        pop_1: 'pop_1 1s infinite',
        pop_2: 'pop_2 1s infinite',
        pop_3: 'pop_3 1s infinite',
        pop_4: 'pop_4 1s infinite'
      }
    },
  },
  plugins: [],
};
