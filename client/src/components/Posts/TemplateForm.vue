<template>
<div v-cloak>
  <v-form v-model="isFormValid" ref="form" @submit.prevent style="width:100%;">
      <!-- Title Input -->
      <v-layout row>
        <v-flex xs3>
          <v-text-field :rules="titleRules" v-model="title" label="input template name" type="text" required></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
         <v-flex xs12>
            <div class="import-icon" v-if="!isTemplate">
              <input type="file" ref="myFile" @change="selectedFile"  class="form-control file-input-type" >
              <!-- <img src="https://icon-library.com/images/data-base-icon/data-base-icon-27.jpg" class="cover-image"/> -->
              <img src="../../../assets/data-base-icon-27.jpg" class="cover-image"/>
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

            
            <v-btn :loading="loading" v-if="isTemplate" color="info" type="button"  @click="importAgain">
              <v-icon light>cached</v-icon>
              Import again
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12 class="left-padding">
            <textarea v-model="text" class="text-area" v-if="isTemplate"></textarea>
          </v-flex>
        </v-layout>
                
  </v-form>

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
      <h2 class="font-weight-light">Imported templates
        <span class="font-weight-regular">({{userTemplates.length}})</span>
      </h2>
    </v-flex>
    <v-layout row wrap style="justify-content:left;">
      <v-flex xs12 v-for="template in userTemplates" :key="template._id" class="grid-view-cus">
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-btn @click="deleteTemplate(template._id)" color="error" floating fab small dark>
            <v-icon>delete</v-icon>
          </v-btn>

          <!-- <v-img :src="template.imageUrl" @click="template_view(template._id)"></v-img> -->
          <div class="v-template-background" @click="template_view(template._id)"></div>
          <v-card-text>{{template.title}}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <!-- View Process Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="processDialog" class="dialog-width">
      <v-card>
        <v-card-title class="headline grey lighten-2">Select the dataset</v-card-title>
        <v-container>
          <v-layout row >
            <v-flex xs12 sm12 md12 ma-12>
              <v-card>
               
                <v-list two-line subheader >
                  <v-subheader id="sub">Select dataset
                    <v-spacer></v-spacer>
                    <v-btn class="ml-4" @click="clear" depressed color="blue lighten-4" small>reset</v-btn>
                  </v-subheader>
                  <div v-for="(item, index) in allDataset" :key="index">
                  <v-list-tile :class="[{'blue lighten-5': item.selected }, 'white']">
                    <v-list-tile-action>
                      <v-checkbox v-model="item.selected"></v-checkbox>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{item.dataset_name}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action id="role" class="pr-2">
                      <v-list-tile-action-text>Project ID</v-list-tile-action-text>
                      <v-list-tile-text>{{ item.project_id }}</v-list-tile-text>
                    </v-list-tile-action>              
                  </v-list-tile>
                    <v-divider v-if="index + 1 < item.length"></v-divider>
                    </div>
                </v-list>
              </v-card>
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

    <!-- View Template Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editTemplateDialog" style="width:100px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Template ({{templateTitle}})</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12>
                <textarea v-model="templateContent" class="text-area"></textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeTemplate">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
              <v-btn color="info" type="button"  @click="closeTemplate">
                <v-icon light>update</v-icon>
                Update
              </v-btn>
              <v-btn :loading="loading" color="info" type="button"  @click="selectDataset">
                <v-icon light>format_list_bulleted</v-icon>
                Select dataset
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
        allDataset:[],
        templateContent:'',
        templateTitle:'',
        editTemplateDialog: false,
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
        ],

        /////////////for testing
        allSelected: false,
      };
    },
    computed: {
      ...mapState(['user', 'userPosts', "userTemplates", 'error', 'loading','postCategories']),
      selection() {
        return this.allDataset.filter(item => {
          if (item.selected === true) {
            return item
          }
        });
      }
    },
    created() {
      this.getUserPosts();
      this.getUserTemplates();
      this.getUserSavedTemplates();
    },
    methods: {
/////////////////// ----- start the prcess of the template ------ ////////////
      processData(){
        let ext_data = this.extractID(this.templateContent)
        let full_data = this.getData(this.userPosts)
        let arr = this.userPosts
        let selected_id = new Array() // selected id of dataset
        
        if(this.selection.length > 0) 
          for(let r in this.selection) 
            selected_id.push(this.selection[r]._id)
        else{
          for(let r in full_data){
            selected_id.push(full_data[r][0][0])
          }
        }
        /// --- main processing section --- ///
        let temp_type = ext_data.type
        let dataExists = false
        for(let r in full_data){
          for(let c in selected_id){
            let f_project_id = full_data[r][0][2].trim()
            let e_project_id = ext_data.project_id.trim()
            if(full_data[r][0][0] == selected_id[c] && !f_project_id.localeCompare(e_project_id)){
              dataExists = true
              let project_variables = new Array()
              let p_node_ids = new Array()
              // in case of template type is any
              if(temp_type == "any"){
                for(let w in full_data[r]){
                  let dataset_variables = arr[r].variables
                  let template_variables = ext_data.variables
                  let row = {}
                  p_node_ids.push(full_data[r][w][3])

                  // checking if template variables exist in dataset, and take the variables.
                  for(let q in template_variables){
                    for(let m in dataset_variables){
                      if(template_variables[q].trim() == dataset_variables[m].trim()){
                        let index = Number(m) + 2
                        let key = dataset_variables[m].trim()
                        row[key] = full_data[r][w][index]
                      }
                    }
                  }
                  project_variables.push(row)
                }
                let processedTemplate = this.makeTemplate(this.templateContent, project_variables)
                let saveTemplates = this.configTemplate(processedTemplate, e_project_id, p_node_ids)

                this.storeTemplates(saveTemplates)

               // in case of template node ids are several.
              }else if(temp_type == "multiple"){
                let node_ids = new Array()

                // node ids in template
                node_ids = ext_data.node_id
                p_node_ids = node_ids
                for(let w in full_data[r]){
                  for(let q in node_ids){

                    // in case of template node id is matched with dataset node id, 
                    if(full_data[r][w][3] == node_ids[q].trim()){
                      let dataset_variables = arr[r].variables
                      let template_variables = ext_data.variables
                      let row = {}

                      // checking if template variables exist in dataset, and take the variables.
                      for(let q in template_variables){
                        for(let m in dataset_variables){
                          if(template_variables[q].trim() == dataset_variables[m].trim()){
                            let index = Number(m) + 2
                            let key = dataset_variables[m].trim()
                            row[key] = full_data[r][w][index]
                          }
                        }
                      }
                      project_variables.push(row)
                    }
                  }
                }

                let processedTemplate = this.makeTemplate(this.templateContent, project_variables)
                let saveTemplates = this.configTemplate(processedTemplate, e_project_id, p_node_ids)

                this.storeTemplates(saveTemplates)

                // in case of template node ids is only one.
              }else if(temp_type.trim() == "single"){
                p_node_ids.push(ext_data.node_id.trim())
                for(let w in full_data[r]){

                  // in case of template node id is matched with dataset node id, 
                  if(full_data[r][w][3] == ext_data.node_id.trim()){
                    let dataset_variables = arr[r].variables
                    let template_variables = ext_data.variables
                    let row = {}

                    // checking if template variables exist in dataset, and take the variables.
                    for(let q in template_variables){
                      for(let m in dataset_variables){
                        if(template_variables[q].trim() == dataset_variables[m].trim()){
                          let index = Number(m) + 2
                          let key = dataset_variables[m].trim()
                          row[key] = full_data[r][w][index]
                        }
                      }
                    }
                    project_variables.push(row)
                  }
                }
                let processedTemplate = this.makeTemplate(this.templateContent, project_variables)
                let saveTemplates = this.configTemplate(processedTemplate, e_project_id, p_node_ids)

                this.storeTemplates(saveTemplates)
              }
            }
          }
        }
        if(!dataExists) alert("The data is not exist!")
      },
      extractID(text){
        let temp_string = text

        while(temp_string.indexOf('\n')>-1){
          temp_string = temp_string.replace('\n', ' ')
        }
        while(temp_string.indexOf('  ')>-1){
          temp_string = temp_string.replace('  ',' ')
        }

        temp_string = temp_string.split(' ')

        let res = {}
        let variables = new Array()
        for(let i = 0; i < temp_string.length; i++){
          if(temp_string[i] == "project_id:") res["project_id"] = temp_string[i+1]
          if(temp_string[i] == "node_id:"){
            
            if(temp_string[i+1].indexOf(',') > 1){
              res["type"] = "multiple"
              let j = i+1
              let node_ids = new Array()
              
              while(temp_string[j].indexOf(',')>1){
                temp_string[j] = temp_string[j].replace(',','')
                node_ids.push(temp_string[j])
                j++
              }
              node_ids.push(temp_string[j])
              res["node_id"] = node_ids
            }else if(temp_string[i+1].indexOf('*') > -1){
              res["type"] = "any"
            }else{
              res["node_id"] = temp_string[i+1]
              res["type"] = "single"
            }
          }

          if(temp_string[i].indexOf('$var_')>-1){
            let val = temp_string[i]
            if(val.indexOf('.')) val = val.replace('.','')
            if(val.indexOf(',')) val = val.replace(',','')
            if(val.indexOf(':')) val = val.replace(':','')
            variables.push(val)
          }
        }
        res["variables"] = variables
        return res
      },
      downloadTemplate(m_template){
        let res_template = this.makeTemplate(m_template)
        
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
        const blob = new Blob([res_template], { type: 'text/plain' }) //text/plain //application/pdf
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = m_template["node_id"]+ "_" +timestamp + ".txt"
        link.click()
        URL.revokeObjectURL(link.href)
      },
      makeTemplate(m_template, variables){
        
        let processedTemplate = new Array()
        for(let r in variables){
          let t_template = m_template

          let keys = Object.keys(variables[r])
          // console.log(keys)
          let exceptChar = [" ", ".", ",","\n", ":", "/", ";", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "|", "{", "}", "/", ""]
          for(let i = 0; i < exceptChar.length; i++){
            for(let k in keys){
              const regex = `${keys[k]}${exceptChar[i]}`
              const repstr = `${variables[r][keys[k]]}${exceptChar[i]}`
              t_template = t_template.replaceAll(regex, repstr );
            }
          }

          let t_str_p = t_template.match(/project_id:(.*)/)
          if(t_str_p != null){
            let r_project_id = "project_id:"+t_str_p[1];
            t_template = t_template.replace(r_project_id, "")
          }
          
          let t_str_n = t_template.match(/node_id:(.*)/)
          if(t_str_n != null){
            let r_node_id = "node_id:"+t_str_n[1];
            t_template = t_template.replace(r_node_id, "")
          }

          processedTemplate.push(t_template)
        }
        return processedTemplate
      },
      selectDataset(){
        if(this.templateContent.indexOf('project_id') > -1 && this.templateContent.indexOf('node_id') > -1){
          let rowObj = {}
          let pData = new Array()
          let full_data = this.getData(this.userPosts)
          
          for(let r in full_data){
            let _id = full_data[r][0][0]
            let ds_nm = full_data[r][0][1]
            let pj_id = full_data[r][0][2]
            rowObj = {'_id':_id, 'dataset_name': ds_nm, 'project_id': pj_id, 'selected':false}
            pData.push(rowObj)
          }
          
          this.allDataset = pData
          this.processDialog = true;
        }else{
          alert("Project ID or Node ID is not exist!")
        }
        
      },
      getData(data){
        let res = new Array()

        for(let r in data){
          let tempArr = data[r].categories
          let variableArr = data[r].variables
          let allArr = new Array()
          for(let i = 0; i < tempArr.length; i += variableArr.length){
            let rows = new Array()
            rows.push(data[r]._id)
            rows.push(data[r].title)
            for(let j = 0; j < variableArr.length; j++) {
              rows.push(tempArr[i+j])
            }
            allArr.push(rows)
          }
          res.push(allArr)
        }

        return res
      },
      
//////////////////////// ----- end process ----- //////////////////

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
      deleteTemplate(templateId) {
        const deleteTemplate = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (deleteTemplate) {
          this.$store.dispatch("deleteUserTemplate", {
            templateId: templateId
          });
          location.reload()
        }
      },
      closeTemplate(){
        this.editTemplateDialog = false;
      },
      template_view(id, editTemplateDialog=true){
        let templates = this.userTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateContent = templates[row].content
              this.templateTitle = templates[row].title
              break;
          } 
        } 
        this.editTemplateDialog = editTemplateDialog;
      },
      closeProcess(){
        this.processDialog = false
      },
      clear() {
        this.allDataset.forEach(item => {
          item.selected = false
        })
      },
      importAgain(){
        this.isTemplate = false
        this.text = ""
      },
      storeTemplates(template) {
        this.$store.dispatch('saveTemplates', template);
        this.$router.push("/");
        location.reload()
      },
      configTemplate(templates, project_id, node_ids){
        // for getting timestamp
        let d = new Date(); 
        let timestamp = d.getFullYear() + ""
          + (d.getMonth()+1) + ""
          + d.getDate() + ""
          + d.getHours() + ""  
          + d.getMinutes() + "" 
          + d.getSeconds() + ""
          + d.getMilliseconds()

        let title = project_id+"_"+timestamp
        let template= {
          "userId": this.userId,
          "title": title,
          "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrBE7meLSJg_1PE9w2EQzKKG6lqDwuAQ0xMPejJzekaPjl8raNuYw_QCmRwBfYaWM6ny8&usqp=CAU",
          "templates": templates,
          "node_ids": node_ids
        }
        return template
      }
    }
  };
</script>

<style>
  #sub {
    background-color: #f0f0f0;
  }
  #toolbar {
    outline-style: solid;
      outline-color: #999999;
      outline-width: 1px;
  }
  .dialog-width{
    min-width:300px !important;
  }
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
