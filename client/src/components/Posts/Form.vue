<template>
<div>
  <v-form v-model="isFormValid" ref="form" @submit.prevent>

    <!-- Title Input -->
    <v-layout row>
      <v-flex xs12>
        <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Image Url Input -->
    <v-layout row>
      <v-flex xs12>
        <v-text-field v-model="imageUrl" :rules="imageRules" label="Image URL" type="text"
                      required></v-text-field>
      </v-flex>
    </v-layout>

    <!-- Image Preview -->
    <v-layout row v-if="imageUrl">
      <v-flex xs12>
        <img :src="imageUrl" height="300px">
      </v-flex>
    </v-layout>

    <!-- Categories Select -->
    <v-layout row>
      <v-flex xs12>
        <v-select v-model="categories" :rules="categoriesRules"
                  :items="postCategories" multiple
                  label="Categories"></v-select>
      </v-flex>
    </v-layout>

    <!-- Description Text Area -->
    <v-layout row>
      <v-flex xs12>
        <v-textarea v-model="description" :rules="descRules" label="Description" type="text"
                    required></v-textarea>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-btn :loading="loading" :disabled="!isFormValid || loading" color="info" type="submit"  @click="submitForm">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
          Submit
        </v-btn>
      </v-flex>
    </v-layout>

  </v-form>
</div>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "../../event";

  export default {
    name: "PostForm",
    props: {
      userId: String,
      parentName: String,
      post: {
        type: Object,
        default: () => {
          return {
            title: "",
            imageUrl: "",
            categories: [],
            description: "",
          }
        }
      }
    },
    watch: {
      post(post) {
        this.assignPostToInputFields(post);
      }
    },
    data() {
      return {
        isFormValid: true,
        postId: null,
        title: "",
        imageUrl: "",
        categories: [],
        description: "",
        titleRules: [
          title => !!title || "Title is required",
          title => title.length < 20 || "Title must have less than 20 characters"
        ],
        imageRules: [image => !!image || "Image is required"],
        categoriesRules: [
          categories =>
            categories.length >= 1 || "At least one category is required"
        ],
        descRules: [
          desc => !!desc || "Description is required",
          desc =>
            desc.length < 200 || "Description must have less than 200 characters"
        ]
      };
    },
    computed: {
      ...mapState(['user', 'error', 'loading','postCategories'])
    },
    methods: {
      assignPostToInputFields({ _id, title, imageUrl, categories, description }) {
        this.postId = _id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.categories = categories;
        this.description = description;
      },
      submitForm() {
        if (this.$refs.form.validate()) {
          EventBus.$emit('submitPostForm',
            {
              parentName: this.parentName,
              post: {
                postId: this.postId,
                userId: this.userId,
                title: this.title,
                imageUrl: this.imageUrl,
                categories: this.categories,
                description: this.description
              }
          });
        }
      }
    }
  };
</script>
