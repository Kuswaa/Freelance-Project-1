/** @type {import('tailwindcss').Config} */
module.exports =
{
  content: 
  [
    "./src/**/*.{html,ts}",
  ],
  
  theme:
  {
    extend: {},
    screens:
    {
      'lg': '1024px',
      'md': {'max': '1023px'},
      'sm': {'max': '767px'},
      'xs': {'max': '425px'},
    },
  },
  
  plugins: [
    
  ],
  
  darkMode: 'class'
}
