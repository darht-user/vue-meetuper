import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuelidate from 'vuelidate'
import toasted from 'vue-toasted'
import AppSocket from './plugins/socket'

import AppHero from './components/shared/AppHero'
import AppSpinner from './components/shared/AppSpinner'
import filters from './filters'

Vue.use(vuelidate)
Vue.use(toasted)


Vue.config.productionTip = false

Vue.component('AppHero', AppHero)
Vue.component('AppSpinner', AppSpinner)

filters()

Vue.use(AppSocket, {connection: process.env.VUE_APP_URI})

new Vue({
  router,
  store,
  vuelidate,
  render: h => h(App),
}).$mount('#app')
