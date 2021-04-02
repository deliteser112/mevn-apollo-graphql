// IMPORTS
import Vue from 'vue'
import Router from 'vue-router'
import welcomeComponent from '../components/welcomeComponent'
import LoginPage from '../pages/LoginPage'

Vue.use(Router)

// ROUTES
const routes = [
  {
    path: '/',
    name: 'welcome',
    component: welcomeComponent
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  }
]
// EXPORT ROUTER
export default new Router({
  mode: 'history',
  routes
})
