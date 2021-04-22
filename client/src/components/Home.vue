<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen style="width:100%!important">
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
<!-- https://res.cloudinary.com/cschroeder/image/upload/v1542293711/Icons/users.png -->
    <login-form v-if="!login && !loading"></login-form>


    <!-- ---------------- dashboard ------------- -->
    
    <v-layout row>
      <v-card
        class="mx-auto"
        max-width="344"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">OVERLINE</div>
            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
            <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
            tile
            size="80"
            color="grey"
          ></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn text>Button</v-btn>
          <v-btn text>Button</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>

    <!-- -------------- end dashboard ------------- -->
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
<style>
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

  .v-dialog--fullscreen {
    width: 100% !important;
  }
/* -0-----------------------------0 */

</style>
