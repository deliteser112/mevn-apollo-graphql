// IMPORTS
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import Vuetify from 'vuetify'
import ApolloClient from './apollo'
import store from './store'
import router from './router'
import App from './App.vue'

import VueMaterial from 'vue-material'
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

// SETUP PLUGINS
Vue.config.productionTip = false
Vue.use(VueApollo)
Vue.use(Vuetify)

Vue.use(VueMaterial)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)

// APOLLO PROVIDER
const apolloProvider = new VueApollo({
  defaultClient: ApolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

new Vue({
  store,
  router,
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App)
})
