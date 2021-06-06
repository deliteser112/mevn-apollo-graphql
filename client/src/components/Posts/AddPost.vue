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
        <h2 class="font-weight-light">
          Sample Datasets
          <span class="font-weight-regular">({{ sampleDatasets.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap style="justify-content:left;">
        <v-flex
          xs12
          v-for="dataset in sampleDatasets"
          :key="dataset._id"
          class="grid-view-cus"
        >
          <v-card class="mt-3 ml-1 mr-2" hover>
            <div
              class="v-dataset-background"
              @click="SampleOpen(dataset._id)"
            ></div>
            <v-card-text>{{ dataset.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- View Sample Dataset Dialog -->
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="viewSample"
      style="width:100px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2"
          >Sample Dataset</v-card-title
        >
        <v-container>
          <v-layout row>
            <v-flex xs12 class="csv-table">
              <thead ref="ref_update_header">
                <tr>
                  <th></th>
                  <th
                    class="text-left"
                    v-for="(item, index) in csvSampleHeader"
                    :key="index"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody ref="ref_update_table">
                <tr v-for="(row, index) in csvSampleTable" :key="index">
                  <td><input type="checkbox" /></td>
                  <td v-for="(item, index) in row" :key="index">
                    <div class="update-input-cell" contenteditable="true">
                      {{ item }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button" @click="closeSampleViewDialog">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- alert -->
    <!-- <v-dialog xs12 sm6 offset-sm3 persistent v-model="alertDialog" 
        transition="dialog-top-transition"
        max-width="600"> -->
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="alertDialog"
      style="width:100px"
    >
      <v-card>
        <v-toolbar color="primary" dark>Template Process</v-toolbar>
        <v-card-text>
          <v-icon
            light
            style="width: 100%; font-size: 100px; color:rgb(237, 86, 27)"
            >error_outline</v-icon
          >
          <div class="font-weight" style="padding:20px 40px 20px 40px;">
            {{ alertContent }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeAlert">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- wizard dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="alertWizardDialog">
      <v-card>
        <v-toolbar color="primary" dark>Template Process</v-toolbar>
        <v-card-text>
          <v-icon
            light
            style="width: 100%; font-size: 100px; color:rgb(4, 170, 109)"
            >{{ alertType }}</v-icon
          >
          <div class="font-weigh title" style="padding:20px 40px 20px 40px;">
            {{ alertContent }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn v-if="isDataset" text @click="closeWizardAlert">Cancel</v-btn>
          <v-btn v-if="isDataset" text @click="gotoTemplate"
            >Go to Template</v-btn
          >
          <v-btn v-if="!isDataset" text @click="closeWizardAlert">Got it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "@/event";
import PostForm from "@/components/Posts/Form";
import { GET_POSTS } from "../../queries";
export default {
  name: "AddDataset",
  components: { PostForm },
  data() {
    return {
      headline: "Import DataSet",
      csvSampleHeader: [],
      csvSampleTable: [],
      viewSample: false,
      isDataset: true,
      alertDialog: false,
      alertContent: "",
      alertType: "",
      alertWizardDialog: false
    };
  },
  apollo: {
    getPosts: {
      query: GET_POSTS
    }
  },
  computed: {
    ...mapState([
      "user",
      "error",
      "loading",
      "posts",
      "userPosts",
      "sampleDatasets"
    ])
  },
  created() {
    EventBus.$on("submitPostForm", ({ parentName, post }) => {
      if (parentName !== this.$options.name) return;
      let createdPost = JSON.parse(JSON.stringify(post));
      delete createdPost.postId;
      // let objAllData = this.getPosts;
      // let titleArr = new Array()
      // let double = false
      // for(let row in objAllData) titleArr.push(objAllData[row].title)
      // for(let i = 0; i < titleArr.length; i++){
      //   if(titleArr[i]==createdPost.title){
      //     double = true
      //     break
      //   }
      // }
      // if(double){
      //   this.alertDialog = true
      //   this.alertContent = "This dataset already exists!"
      // }else{
      //   this.addPost(createdPost)
      // }

      let objAllData = this.userPosts;
      let otherData = this.getPosts;

      let currentUserTitleArr = new Array();
      let otherUserTitleArr = new Array();
      let currentUserDouble = false;
      let otherUserDouble = false;

      for (let row in objAllData)
        currentUserTitleArr.push(objAllData[row].title);
      for (let row in otherData) otherUserTitleArr.push(otherData[row].title);

      console.log(otherUserTitleArr, currentUserTitleArr);

      for (let i = 0; i < currentUserTitleArr.length; i++) {
        if (currentUserTitleArr[i] == createdPost.title) {
          currentUserDouble = true;
          break;
        }
      }

      for (let i = 0; i < otherUserTitleArr.length; i++) {
        if (otherUserTitleArr[i] == createdPost.title) {
          otherUserDouble = true;
          break;
        }
      }

      if (currentUserDouble) {
        this.alertDialog = true;
        this.alertContent = "This dataset name already exists!";
        otherUserDouble = false;
      } else if (otherUserDouble) {
        this.alertDialog = true;
        this.alertContent =
          "This dataset name is already used by another user!";
      } else {
        console.log(createdPost);
        this.addPost(createdPost);
      }
    });

    EventBus.$on("submitUpdatePostForm", ({ parentName, post }) => {
      if (parentName !== this.$options.name) return;
      this.updatePost(post);
    });
  },
  mounted() {
    // this.asyncCall()
  },
  methods: {
    async asyncCall() {
      console.log("calling");
      const result = await this.resolveAfterSeconds();
      if (result == "resolved") {
        if (this.userPosts.length == 0) {
          console.log("this is 0000");
          this.isDataset = false;
          this.alertType = "check";
          this.alertContent =
            "You can import the csv file to store into the database.";
          this.alertWizardDialog = true;
        } else if (this.userPosts.length == 1) {
          this.isDataset = true;
          this.alertType = "add_task";
          this.alertContent =
            "Will you move into Template to import the templates?";
          this.alertWizardDialog = true;
        }
      }
      console.log(result);
    },
    resolveAfterSeconds() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve("resolved");
        }, 1000);
      });
    },
    gotoTemplate() {
      this.$router.push(`/post/addtemplate`);
    },
    addPost(post) {
      this.$store.dispatch("addPost", post);
      const path = `/post/addpost`;
      if (this.$route.path !== path) this.$router.push(path);
      location.reload();
    },
    updatePost(post) {
      this.$store.dispatch("updateUserPost", JSON.parse(JSON.stringify(post)));
      location.reload();
    },
    SampleOpen(id, viewSample = true) {
      let datasets = this.sampleDatasets;
      let values = new Array();
      let variables = new Array();
      for (let row in datasets) {
        if (id == datasets[row]._id) {
          values = datasets[row].categories;
          variables = datasets[row].variables;
          break;
        }
      }

      this.csvSampleHeader = variables;
      let allArr = new Array();
      for (let i = 0; i < values.length; i += variables.length) {
        let rowArr = new Array();
        for (let j = 0; j < variables.length; j++) rowArr.push(values[i + j]);
        allArr.push(rowArr);
      }
      this.csvSampleTable = allArr;

      this.viewSample = viewSample;
    },
    closeSampleViewDialog() {
      this.viewSample = false;
    },
    closeAlert() {
      this.alertDialog = false;
    },
    closeWizardAlert() {
      this.alertWizardDialog = false;
    }
  }
};
</script>
<style>
.layout {
  justify-content: center;
}
</style>
