<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Post Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>

        <post-form :userId="user._id" :parent-name="$options.name"></post-form>

      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import PostForm from "@/components/Posts/Form";

  export default {
    name: "AddPost",
    components: { PostForm },
    data() {
      return {
        headline: 'Add Post',
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
    methods: {
      addPost(post) {
          this.$store.dispatch('addPost', post);
          this.$router.push("/");
        }

    }
  };
</script>
