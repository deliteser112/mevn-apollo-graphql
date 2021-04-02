import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: "#5176bb",
    secondary: "#7f93c1",
    accent: "#c5d2b2",
    error: "#722d0e",
    warning: "#A37513",
    info: "#396893",
    success: "#4caf50"
  }
})
