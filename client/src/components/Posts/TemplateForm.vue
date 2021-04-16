<template>
<div v-cloak>
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

            <v-btn :loading="loading" v-if="isTemplate" color="info" type="submit"  @click="selectDataset">
              <v-icon light>cached</v-icon>
              Select dataset
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

  <!-- View Process Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="processDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Select the dataset</v-card-title>
        <v-container>

          <v-layout row v-for="item in processToDialog" :key="item._id">
            <v-flex xs4 sm12>
              <div>{{item.dataset_name}}</div>
            </v-flex>
            <v-flex xs4 sm12>
              <div>{{item.project_id}}</div>
            </v-flex>
            <v-flex xs4 sm12>
              <div>{{item.node_id_range}}</div>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeProcess">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Close
              </v-btn>
              <v-btn color="info" type="button"  @click="processData">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                Process
              </v-btn>
              
            </v-flex>
          </v-layout>

        </v-container>
      </v-card>
    </v-dialog>
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
      template: {
        type: Object,
        default: () => {
          return {
            title: "",
            imageUrl: "",
            content: "",
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
        text:"",
        processDialog:false,
        processToDialog:[],
        // adding template
        isFormValid: true,
        templateId: null,
        title: "",
        imageUrl: "",
        content: "",
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
      ...mapState(['user', 'userPosts', 'error', 'loading','postCategories'])
    },
    created() {
      this.getUserPosts();
    },
    methods: {
      processData(){
        let ext_data = this.extractID(this.text)
        let project_id = ext_data.project_id
        let node_id = ext_data.node_id
        let full_data = this.getData(this.userPosts)
        let selected_id = ['6078d4552d4a671184df4af0', '6078e6cb2d4a671184df4af2']
        // in case of node id is several.????????????
        for(let r in full_data){
          for(let c in selected_id){
            if(full_data[r][0]._id == selected_id[c]){
              if(full_data[r][0].project_id == project_id){
                console.log(full_data[r][0].project_id, project_id, full_data[r][0].node_id, node_id)
                // console.log(selected_id[c])
              }
            } 
          }
        }
      },
      selectDataset(){
        let rowObj = {}
        let pData = new Array()
        let full_data = this.getData(this.userPosts)
        
        for(let r in full_data){
          let _id = full_data[r][0]._id
          let ds_nm = full_data[r][0].dataset_name
          let pj_id = full_data[r][0].project_id
          let nd_id_rng = full_data[r][0].node_id + " ~ " + full_data[r][full_data[r].length-1].node_id
          rowObj = {'_id':_id, 'dataset_name': ds_nm, 'project_id': pj_id, 'node_id_range': nd_id_rng}
          pData.push(rowObj)
        }
        
        this.processToDialog = pData
        this.processDialog = true;
      },
      getData(data){
        let res = new Array()
        let rowObj = {}
        for(let r in data){
          let tempArr = data[r].categories
          let allArr = new Array()
          for(let i = 0; i < tempArr.length; i+=7){
            rowObj = {'_id':data[r]._id,'dataset_name':data[r].title, 'project_id':tempArr[i], 'node_id':tempArr[i+1], 'var_ip':tempArr[i+2], 'var_sm':tempArr[i+3], 'var_gw':tempArr[i+4], 'var_addr':tempArr[i+5], 'var_cont':tempArr[i+6]}
            allArr.push(rowObj)
          }
          res.push(allArr)
        }
        return res
      },
      extractID(text){
        let temp_string = text
        while(temp_string.indexOf("\n")>-1){
          temp_string = temp_string.replace('\n',' ')
        }

        while(temp_string.indexOf('  ')>-1){
          temp_string = temp_string.replace('  ',' ')
        }
        temp_string = temp_string.split(' ')

        let res = {}
        for(let i = 0; i < temp_string.length; i++){
          if(temp_string[i] == "project-id:") res["project_id"] = temp_string[i+1]
          if(temp_string[i] == "node-id:") res["node_id"] = temp_string[i+1]
        }
        return res
      },
      submitForm() {
        if (this.$refs.form.validate()) {
          EventBus.$emit('submitPostForm',
          {
            parentName: this.parentName,
            template: {
              templateId: this.templateId,
              userId: this.userId,
              title: this.title,
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrBE7meLSJg_1PE9w2EQzKKG6lqDwuAQ0xMPejJzekaPjl8raNuYw_QCmRwBfYaWM6ny8&usqp=CAU",
              content: this.text,
              description: "no description"
            }
          });
        }
      },
      selectedFile() {
        // console.log('selected a file');
        // console.log(this.$refs.myFile.files[0]);
        
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
      },
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
      },
      closeProcess(){
        this.processDialog = false
      }
    }
  };
</script>

<style>
  .text-area{
    width:100%;
    min-width:300px;
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
  @media only screen and (min-width: 500px){
    .text-area{
      width:100%;
      min-width:500px;
      min-height:300px;
      border: 1px solid;
    }
  }
</style>
