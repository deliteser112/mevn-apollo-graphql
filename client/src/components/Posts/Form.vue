<template>
<div>
  <v-form v-model="isFormValid" ref="form" @submit.prevent>
      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field :rules="titleRules" v-model="title" label="Dataset Name" type="text" required></v-text-field>
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

            <v-btn v-if="isCSV" color="info" type="button"  @click="addAddRow">
              <v-icon light>add</v-icon>
              Add row
            </v-btn>
            <v-btn v-if="isCSV" color="info" type="button"  @click="deleteRows">
              <v-icon light>delete</v-icon>
              Delete row
            </v-btn>
            <v-btn :loading="loading" v-if="isCSV" color="info" type="button"  @click="importAgain">
              <v-icon light>slow_motion_video</v-icon>
              Import again
            </v-btn>
          </v-flex>
        </v-layout>

          <div class="container" style="overflow-x:auto">
            <div class="panel panel-sm">
              <div class="panel-body">
                <table v-if="isCSV">
                  <thead>
                    <tr>
                     <th></th>
                      <th v-for="(key, h_index) in parse_header"
                          @click="sortBy(key)"
                          :key="h_index"
                          :class="{ active: sortKey == key }">
                        {{ key | capitalize }}
                        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="table_content" ref="ref_table">
                    <tr v-for="(csv, index) in parse_csv" :key="index" :id="index">
                      <td style="text-align:center"><input type="checkbox" :data-value="index" style="width:20px; height:20px"></td>
                      <td v-for="(key, c_index) in parse_header" :key="c_index">
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
        <v-card-title class="headline grey lighten-2">DataSet({{update_title}})</v-card-title>
        <v-container style="overflow-x:auto;">

          <v-layout row>
            <v-flex xs12 style="text-align:right">
              <v-btn color="info" type="submit"  @click="updateAddRow">
                <v-icon light>add</v-icon>
                Add row
              </v-btn>
              <v-btn color="info" type="submit"  @click="updateDeleteRows">
                <v-icon light>delete</v-icon>
                Delete row
              </v-btn>
            </v-flex>
          </v-layout>

          <v-form v-model="isFormValid" ref="updateform" @submit.prevent>
            <v-layout row>
              <v-flex xs12>
                <thead ref="ref_update_header">
                  <tr>
                    <th></th>
                    <th class="text-left" v-for="(item, index) in csvHeader" :key="index">
                      {{item}}
                    </th>
                  </tr>
                </thead>
                <tbody ref="ref_update_table">
                  <tr
                    v-for="(row,index) in csvTable"
                    :key="index"
                    :id="index"
                  >
                    <td style="text-align:center"><input type="checkbox" :data-value="index" style="width:20px;height:20px"></td>
                    <td v-for="(item, index) in row" :key="index">
                      <div class="update-input-cell" contenteditable="true">{{item}}</div>
                    </td>
                  </tr>
                </tbody>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-btn color="info" type="button"  @click="closeDataset">
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                  Close
                </v-btn>
                <v-btn color="info" type="submit"  @click="submitUpdateForm">
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                  Update
                </v-btn>
                
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- alert -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="alertDialog" 
        transition="dialog-top-transition"
        max-width="600">
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >Template Process</v-toolbar>
        <v-card-text>
          <v-icon light style="width: 100%; font-size: 100px; color:rgb(237, 86, 27)">verified_user</v-icon>
          <div class="font-weight title" style="padding:20px;">{{alertContent}}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="confirmAlert"
          >Ok</v-btn>

          <v-btn
            text
            @click="closeAlert"
          >Cancel</v-btn>
        </v-card-actions>
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
        alertDialog: false,
        alertContent: "",
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

        //update post
        
        update_title:"",
        update_variables:[],

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

      submitUpdateForm() {
        if (this.$refs.updateform.validate()) {
          EventBus.$emit('submitUpdatePostForm',
          {
            parentName: this.parentName,
            post: {
              postId: this.postId,
              userId: this.userId,
              title: this.getDataset().title,
              imageUrl: "../../../assets/dataset-icon.jpg",
              categories: this.getDataset().values,
              variables: this.getDataset().variables,
              description: "no description"
            }
          });
        }
      },
  
      deleteRows(){
        let tbl_data = this.$refs.ref_table
        const checkboxes = tbl_data.querySelectorAll(`input[type="checkbox"]:checked`);

        console.log(checkboxes)
        let checkedArr = new Array()
        for(let i = 0; i < checkboxes.length; i++){
          checkedArr.push(checkboxes[i].getAttribute('data-value'))
        }

        for(let i = 0; i < checkedArr.length; i++){
          let el = document.getElementById(checkedArr[i]);
          console.log(el)
          el.remove(); // Removes the div with the 'div-02' id
        }
      },
      updateDeleteRows(){
        let tbl_data = this.$refs.ref_update_table
        const checkboxes = tbl_data.querySelectorAll(`input[type="checkbox"]:checked`);

        let checkedArr = new Array()
        for(let i = 0; i < checkboxes.length; i++){
          checkedArr.push(checkboxes[i].getAttribute('data-value'))
        }

        for(let i = 0; i < checkedArr.length; i++){
          let el = document.getElementById(checkedArr[i]);
          console.log(el)
          el.remove(); // Removes the div with the 'div-02' id
        }
      },
      addAddRow(){
        let tbl_data = this.$refs.ref_table
        let value = tbl_data.querySelectorAll(".input-cell");
        let val_len = this.parse_header.length
        let data_val = value.length/val_len
        let project_id = value[0].innerHTML

        let c_tr, c_td, c_div, c_input, c_text
        c_tr = document.createElement("tr")
        c_tr.setAttribute("id", data_val)
        c_input = document.createElement("input");
        c_input.setAttribute("type", "checkbox");
        c_text = document.createTextNode(project_id.trim())

        for(let i = 0; i < (val_len+1); i++){
          c_td = document.createElement("td")
          c_div = document.createElement("div")
          if(i == 0){
            c_td.style.textAlign = 'center'
            c_input.style.width = '20px'
            c_input.style.height = '20px'
            c_input.setAttribute('data-value', data_val)
            c_div.appendChild(c_input)
          }else{
            c_div.setAttribute('class', 'input-cell')
            c_div.setAttribute('contenteditable', 'true')
          }
          if(i == 1) c_div.appendChild(c_text)
          c_td.appendChild(c_div)
          c_tr.appendChild(c_td)
        }
        
        tbl_data.appendChild(c_tr)
      },

      updateAddRow(){
        let tbl_data = this.$refs.ref_update_table
        let value = tbl_data.querySelectorAll(".update-input-cell");
        let val_len = this.update_variables.length
        let data_val = value.length/val_len
        let project_id = value[0].innerHTML

        let c_tr, c_td, c_div, c_input, c_text
        c_tr = document.createElement("tr")
        c_tr.setAttribute("id", data_val)
        c_input = document.createElement("input");
        c_input.setAttribute("type", "checkbox");
        c_text = document.createTextNode(project_id.trim())

        for(let i = 0; i < (val_len+1); i++){
          c_td = document.createElement("td")
          c_div = document.createElement("div")
          if(i == 0){
            c_td.style.textAlign = 'center'
            c_input.style.width = '20px'
            c_input.style.height = '20px'
            c_input.setAttribute('data-value', data_val)
            c_div.appendChild(c_input)
          }else{
            c_div.setAttribute('class', 'update-input-cell')
            c_div.setAttribute('contenteditable', 'true')
          }
          if(i == 1) c_div.appendChild(c_text)
          c_td.appendChild(c_div)
          c_tr.appendChild(c_td)
        }
        
        tbl_data.appendChild(c_tr)
      },
      /////////// import csv
      saveDataSet(){
        let element = this.$refs.ref_table
        let data = element.querySelectorAll(".input-cell");

        let res = {}
        let linerArr = new Array()

        res["variables"] = this.parse_header
        for(let i = 0; i < data.length; i++){
          let tp_cell = data[i].innerHTML.trim()
          tp_cell = tp_cell.replaceAll('<div>', ' ')
          tp_cell = tp_cell.replaceAll('</div>', ' ')
          tp_cell = tp_cell.trim()
          linerArr.push(tp_cell)
        }
        res["values"] = linerArr
        return res
      },
      getDataset(){
        let datasets = this.userPosts;

        let element = this.$refs.ref_update_table
        let header = this.$refs.ref_update_header
        let data = element.querySelectorAll(".update-input-cell");
        let variables = header.querySelectorAll(".text-left")

        let res = {}
        let linerArr = new Array()
        let variablesArr = new Array()

        for(let i = 0; i < variables.length; i++) variablesArr.push(variables[i].innerHTML.trim())

        res["variables"] = variablesArr
        for(let i = 0; i < data.length; i++){
          let tp_cell = data[i].innerHTML.trim()
          tp_cell = tp_cell.replaceAll('<div>', ' ')
          tp_cell = tp_cell.replaceAll('</div>', ' ')
          tp_cell = tp_cell.trim()
          linerArr.push(tp_cell)
        }
        res["values"] = linerArr
        res["title"] = this.update_title
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
        this.isCSV = false
        this.parse_csv = []
        this.parse_header = []
      },
      open(id, editPostDialog=true){
        this.postId = id
        let datasets = this.userPosts;
        let values = new Array()
        let variables = new Array()
        for(let row in datasets){
          if(id == datasets[row]._id){
            this.update_title = datasets[row].title
            this.update_variables = datasets[row].variables
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
        this.csvTable = allArr

        this.editPostDialog = editPostDialog;
      },
      deletePost(postId) {
        this.postId = postId
        this.alertDialog = true
        this.alertContent = "Are you sure you want to delete this dataset?"
      },
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
      },
      closeDataset(){
        this.editPostDialog = false;
      },
      closeAlert(){
        this.alertDialog = false
      },
      confirmAlert(){
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId
        });
        location.reload()
      }
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

  checkbox{
    width: 20px !important;
    height: 20px !important;
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
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  }

  td, th {
    border: 1px solid #ffffff;
    text-align: left;
    padding: 8px;
    background-color: white;
  }

  tr:nth-child(even) {
    background-color: #ffffff !important;
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
  .update-input-cell{
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
