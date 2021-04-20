<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Dataset Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Dataset Form -->
    <v-layout row wrap>
        <post-form :userId="user._id" :parent-name="$options.name"></post-form>
    </v-layout>

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import PostForm from "@/components/Posts/Form";
  import {
    GET_POSTS,
  } from "../../queries";
  export default {
    name: "AddDataset",
    components: { PostForm },
    data() {
      return {
        headline: 'Import DataSet',
      };
    },
    apollo: {
      getPosts: {
        query: GET_POSTS,
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        let createdPost = JSON.parse(JSON.stringify(post));
        delete createdPost.postId;
        console.log("this is my data:", createdPost)
        let objAllData = this.getPosts;
        let titleArr = new Array()
        let double = false
        for(let row in objAllData) titleArr.push(objAllData[row].title)
        console.log(titleArr)
        for(let i = 0; i < titleArr.length; i++){
          if(titleArr[i]==createdPost.title){
            double = true
            break
          } 
        }
        if(double){
          alert("This dataset already exists!")
        }else{
          setTimeout(() => this.addPost(createdPost), 500);
        }
      });
    },
    methods:{
      addPost(post) {
        this.$store.dispatch('addPost', post);
        this.$router.push("/");
        location.reload()
      },
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}
</style>