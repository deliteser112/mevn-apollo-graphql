<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Post Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Post Form -->
    <v-layout row wrap>
      <!-- <v-flex xs12 sm6 offset-sm3> -->
          <div class="container">
            <div class="panel panel-sm">
              <div class="panel-heading"> 
                <h4>CSV Import</h4>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label for="csv_file" class="control-label col-sm-3 text-right">CSV file to import</label>
                  <div class="col-sm-9">
                    <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)">
                  </div>
                </div>
                
                <div class="col-sm-offset-3 col-sm-9">
                  <a href="#" class="btn btn-primary">Parse CSV</a>
                </div>
                <table v-if="parse_csv">
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
        <!-- <post-form :userId="user._id" :parent-name="$options.name"></post-form> -->
      <!-- </v-flex> -->
    </v-layout>

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import PostForm from "@/components/Posts/Form";

  export default {
    name: "AddPost",
    components: { PostForm },
    data() {
      return {
        headline: 'Import CSV',
        channel_name: '',
        channel_fields: [],
        channel_entries: [],
        parse_header: [],
        parse_csv: [],
        sortOrders:{},
        sortKey: ''
      };
    },
    filters: {
      capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;

        let createdPost = JSON.parse(JSON.stringify(post));
        delete createdPost.postId;
        this.addPost(createdPost);
      });
    },
    methods: {
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
        console.log(lines)
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
  .panel {
    border: 2px solid #dfdfdf;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 0 0;
    margin: 10px;
  } 
  .panel.panel-sm {
    max-width: 700px;
    margin: 10px auto;
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
</style>
