<template>
  <v-container class="text-xs-center">
  <v-card color="basil">
    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar" @click="test_console"></v-img>
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
            <v-container v-if="!userSavedTemplates.length">
              <v-layout row wrap>
                <v-flex xs12>
                  <h2>You have no templates currently. Go and add some!</h2>
                </v-flex>
              </v-layout>
            </v-container>

            <v-container class="mt-3" v-else>
              <v-flex xs12>
                <h2 class="font-weight-light">Your templates
                  <span class="font-weight-regular">({{userSavedTemplates.length}})</span>
                </h2>
              </v-flex>
              <v-layout row wrap style="justify-content:left;">
                <v-flex xs12 sm6 v-for="template in userSavedTemplates" :key="template._id">
                  <v-card class="mt-3 ml-1 mr-2" hover>
                    <v-btn @click="deleteSavedTemplate(template._id)" color="error" floating fab small dark>
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
    <v-dialog xs6 sm6 offset-sm3 persistent v-model="editTemplateDialog" >
      <v-card>
        <v-card-title class="headline grey lighten-2">Template ({{templateTitle}})</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12>
              <v-card>
                
                <v-list two-line subheader>
                  
                  <v-list-tile v-for="(item, index) in templateContent" v-bind:key="index" avatar @click="">
                    <v-list-tile-avatar>
                      <v-icon v-bind:class="[item.iconClass]">{{ item.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.node_id }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ item.template_content }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-icon color="grey lighten-1">info</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeTemplate">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
    
              <v-btn color="info" type="button"  @click="downloadTemplates">
                <v-icon light>download</v-icon>
                Download templates
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
  import JsZip from 'jszip';
  import FileSaver from 'file-saver';
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
        templateContent:[],
        templateTitle:'',
        templateID:'',
        tab: null,
        items: [
          'Appetizers', 'Entrees',
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      };
    },
    computed: {
      ...mapGetters(["userFavorites"]),
      ...mapState(["user", "userPosts", "userTemplates", "userSavedTemplates"])
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
      this.getUserSavedTemplates();
      
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        this.updatePost(post);
      })
    },
    methods: {
      test_console(){
        console.log("this is post:", this.userSavedTemplates)
      },
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
        this.templateID = id
        let templates = this.userSavedTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateTitle = templates[row].title
              let tempArray = new Array()
              for(let i in templates[row].templates){
                let temp_row = {}
                console.log(templates[row].node_ids[i])
                temp_row["template_content"] = templates[row].templates[i]
                temp_row["node_id"] = templates[row].node_ids[i]
                temp_row["icon"] = "folder"
                temp_row["iconClass"] = "grey lighten-1 white--text"
                tempArray.push(temp_row)
              }
              console.log(tempArray)
              this.templateContent = tempArray
              break;
          } 
        } 
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

        this.editPostDialog = editPostDialog;
      },
      getUserTemplates() {
        this.$store.dispatch("getUserTemplates", {
          userId: this.user._id
        })
      },
      getUserSavedTemplates() {
        this.$store.dispatch("getUserSavedTemplates", {
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
          location.reload()
        }
      },
      deleteSavedTemplate(templateId) {
        const deleteSavedTemplate = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (deleteSavedTemplate) {
          this.$store.dispatch("deleteUserSavedTemplate", {
            templateId: templateId
          });
          location.reload()
        }
      },
      openEditPost(post, editPostDialog = true) {
        this.editPostDialog = editPostDialog;
        this.postToEdit = post;
      },
      downloadTemplates(){
        let templates = this.userSavedTemplates;
        let id = this.templateID
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateTitle = templates[row].title
              let tempArray = new Array()
              const zip = JsZip();
              for(let i in templates[row].templates){
                console.log(templates[row])

                // for getting timestamp
                let d = new Date(); 
                let timestamp = d.getFullYear() + ""
                  + (d.getMonth()+1) + ""
                  + d.getDate() + ""
                  + d.getHours() + ""  
                  + d.getMinutes() + "" 
                  + d.getSeconds() + ""
                  + d.getMilliseconds()
                
                // download the templates
                const blob = new Blob([templates[row].templates[i]], { type: 'text/cfg' }) //text/plain //application/pdf
                zip.file(`${templates[row].node_ids[i]}_${timestamp}.cfg`, blob);

                tempArray.push(templates[row].templates[i])
              }

              zip.generateAsync({type: 'blob'}).then(zipFile => {
                // for getting timestamp
                const d = new Date(); 
                const timestamp = d.getFullYear() + ""
                  + (d.getMonth()+1) + ""
                  + d.getDate() + ""
                  + d.getHours() + ""  
                  + d.getMinutes() + "" 
                  + d.getSeconds() + ""
                  + d.getMilliseconds()
                const fileName = `${this.templateTitle}.zip`;
                return FileSaver.saveAs(zipFile, fileName);
              });
              break;
          } 
        }
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