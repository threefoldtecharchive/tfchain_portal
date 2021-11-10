import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#8116F0',
        secondary: '#8116F0',
        tertiary: '#8116F0',
        background: '#8116F0',
      },
    },
  },
})
