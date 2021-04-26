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
    
    <!-- Sample Datasets -->
    <v-container class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-light">Sample Datasets
          <span class="font-weight-regular">({{sampleDatasets.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap style="justify-content:left;">
        <v-flex xs12 v-for="dataset in sampleDatasets" :key="dataset._id" class="grid-view-cus">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <div class="v-dataset-background" @click="SampleOpen(dataset._id)"></div>
            <v-card-text>{{dataset.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- View Sample Dataset Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="viewSample" style="width:100px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Sample Dataset</v-card-title>
        <v-container>
            <v-layout row>
              <v-flex xs12>
                <thead ref="ref_update_header">
                  <tr>
                    <th></th>
                    <th class="text-left" v-for="(item, index) in csvSampleHeader" :key="index">
                      {{item}}
                    </th>
                  </tr>
                </thead>
                <tbody ref="ref_update_table">
                  <tr
                    v-for="(row,index) in csvSampleTable"
                    :key="index"
                  >
                    <td><input type="checkbox"></td>
                    <td v-for="(item, index) in row" :key="index">
                      <div class="update-input-cell" contenteditable="true">{{item}}</div>
                    </td>
                  </tr>
                </tbody>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-btn color="info" type="button"  @click="closeSampleViewDialog">
                  <v-icon light>close</v-icon>
                  Close
                </v-btn>
              </v-flex>
            </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
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
        csvSampleHeader:[],
        csvSampleTable:[],
        viewSample:false
      };
    },
    apollo: {
      getPosts: {
        query: GET_POSTS,
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading', "userPosts", "sampleDatasets"])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, post}) => {
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
          console.log(createdPost)
          this.addPost(createdPost)
        }
      });

      EventBus.$on('submitUpdatePostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        this.updatePost(post);
      })
    },
    mounted() {
      console.log(this.sampleDatasets.length)
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
      },
      SampleOpen(id, viewSample=true){
        let datasets = this.sampleDatasets;
        let values = new Array()
        let variables = new Array()
        for(let row in datasets){
          if(id == datasets[row]._id){
            values = datasets[row].categories
            variables = datasets[row].variables
            break;
          }
        }
        
        this.csvSampleHeader = variables
        let allArr = new Array()
        for(let i = 0; i < values.length; i += variables.length){
          let rowArr = new Array()
          for(let j = 0; j < variables.length; j++) rowArr.push(values[i+j])
          allArr.push(rowArr)
        }
        this.csvSampleTable = allArr

        this.viewSample = viewSample;
      },
      closeSampleViewDialog(){
        this.viewSample = false
      }
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}
</style>