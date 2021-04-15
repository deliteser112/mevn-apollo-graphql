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
                    <v-btn @click="deletePost(template._id)" color="error" floating fab small dark>
                      <v-icon>delete</v-icon>
                    </v-btn>

                    <v-img :src="template.imageUrl" @click="open(template._id)"></v-img>
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

          <!-- <v-simple-table> -->
            <!-- <template v-slot:default> -->
              <thead>
                <tr>
                  <th class="text-left">
                    Project_ID
                  </th>
                  <th class="text-left">
                    Node_ID
                  </th>
                  <th class="text-left">
                    $var_IP
                  </th>
                  <th class="text-left">
                    $var_SM
                  </th>
                  <th class="text-left">
                    $var_GW
                  </th>
                  <th class="text-left">
                    $var_Address
                  </th>
                  <th class="text-left">
                    $var_content
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in csvTable"
                  :key="item.node_id"
                >
                  <td>{{ item.project_id }}</td>
                  <td>{{ item.node_id }}</td>
                  <td>{{ item.var_ip }}</td>
                  <td>{{ item.var_sm }}</td>
                  <td>{{ item.var_gw }}</td>
                  <td>{{ item.var_addr }}</td>
                  <td>{{ item.var_cont }}</td>
                </tr>
              </tbody>
            <!-- </template> -->
          <!-- </v-simple-table> -->

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="confirm">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
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
        postToEdit: {},
        postId:'',
        csvTable:[],
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
      confirm(){
        this.editPostDialog = false;
      },
      async open(id, editPostDialog=true){
        this.postId = id
        console.log('calling');
        console.log("this is value", this.getPosts)

        const result = await this.apolloFnc();
        this.csvTable = result
        this.editPostDialog = editPostDialog;
        // console.log(this.csvTable);
        // console.log("this is id:", id, "this is All posts:", this.userPosts)
      },
      apolloFnc(){
        // console.log(this.getPost.categories)
        return new Promise(resolve => {
          setTimeout(() => {
            // console.log(this.getPost.categories)
            let rowObj = {}
            let allArr = new Array()

            let tempArr = this.getPost.categories
            for(let i = 0; i < tempArr.length; i+=7){
              rowObj = {'project_id':tempArr[i], 'node_id':tempArr[i+1], 'var_ip':tempArr[i+2], 'var_sm':tempArr[i+3], 'var_gw':tempArr[i+4], 'var_addr':tempArr[i+5], 'var_cont':tempArr[i+6]}
              allArr.push(rowObj)
            }
            resolve(allArr);
          }, 100);
        });
      },
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