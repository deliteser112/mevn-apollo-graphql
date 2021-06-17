import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';

Vue.use(Vuex)

import {
  GET_POSTS,
  GET_TEMPLATES,
  ADD_POST,
  ADD_TEMPLATE,
  ADD_REPORT,
  SAVE_TEMPLATES,
  UPDATE_USER_POST,
  UPDATE_USER_TEMPLATE,
  UPDATE_PROC_TEMPLATE, 
  DELETE_USER_POST,
  DELETE_USER_REPORT,
  DELETE_USER_TEMPLATE,
  DELETE_USER_SAVED_TEMPLATE,
  LOGIN_USER,
  REGISTER_USER,
  GET_CURRENT_USER,
  GET_USER_POSTS,
  GET_USER_REPORTS,
  GET_USER_TEMPLATES,
  GET_USER_SAVED_TEMPLATES,
  GET_SAVED_TEMPLATES,
  SEARCH_POSTS,
  INFINITE_SCROLL_POSTS,
  INFINITE_SCROLL_TEMPLATES
} from './queries';
import { defaultClient as apolloClient } from './main';

export default new Vuex.Store({
  state: {
    posts: [],
    templates: [],
    loading: false,
    user: null,
    error: null,
    authError: null,
    searchResults: [],
    userPosts: [],
    userReports: [],
    userTemplates: [],
    userSavedTemplates: [],
    postCategories: ['$var_ip', '$var_sm', '$var_gw', 'address', 'location'],
    sampleDatasets: [
      {
        "_id":"dataset_101",
        "categories": ["test1","1001","101.1.1.1","255.0.0.0","10.1.1.254","CologneStr1","Michael","test1","1002","102.1.1.2","255.255.224.0","10.1.1.254","Newstreet1","Michael","test1","1003","103.1.1.8","255.0.0.0","10.1.1.254","Newstreet1","Peter","test1","1004","172.16.2.2","255.255.224.0","172.16.2.254","CologneStr1","Michael","test1","1005","153.1.1.1","255.0.0.0","10.1.1.254","Newstreet1","Peter","test1","1006","233.1.1.2","255.0.0.0","10.1.1.254","Newstreet1","Michael","test1","1007","30.1.1.2","255.255.224.0","10.1.1.254","CologneStr1","Peter","test1","1008","241.1.1.8","255.0.0.0","10.1.1.254","Newstreet1","Peter","test1","1009","172.16.2.2","255.255.224.0","172.16.2.254","CologneStr1","Michael"],
        "description": "no description",
        "imageUrl": "../../../assets/dataset-icon.jpg",
        "title": "Default_Dataset",
        "variables":["project_id","node_id","$var_IP","$var_SM","$var_GW","$var_address","$var_contact"],
      }
    ],
    
    sampleTemplates: [
      {
        "_id":"template_101",
        "content": " Template:\n---\n- project_id: test1\n  node_id: *\n\n\n  tasks:\n \n  - IP of Node: $var_IP \n    \n - SM of Node: $var_SM\n    \n - GW of Node: $var_GW \n \n - Name of Node: $var_address\n    \n - Node is located at location: $var_contact\n \n \n For questions please call us at : +49111111111\n \n  \n    \n",
        "description": "no description",
        "templateType": "single",
        "title": "Default_Template_1"
      },
      {
        "_id":"template_102",
        "content": "Template:\n---\n- project_id: test2\n  node_id: 2001, 2003, 2004\n\n\n  tasks:\n \n  - IP of Node: $var_IP \n    \n - SM of Node: $var_SM\n    \n - GW of Node: $var_GW \n \n - Name of Node: $var_hostname\n    \n \n Node is located at location: $location\n \n \n For questions please call us at : +49111111111\n \n  \n    \n",
        "description": "no description",
        "templateType": "single",
        "title": "Default_Template_2"
      },
      {
        "_id":"template_103",
        "content": " Template:\n---\n- project_id: test3\n  node_id: 3005 \n\n\n  tasks:\n \n  - IP of Node: $var_IP \n    \n - SM of Node: $var_SM\n    \n - GW of Node: $var_GW \n \n - Name of Node: $var_address\n    \n \n Node is located at location: $var_contact\n \n \n For questions please call us at : +49111111111\n \n  \n    \n",
        "description": "no description",
        "templateType": "single",
        "title": "Default_Template_3"
      }
    ],
  },
  mutations: {
    setPosts: (state, posts) => {
      state.posts = posts;
    },
    setTemplates: (state, templates) => {
      state.templates = templates;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setUserReports: (state, payload) => {
      state.userReports = payload;
    },
    setUserTemplates: (state, payload) => {
      state.userTemplates = payload;
    },
    setUserSavedTemplates: (state, payload) => {
      state.userSavedTemplates = payload;
    },
    setLoading: (state, value) => {
      state.loading = value;
    },
    setUser: (state, user) => {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setError: (state, error) => {
      state.error = error;
    },
    setAuthError: (state, error) => {
      state.authError = error;
    },
    clearUser: state => {
      state.user = null;
      localStorage.setItem('user', '');
    },
    clearError: state => (state.error = null),
    clearSearchResults: state => {
      state.searchResults = []
    }
  },
  actions: {
    initUser: ({ commit, state }) => {
      if (localStorage.getItem('user')) {
        state.user = JSON.parse(localStorage.getItem('user'));
      }
    },
    getCurrentUser: ({ commit }) => {
      commit('setLoading');
      apolloClient.query({
        query: GET_CURRENT_USER
      }).then(({ data }) => {
        commit('setUser', data.getCurrentUser);
        commit('setLoading', false);
      }).catch(err => {
        console.log(err)
        commit('setLoading', false);
      });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          // console.log(data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },

    getUserReports: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_REPORTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserReports", data.getUserReports);
          // console.log(data.getUserReports);
        })
        .catch(err => {
          console.error(err);
        });
    },

    getUserTemplates: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_TEMPLATES,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserTemplates", data.getUserTemplates);
          // console.log(data.getUserTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getUserSavedTemplates: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_SAVED_TEMPLATES,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserSavedTemplates", data.getUserSavedTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({ data }) => {
        commit('setPosts', data.getPosts);
        commit('setLoading', false);
      }).catch(err => {
        // console.log(err)
        commit('setLoading', false);
      });
    },
    getTemplates: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_TEMPLATES
        }).then(({ data }) => {
        commit('getTemplates', data.getTemplates);
        commit('setLoading', false);
      }).catch(err => {
        // console.log(err)
        commit('setLoading', false);
      });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload,
      }).then(({ data }) => {
        commit('setSearchResults', data.searchPosts);
      }).catch(err => 
        console.log(err)
        );
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,

          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
        })
        .then(({ data }) => {
          //console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },

    addReport: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_REPORT,
          variables: payload,

          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addReport: {
              __typename: "Report",
              _id: -1,
              ...payload
            }
          },
        })
        .then(({ data }) => {
          //console.log(data.addReport);
        })
        .catch(err => {
          console.error(err);
        });
    },

    addTemplate: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_TEMPLATE,
          variables: payload,
          optimisticResponse: {
            __typename: "Mutation",
            addTemplate: {
              __typename: "Template",
              _id: -1,
              ...payload
            }
          },
        })
        .then(({ data }) => {
          //console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    saveTemplates: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: SAVE_TEMPLATES,
          variables: payload,
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            saveTemplates: {
              __typename: "Process",
              _id: -1,
              ...payload
            }
          },
        })
        .then(({ data }) => {
          console.log(data)
          //console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          // update list of all userPosts
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserTemplate: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_TEMPLATE,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userTemplates.findIndex(
            post => post._id === data.updateUserTemplate._id
          );
          // update list of all userPosts
          const userTemplates = [
            ...state.userTemplates.slice(0, index),
            data.updateUserTemplate,
            ...state.userTemplates.slice(index + 1)
          ];
          commit("setUserTemplates", userTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },

    updateProcTemplate: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_PROC_TEMPLATE,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userSavedTemplates.findIndex(
            template => template._id === data.updateProcTemplate._id
          );

          // update list of all userPosts
          const userSavedTemplates = [
            ...state.userSavedTemplates.slice(0, index),
            data.updateProcTemplate,
            ...state.userSavedTemplates.slice(index + 1)
          ];
          commit("setUserSavedTemplates", userSavedTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },

    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },

    deleteUserTemplate: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_TEMPLATE,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userTemplates.findIndex(
            template => template._id === data.deleteUserTemplate._id
          );
          const userTemplates = [
            ...state.userTemplates.slice(0, index),
            ...state.userTemplates.slice(index + 1)
          ];
          commit("setUserTemplates", userTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },

    deleteUserReport: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_REPORT,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userReports.findIndex(
            report => report._id === data.deleteUserReport._id
          );
          const userReports = [
            ...state.userReports.slice(0, index),
            ...state.userReports.slice(index + 1)
          ];
          commit("setUserReports", userReports);
        })
        .catch(err => {
          console.error(err);
        });
    },

    deleteUserSavedTemplate: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_SAVED_TEMPLATE,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userSavedTemplates.findIndex(
            template => template._id === data.deleteUserSavedTemplate._id
          );
          const userSavedTemplates = [
            ...state.userSavedTemplates.slice(0, index),
            ...state.userSavedTemplates.slice(index + 1)
          ];
          commit("setUserSavedTemplates", userSavedTemplates);
        })
        .catch(err => {
          console.error(err);
        });
    },

    loginUser: ({ commit }, payload) => {
      commit('clearError');
      commit("setLoading", true);
      // prevent malformed token
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: LOGIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data);
          commit("setLoading", false);
          localStorage.setItem('token', data.loginUser.token);
          commit('setUser', data.loginUser.user);
          router.push('/');
        }).catch(err => {
        commit('setError', err);
        commit("setLoading", false);
        // console.log(err)

      });
    },
    registerUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: REGISTER_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.registerUser.token);
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });

    },
    logoutUser: async ({ commit }, payload) => {
      commit('clearUser');
      localStorage.setItem('token', '');

      await apolloClient.resetStore();
      router.push('/');
    }
  },
  getters: {
    userFavorites: state => state.user && state.user.favorites,
  }
})
