import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";

import AddPost from './components/Posts/AddPost.vue'
import AddTemplate from './components/Posts/AddTemplate.vue'
import Posts from './components/Posts/Posts.vue'
import Post from './components/Posts/Post.vue'

import Dataset from './components/User/Dataset.vue'
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
      component: Dataset,
      beforeEnter: AuthGuard
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true
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
