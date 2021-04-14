<template>
<!-- <div v-cloak> -->
  <v-form v-model="isFormValid" ref="form" @submit.prevent style="width:100%;">
      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field :rules="titleRules" v-model="title" label="input template name" type="text" required></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
         <v-flex xs12>
            <div class="import-icon" v-if="!isTemplate">
              <input type="file" ref="myFile" @change="selectedFile"  class="form-control file-input-type" >
              <img src="https://icon-library.com/images/data-base-icon/data-base-icon-27.jpg" class="cover-image"/>
            </div>
        </v-flex>
      </v-layout>

        <v-layout row>
          <v-flex xs12 class="left-padding">
            <!-- <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)"> -->
            
            <v-btn :loading="loading" :disabled="!isTemplate || loading" color="info" type="submit"  @click="submitForm">
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
              Save template
            </v-btn>

            <v-btn :loading="loading" v-if="isTemplate" color="info" type="submit"  @click="processData">
              <v-icon light>cached</v-icon>
              Processing Data
            </v-btn>
            <!-- <v-btn :loading="loading" v-if="isCSV" color="info" type="submit"  @click="deleteRows">
              <v-icon light>delete</v-icon>
              Delete row
            </v-btn> -->
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12 class="left-padding">
            <textarea v-model="text" class="text-area"></textarea>
          </v-flex>
        </v-layout>
                
  </v-form>
<!-- </div> -->
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
    filters: {
      capitalize: function (str) {
        return str.charAt(0) + str.slice(1)
      }
    },
    watch: {
      post(post) {
        this.assignPostToInputFields(post);
      }
    },
    data() {
      return {
        // import csv
        headline: 'Import Template',
        isTemplate: false,
        text:'',
        // adding post
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
      processData(){
        console.log(typeof this.text)
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
              imageUrl: "https://cdn.pixabay.com/photo/2013/07/12/17/22/database-152091_960_720.png",
              categories: this.saveDataSet(),
              description: "no description"
            }
          });
        }
      },
      addPost(post) {
        this.$store.dispatch('addPost', post);
        this.$router.push("/");
      },
      selectedFile() {
        console.log('selected a file');
        console.log(this.$refs.myFile.files[0]);
        
        let file = this.$refs.myFile.files[0];
        if(!file || file.type !== 'text/plain') return;
        
        // Credit: https://stackoverflow.com/a/754398/52160
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload =  evt => {
          this.text = evt.target.result;
        }
        reader.onerror = evt => {
          console.error(evt);
        }
        this.isTemplate = true
      }
    }
    
  };
</script>

<style>
  .text-area{
    width:100%;
    min-height:300px;
    border: 1px solid;
  }
  .margin-top{
    margin-top:30px;
  }
  .layou.row.wrap>div{
    width: 100%;
  }
  .panel {
    border: 2px solid #dfdfdf;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 0 0;
  } 
  .panel.panel-sm {
    width:100%;
    /* max-width: 700px; */
    /* margin: 10px auto; */
  }
  .panel-heading {
    border-bottom: 2px solid #dfdfdf;
  }
  .panel-heading h1, .panel-heading h2, .panel-heading h3, .panel-heading h4, .panel-heading h5, .panel-heading h6 {
    margin: 0;
    padding: 0;
  }
  .panel-body .checkbox-inline {
    padding: 15px 20px;
  }
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #b7aeae;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
  .input-cell{
    width:100%;
  }
  .left-padding{
    padding: 20px;
  }
</style>
