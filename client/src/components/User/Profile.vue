<template>
  <v-container class="text-xs-center">

    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts Favorited by User -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favorited
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Posts Created By user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Your Posts
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="openEditPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="deletePost(post._id)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-container>
          <post-form :post="postToEdit" :userId="user._id" :parent-name="$options.name"></post-form>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import { mapState } from "vuex";
  import PostForm from "../Posts/Form";
  import Post from "../Posts/Post";
  import { EventBus } from "@/event";

  export default {
    name: "Profile",
    components: { Post, PostForm },
    data() {
      return {
        editPostDialog: false,
        postToEdit: {}
      };
    },
    computed: {
      ...mapGetters(["userFavorites"]),
      ...mapState(["user", "userPosts"])
    },
    created() {
      this.getUserPosts();

      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        this.updatePost(post);
      })
    },
    methods: {
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        });
      },
      updatePost(post) {
        this.$store.dispatch("updateUserPost", JSON.parse(JSON.stringify(post)));
        this.editPostDialog = false;
      },
      deletePost(postId) {
        const deletePost = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (deletePost) {
          this.$store.dispatch("deleteUserPost", {
            postId: postId
          });
        }
      },
      openEditPost(
        post,
        editPostDialog = true
      ) {
        this.editPostDialog = editPostDialog;
        this.postToEdit = post;
      }
    }
  };
</script>
