<template>
  <div>
    <v-form v-model="isFormValid" ref="form" @submit.prevent>
      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            :rules="titleRules"
            v-model="title"
            label="Dataset Name"
            type="text"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 class="left-padding">
          <div class="import-icon" v-if="!isCSV">
            <input
              type="file"
              id="csv_file"
              name="csv_file"
              class="form-control file-input-type"
              @change="loadCSV($event)"
            />
            <img
              src="../../../assets/import-csv-to-database.jpg"
              class="cover-image"
            />
          </div>

          <v-btn
            :loading="loading"
            :disabled="!isCSV || loading"
            color="info"
            type="submit"
            @click="submitForm"
          >
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
            Submit
          </v-btn>

          <v-btn v-if="isCSV" color="info" type="button" @click="addAddRow">
            <v-icon light>add</v-icon>
            Add row
          </v-btn>
          <v-btn v-if="isCSV" color="info" type="button" @click="deleteRows">
            <v-icon light>delete</v-icon>
            Delete row
          </v-btn>
          <v-btn
            :loading="loading"
            v-if="isCSV"
            color="info"
            type="button"
            @click="importAgain"
          >
            <v-icon light>slow_motion_video</v-icon>
            Import again
          </v-btn>
        </v-flex>
      </v-layout>

      <div class="container" style="overflow-x: auto">
        <div class="panel panel-sm">
          <div class="panel-body">
            <table v-if="isCSV" class="csv-table">
              <thead>
                <tr>
                  <th></th>
                  <th
                    v-for="(key, h_index) in parse_header"
                    @click="sortBy(key)"
                    :key="h_index"
                    :class="{ active: sortKey == key }"
                  >
                    {{ key | capitalize }}
                    <span
                      class="arrow"
                      :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"
                    >
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody id="table_content" ref="ref_table">
                <tr v-for="(csv, index) in parse_csv" :key="index" :id="index">
                  <td style="text-align: center" class="csv-td">
                    <input
                      type="checkbox"
                      :data-value="index"
                      style="width: 20px; height: 20px"
                    />
                  </td>
                  <td
                    v-for="(key, c_index) in parse_header"
                    :key="c_index"
                    class="csv-td"
                  >
                    <div class="input-cell" contenteditable="true">
                      {{ csv[key] }}
                    </div>
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
        <h2 class="font-weight-light">
          Your datasets
          <span class="font-weight-regular">({{ userPosts.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap style="justify-content: left">
        <v-flex
          xs12
          v-for="post in userPosts"
          :key="post._id"
          class="grid-view-cus"
        >
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn
              @click="deletePost(post._id)"
              color="error"
              floating
              fab
              small
              dark
            >
              <v-icon>delete</v-icon>
            </v-btn>
            <div class="v-dataset-background" @click="open(post._id)"></div>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- View Dataset Dialog -->
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="editPostDialog"
      style="width: 100px"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2"
          >DataSet({{ update_title }})</v-card-title
        >
        <v-container style="overflow-x: auto">
          <v-layout row>
            <v-flex xs12 style="text-align: right">
              <v-btn color="info" type="submit" @click="updateAddRow">
                <v-icon light>add</v-icon>
                Add row
              </v-btn>
              <v-btn color="info" type="submit" @click="updateDeleteRows">
                <v-icon light>delete</v-icon>
                Delete row
              </v-btn>
            </v-flex>
          </v-layout>

          <v-layout row style="margin-top: 20px">
            <v-flex xs12>
              <v-form v-model="isFormValid" ref="updateform" @submit.prevent>
                <v-layout row>
                  <v-flex xs12>
                    <table class="csv-table">
                      <thead ref="ref_update_header">
                        <tr>
                          <th></th>
                          <th
                            class="text-left"
                            v-for="(item, index) in csvHeader"
                            :key="index"
                          >
                            {{ item }}
                          </th>
                        </tr>
                      </thead>
                      <tbody ref="ref_update_table">
                        <tr
                          v-for="(row, index) in csvTable"
                          :key="index"
                          :id="index"
                        >
                          <td style="text-align: center">
                            <input
                              type="checkbox"
                              :data-value="index"
                              style="width: 20px; height: 20px"
                            />
                          </td>
                          <td v-for="(item, index) in row" :key="index">
                            <div
                              class="update-input-cell"
                              contenteditable="true"
                            >
                              {{ item }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn color="info" type="button" @click="closeDataset">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                      Close
                    </v-btn>
                    <v-btn color="info" type="submit" @click="submitUpdateForm">
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                      Update
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
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
      style="width: 100px"
    >
      <v-card>
        <v-toolbar color="primary" dark>Template Process</v-toolbar>
        <v-card-text>
          <v-icon
            light
            style="width: 100%; font-size: 100px; color: rgb(237, 86, 27)"
            v-if="!isConfirmUpdate"
            >verified_user</v-icon
          >

          <div style="padding: 10px 20px 10px 20px">
            <div class="font-weight subheading">{{ alertContent }}</div>
            <div class="font-weight subheading" v-if="isConfirmUpdate">
              {{ alertContent1 }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn v-if="isDelete" text @click="confirmAlert">Ok</v-btn>

          <v-btn v-if="isConfirmUpdate" text @click="reportUpdate">Ok</v-btn>

          <v-btn text @click="closeAlert">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- report -->
    <v-dialog
      xs12
      sm6
      offset-sm3
      persistent
      v-model="reportDialog"
      style="width: 100px"
    >
      <v-card>
        <v-toolbar color="primary" dark>Template Process</v-toolbar>
        <v-card-text>
          <!-- Title Input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                :rules="titleRules"
                v-model="report_name"
                label="Report Name"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="report_description"
                label="Report Description"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- <v-layout row>
            <v-flex xs12>
              <v-textarea
                :rules="titleRules"
                name="input-7-1"
                label="Report Description"
                v-model="report_description"
              ></v-textarea>
            </v-flex>
          </v-layout> -->

          <!-- <v-card
            v-for="(item, index) in changed_status"
            :key="index"
            style="margin-bottom: 10px"
          >
            <v-layout>
              <v-flex xs4>
                <v-img class="v-template-background-changed" contain></v-img>
              </v-flex>
              <v-flex xs8>
                <v-card-title primary-title>
                  <div>
                    <div class="title">{{ item.title }}</div>
                    <div>
                      Project ID: &nbsp;<b>{{ item.project_id }}</b>
                    </div>
                    <div>
                      Node ID: &nbsp;<b>{{ item.node_id }}</b>
                    </div>
                    <div>
                      Variable: &nbsp;<b>{{ item.variable }}</b>
                    </div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              Previous: &nbsp;<b> {{ item.previous }}</b>
              <v-spacer></v-spacer>
              Modified: &nbsp;<b> {{ item.modified }}</b>
            </v-card-actions>
          </v-card> -->
          <v-layout row style="overflow-x: auto;">
            <v-flex xs12 class="csv-table report-table">
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-left">ProcessedName</th>
                  <th class="text-left">ProjectID</th>
                  <th class="text-left">NodeID</th>
                  <th class="text-left">Variable</th>
                  <th class="text-left">Previous</th>
                  <th class="text-left">Modified</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in changed_status" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.project_id }}</td>
                  <td>{{ item.node_id }}</td>
                  <td>{{ item.variable }}</td>
                  <td>{{ item.previous }}</td>
                  <td>{{ item.modified }}</td>
                </tr>
              </tbody>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn v-if="isDelete" text @click="confirmAlert">Ok</v-btn>

          <v-btn v-if="isConfirmUpdate" text @click="confirmUpdate">Ok</v-btn>

          <v-btn text @click="closeAlertReport">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "../../event";

import { TemplateProcess } from "./TemplateProcess.js";
import { TreeTemplateProcess } from "./TreeTemplateProcess.js";

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
          description: ""
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
      headline: "Import DataSet",
      isCSV: false,
      editPostDialog: false,
      alertDialog: false,
      reportDialog: false,
      alertContent: "",
      alertContent1: "",
      isDelete: false,
      isConfirmUpdate: false,
      changed_status: [],

      report_name: "",
      report_description: "",
      checked: [],
      channel_name: "",
      channel_fields: [],
      channel_entries: [],
      parse_header: [],
      parse_csv: [],
      sortOrders: {},
      sortKey: "",

      csvTable: [],
      csvHeader: [],

      //update post

      update_title: "",
      update_variables: [],

      // adding post
      isFormValid: true,
      postId: null,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 30 || "Title must have less than 30 characters"
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
    ...mapState([
      "user",
      "error",
      "loading",
      "postCategories",
      "userPosts",
      "userTemplates",
      "userSavedTemplates"
    ])
  },
  created() {
    this.getUserPosts();
    this.getUserTemplates();
    this.getUserSavedTemplates();
  },
  methods: {
    submitForm() {
      if (this.$refs.form.validate()) {
        EventBus.$emit("submitPostForm", {
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
      let newTable = this.getTable(
        this.getDataset().values,
        this.getDataset().variables
      );
      let oldTable = this.csvTable;
      let variables = this.getDataset().variables;

      let ids = new Array();

      // check the table is changed
      for (let i = 0; i < oldTable.length; i++) {
        for (let j = 2; j < oldTable[i].length; j++) {
          let id_row = {};
          if (oldTable[i][j].trim() != newTable[i][j].trim()) {
            id_row.project_id = oldTable[i][0];
            id_row.node_id = oldTable[i][1];
            id_row.previous = oldTable[i][j];
            id_row.modified = newTable[i][j];
            id_row.variable = variables[j];
            ids.push(id_row);
          }
        }
      }

      console.log("A:", ids)

      // if changed, fetching the processed data
      if (ids.length > 0) {
        let pcd_template = this.userSavedTemplates;
        let pcd_data = new Array();
        for (let i = 0; i < pcd_template.length; i++) {
          let pj_id = pcd_template[i].title.trim().split("_")[0];
          let node_ids = pcd_template[i].node_ids;
          let temp_id = pcd_template[i]._id;
          let temp_title = pcd_template[i].title;
          let original_template = pcd_template[i].originalTemp;

          let c_temp = this.getTemplateByID(pcd_template[i].originalTemp);

          let tp_type = c_temp.templateType;
          
          let file_names = new Array()
          if(tp_type == 'single'){
            for(let node_id of pcd_template[i].node_ids) file_names.push(`${node_id}_timestamp.cfg`);
          }else if(tp_type == 'tree'){
            for(let i in c_temp.treeTemplate){
              let m_temp = this.extractID(c_temp.treeTemplate[i]);
              if(m_temp.variables.length > 0 && m_temp.type == 'single' && m_temp.project_id != undefined && m_temp.node_id != undefined){
                console.log(c_temp.filenames[i])
                file_names.push(`${c_temp.filenames[i]}${c_temp.filetypes[i]}`)
              }
            }
          }

          console.log('M:', file_names);

          for (let j = 0; j < node_ids.length; j++) {
            let id_row = {};
            if(pcd_template[i].templateType == 'tree') pj_id = pcd_template[i].project_ids[j]
            id_row.project_id = pj_id;
            id_row.node_id = node_ids[j];
            id_row.filename = file_names[j];
            id_row.template_id = temp_id;
            id_row.title = temp_title;
            id_row.original_template = original_template;
            id_row.template_type = pcd_template[i].templateType
            pcd_data.push(id_row);
          }
        }

        console.log("B:", pcd_data)

        // check changed dataset and processed template data is related.
        let isChanged = false;
        let changed_status = new Array();
        for (let i = 0; i < ids.length; i++) {
          for (let j = 0; j < pcd_data.length; j++) {
            let changed_row = {};
            if (
              ids[i].project_id == pcd_data[j].project_id &&
              ids[i].node_id == pcd_data[j].node_id
            ) { // if it's related

              isChanged = true;
              changed_row.template_id = pcd_data[j].template_id;
              changed_row.title = pcd_data[j].title;
              changed_row.filename = pcd_data[j].filename;
              changed_row.project_id = pcd_data[j].project_id;
              changed_row.node_id = pcd_data[j].node_id;
              changed_row.template_id = pcd_data[j].template_id;
              changed_row.previous = ids[i].previous;
              changed_row.modified = ids[i].modified;
              changed_row.variable = ids[i].variable;
              changed_row.original_temp_id = pcd_data[j].original_template;
              changed_row.template_type = pcd_data[j].template_type;
              changed_status.push(changed_row);
            }
          }
        }

        console.log("C:", changed_status)

        if (isChanged) {
          this.alertDialog = true;
          this.isConfirmUpdate = true;
          this.isDelete = false;
          this.changed_status = changed_status;
          this.alertContent =
            "  This dataset was already used for processing templates.";
          this.alertContent1 =
            "Would you like to continue making changes anyway?";
        } else {
          if (this.$refs.updateform.validate()) {
            EventBus.$emit("submitUpdatePostForm", {
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
        }
      } else {
        if (this.$refs.updateform.validate()) {
          EventBus.$emit("submitUpdatePostForm", {
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
      }
    },

    // starting update
    confirmUpdate() {
      let changed_status = this.changed_status;

      let template_name = new Array();
      let project_id = new Array();
      let node_id = new Array();
      let variable = new Array();
      let previous = new Array();
      let modified = new Array();
      let filenames = new Array();

      if (changed_status.length > 0) {
        for (let i = 0; i < changed_status.length; i++) {
          template_name.push(changed_status[i].title);
          filenames.push(changed_status[i].filename)
          project_id.push(changed_status[i].project_id);
          node_id.push(changed_status[i].node_id);
          variable.push(changed_status[i].variable);
          previous.push(changed_status[i].previous);
          modified.push(changed_status[i].modified);
        }
      }

      if (this.report_description != "" && this.report_name != "") {
        console.log("passed");
        let report = {
          userId: this.userId,
          report_name: this.report_name,
          report_desc: this.report_description,
          template_name: template_name,
          file_name: filenames,
          project_id: project_id,
          node_id: node_id,
          variable: variable,
          previous: previous,
          modified: modified
        };
        this.addReport(report);

        // re-processing the templates regarding changed dataset
        let processedTemplateIDs = new Array();
        let originalTemplateIDs = new Array();

        // get changed and processed template for reverse checking process
        if (changed_status.length > 0) {

          let proc_init = {};
          let org_init = {};

          proc_init.id = changed_status[0].template_id
          proc_init.template_type = changed_status[0].template_type
          proc_init.template_title = changed_status[0].title

          org_init.id = changed_status[0].original_temp_id
          org_init.template_type = changed_status[0].template_type
          org_init.template_title = changed_status[0].title

          processedTemplateIDs.push(proc_init);
          originalTemplateIDs.push(org_init);

          for (let i = 1; i < changed_status.length; i++) {
            if (changed_status[i - 1].template_id == changed_status[i].template_id) continue;
            let proc_row = {}; 
            let org_row = {}

            proc_row.id = changed_status[i].template_id
            proc_row.template_type = changed_status[i].template_type
            proc_row.template_title = changed_status[0].title

            org_row.id = changed_status[i].original_temp_id
            org_row.template_type = changed_status[i].template_type
            org_row.template_title = changed_status[0].title

            processedTemplateIDs.push(proc_row);
            originalTemplateIDs.push(org_row);
          }
        }

        for (let i = 0; i < processedTemplateIDs.length; i++) {
          let userID = this.userId;
          let templateID = processedTemplateIDs[i].id;
          let newDataset = this.getDataset();
          let newTemplate = this.getTemplateByID(originalTemplateIDs[i].id).content;
          if(processedTemplateIDs[i].template_type == 'tree') newTemplate = this.getTreeTemplateByID(originalTemplateIDs[i].id).treeTemplate;
          let oldTemplate = this.getProcessedTempateByID(processedTemplateIDs[i].id);
          let originalTemp = originalTemplateIDs[i].id;
          let templateTitle = originalTemplateIDs[i].template_title;
          let fileNames = this.getProcessedTempateFileNamesByID(processedTemplateIDs[i].id);
          let fileTypes = this.getProcessedTempateFileTypesByID(processedTemplateIDs[i].id);

          let updateTemplate = ""
          if(processedTemplateIDs[i].template_type == 'single'){
            updateTemplate = TemplateProcess.processData(
              userID,
              templateID,
              newDataset,
              newTemplate,
              oldTemplate,
              originalTemp
            );
          }else{
            updateTemplate = TreeTemplateProcess.processData(
              userID,
              templateID,
              templateTitle,
              newDataset,
              newTemplate,
              oldTemplate,
              originalTemp,
              fileNames,
              fileTypes
            );
          }
          
          console.log("ETC:", updateTemplate)
          this.updateProcTemplate(updateTemplate);

          if (this.$refs.updateform.validate()) {
            EventBus.$emit("submitUpdatePostForm", {
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
        }
      } else {
        alert("input failed");
      }
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

    updateProcTemplate(template) {
      this.$store.dispatch(
        "updateProcTemplate",
        JSON.parse(JSON.stringify(template))
      );
      this.$router.push("/dataset");
      setTimeout(() => {
        location.reload();
      }, 500);
    },

    getTemplateByID(id) {
      let template = "";
      for (let r in this.userTemplates) {
        if (id == this.userTemplates[r]._id) {
          template = this.userTemplates[r];
        }
      }
      return template;
    },
    getTreeTemplateByID(id) {
      let template = "";
      for (let r in this.userTemplates) {
        if (id == this.userTemplates[r]._id) {
          template = this.userTemplates[r];
        }
      }
      return template;
    },
    getProcessedTempateByID(id) {
      let template = "";
      for (let r in this.userSavedTemplates) {
        if (id == this.userSavedTemplates[r]._id) {
          template = this.userSavedTemplates[r].templates;
        }
      }
      return template;
    },
    getProcessedTempateFileNamesByID(id) {
      let template = "";
      for (let r in this.userSavedTemplates) {
        if (id == this.userSavedTemplates[r]._id) {
          template = this.userSavedTemplates[r].file_names;
        }
      }
      return template;
    },
    getProcessedTempateFileTypesByID(id) {
      let template = "";
      for (let r in this.userSavedTemplates) {
        if (id == this.userSavedTemplates[r]._id) {
          template = this.userSavedTemplates[r].file_types;
        }
      }
      return template;
    },
    deleteRows() {
      let tbl_data = this.$refs.ref_table;
      const checkboxes = tbl_data.querySelectorAll(
        `input[type="checkbox"]:checked`
      );

      let checkedArr = new Array();
      for (let i = 0; i < checkboxes.length; i++) {
        checkedArr.push(checkboxes[i].getAttribute("data-value"));
      }

      for (let i = 0; i < checkedArr.length; i++) {
        let el = document.getElementById(checkedArr[i]);
        el.remove(); // Removes the div with the 'div-02' id
      }
    },
    updateDeleteRows() {
      let tbl_data = this.$refs.ref_update_table;
      const checkboxes = tbl_data.querySelectorAll(
        `input[type="checkbox"]:checked`
      );

      let checkedArr = new Array();
      for (let i = 0; i < checkboxes.length; i++) {
        checkedArr.push(checkboxes[i].getAttribute("data-value"));
      }

      for (let i = 0; i < checkedArr.length; i++) {
        let el = document.getElementById(checkedArr[i]);
        el.remove(); // Removes the div with the 'div-02' id
      }
    },
    addAddRow() {
      let tbl_data = this.$refs.ref_table;
      let value = tbl_data.querySelectorAll(".input-cell");
      let val_len = this.parse_header.length;
      let data_val = value.length / val_len;
      let project_id = value[0].innerHTML;

      let c_tr, c_td, c_div, c_input, c_text;
      c_tr = document.createElement("tr");
      c_tr.setAttribute("id", data_val);
      c_input = document.createElement("input");
      c_input.setAttribute("type", "checkbox");
      c_text = document.createTextNode(project_id.trim());

      for (let i = 0; i < val_len + 1; i++) {
        c_td = document.createElement("td");
        c_div = document.createElement("div");
        if (i == 0) {
          c_td.style.textAlign = "center";
          c_input.style.width = "20px";
          c_input.style.height = "20px";
          c_input.setAttribute("data-value", data_val);
          c_div.appendChild(c_input);
        } else {
          c_div.setAttribute("class", "input-cell");
          c_div.setAttribute("contenteditable", "true");
        }
        if (i == 1) c_div.appendChild(c_text);
        c_td.appendChild(c_div);
        c_tr.appendChild(c_td);
      }

      tbl_data.appendChild(c_tr);
    },

    updateAddRow() {
      let tbl_data = this.$refs.ref_update_table;
      let value = tbl_data.querySelectorAll(".update-input-cell");
      let val_len = this.update_variables.length;
      let data_val = value.length / val_len;
      let project_id = value[0].innerHTML;

      let c_tr, c_td, c_div, c_input, c_text;
      c_tr = document.createElement("tr");
      c_tr.setAttribute("id", data_val);
      c_input = document.createElement("input");
      c_input.setAttribute("type", "checkbox");
      c_text = document.createTextNode(project_id.trim());

      for (let i = 0; i < val_len + 1; i++) {
        c_td = document.createElement("td");
        c_div = document.createElement("div");
        if (i == 0) {
          c_td.style.textAlign = "center";
          c_input.style.width = "20px";
          c_input.style.height = "20px";
          c_input.setAttribute("data-value", data_val);
          c_div.appendChild(c_input);
        } else {
          c_div.setAttribute("class", "update-input-cell");
          c_div.setAttribute("contenteditable", "true");
        }
        if (i == 1) c_div.appendChild(c_text);
        c_td.appendChild(c_div);
        c_tr.appendChild(c_td);
      }

      tbl_data.appendChild(c_tr);
    },
    /////////// import csv
    saveDataSet() {
      let element = this.$refs.ref_table;
      let data = element.querySelectorAll(".input-cell");

      let res = {};
      let linerArr = new Array();

      res["variables"] = this.parse_header;
      for (let i = 0; i < data.length; i++) {
        let tp_cell = data[i].innerHTML.trim();
        tp_cell = tp_cell.replaceAll("<div>", "\n ");
        tp_cell = tp_cell.replaceAll("</div>", " ");
        tp_cell = tp_cell.trim();
        linerArr.push(tp_cell);
      }
      res["values"] = linerArr;
      return res;
    },
    getDataset() {
      let datasets = this.userPosts;

      let element = this.$refs.ref_update_table;
      let header = this.$refs.ref_update_header;
      let data = element.querySelectorAll(".update-input-cell");
      let variables = header.querySelectorAll(".text-left");

      let res = {};
      let linerArr = new Array();
      let variablesArr = new Array();

      for (let i = 0; i < variables.length; i++)
        variablesArr.push(variables[i].innerHTML.trim());

      res["variables"] = variablesArr;
      for (let i = 0; i < data.length; i++) {
        let tp_cell = data[i].innerHTML.trim(); //&nbsp;
        tp_cell = tp_cell.replaceAll("<div>", "\n ");
        tp_cell = tp_cell.replaceAll("&nbsp;", "\n ");
        tp_cell = tp_cell.replaceAll("</div>", " ");
        tp_cell = tp_cell.trim();
        linerArr.push(tp_cell);
      }
      res["values"] = linerArr;
      res["title"] = this.update_title;
      return res;
    },
    addReport(report) {
      this.$store.dispatch("addReport", report);
      // this.$router.push("/");
    },
    sortBy: function(key) {
      var vm = this;
      vm.sortKey = key;
      vm.sortOrders[key] = vm.sortOrders[key] * -1;
    },
    csvJSON(csv) {
      var vm = this;
      var lines = csv.split("\n");
      if (lines.length > 0) this.isCSV = true;
      var result = [];
      var headers = lines[0].split(",");
      vm.parse_header = lines[0].split(",");
      lines[0].split(",").forEach(function(key) {
        vm.sortOrders[key] = 1;
      });

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return; // Jump header line

        var obj = {};
        var currentline = line.split(",");

        headers.map(function(header, indexHeader) {
          obj[header] = currentline[indexHeader];
        });

        result.push(obj);
      });

      result.pop(); // remove the last item because undefined values

      return result; // JavaScript object
      console.log('Result:', result);
    },
    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
        };
        reader.onerror = function(evt) {
          if (evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert("FileReader are not supported in this browser.");
      }
    },
    importAgain() {
      this.isCSV = false;
      this.parse_csv = [];
      this.parse_header = [];
    },
    open(id, editPostDialog = true) {
      this.postId = id;

      let data = this.sortData(id, this.userPosts);
      this.update_title = data["title"];
      this.update_variables = data["variable"];
      this.csvHeader = data["header"];
      this.csvTable = data["table"];

      this.editPostDialog = editPostDialog;
    },
    sortData(id, datasets) {
      let values = new Array();
      let variables = new Array();
      let res = {};

      for (let row in datasets) {
        if (id == datasets[row]._id) {
          res["title"] = datasets[row].title;
          res["variable"] = datasets[row].variables;
          values = datasets[row].categories;
          variables = datasets[row].variables;
          break;
        }
      }

      res["header"] = variables;
      res["table"] = this.getTable(values, variables);
      return res;
    },
    getTable(values, variables) {
      let allArr = new Array();
      for (let i = 0; i < values.length; i += variables.length) {
        let rowArr = new Array();
        for (let j = 0; j < variables.length; j++) rowArr.push(values[i + j]);
        allArr.push(rowArr);
      }
      return allArr;
    },
    deletePost(postId) {
      this.postId = postId;
      this.isDelete = true;
      this.isConfirmUpdate = false;
      this.alertDialog = true;
      this.alertContent = "Are you sure you want to delete this dataset?";
    },
    getUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    getUserSavedTemplates() {
      this.$store.dispatch("getUserSavedTemplates", {
        userId: this.user._id
      });
    },
    getUserTemplates() {
      this.$store.dispatch("getUserTemplates", {
        userId: this.user._id
      });
    },
    closeDataset() {
      this.editPostDialog = false;
    },
    closeAlert() {
      this.alertDialog = false;
    },
    closeAlertReport() {
      this.reportDialog = false;
    },
    confirmAlert() {
      this.$store.dispatch("deleteUserPost", {
        postId: this.postId
      });
      setTimeout(() => {
        location.reload();
      }, 500);
    },

    reportUpdate() {
      // for getting timestamp
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

      this.report_name = `report_${timestamp}`;
      this.reportDialog = true;
    },

  }
};
</script>

<style>
.import-icon {
  position: relative;
}
.cover-image {
  width: 300px;
  height: 120px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

checkbox {
  width: 20px !important;
  height: 20px !important;
}

.file-input-type {
  cursor: pointer;
  width: 300px;
  height: 120px;
  position: absolute;
  opacity: 0;
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

.csv-table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
}
.csv-table tr td {
  padding: 8px;
  border-top: 1px solid #adadad;
  border-left: 1px solid #adadad;
  background: white;
}

.csv-table > thead > tr > th {
  border-left: 1px solid #adadad;
  background: #1867c0;
  color: white;
  padding: 10px;
}

.input-cell {
  background: #ffffff;
  -moz-box-sizing: border-box;
  border: 1px solid #cbd5dd;
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
.update-input-cell {
  background: #ffffff;
  -moz-box-sizing: border-box;
  border: 1px solid #cbd5dd;
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
.left-padding {
  padding: 20px;
}
.panel {
  border: 0px solid #dfdfdf !important;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 0 0;
}

.v-template-background-changed {
  background-image: url(/img/template-icon.a13e7a0b.jpg);
  margin-left: 20px;
  width: 130px;
  height: 130px;
  background-size: 100% 100%;
}

.report-table {
  box-shadow: none !important;
  border-right: 1px solid #adadad;
  border-bottom: 1px solid #adadad;
}

.report-table tr:hover {
  color: #1867c0;
  cursor: pointer;
}
</style>
