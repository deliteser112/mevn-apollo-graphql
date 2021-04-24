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
    <!-- <login-form v-if="!login && !loading"></login-form> -->


    <!-- ---------------- dashboard ------------- -->
    
    <!-- <v-container class="mt-3"> -->
      <v-flex xs12>
        <!-- <h2 class="font-weight-light">Your templates </h2> -->
      </v-flex>
      <v-layout row wrap style="justify-content:left;">
        
        <v-flex xs12 sm6 lg4>
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80"
              height="200px"
            >
            </v-img>

            <v-card-title primary-title>
                <div class="display-3">{{userPosts.length}} <span class="headline">Datasets</span></div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat @click="gotoInventory" style="text-transform: capitalize;">View/Add Datasets</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 lg4>
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              src="https://images.unsplash.com/photo-1550438496-8c6e269e7886?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
              height="200px"
            >
            </v-img>

            <v-card-title primary-title>
                <div class="display-3">{{userTemplates.length}} <span class="headline">Templates</span></div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat @click="gotoTemplate" style="text-transform: capitalize;">View/Add Templates</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm6 lg4>
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
              height="200px"
            >
            </v-img>

            <v-card-title primary-title>
                <div class="display-3">{{userSavedTemplates.length}} <span class="headline">Processed templates</span></div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat @click="gotoInventory" style="text-transform: capitalize;">View Templates</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>

      </v-layout>
      <div style="margin-bottom:20px;"></div>
      <v-layout row>
        <v-btn fab dark  ma-10 large color="cyan" @click="gotoDataset">
          <v-icon dark>play_arrow</v-icon>
        </v-btn>
      </v-layout>
      <v-layout row>
        <span class="grey--text">You can start the process by click this button.</span>
      </v-layout>
      
    <!-- </v-container> -->

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
        items:[3,2,1],
        loginStatus: false,
        card_text: 'Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat.'
      }
    },
    created() {
      this.handleCarouselPosts();
    },
    computed: {
      ...mapState([
        'user', 'posts', 'loading', 'userPosts', 'userTemplates', 'userSavedTemplates'
      ]),
      login: function(){
        return this.user
      },
    },
    created() {
      this.getUserPosts();
      this.getUserTemplates();
      this.getUserSavedTemplates();
    },
    methods: {
      handleCarouselPosts() {
        this.$store.dispatch('getPosts');
      },
      goToPost(_id){
        this.$router.push(`/posts/${_id}`);
      },
      gotoDataset(){
        this.$router.push(`/post/addpost`)
      },
      gotoInventory(){
        this.$router.push(`/dataset`)
      },
      gotoTemplate(){
        this.$router.push(`/post/addtemplate`)
      },

      // gathering the data from database by vuex
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
      },
      getUserTemplates() {
        this.$store.dispatch("getUserTemplates", {
          userId: this.user._id
        })
        console.log("this is OK:", this.user._id)
      },
      getUserSavedTemplates() {
        this.$store.dispatch("getUserSavedTemplates", {
          userId: this.user._id
        })
      },
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
