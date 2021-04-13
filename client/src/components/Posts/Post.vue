<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>

    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>

            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img @click="toggleImageDialog" slot="activator" :src="getPost.imageUrl"
                          id="post__image"></v-img>
          </v-tooltip>

          <!-- Dataset banner Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>
            <v-container>

            <table style="width:100%">
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
            </table>

          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

    <div class="mt-3">
    </div>

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import {
    GET_POST,
  } from "../../queries";
  import moment from 'moment';

  export default {
    name: "Post",
    props: ["postId"],
    data() {
      return {
        postLiked: false,
        dialog: false,
        messageBody: "",
        isFormValid: true,
        csvTable:[],
        messageRules: [
          message => !!message || "Message is required",
          message =>
            message.length < 75 || "Message must be less than 75 characters"
        ]
      };
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
    mounted(){
      this.ToConvertJSON()
    },
   
    computed: {
      ...mapState(["user"])
    },
    methods: {
      async ToConvertJSON(){
        console.log('calling');
        const result = await this.toJSON();
        this.csvTable = result
      },
      toJSON(){
        // console.log(this.getPost.categories)
        return new Promise(resolve => {
          setTimeout(() => {
            // console.log(this.getPost.categories)
            let rowObj = {}
            let allArr = new Array()

            let tempArr = this.getPost.categories
            // console.log(this.getPost)
            for(let i = 0; i < tempArr.length; i+=7){
              rowObj = {'project_id':tempArr[i], 'node_id':tempArr[i+1], 'var_ip':tempArr[i+2], 'var_sm':tempArr[i+3], 'var_gw':tempArr[i+4], 'var_addr':tempArr[i+5], 'var_cont':tempArr[i+6]}
              allArr.push(rowObj)
            }
            resolve(allArr);
          }, 100);
        });
      },
      getTimeFromNow(time){
        return moment(new Date(time)).fromNow();
      },
     
      goToPreviousPage() {
        this.$router.go(-1);
      },
      toggleImageDialog() {
        if (window.innerWidth > 500) {
          this.dialog = !this.dialog;
        }
      },
      checkIfOwnMessage(message) {
        return this.user && this.user._id === message.messageUser._id;
      }
    }
  };
</script>

<style scoped>
  #post__image {
    height: 400px !important;
  }
</style>
