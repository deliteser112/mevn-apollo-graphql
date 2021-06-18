<template>
  <div>
    <v-form v-model="isFormValid" ref="form" @submit.prevent>
      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            :rules="titleRules"
            v-model="title"
            class="margin-top"
            label="Template Name"
            type="text"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

    <!-- Template Type -->
      <v-layout row>
        <v-flex xs6>
          <v-radio-group v-model="radioTemplateType" row @change="typeSet">
            <v-radio
              label="Single Template"
              value="single"
            ></v-radio>
            <v-radio
              label="Template Tree"
              value="tree"
            ></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout row v-if="!isTree">
        <v-flex xs12>
          <div class="import-icon" v-if="!isTemplate">
            <input
              type="file"
              ref="myFile"
              @change="selectedFile"
              class="form-control file-input-type"
            />
            <img
              src="../../../assets/data-base-icon-17.jpg"
              class="cover-image"
            />
          </div>
        </v-flex>
      </v-layout>

      <!-- <v-layout row v-else>
        <v-flex xs12>
          <div class="import-icon" v-if="!isTemplate">
            <input
              type="file"
              ref="myFiles"
              @change="selectedFiles"
              multiple="multiple"
              class="form-control file-input-type"
            />
            <img
              src="../../../assets/data-base-icon-27.jpg"
              class="cover-image"
            />
          </div>
        </v-flex>
      </v-layout> -->

      <v-layout row v-show="isTree">
        <v-flex xs12>
          <upload ref="upload"
            name="files"
            :async-save-url="'custom-save-url'"
            :async-remove-url="'custom-remove-url'"
            :async-chunk-size="11000"
            :directory="true"
            :directory-drop="true">
          </upload>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 class="left-padding">
          <v-btn
            v-if="!isTree"
            :loading="loading"
            :disabled="!isTemplate || loading"
            color="info"
            type="submit"
            @click="submitForm"
          >
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
            Save
          </v-btn>

          <v-btn
            v-if="isTree"
            :loading="loading"
            :disabled="!isTreeImport || loading"
            color="info"
            type="submit"
            @click="submitForm"
          >
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
            Save
          </v-btn>

          <v-btn
            :loading="loading"
            v-if="isTemplate"
            color="info"
            type="button"
            @click="importAgain"
          >
            <v-icon light>cached</v-icon>
            Import again
          </v-btn>

          <v-btn
            :loading="loading"
            :disabled="!isTreeImport || loading"
            v-if="isTree"
            color="info"
            type="button"
            @click="treeImportAgain"
          >
            <v-icon light>cached</v-icon>
            Import again
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 class="left-padding">
          <textarea
            v-model="text"
            class="text-area"
            v-if="isTemplate && !isTree"
          ></textarea>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="isTemplate && isTree">
        <v-flex xs12 style="text-align: right">
          <v-btn color="info" type="button" @click="deleteTemplates">
            <v-icon light>delete</v-icon>
            Delete
          </v-btn>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="treeTemplates"
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 30, 50, 100]"
            select-all
            item-key="_id"
          >
            <template v-slot:headers="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.stop="toggleAll"
                  ></v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template v-slot:items="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td style="width:50px;text-align:center">
                  <v-checkbox
                    :input-value="props.selected"
                    secondary
                    hide-details
                  ></v-checkbox>
                </td>
                <td>{{ Number(props.item._id)+1 }}</td>
                <td class="text-xs-right">{{ props.item.template_name }}</td>
                <td class="text-xs-right">{{ props.item.file_name }}</td>
                <td class="text-xs-right"><v-btn text @click="viewTemplate(props.item._id, viewTemplateType = 'single', isTemplateView = 'tree')">View</v-btn></td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-form>

    <!-- Templates Created By user -->
    <v-container v-if="!userTemplates.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no templates currently. Go and add some!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-1" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Imported templates
          <span class="font-weight-regular">({{ userTemplates.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap style="justify-content:left;">
        <v-flex
          xs12
          v-for="template in userTemplates"
          :key="template._id"
          class="grid-view-cus"
        >
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn
              @click="deleteTemplate(template._id)"
              color="error"
              floating
              fab
              small
              dark
            >
              <v-icon>delete</v-icon>
            </v-btn>
            <div
              v-if="template.templateType=='single'"
              class="v-template-background"
              @click="template_view(template._id, viewTemplateType = 'single', isTemplateView = 'template')"
            ></div>
            <div
              v-else
              class="v-template-background-1"
              @click="template_view(template._id, viewTemplateType = 'tree', isTemplateView = 'template')"
            ></div>
            <v-card-text>{{ template.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- View Process Dialog -->
    <v-dialog
      class="dialog-width"
      xs12
      sm6
      offset-sm3
      persistent
      v-model="processDialog"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2"
          >Select the dataset</v-card-title
        >
        <v-container>
          <v-layout row>
            <v-flex xs12 sm12 md12 ma-12>
              <v-card>
                <v-list two-line subheader style="width: 350px;">
                  <v-subheader id="sub">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="ml-4"
                      @click="clear"
                      color="blue lighten-4"
                      >reset</v-btn
                    >
                  </v-subheader>
                  <div v-for="(item, index) in allDataset" :key="index">
                    <v-list-tile
                      :class="[{ 'blue lighten-5': item.selected }, 'white']"
                    >
                      <v-list-tile-action>
                        <v-checkbox v-model="item.selected"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{
                          item.dataset_name
                        }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < item.length"></v-divider>
                  </div>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button" @click="closeProcess">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Close
              </v-btn>

              <v-btn color="info" type="button" @click="processData" v-if="viewTemplateType=='single'">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Process
              </v-btn>

              <v-btn color="info" type="button" @click="treeTemplateProcess" v-if="viewTemplateType=='tree'">
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
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="editTemplateDialog"
      style="width:100px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2"
          >Template ({{ templateTitle }})</v-card-title
        >
        <v-container>
          <v-form v-model="isFormValid" ref="updateform" @submit.prevent>
            <v-layout row v-if="viewTemplateType=='single'">
              <v-flex xs12>
                <textarea
                  v-model="templateContent"
                  class="text-area"
                ></textarea>
              </v-flex>
            </v-layout>

            <v-layout row wrap v-else>
              <v-flex xs12 style="text-align: right">
                <v-btn color="info" type="button" @click="uDeleteTemplates">
                  <v-icon light>delete</v-icon>
                  Delete
                </v-btn>
                <v-data-table
                  v-model="uSelected"
                  :headers="updateHeaders"
                  :items="updateTreeTemplates"
                  :pagination.sync="pagination"
                  :rows-per-page-items="[10, 15, 50, 100]"
                  select-all
                  item-key="_id"
                >
                  <template v-slot:headers="props">
                    <tr>
                      <th>
                        <v-checkbox
                          :input-value="props.all"
                          :indeterminate="props.indeterminate"
                          primary
                          hide-details
                          @click.stop="uToggleAll"
                        ></v-checkbox>
                      </th>
                      <th
                        v-for="header in props.headers"
                        :key="header.text"
                        :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                        @click="changeSort(header.value)"
                      >
                        <v-icon small>arrow_upward</v-icon>
                        {{ header.text }}
                      </th>
                    </tr>
                  </template>
                  <template v-slot:items="props">
                    <tr :active="props.selected" @click="props.selected = !props.selected">
                      <td style="width:50px;text-align:center">
                        <v-checkbox
                          :input-value="props.selected"
                          secondary
                          hide-details
                        ></v-checkbox>
                      </td>
                      <td>{{ Number(props.item._id)+1 }}</td>
                      <td class="text-xs-right">{{ props.item.template_name }}</td>
                      <td class="text-xs-right">{{ props.item.file_type }}</td>
                      <td class="text-xs-right"><v-btn text @click="updateViewTemplate(props.item._id)">View</v-btn></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-btn color="info" type="button" @click="closeTemplate">
                  <v-icon light>close</v-icon>
                  Close
                </v-btn>
                <v-btn color="info" type="submit" @click="submitUpdateForm" v-if="viewStatus=='template'">
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                  Update template
                </v-btn>
                <v-btn
                  :loading="loading"
                  color="info"
                  type="button"
                  @click="selectDataset"
                  v-if="viewStatus=='template'"
                >
                  <v-icon light>format_list_bulleted</v-icon>
                  Select dataset
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- View Template Dialog -->
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="viewSubTemplateDialog"
      style="width:100px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2"
          >SubTemplate ({{ templateSubTitle }})</v-card-title
        >
        <v-container>
            <v-layout row>
              <v-flex xs12>
                <textarea
                  v-model="templateSubContent"
                  class="text-area"
                ></textarea>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs12>
                <v-btn color="info" type="button" @click="closeSubTemplate">
                  <v-icon light>close</v-icon>
                  Close
                </v-btn>
              </v-flex>
            </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- alert -->
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
            >{{ alertType }}</v-icon
          >
          <div class="font-weigh" style="padding:20px;">{{ alertContent }}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn v-if="isDelete" text @click="confirmDelete">Ok</v-btn>
          <v-btn text @click="closeAlert">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "../../event";
import { Upload } from '@progress/kendo-upload-vue-wrapper';

export default {
  name: "PostForm",
  components: {
      'upload': Upload
  },
  props: {
    userId: String,
    parentName: String,
    template: {
      type: Object,
      default: () => {
        return {
          title: "",
          templateType: "",
          content: "",
          treeTemplate: []
        };
      }
    }
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0) + str.slice(1);
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
      headline: "Import Template",
      isTemplate: false,
      text: "",
      alertDialog: false,
      alertContent: "",
      alertType: "",
      isDelete: false,
      viewStatus: "",
      processDialog: false,
      allDataset: [],
      templateContent: "",
      templateTitle: "",
      editTemplateDialog: false,
      template_title: "",

      viewSubTemplateDialog:false,
      templateSubTitle: "",
      templateSubContent:"",

      // adding template
      isFormValid: true,
      templateId: null,
      title: "",
      templateType: "",
      content: "",
      treeTemplate: [],

      //template tree
      radioTemplateType:"",
      isTree: false,
      treeText: [],
      treeTemplates:[],
      updateTreeTemplates:[],
      isTreeImport:false,

      viewTemplateType:"single",

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

      //datatable

      pagination: {
        sortBy: 'key'
      },
      selected: [],
      uSelected: [],
      headers: [
        {
          text: 'No',
          align: 'left',
          value: 'key'
        },
        { text: 'Name', value: 'template_name' },
        { text: 'File Name', value: 'file_name' },
        { text: 'Template View', value: 'view' }
      ],

      updateHeaders: [
        {
          text: 'No',
          align: 'left',
          value: 'key'
        },
        { text: 'Template Name', value: 'template_name' },
        { text: 'File Type', value: 'file_type' },
        { text: 'Template View', value: 'view' }
      ],

      /////////////for testing
      allSelected: false
    };
  },
  computed: {
    ...mapState([
      "user",
      "userPosts",
      "userTemplates",
      "error",
      "loading",
      "postCategories"
    ]),
    selection() {
      return this.allDataset.filter(item => {
        if (item.selected === true) {
          return item;
        }
      });
    }
  },
  created() {
    this.getUserPosts();
    this.getUserTemplates();
    this.getUserSavedTemplates();
  },
  mounted() {
    this.radioTemplateType = "single"
    this.templateType = "single"

    var upload = this.$refs.upload.kendoWidget();

    let getFile = this.getFile

    upload._module.postFormData = async function (url, data, fileEntry, xhr) {
        var module = this;
        var counter = 0;

        var uid = fileEntry.data("files")[0].uid;

        let file = fileEntry.data("files")[0].rawFile

        let filetype = fileEntry.data("files")[0].extension
        let tmp_name = fileEntry.data("files")[0].name
        tmp_name = tmp_name.split('/')
        tmp_name = tmp_name[tmp_name.length-1]

        let ext_name = tmp_name.split('.')

        let ext = ext_name[ext_name.length-1]
        let filename = tmp_name.replace(`.${ext}`, '')

        const result = await getFile(file, filename, filetype)

        var refreshIntervalId = setInterval(function () {
            if (counter > 100) {
                clearInterval(refreshIntervalId);
                var e = { target: { responseText: '{"uploaded":true,"fileUid":"' + uid + '"}', statusText: "OK", status: 200 } };
                 module.onRequestSuccess.call(module, e, fileEntry);
                return;
            }
            module.upload._onFileProgress({ target: $(fileEntry, module.upload.wrapper) }, counter);
            counter += 49;
        }, 100);
    };

    upload._submitRemove = function (fileNames, eventArgs, onSuccess, onError) {
      
      onSuccess(()=>{
        console.log("OK")
      });
    };
    upload._module.stopUploadRequest= function(fileEntry) {
      console.log("test")
    };
  },

  methods: {
    test(){
      console.log("this is test!!!")
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.treeTemplates.slice()
    },
    uToggleAll () {
      if (this.uSelected.length) this.uSelected = []
      else this.uSelected = this.updateTreeTemplates.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    
    typeSet(){
      this.isTree = this.radioTemplateType=="tree"?true:false
      this.templateType = this.radioTemplateType
      this.isTemplate = false
    },

    /////////////////// ----- start the prcess of the template ------ //////////// ----------------------------------------------
    // singleTemplateProcess(){

    // },

    processData() {
      let ext_data = this.extractID(this.templateContent);
      let full_data = this.getData(this.userPosts);

      let arr = this.userPosts;
      let selected_id = this.getSelectIDs()

      /// --- main processing section --- ///
      let temp_type = ext_data.type;
      let dataExists = false;
      let proStatus = false;

      for (let r in full_data) {
        for (let c in selected_id) {
          let f_project_id = Array();
          let f_tmp_project_id = full_data[r][0][2].trim();
          let e_project_id = ext_data.project_id.trim();

          for (let m in full_data[r])
            f_project_id.push(full_data[r][m][2].trim());

          if (full_data[r][0][0] == selected_id[c]) {
            dataExists = true;
            let project_variables = new Array();
            let p_node_ids = new Array();
            // in case of template type is any
            if (temp_type == "any") {
              for (let w in full_data[r]) {
                let dataset_variables = arr[r].variables;
                let template_variables = ext_data.variables;
                let row = {};
                if (full_data[r][w][2] == e_project_id) {
                  p_node_ids.push(full_data[r][w][3]);

                  // checking if template variables exist in dataset, and take the variables.
                  for (let q in template_variables) {
                    for (let m in dataset_variables) {
                      if (
                        template_variables[q].trim() ==
                        dataset_variables[m].trim()
                      ) {
                        let index = Number(m) + 2;
                        let key = dataset_variables[m].trim();
                        row[key] = full_data[r][w][index];
                      }
                    }
                  }
                  project_variables.push(row);
                }
              }

              let processedTemplate = this.makeTemplate(
                this.templateContent,
                project_variables
              );

              if (processedTemplate.length > 0) {
                proStatus = true;
                let p_project_ids=""
                let p_file_names=""
                let p_file_types=""
                let saveTemplates = this.configTemplate(
                  'single',
                  processedTemplate,
                  this.templateId,
                  e_project_id,
                  p_node_ids,
                  p_project_ids="",
                  p_file_names="",
                  p_file_types=""
                );
                this.storeTemplates(saveTemplates);
              }

              // in case of template node ids are several.
            } else if (temp_type == "multiple") {
              let node_ids = new Array();
              let res_node_ids = new Array();

              // node ids in template
              node_ids = ext_data.node_id;
              for (let w in full_data[r]) {
                for (let q in node_ids) {
                  // in case of template node id is matched with dataset node id,
                  if (
                    full_data[r][w][3] == node_ids[q].trim() &&
                    full_data[r][w][2] == e_project_id
                  ) {
                    let dataset_variables = arr[r].variables;
                    let template_variables = ext_data.variables;
                    let row = {};

                    res_node_ids.push(node_ids[q]);

                    // checking if template variables exist in dataset, and take the variables.
                    for (let q in template_variables) {
                      for (let m in dataset_variables) {
                        if (
                          template_variables[q].trim() ==
                          dataset_variables[m].trim()
                        ) {
                          let index = Number(m) + 2;
                          let key = dataset_variables[m].trim();
                          row[key] = full_data[r][w][index];
                        }
                      }
                    }
                    project_variables.push(row);
                  }
                }
              }

              let processedTemplate = this.makeTemplate(
                this.templateContent,
                project_variables
              );

              console.log(project_variables)

              if (processedTemplate.length > 0) {
                proStatus = true;
                let p_project_ids=""
                let p_file_names=""
                let p_file_types=""
                let saveTemplates = this.configTemplate(
                  'single',
                  processedTemplate,
                  this.templateId,
                  e_project_id,
                  res_node_ids,
                  p_project_ids="",
                  p_file_names="",
                  p_file_types=""
                );
                this.storeTemplates(saveTemplates);
              }

              // in case of template node ids is only one.
            } else if (temp_type.trim() == "single") {
              p_node_ids.push(ext_data.node_id.trim());

              for (let w in full_data[r]) {
                // in case of template node id is matched with dataset node id,
                if (
                  full_data[r][w][3] == ext_data.node_id.trim() &&
                  full_data[r][w][2] == e_project_id
                ) {
                  let dataset_variables = arr[r].variables;
                  let template_variables = ext_data.variables;
                  let row = {};

                  // checking if template variables exist in dataset, and take the variables.
                  for (let q in template_variables) {
                    for (let m in dataset_variables) {
                      if (
                        template_variables[q].trim() ==
                        dataset_variables[m].trim()
                      ) {
                        let index = Number(m) + 2;
                        let key = dataset_variables[m].trim();
                        row[key] = full_data[r][w][index];
                      }
                    }
                  }
                  project_variables.push(row);
                }
              }

              let processedTemplate = this.makeTemplate(
                this.templateContent,
                project_variables
              );
              if (processedTemplate.length > 0) {
                proStatus = true;
                let p_project_ids=""
                let p_file_names=""
                let p_file_types=""

                let saveTemplates = this.configTemplate(
                  'single',
                  processedTemplate,
                  this.templateId,
                  e_project_id,
                  p_node_ids,
                  p_project_ids="",
                  p_file_names="",
                  p_file_types=""
                );
                this.storeTemplates(saveTemplates);
              }
            }
          }
        }
      }
      if (!proStatus) {
        this.alertDialog = true;
        this.alertType = "error_outline";
        this.alertContent = "Processing Failed!";
      }
      if (!dataExists) {
        this.alertDialog = true;
        this.alertType = "error_outline";
        this.alertContent = "Data is not exist!";
      }
    },
    
    getSelectIDs(){

      let full_data = this.getData(this.userPosts);
      let selected_id = new Array(); // selected id of dataset

      if (this.selection.length > 0)
        for (let r in this.selection) selected_id.push(this.selection[r]._id);
      else {
        for (let r in full_data) {
          selected_id.push(full_data[r][0][0]);
        }
      }
      return selected_id
    },

    extractID(text) {
      let temp_string = text;

      while (temp_string.indexOf("\n") > -1) {
        temp_string = temp_string.replace("\n", " ");
      }
      while (temp_string.indexOf("  ") > -1) {
        temp_string = temp_string.replace("  ", " ");
      }

      temp_string = temp_string.split(" ");

      let res = {};
      let variables = new Array();
      for (let i = 0; i < temp_string.length; i++) {
        if (temp_string[i] == "project_id:")
          res["project_id"] = temp_string[i + 1];
        if (temp_string[i] == "node_id:") {
          if (temp_string[i + 1].indexOf(",") > 1) {
            res["type"] = "multiple";
            let j = i + 1;
            let node_ids = new Array();

            while (temp_string[j].indexOf(",") > 1) {
              temp_string[j] = temp_string[j].replace(",", "");
              node_ids.push(temp_string[j]);
              j++;
            }
            node_ids.push(temp_string[j]);
            res["node_id"] = node_ids;
          } else if (temp_string[i + 1].indexOf("*") > -1) {
            res["type"] = "any";
          } else {
            res["node_id"] = temp_string[i + 1];
            res["type"] = "single";
          }
        }

        if (temp_string[i].indexOf("$var_") > -1) {
          let val = temp_string[i];
          if (val.indexOf(".")) val = val.replace(".", "");
          if (val.indexOf(",")) val = val.replace(",", "");
          if (val.indexOf(":")) val = val.replace(":", "");
          variables.push(val);
        }
      }
      res["variables"] = variables;
      res["content"] = text
      return res;
    },
    downloadTemplate(m_template) {
      let res_template = this.makeTemplate(m_template);

      let timestamp = this.getTimestamp()

      // download the templates
      const blob = new Blob([res_template], { type: "text/plain" }); //text/plain //application/pdf
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = m_template["node_id"] + "_" + timestamp + ".txt";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    makeTemplate(m_template, variables) {
      let processedTemplate = new Array();
      for (let r in variables) {
        let t_template = m_template;

        let keys = Object.keys(variables[r]);
        // console.log(keys)
        let exceptChar = [
          " ",
          ".",
          ",",
          "\n",
          ":",
          "/",
          ";",
          "~",
          "!",
          "@",
          "#",
          "$",
          "%",
          "^",
          "&",
          "*",
          "(",
          ")",
          "-",
          "_",
          "+",
          "=",
          "|",
          "{",
          "}",
          "/",
          ""
        ];
        for (let i = 0; i < exceptChar.length; i++) {
          for (let k in keys) {
            const regex = `${keys[k]}${exceptChar[i]}`;
            const repstr = `${variables[r][keys[k]]}${exceptChar[i]}`;
            t_template = t_template.replaceAll(regex, repstr);
          }
        }

        let t_str_p = t_template.match(/project_id:(.*)/);
        if (t_str_p != null) {
          let r_project_id = "project_id:" + t_str_p[1];
          t_template = t_template.replace(r_project_id, "");
        }

        let t_str_n = t_template.match(/node_id:(.*)/);
        if (t_str_n != null) {
          let r_node_id = "node_id:" + t_str_n[1];
          t_template = t_template.replace(r_node_id, "");
        }

        processedTemplate.push(t_template);
      }
      return processedTemplate;
    },
    selectDataset() {
      if(this.viewTemplateType == 'single'){
        if ( this.templateContent.indexOf("project_id") > -1 && this.templateContent.indexOf("node_id") > -1 ) {
          this.viewDatasetList()
        } else {
          this.alertDialog = true;
          this.alertContent = "Project ID or Node ID is not exist!";
        }
      }else if(this.viewTemplateType == 'tree'){
        this.viewDatasetList()
      }
      
    },
    viewDatasetList(){
      let rowObj = {};
      let pData = new Array();
      let full_data = this.getData(this.userPosts);

      for (let r in full_data) {
        let _id = full_data[r][0][0];
        let ds_nm = full_data[r][0][1];
        let pj_id = full_data[r][0][2];
        rowObj = {
          _id: _id,
          dataset_name: ds_nm,
          project_id: pj_id,
          selected: false
        };
        pData.push(rowObj);
      }

      this.allDataset = pData;
      this.processDialog = true;
    },

    getData(data) {
      let res = new Array();

      for (let r in data) {
        let tempArr = data[r].categories;
        let variableArr = data[r].variables;
        let allArr = new Array();
        for (let i = 0; i < tempArr.length; i += variableArr.length) {
          let rows = new Array();
          rows.push(data[r]._id);
          rows.push(data[r].title);
          for (let j = 0; j < variableArr.length; j++) {
            rows.push(tempArr[i + j]);
          }
          allArr.push(rows);
        }
        res.push(allArr);
      }

      return res;
    },

    //////////////////////// ----- end process ----- //////////////////


    //////////////////////// ----- Start Tree Template process ----- //////////////////
    treeTemplateProcess(){
      let treeTemplates = new Array()
      let tp_data = this.updateTreeTemplates
      for(let item of tp_data){
        treeTemplates.push(item.content)
      }

      let datasets = this.getData(this.userPosts)
      let selectedIDs = this.getSelectIDs()
      let selectedDatasets = this.getSelectedDatasets(datasets, selectedIDs)
      let selectedVariables = this.getSelectedVariables(this.userPosts, selectedIDs)
      this.treeProcessingData(treeTemplates, selectedDatasets, selectedVariables)
    },

    treeProcessingData(treeTemplates, datasets, variables){
      let templateData = new Array()
      for(let template of treeTemplates) templateData.push(this.extractID(template))

      let processedTemplate = new Array()
      let p_node_ids = new Array();
      let p_project_ids = new Array();
      let p_file_names = new Array();
      let p_file_types = new Array();

      let tp_data = this.updateTreeTemplates
      for(let item of tp_data){
        p_file_names.push(item.template_name)
        p_file_types.push(item.file_type)
      }

      for (let template of templateData){
        let e_project_id = template.project_id;
        console.log("AAAAAAAAAA", template.node_id)
        if(e_project_id == undefined || template.node_id == undefined){
          processedTemplate.push(template.content)
          continue
        }

        let project_variables = new Array();
        p_node_ids.push(template.node_id.trim());
        p_project_ids.push(template.project_id.trim());

        for (let r in datasets) {
          let f_project_id = Array();

          for (let m in datasets[r])
            f_project_id.push(datasets[r][m][2]);



          for (let w in datasets[r]) {
            // in case of template node id is matched with dataset node id,
            if (
              datasets[r][w][3] == template.node_id.trim() &&
              datasets[r][w][2] == e_project_id.trim()
            ) {
              let dataset_variables = variables[r];
              let template_variables = template.variables;
              let row = {};

              // checking if template variables exist in dataset, and take the variables.
              for (let q in template_variables) {
                for (let m in dataset_variables) {
                  if (
                    template_variables[q].trim() ==
                    dataset_variables[m].trim()
                  ) {
                    let index = Number(m) + 2;
                    let key = dataset_variables[m].trim();
                    row[key] = datasets[r][w][index];
                  }
                }
              }
              project_variables.push(row);
            }
          }
        }
        let maketemplate = this.makeTemplate(
            template.content,
            project_variables
          );
        maketemplate[0] = maketemplate[0] == undefined ? template.content : maketemplate[0]
        processedTemplate.push(maketemplate[0])
      }

      if (processedTemplate.length > 0) {
        let templateType = 'tree'
        let saveTemplates = this.configTemplate(
          templateType,
          processedTemplate,
          this.templateId,
          this.template_title,
          p_node_ids,
          p_project_ids,
          p_file_names,
          p_file_types
        );
        
        this.storeTemplates(saveTemplates);
      }
    },

    getSelectedDatasets(datasets, selectedIDs){
      let sel_datasets = new Array()
      for(let id of selectedIDs){
        for(let dataset of datasets){
          if(dataset[0][0] == id){
            sel_datasets.push(dataset)
            break;
          }
        }
      }
      return sel_datasets
    },

    getSelectedVariables(datasets, selectedIDs){
      let sel_variables = new Array()
      for(let id of selectedIDs){
        for(let dataset of datasets){
          if(dataset._id == id){
            sel_variables.push(dataset.variables)
            break;
          }
        }
      }
      return sel_variables
    },

    //////////////////////// ----- end process ----- //////////////////

    submitForm() {
      if(this.templateType == "tree") this.text = "tree"
      let treeTemplate = new Array()
      let filetypes = new Array()
      let filenames = new Array()

      console.log(this.treeTemplates)
      for(let template of this.treeTemplates){
        treeTemplate.push(template.content)
        filetypes.push(template.filetype)
        filenames.push(template.filename)
      }

      if (this.$refs.form.validate()) {
        EventBus.$emit("submitTemplateForm", {
          parentName: this.parentName,
          template: {
            templateId: this.templateId,
            userId: this.userId,
            title: this.title,
            templateType: this.templateType,
            content: this.text,
            treeTemplate: treeTemplate,
            filenames: filenames,
            filetypes: filetypes
          }
        });
      }
    },

    submitUpdateForm() {
      console.log(this.viewTemplateType)
      
      let templates = new Array()
      let filenames = new Array()
      let filetypes = new Array()
      if(this.viewTemplateType=='single'){
        this.updateTreeTemplates = "single"
      }else{
        this.templateContent = "tree"
        for(let item of this.updateTreeTemplates){
          templates.push(item.content)
          filenames.push(item.template_name)
          filetypes.push(item.file_type)
        }
      }

      if (this.$refs.updateform.validate()) {
        EventBus.$emit("submitUpdateTemplateForm", {
          parentName: this.parentName,
          template: {
            templateId: this.templateId,
            userId: this.userId,
            title: this.templateTitle,
            templateType: this.viewTemplateType,
            content: this.templateContent,
            treeTemplate: templates,
            filenames: filenames,
            filetypes: filetypes
          }
        });
      }
    },

    async getFile(ref_file, filename, filetype) {
      let file = ref_file;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      const result = await this.getText(reader)

      let rowObj = {}
      rowObj.filename = filename
      rowObj.filetype = filetype=="" ? ".cfg" : filetype
      rowObj.content = result
      this.treeTemplates.push(rowObj)

      if(this.treeTemplates.length>0) this.isTreeImport = true
      reader.onerror = evt => {
        console.error(evt);
      };
      return result
    },

    async selectedFile() {
      let file = this.$refs.myFile.files[0];
      console.log(file)
      if (!file || file.type !== "text/plain") return;

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      const result = await this.getText(reader)
      this.text = result
      reader.onerror = evt => {
        console.error(evt);
      };
      this.isTemplate = true;
    },

    // async selectedFiles() {
    //   let files = this.$refs.myFiles.files;
    //   let file_names = new Array()
    //   for(let file of files){
    //     if (!file || file.type !== "text/plain") return;
    //     file_names.push(file.name)
    //     let reader = new FileReader();
        
    //     reader.readAsText(file, "UTF-8");
        
    //     const result = await this.getText(reader)

    //     this.treeText.push(result)
    //     reader.onerror = evt => {
    //       console.error(evt);
    //     };
    //   }
      
    //   for(let key in this.treeText){
    //     let rowObj = {}
    //     rowObj._id = key;
    //     rowObj.file_name = file_names[key]
    //     rowObj.content = this.treeText[key]
    //     rowObj.template_name = this.title==""?`Template_${key}`:`${this.title}_${key}`
    //     this.treeTemplates.push(rowObj)
    //   }

    //   console.log("M:", this.treeTemplates)
    //   console.log("U:", this.treeText)
    //   console.log("HELLO", this.isTree)
    //   this.isTemplate = true;
    // },

    getText(reader){
      return new Promise(resolve => {
          reader.onload = evt => {
            const res = evt.target.result
            resolve(res);
          };
      });
    },
    getUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    getUserTemplates() {
      this.$store.dispatch("getUserTemplates", {
        userId: this.user._id
      });
    },
    getUserSavedTemplates() {
      this.$store.dispatch("getUserSavedTemplates", {
        userId: this.user._id
      });
    },
    deleteTemplates(){
      let templateIDs = new Array()
      if(this.selected.length > 0){
        for(let i in this.selected){
          templateIDs.push(this.selected[i]._id)
        }
      }

      // let rTemplates = this.treeTemplates

      for(let i = 0; i < this.treeTemplates.length; i++){
        console.log("U:", this.treeTemplates[i]._id)
        for(let id of templateIDs){
          console.log(this.treeTemplates[i]._id, "==", id)
          if(this.treeTemplates[i]._id == id){

            this.treeTemplates.splice(i, 1)
            // i--
          }
        }
        
      }
      console.log(this.treeTemplates)
    },

    uDeleteTemplates(){
      let templateIDs = new Array()
      if(this.uSelected.length > 0){
        for(let i in this.uSelected){
          templateIDs.push(this.uSelected[i]._id)
        }
      }

      console.log(templateIDs)

      for(let i = 0; i < this.updateTreeTemplates.length; i++){
        console.log("U:", this.updateTreeTemplates[i]._id)
        for(let id of templateIDs){
          console.log(this.updateTreeTemplates[i]._id, "==", id)
          if(this.updateTreeTemplates[i]._id == id){

            this.updateTreeTemplates.splice(i, 1)
            // i--
          }
        }
        
      }
      console.log(this.updateTreeTemplates)
    },
    deleteTemplate(templateId) {
      this.isDelete = true;
      this.templateId = templateId;
      this.alertDialog = true;
      this.alertType = "verified_user";
      this.alertContent = "Are you sure you want to delete this template?";
    },
    confirmDelete() {
      this.$store.dispatch("deleteUserTemplate", {
        templateId: this.templateId
      });
      setTimeout(() => {
        location.reload();
      }, 500);
    },
    closeTemplate() {
      this.editTemplateDialog = false;
    },
    closeSubTemplate() {
      this.viewSubTemplateDialog = false;
    },
    template_view(id, viewTemplateType, templateStatus, editTemplateDialog = true) {
      this.viewStatus = templateStatus
      this.viewTemplateType = viewTemplateType
      this.updateTreeTemplates = []
      this.templateId = id;
      console.log("H:", this.templateId)
      let templates = this.userTemplates;
      for (let row in templates) {
        if (id == templates[row]._id) {
          this.template_title = templates[row].title
          if(viewTemplateType=='tree'){
            for(let i in templates[row].treeTemplate){
              let rowObj = {}
              rowObj._id = i
              rowObj.template_name = `${templates[row].filenames[i]}`
              rowObj.file_type = templates[row].filetypes[i]
              rowObj.content = templates[row].treeTemplate[i]
              this.updateTreeTemplates.push(rowObj);
            }
          }else{
            this.templateContent = templates[row].content
          }
          
          this.templateTitle = templates[row].title;
          break;
        }
      }
      this.editTemplateDialog = editTemplateDialog;
    },

    //tree template view in table when is imported
    viewTemplate(id, templateStatus, editTemplateDialog = true) {
      this.templateId = id;
      console.log('U:', this.templateId)
      this.viewStatus = templateStatus
      let templates = this.treeTemplates;

      for (let row in templates) {
        if (id == templates[row]._id) {
          this.templateContent = templates[row].content;
          this.templateTitle = templates[row].template_name;
          break;
        }
      }
      this.isTreeImport = true
      this.editTemplateDialog = editTemplateDialog;
    },

    //tree template view in table when updated
    updateViewTemplate(id, viewSubTemplateDialog = true){
      
      let templates = this.updateTreeTemplates;
      for (let row in templates) {
        if (id == templates[row]._id) {
          this.templateSubContent = templates[row].content;
          this.templateSubTitle = templates[row].template_name;
          break;
        }
      }
      this.viewSubTemplateDialog = viewSubTemplateDialog;
    },

    closeProcess() {
      this.processDialog = false;
    },
    closeAlert() {
      this.alertDialog = false;
    },
    clear() {
      this.allDataset.forEach(item => {
        item.selected = false;
      });
    },
    importAgain() {
      this.isTemplate = false;
      this.text = "";
      this.treeText = []
      this.treeTemplates = []
    },
    treeImportAgain() {
      location.reload()
    },
    storeTemplates(template) {
      this.$store.dispatch("saveTemplates", template);
      this.$router.push("/dataset");
      setTimeout(() => {
        location.reload();
      }, 500);
    },
    getTimestamp(){
      let d = new Date();
      let timestamp =
        d.getFullYear() +
        "" +
        (d.getMonth() + 1) +
        "" +
        d.getDate() +
        "" +
        d.getHours() +
        "" +
        d.getMinutes() +
        "" +
        d.getSeconds() +
        "" +
        d.getMilliseconds();
      return timestamp
    },
    configTemplate(templateType, templates, originalTemp, project_id, node_ids, project_ids, file_names, file_types) {
      // for getting timestamp
      let timestamp = this.getTimestamp()
      let title = ""

      title = templateType == 'single' ? `${project_id}_${timestamp}` : `${project_id}`

      let template = {
        userId: this.userId,
        title: title,
        templateType: templateType,
        templates: templates,
        originalTemp: originalTemp,
        newTemplates: templates,
        isUpdated: "0",
        node_ids: node_ids,
        project_ids: project_ids,
        file_names: file_names,
        file_types: file_types
      };
      return template;
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

.dialog-width {
  min-width: 300px !important;
}

.text-area {
  width: 100%;
  min-width: 300px;
  min-height: 300px;
  border: 1px solid;
}
.margin-top {
  margin-top: 30px;
}
.layou.row.wrap > div {
  width: 100%;
}
.panel {
  border: 2px solid #dfdfdf;
  box-shadow: rgba(0, 0, 0, 0.15) 0 1px 0 0;
}
.panel.panel-sm {
  width: 100%;
  /* max-width: 700px; */
  /* margin: 10px auto; */
}
.panel-heading {
  border-bottom: 2px solid #dfdfdf;
}
.panel-heading h1,
.panel-heading h2,
.panel-heading h3,
.panel-heading h4,
.panel-heading h5,
.panel-heading h6 {
  margin: 0;
  padding: 0;
}
.panel-body .checkbox-inline {
  padding: 15px 20px;
}

.left-padding {
  padding: 20px;
}

@media only screen and (min-width: 500px) {
  .text-area {
    width: 100%;
    min-width: 500px;
    min-height: 300px;
    border: 1px solid;
  }
}
</style>
