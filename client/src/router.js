import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";

import AddPost from './components/Posts/AddPost.vue'
import AddTemplate from './components/Posts/AddTemplate.vue'

import Dataset from './components/User/Dataset.vue'
import Reports from './components/User/Reports.vue'

import Login from './components/Auth/Login.vue'
import Register from './components/Auth/Register.vue'

import AuthGuard from './AuthGuard';

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter: AuthGuard
    },
    {
      path: "/post/addpost",
      name: "AddPost",
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: "/post/addtemplate",
      name: "AddTemplate",
      component: AddTemplate,
      beforeEnter: AuthGuard
    },
    {
      path: "/dataset",
      name: "Dataset",
      component: Dataset,
      beforeEnter: AuthGuard
    },
    {
      path: "/reports",
      name: "Reports",
      component: Reports,
      beforeEnter: AuthGuard
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    }
  ]
});
