<template>
<div>
  <v-form v-model="isFormValid" ref="form" @submit.prevent>

      <!-- Title Input -->
      <v-layout row>
        <v-flex xs12>
          <v-text-field :rules="titleRules" v-model="title" class="margin-top" label="Dataset name" type="text" required></v-text-field>
        </v-flex>
      </v-layout>

        <v-layout row>
          <v-flex xs12 class="left-padding">
            <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)">
          </v-flex>
        </v-layout>

          <div class="container">
            <div class="panel panel-sm">
              <div class="panel-body">
                <table v-if="parse_csv" id="table_content">
                  <thead>
                    <tr>
                      <th v-for="key in parse_header"
                          @click="sortBy(key)"
                          :class="{ active: sortKey == key }">
                        {{ key | capitalize }}
                        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tr v-for="csv in parse_csv">
                    <td v-for="key in parse_header">
                      <input type="text" :value="csv[key]" class="input-cell"/>
                    </td>
                  </tr>
                  
                </table>
              </div>
            </div>
            
          </div>
    <v-layout row>
      <v-flex xs12>
        <v-btn :loading="loading" :disabled="!isCSV || loading" color="info" type="submit"  @click="submitForm">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
          Submit
        </v-btn>
      </v-flex>
    </v-layout>

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
        console.log("this is assignPostToInputFields")
      }
    },
    data() {
      return {
        // import csv
        isCSV: false,
        headline: 'Import DataSet',
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
              imageUrl: "https://designshack.net/wp-content/uploads/photoshop-logo-templates-368x246.png",
              categories: this.saveDataSet(),
              description: "no description"
            }
          });
        }
      },

      /////////// import csv
      saveDataSet(){
        // let table_content = document.getElementById("table_content")
        // console.log(table_content)document.getElementById("myDIV").querySelectorAll(".example")
        let data = document.getElementById("table_content").querySelectorAll(".input-cell");
        let rowObj = {}
        let allArr = new Array()
        let linerArr = new Array()
        for(let i = 0; i < data.length; i+=7){
          rowObj = {'project_id':data[i].value, 'node_id':data[i+1].value, 'var_ip':data[i+2].value, 'var_sm':data[i+3].value, 'var_gw':data[i+4].value, 'var_addr':data[i+5].value, 'var_cont':data[i+6].value}
          allArr.push(rowObj)
        }

        for(let i = 0; i < data.length; i++) linerArr.push(data[i].value)
        console.log(linerArr)
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
