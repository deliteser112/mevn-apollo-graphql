<template>
  <v-container class="text-xs-center">
  <v-card color="basil">
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
                <!-- <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} popular</div> -->
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} datasets and {{userTemplates.length}} templates Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <v-tabs v-model="tab" grow>
      <v-tab>
       Datasets
      </v-tab>
      <v-tab>
       Templates
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item >
        <v-card flat>
          <v-card-text>
            <!-- DataSets Created By user -->
            <v-container v-if="!userPosts.length">
              <v-layout row wrap>
                <v-flex xs12>
                  <h2>You have no datasets currently. Go and add some!</h2>
                </v-flex>
              </v-layout>
            </v-container>

            <v-container class="mt-3" v-else>
              <v-flex xs12>
                <h2 class="font-weight-light">Your datasets
                  <span class="font-weight-regular">({{userPosts.length}})</span>
                </h2>
              </v-flex>
              <v-layout row wrap style="justify-content:left;">
                <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
                  <v-card class="mt-3 ml-1 mr-2" hover>
                    <v-btn @click="deletePost(post._id)" color="error" floating fab small dark>
                      <v-icon>delete</v-icon>
                    </v-btn>

                    <v-img :src="post.imageUrl" @click="open(post._id)"></v-img>
                    <v-card-text>{{post.title}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>

          </v-card-text>
        </v-card>
      </v-tab-item>
       <v-tab-item >
        <v-card flat>
          <v-card-text>
            <!-- DataSets Created By user -->
            <v-container v-if="!userTemplates.length">
              <v-layout row wrap>
                <v-flex xs12>
                  <h2>You have no templates currently. Go and add some!</h2>
                </v-flex>
              </v-layout>
            </v-container>

            <v-container class="mt-3" v-else>
              <v-flex xs12>
                <h2 class="font-weight-light">Your templates
                  <span class="font-weight-regular">({{userTemplates.length}})</span>
                </h2>
              </v-flex>
              <v-layout row wrap style="justify-content:left;">
                <v-flex xs12 sm6 v-for="template in userTemplates" :key="template._id">
                  <v-card class="mt-3 ml-1 mr-2" hover>
                    <v-btn @click="deleteTemplate(template._id)" color="error" floating fab small dark>
                      <v-icon>delete</v-icon>
                    </v-btn>

                    <v-img :src="template.imageUrl" @click="template_view(template._id)"></v-img>
                    <v-card-text>{{template.title}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>

    <!-- View Dataset Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog" style="width:100px">
      <v-card>
        <v-card-title class="headline grey lighten-2">DataSet</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12 style="text-align:right">
              <v-btn color="info" type="submit"  @click="addRow">
                <v-icon light>add</v-icon>
                Add row
              </v-btn>
              <v-btn color="info" type="submit"  @click="deleteRows">
                <v-icon light>delete</v-icon>
                Delete row
              </v-btn>
            </v-flex>
          </v-layout>
          
          <!-- <v-simple-table> -->
            <!-- <template v-slot:default> -->
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left" v-for="(item, index) in csvHeader" :key="index">
                    {{item}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row,index) in csvTable"
                  :key="index"
                >
                  <td><input type="checkbox"></td>
                  <td v-for="(item, index) in row" :key="index">{{ item }}</td>
                </tr>
              </tbody>
            <!-- </template> -->
          <!-- </v-simple-table> -->

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeDataset">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Close
              </v-btn>
              <v-btn color="info" type="button"  @click="closeDataset">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Update
              </v-btn>
              
            </v-flex>
          </v-layout>
          
        </v-container>
      </v-card>
    </v-dialog>



    <!-- View Template Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editTemplateDialog" style="width:100px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Template ({{templateTitle}})</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12>
                <textarea v-model="templateContent" class="text-area"></textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeTemplate">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Close
              </v-btn>
              <v-btn color="info" type="button"  @click="closeTemplate">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Update
              </v-btn>
              <v-btn color="info" type="button"  @click="closeTemplate">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Data Processing
              </v-btn>
            </v-flex>
          </v-layout>
          
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
  import {
    GET_POST,
  } from "../../queries";
  export default {
    name: "Dataset",
    components: { Post, PostForm },
    data() {
      return {
        editPostDialog: false,
        editTemplateDialog: false,
        postToEdit: {},
        postId:'',
        templateId:'',
        csvTable:[],
        csvHeader:[],
        templateContent:'',
        templateTitle:'',
        tab: null,
        items: [
          'Appetizers', 'Entrees',
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      };
    },
    computed: {
      ...mapGetters(["userFavorites"]),
      ...mapState(["user", "userPosts", "userTemplates"])
    },
    apollo: {
      getPost: {
        query: GET_POST,
        variables() {
          return {
            postId: this.postId
          };
        }
      }
    },
    created() {
      this.getUserPosts();
      this.getUserTemplates();
      
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        this.updatePost(post);
      })
    },
    methods: {
      addRow(){
        console.log("add row")
      },
      deleteRows(){
        console.log("delete row")
      },
      closeDataset(){
        this.editPostDialog = false;
      },
      closeTemplate(){
        this.editTemplateDialog = false;
      },
      template_view(id, editTemplateDialog=true){
        let templates = this.userTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateContent = templates[row].content
              this.templateTitle = templates[row].title
              break;
          } 
        } 
        console.log(this.templateContent, this.templateTitle)
        this.editTemplateDialog = editTemplateDialog;
      },
      open(id, editPostDialog=true){
        let datasets = this.userPosts;
        let values = new Array()
        let variables = new Array()
        for(let row in datasets){
          if(id == datasets[row]._id){
              values = datasets[row].categories
              variables = datasets[row].variables
              break;
          }
        }
        
        this.csvHeader = variables
        let allArr = new Array()
        for(let i = 0; i < values.length; i += variables.length){
          let rowArr = new Array()
          for(let j = 0; j < variables.length; j++) rowArr.push(values[i+j])
          allArr.push(rowArr)
        }
        console.log(allArr)
        this.csvTable = allArr
        // this.postId = id
        // console.log('calling');

        // const result = await this.apolloFnc();
        // this.csvTable = result
        this.editPostDialog = editPostDialog;
      },
      // apolloFnc(){
      //   return new Promise(resolve => {
      //     setTimeout(() => {
      //       let rowObj = {}
      //       let allArr = new Array()
      //       let tempArr = this.getPost.categories
      //       for(let i = 0; i < tempArr.length; i+=7){
      //         rowObj = {'project_id':tempArr[i], 'node_id':tempArr[i+1], 'var_ip':tempArr[i+2], 'var_sm':tempArr[i+3], 'var_gw':tempArr[i+4], 'var_addr':tempArr[i+5], 'var_cont':tempArr[i+6]}
      //         allArr.push(rowObj)
      //       }
      //       resolve(allArr);
      //     }, 100);
      //   });
      // },
      getUserTemplates() {
        this.$store.dispatch("getUserTemplates", {
          userId: this.user._id
        })
      },
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
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
      deleteTemplate(templateId) {
        const deleteTemplate = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (deleteTemplate) {
          this.$store.dispatch("deleteUserTemplate", {
            templateId: templateId
          });
        }
      },
      openEditPost(post, editPostDialog = true) {
        this.editPostDialog = editPostDialog;
        this.postToEdit = post;
      }
    }
  };
</script>
<style>
.v-dialog {
    width: auto;
}

@media (min-width: 600px){
  .flex.sm6 {
      -ms-flex-preferred-size: 50%;
      flex-basis: 20%;
      -webkit-box-flex: 0;
      -ms-flex-positive: 0;
      flex-grow: 0;
      max-width: 50%;
  }
}


</style>