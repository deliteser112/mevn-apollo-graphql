import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

// global error component
import FormAlert from './components/System/FormAlert';
import JSZip from 'jszip'

import VueBlobJsonCsv from 'vue-blob-json-csv';

Vue.use(VueBlobJsonCsv)

Vue.use(JSZip)

Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

// Setup ApolloClient
// with token for auth routes
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",

  // for hosting  ------->
  // uri: "http://172.25.5.101:4000/graphql",
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem('token', '');
      localStorage.setItem('user', '');
    }
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if(err.name === 'AuthenticationError') {
           store.commit('setAuthError', err);
           store.dispatch('logoutUser');
        }
      }
    }
  }

});

// needs to be called even before beforeCreate()
// otherwise AuthGuard in router is called before user is initalized
store.dispatch('initUser');

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
}).$mount("#app");
