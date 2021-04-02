<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in posts" :key="post._id" :src="post.imageUrl" @click.native="goToPost(post._id)">
          <h2 class="carousel_title">{{ post.title }}</h2>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "home",
    created() {
      this.handleCarouselPosts();
    },
    computed: {
      ...mapState([
        'posts', 'loading'
      ])
    },
    methods: {
      handleCarouselPosts() {
        this.$store.dispatch('getPosts');
      },
      goToPost(_id){
        this.$router.push(`/posts/${_id}`);
      }
    },
  };
</script>
<style>
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
