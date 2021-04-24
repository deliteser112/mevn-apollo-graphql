<template>
<div>
  <v-form v-model="isFormValid" ref="form" @submit.prevent>

      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field :rules="titleRules" v-model="title" class="margin-top" label="Dataset name" type="text" required></v-text-field>
        </v-flex>
      </v-layout>

        <v-layout row>
          <v-flex xs12 class="left-padding">
            <div class="import-icon" v-if="!isCSV">
              <input type="file" id="csv_file" name="csv_file" class="form-control file-input-type" @change="loadCSV($event)">
              <img src="../../../assets/import-csv-to-database.jpg" class="cover-image"/>
            </div>
            
            <v-btn :loading="loading" :disabled="!isCSV || loading" color="info" type="submit"  @click="submitForm">
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
              Submit
            </v-btn>

            <v-btn :loading="loading" v-if="isCSV" color="info" type="button"  @click="addRow">
              <v-icon light>add</v-icon>
              Add row
            </v-btn>
            <v-btn :loading="loading" v-if="isCSV" color="info" type="button"  @click="deleteRows">
              <v-icon light>delete</v-icon>
              Delete row
            </v-btn>
            <v-btn :loading="loading" v-if="isCSV" color="info" type="button"  @click="importAgain">
              <v-icon light>slow_motion_video</v-icon>
              Import again
            </v-btn>
          </v-flex>
        </v-layout>

          <div class="container">
            <div class="panel panel-sm">
              <div class="panel-body">
                <table v-if="parse_csv">
                  <thead>
                    <tr>
                     <th></th>
                      <th v-for="key in parse_header"
                          @click="sortBy(key)"
                          :class="{ active: sortKey == key }">
                        {{ key | capitalize }}
                        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="table_content" ref="ref_table">
                    <tr v-for="csv in parse_csv">
                      <td><input type="checkbox" @click="isChecked"></td>
                      <td v-for="key in parse_header">
                        <!-- <input type="text" :value="csv[key]" class="input-cell" /> -->
                        <div class="input-cell" contenteditable="true">{{csv[key]}}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
  </v-form>
  
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
        <v-flex xs12 v-for="post in userPosts" :key="post._id" class="grid-view-cus">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="deletePost(post._id)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>
            <div class="v-dataset-background" @click="open(post._id)"></div>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

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
                  <td v-for="(item, index) in row" :key="index">
                    <div class="input-cell" contenteditable="true">{{item}}</div>
                  </td>
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
            variables: [],
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
        headline: 'Import DataSet',
        isCSV: false,
        editPostDialog: false,
        checked:[],
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders:{},
        sortKey: '',

        csvTable:[],
        csvHeader:[],
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
      ...mapState(['user', 'error', 'loading','postCategories', 'userPosts'])
    },
    created() {
      this.getUserPosts();
    },
    methods: {
      submitForm() {
        if (this.$refs.form.validate()) {
          console.log(this.saveDataSet().variables, this.saveDataSet().values)
          EventBus.$emit('submitPostForm',
          {
            parentName: this.parentName,
            post: {
              postId: this.postId,
              userId: this.userId,
              title: this.title,
              imageUrl: "../../../assets/dataset-icon.jpg",
              categories: this.saveDataSet().values,
              variables: this.saveDataSet().variables,
              description: "no description"
            }
          });
        }
      },
      
      isChecked(event){
        console.log("this is isChecked functions")
      },
      deleteRows(){
        let tbl_data = this.$refs.ref_table
      },
      addRow(){
        let tbl_data = this.$refs.ref_table
        let value = tbl_data.querySelectorAll(".input-cell");
        let project_id = value[0].value
        let node_id = Number(value[1].value)-1
        let c_tr, c_td, c_input
        c_tr = document.createElement("tr")
        for(let i = 0; i < (this.parse_header.length+1); i++){
          c_td = document.createElement("td")
          c_input = document.createElement("input")
          if(i == 0){
            c_input.setAttribute('type','checkbox')
            c_input.setAttribute('onClick','isChecked()')
          }else{
            c_input.setAttribute('type','text')
            c_input.setAttribute('class', 'input-cell')
          }
          if(i == 1) c_input.setAttribute('value', project_id)
          if(i == 2) c_input.setAttribute('value', node_id+tbl_data.rows.length+1)
          c_td.appendChild(c_input)
          c_tr.appendChild(c_td)
        }
        
        tbl_data.appendChild(c_tr)
      },
      /////////// import csv
      saveDataSet(){
        let element = this.$refs.ref_table
        let data = element.querySelectorAll(".input-cell");

        let res = {}
        let rowObj = {}
        let allArr = new Array()
        let linerArr = new Array()

        // for(let i = 0; i < data.length; i+=7){
        //   rowObj = {'project_id':data[i].value, 'node_id':data[i+1].value, 'var_ip':data[i+2].value, 'var_sm':data[i+3].value, 'var_gw':data[i+4].value, 'var_addr':data[i+5].value, 'var_cont':data[i+6].value}
        //   allArr.push(rowObj)
        // }

        res["variables"] = this.parse_header
        for(let i = 0; i < data.length; i++) linerArr.push(data[i].innerHTML)
        res["values"] = linerArr
        return res
      },
      addPost(post) {
        this.$store.dispatch('addPost', post);
        this.$router.push("/");
      },
      sortBy: function (key) {
        var vm = this
        vm.sortKey = key
        vm.sortOrders[key] = vm.sortOrders[key] * -1
      },
      csvJSON(csv){
        var vm = this
        var lines = csv.split("\n")
        if(lines.length>0) this.isCSV = true
        var result = []
        var headers = lines[0].split(",")
        vm.parse_header = lines[0].split(",") 
        lines[0].split(",").forEach(function (key) {
          vm.sortOrders[key] = 1
        })
        
        lines.map(function(line, indexLine){
          if (indexLine < 1) return // Jump header line
          
          var obj = {}
          var currentline = line.split(",")
          
          headers.map(function(header, indexHeader){
            obj[header] = currentline[indexHeader]
          })
          
          result.push(obj)
        })
        
        result.pop() // remove the last item because undefined values
        
        return result // JavaScript object
      },
      loadCSV(e) {
        var vm = this
        if (window.FileReader) {
          var reader = new FileReader();
          reader.readAsText(e.target.files[0]);
          // Handle errors load
          reader.onload = function(event) {
            var csv = event.target.result;
            vm.parse_csv = vm.csvJSON(csv)
            
          };
          reader.onerror = function(evt) {
            if(evt.target.error.name == "NotReadableError") {
              alert("Canno't read file !");
            }
          };
        } else {
          alert('FileReader are not supported in this browser.');
        }
      },
      importAgain(){
        location.reload()
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
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
        console.log("this is user_id:", this.user._id)
      },
      closeDataset(){
        this.editPostDialog = false;
      },
    }
    
  };
</script>

<style>
  .import-icon{
    position:relative;
  }
  .cover-image{
    width: 300px;
    height: 120px;
    cursor: pointer;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  }

  .file-input-type{
    cursor: pointer;
    width: 300px;
    height: 120px;
    position: absolute;
    opacity: 0;
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
    background: #ffffff;
    -moz-box-sizing: border-box;
    border: 1px solid #CBD5DD;
    border-radius: 2px;
    max-height: 70px;
    max-width: 150px;
    word-wrap: break-word;
    margin: 0;
    min-height: 33px;
    overflow: auto;
    position: relative;
    width: 100%;
    padding-left: 5px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  
  .left-padding{
    padding: 20px;
  }
  .panel {
    border: 0px solid #dfdfdf !important;
    box-shadow: rgb(0 0 0 / 15%) 0 1px 0 0;
  }
</style>
