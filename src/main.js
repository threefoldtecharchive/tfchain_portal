import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './plugins/vuex'
import router from './router'
import Toasted from 'vue-toasted'

import secondsToReadable from '../src/filters/secondsToReadable'
import toTeraOrGiga from './filters/toTerraOrGiga'

Vue.config.productionTip = false

Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 4000
})
Vue.filter('secondsToReadable', secondsToReadable)
Vue.filter('toTerraOrGiga', toTeraOrGiga)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
