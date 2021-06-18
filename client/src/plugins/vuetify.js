import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import 'vuetify/dist/vuetify.min.css'


Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: "#1867c0",
    secondary: "#7f93c1",
    accent: "#c5d2b2",
    error: "#722d0e",
    warning: "#A37513",
    info: "#396893",
    success: "#4caf50"
  }
})
