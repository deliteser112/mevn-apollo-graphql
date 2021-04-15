<template>
  <v-app>
    <v-navigation-drawer app temporary fixed v-model="showSideNav">
      <v-toolbar color="accent" flat dark>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer;">
          <h1>Template Validation</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile ripple v-for="item in sideNavbar" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <span>{{ item.title }}</span>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer;">Template Validation</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items>
        <v-btn flat v-for="(item, index) in horizontalNavbar" :to="item.link" :key="index">
          <v-icon left>{{ item.icon }}</v-icon>
          <span class="hidden-xs-only">{{ item.title }}</span>
        </v-btn>

        <v-btn flat to="/dataset" v-if="user">
          <v-icon class="hidden-sm-only" left>inventory</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            <span class="hidden-xs-only">Inventory</span>
          </v-badge>
        </v-btn>
        <v-btn flat @click="onLogoutUser" v-if="user">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          <v-badge right color="blue darken-2">
            <span class="hidden-xs-only">Log out</span>
          </v-badge>
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <main>
      <v-container class="mt-4">
        <transition name="fade"></transition>

        <router-view/>

        <v-snackbar v-model="authSnackbar" color="success" :timeout='5000' bottom left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="error" :timeout='10000' bottom left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/login">Log in</v-btn>
        </v-snackbar>

      </v-container>
    </main>

  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'App',
    data() {
      return {
        searchTerm: "",
        authErrorSnackbar: false,
        authSnackbar: false,
        showSideNav: false,
        badgeAnimated: false
      }
    },
    computed: {
      ...mapState(['user', 'authError', 'searchResults']),
      userFavorites() {
        return this.$store.getters.userFavorites;
      },
      horizontalNavbar() {
        let items = [
          { icon: 'create', title: 'Register', link: '/register' },
          { icon: 'lock_open', title: 'Login', link: '/login' },
        ];
        if (this.user) {
          items = [
            { icon: 'summarize', title: 'Import Template', link: '/post/addtemplate' },
            { icon: 'storage', title: 'Import DataSet', link: '/post/addpost' },
          ];
        }
        return items;
      },
      sideNavbar() {
        let items = [
          { icon: 'create', title: 'Register', link: '/register' },
          { icon: 'lock_open', title: 'Login', link: '/login' },
        ];
        if (this.user) {
          items = [
            { icon: 'summarize', title: 'Import Template', link: '/post/addtemplate' },
            { icon: 'storage', title: 'Import DataSet', link: '/post/addpost' },
            { icon: 'account_box', title: 'Inventory', link: '/dataset' },
          ];
        }
        return items;
      }
    },
    watch: {
      userFavorites(value) {
        // if user favorites value changed at all
        if (value) {
          this.badgeAnimated = true;
          setTimeout(() => (this.badgeAnimated = false), 1000);
        }
      },
      user(newValue, oldValue) {
        if (oldValue === null) {
          this.authSnackbar = true;
        }
      },
      authError(value) {
        if (value !== null) {
          this.authErrorSnackbar = true;
        }
      }
    },
    methods: {
      toggleSideNav() {
        this.showSideNav = !this.showSideNav;
      },
      onLogoutUser() {
        this.$store.dispatch('logoutUser');
      },
      handleSearchPosts() {
        this.$store.dispatch('searchPosts', { searchTerm: this.searchTerm });
      },
      goToSearchResult(_id){
        this.$store.commit('clearSearchResults');
        this.searchTerm = "";
        return this.$router.push(`/posts/${_id}`);
      },
      formatDescription(desc){
        return desc.length > 20 ? `${desc.slice(0,20)}` : desc;
      },
      checkIfIsUserFavoritesPost(id){
        return this.userFavorites && this.userFavorites.some(fave => fave._id === id)
      }
    }
  }
</script>
<style scoped>
  .v-btn {
    text-transform: none;
  }
  .accent {
      background-color: #3b4f74 !important;
      border-color: #c5d2b2 !important;
  }
  #search__card {
    position: absolute;
    width: 100vw;
    z-index:8;
    top: 100%;
  }

  #header_search {
    padding-top: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.45s;
  }

  .fade-enter-active {
    transition-delay: 0.45s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /* User Favorite Animation */
  .bounce {
    animation: bounce 1s both;
  }

  
  @keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
      transform: translate3d(0, -20px, 0);
    }
    70% {
      transform: translate3d(0, -10px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
</style>
