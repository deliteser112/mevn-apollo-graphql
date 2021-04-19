<template>
  <v-container text-xs-center>
    <v-layout row>
      <h1 class="home-process">Template Processing....</h1>
      <!-- <v-dialog v-model="loading" persistent fullscreen style="width:100%!important">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog> -->
    </v-layout>
    <login-form v-if="!login && !loading"></login-form>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import LoginForm from "@/components/Auth/Login";

  export default {
    name: "home",
    components: { LoginForm },
    data() {
      return {
        loginStatus: false
      }
    },
    created() {
      this.handleCarouselPosts();
    },
    computed: {
      ...mapState([
        'user', 'posts', 'loading'
      ]),
      login: function(){
        return this.user
      }
    },
    methods: {
      handleCarouselPosts() {
        this.$store.dispatch('getPosts');
      },
      goToPost(_id){
        this.$router.push(`/posts/${_id}`);
      }
    }
  };
</script>
<style scoped>
  .home-process{
    margin-top:100px;
  }

  .carousel_title {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: 0 0.5em;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
  }
</style>
