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

        <!-- <post-form :userId="user._id" :parent-name="$options.name"></post-form> -->
        <!-- <section class="py-5">
          <div class="row mt-5">
              <div class="col-8 offset-2">
                  <h4 class="mb-4">Result:</h4>
                  <vue-csv-import
                      v-slot="{file}"
                      v-model="csv"
                      :fields="{name: {required: false, label: 'Name'}, age: {required: true, label: 'Age'}}"
                  >
                      <vue-csv-errors></vue-csv-errors>
                      <vue-csv-toggle-headers></vue-csv-toggle-headers>
                      <vue-csv-input></vue-csv-input>
                      <vue-csv-map :auto-match="false"></vue-csv-map>
                      <vue-csv-submit url="/"></vue-csv-submit>
                  </vue-csv-import>
                  <pre class="mt-15" v-if="csv"><code>{{ csv }}</code></pre>
              </div>
          </div>
      </section> -->

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
        headline: 'Import CSV',
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
