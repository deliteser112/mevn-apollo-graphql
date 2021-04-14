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
              <img src="https://4.bp.blogspot.com/-RvcP073l-D4/XEnytR0HqyI/AAAAAAAAACg/VZVoarvnCGc1TKpSlliQ60EnujJiCm1OwCLcBGAs/s1600/import-csv-to-database.png" class="cover-image"/>
            </div>
            
            <v-btn :loading="loading" :disabled="!isCSV || loading" color="info" type="submit"  @click="submitForm">
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
              Submit
            </v-btn>

            <v-btn :loading="loading" v-if="isCSV" color="info" type="submit"  @click="addRow">
              <v-icon light>add</v-icon>
              Add row
            </v-btn>
            <v-btn :loading="loading" v-if="isCSV" color="info" type="submit"  @click="deleteRows">
              <v-icon light>delete</v-icon>
              Delete row
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
                        <input type="text" :value="csv[key]" class="input-cell"/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
  </v-form>
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
        checked:[],
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders:{},
        sortKey: '',
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
        for(let i = 0; i < 7; i++){
          c_td = document.createElement("td")
          c_input = document.createElement("input")
          // if(i == 0){
          //   c_input.setAttribute('type','checkbox')
          //   c_input.setAttribute('onClick','isChecked()')
          // }else{
            c_input.setAttribute('type','text')
            c_input.setAttribute('class', 'input-cell')
          // }
          if(i == 0) c_input.setAttribute('value', project_id)
          if(i == 1) c_input.setAttribute('value', node_id+tbl_data.rows.length+1)
          c_td.appendChild(c_input)
          c_tr.appendChild(c_td)
        }
        
        tbl_data.appendChild(c_tr)
      },
      /////////// import csv
      saveDataSet(){
        let element = this.$refs.ref_table
        let data = element.querySelectorAll(".input-cell");
        let rowObj = {}
        let allArr = new Array()
        let linerArr = new Array()
        for(let i = 0; i < data.length; i+=7){
          rowObj = {'project_id':data[i].value, 'node_id':data[i+1].value, 'var_ip':data[i+2].value, 'var_sm':data[i+3].value, 'var_gw':data[i+4].value, 'var_addr':data[i+5].value, 'var_cont':data[i+6].value}
          allArr.push(rowObj)
        }

        for(let i = 0; i < data.length; i++) linerArr.push(data[i].value)
        return linerArr
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
    width:100%;
  }
  .left-padding{
    padding: 20px;
  }
</style>
