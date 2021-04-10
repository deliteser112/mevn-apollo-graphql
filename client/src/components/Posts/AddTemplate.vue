<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Template Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Template Form -->
    <!-- <v-layout row wrap>
        <post-form :userId="user._id" :parent-name="$options.name"></post-form>
    </v-layout> -->

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import PostForm from "@/components/Posts/Form";

  export default {
    name: "AddTemplate",
    components: { PostForm },
    data() {
      return {
        headline: 'Not finished yet',
      };
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        let createdPost = JSON.parse(JSON.stringify(post));
        delete createdPost.postId;
        this.addPost(createdPost);
      });
    },
    methods:{
      addPost(post) {
        this.$store.dispatch('addPost', post);
        this.$router.push("/");
      },
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}
</style>