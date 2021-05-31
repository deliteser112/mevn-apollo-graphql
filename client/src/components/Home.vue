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

    <!-- ---------------- dashboard ------------- -->
    
    <v-container class="mt-3">
      <v-flex xs12>
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
              <v-btn flat @click="gotoDataset" style="text-transform: capitalize;">View/Add Datasets</v-btn>
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
        <v-btn fab dark  ma-10 large color="cyan" @click="goToProcessing">
          <v-icon dark>play_arrow</v-icon>
        </v-btn>
      </v-layout>
      <v-layout row>
        <span class="grey--text">You can start the process by click this button.</span>
      </v-layout>
      
    </v-container>
    <!-- -------------- end dashboard ------------- -->

    <!-- alert -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="alertDialog" 
        transition="dialog-top-transition"
        max-width="600">
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >Template Process</v-toolbar>
        <v-card-text>
          <v-icon light style="width: 100%; font-size: 100px; color:rgb(4, 170, 109)">{{alertType}}</v-icon>
          <div class="font-weigh title" style="padding:20px;">{{alertContent}}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="closeAlert"
          >Cancel</v-btn>
          <v-btn
            text
            @click="gotoDataset"
          >Go to Dataset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import LoginForm from "@/components/Auth/Login";

  export default {
    name: "home",
    components: { LoginForm },
    
    data() {
      return{
        alertDialog: false,
        alertContent:"",
        alertType: "",
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
      goToProcessing(){
        if(this.userPosts.length > 1){
          this.gotoDataset()
        }else{
          this.alertContent = "Will you start the data processing for a template?"
          this.alertType = "task_alt"
          this.alertDialog = true
        }
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
      },
      getUserSavedTemplates() {
        this.$store.dispatch("getUserSavedTemplates", {
          userId: this.user._id
        })
      },
      closeAlert(){
        this.alertDialog = false
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
