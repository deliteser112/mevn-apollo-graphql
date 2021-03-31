// IMPORTS
import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../pages/MainPage.vue'
import LoginPage from '../pages/LoginPage.vue'

Vue.use(Router)

// ROUTES
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'welcome',
    component: MainPage
  }
]
// EXPORT ROUTER
export default new Router({
  mode: 'history',
  routes
})
