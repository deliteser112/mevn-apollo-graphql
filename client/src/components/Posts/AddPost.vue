<template>
  <v-container text-xs-center mt-5 pt-1>

    <!-- Add Dataset Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Dataset Form -->
    <post-form :userId="user._id" :parent-name="$options.name"></post-form>

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
      ...mapState(['user', 'error', 'loading', "userPosts"])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        console.log(post)
        if (parentName !== this.$options.name) return;
        let createdPost = JSON.parse(JSON.stringify(post));
        delete createdPost.postId;
        let objAllData = this.userPosts;
        // console.log("userData:", this.userPosts, objAllData)
        let titleArr = new Array()
        let double = false
        for(let row in objAllData) titleArr.push(objAllData[row].title)
        for(let i = 0; i < titleArr.length; i++){
          if(titleArr[i]==createdPost.title){
            double = true
            break
          } 
        }
        if(double){
          alert("This dataset already exists!")
        }else{
          this.addPost(createdPost)
        }
      });

      EventBus.$on('submitUpdatePostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        console.log(post)
        this.updatePost(post);
      })
    },
    methods:{
      addPost(post) {
        this.$store.dispatch('addPost', post);
        const path = `/post/addpost`
        if (this.$route.path !== path) this.$router.push(path)
        location.reload()
      },
      updatePost(post) {
        this.$store.dispatch("updateUserPost", JSON.parse(JSON.stringify(post)));
        location.reload()
        // this.editTemplateDialog = false;
      },
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}
</style>