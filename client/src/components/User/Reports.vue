<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 style="text-align: right">
        <v-btn color="info" type="button" @click="deleteReports">
          <v-icon light>delete</v-icon>
          Delete
        </v-btn>
        <v-card
          elevation="2"
        >
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="userReports"
            :pagination.sync="pagination"
            :rows-per-page-items="[10, 20, 50, 100]"
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
                <td>
                  <v-checkbox
                    :input-value="props.selected"
                    secondary
                    hide-details
                  ></v-checkbox>
                </td>
                <td>{{ props.item._id }}</td>
                <td class="text-xs-right">{{ props.item.report_name }}</td>
                <td class="text-xs-right">{{ props.item.report_desc }}</td>
                <!-- <td class="text-xs-right">{{ props.item.node_id }}</td>
                <td class="text-xs-right">{{ props.item.variable }}</td>
                <td class="text-xs-right">{{ props.item.previous }}</td> -->
                <td class="text-xs-right">{{ props.item.createdDate }}</td>
                <td class="text-xs-right"><v-btn text @click="viewReport(props.item._id)">View</v-btn></td>

              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>

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
          <v-layout row wrap>
            <v-flex xs12 style="text-align: center">
              <div class="title">{{ reportContent.report_name }}</div>
              <div style="margin:10px 0px 10px 0px">
                ({{ reportContent.report_desc }})
              </div>
            </v-flex>
          </v-layout>
          <v-layout row style="overflow-x: auto;">
            <v-flex xs12 class="csv-table report-table">
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-left">FileName</th>
                  <th class="text-left">ProcessedName</th>
                  <th class="text-left">ProjectID</th>
                  <th class="text-left">NodeID</th>
                  <th class="text-left">Variable</th>
                  <th class="text-left">Previous</th>
                  <th class="text-left">Modified</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in reportContent.report_content" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.file_name }}</td>
                  <td>{{ item.template_name }}</td>
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
          <vue-blob-json-csv
            file-type="csv"
            :file-name="csv_download_name"
            :data="reportContent.report_content"
          >
            <v-btn text><v-icon light>download</v-icon>CSV Download</v-btn>
          </vue-blob-json-csv>

          <v-spacer></v-spacer>
          <v-btn text @click="closeAlertReport">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- alert -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="alertDialog" style="width:100px">
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >Template Process</v-toolbar>
        <v-card-text>
          <v-icon light style="width: 100%; font-size: 100px; color:rgb(237, 86, 27)">verified_user</v-icon>
          <div class="font-weigh" style="padding:20px;">{{alertContent}}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="confirmDelete"
          >Ok</v-btn>
          <v-btn
            text
            @click="closeAlert"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
  
</template>

<script>

  import { mapState } from "vuex";
  export default {
    data: () => ({
      pagination: {
        sortBy: 'template_name'
      },
      selected: [],
      
      reportIDs: [],
      alertDialog: false,
      alertContent: "",
      reportDialog:false,
      reportContent:"",
      csv_download_name:"",
      
      headers: [
        {
          text: 'Report ID',
          align: 'left',
          value: '_id'
        },
        { text: 'Report Name', value: 'template_name' },
        { text: 'Description', value: 'project_id' },
        // { text: 'Node ID', value: 'node_id' },
        // { text: 'Variable', value: 'variable' },
        // { text: 'Previous', value: 'previous' },
        { text: 'Modified Date', value: 'created_at' },
        { text: 'Report View', value: 'modified' }
      ],
      reports: []
    }),
    computed: {
      ...mapState(["user", "userReports"])
    },
    created() {
      this.getUserReports();
    },
    mounted() {
      console.log(this.userReports, this.user)
    },
    methods: {
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.userReports.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      getUserReports() {
        this.$store.dispatch("getUserReports", {
          userId: this.user._id
        })
      },
      convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      },
      deleteReports(){
        console.log(this.selected)
        let reportIDs = new Array()
        if(this.selected.length > 0){
          for(let i in this.selected){
            reportIDs.push(this.selected[i]._id)
          }
          this.confirmDeleteReports(reportIDs)
        }
      },

      confirmDeleteReports(reportIDs) {
        this.reportIDs = reportIDs;
        this.alertDialog = true;
        this.alertContent = "Are you sure you want to delete selected reports?";
        console.log(reportIDs)
      },

      confirmDelete(){
        for(let i in this.reportIDs){
          this.deleting(this.reportIDs[i])
        }
        this.alertDialog = false;
      },

      deleting(id){
        this.$store.dispatch("deleteUserReport", {
          reportId: id
        });
        location.reload()
      },

      closeAlert(){
        this.alertDialog = false;
      },
      viewReport(id){
        this.reportDialog = true;
        this.reportContent = this.getReportById(id)
        // for getting timestamp
        let d = new Date(); 
        let timestamp = d.getFullYear() + ""
          + (d.getMonth()+1) + ""
          + d.getDate() + ""
          + d.getHours() + ""  
          + d.getMinutes() + "" 
          + d.getSeconds() + ""
          + d.getMilliseconds()

        this.csv_download_name = `report_${timestamp}`

        console.log(this.reportContent.report_content)
      },
      closeAlertReport(){
        this.reportDialog = false
      },
      getReportById(id){
        let report = new Array();
        let res = {}
        for (let r in this.userReports) {
          if (id == this.userReports[r]._id) {
            res.report_name = this.userReports[r].report_name
            res.report_desc = this.userReports[r].report_desc
            for(let i in this.userReports[r].modified){
              let row = {}
              row.file_name = this.userReports[r].file_name[i];
              row.template_name = this.userReports[r].template_name[i];
              row.project_id = this.userReports[r].project_id[i];
              row.node_id = this.userReports[r].node_id[i];
              row.variable = this.userReports[r].variable[i];
              row.previous = this.userReports[r].previous[i];
              row.modified = this.userReports[r].modified[i];
              report.push(row)
            }

            res.report_content = report
            break;
          }
        }
        return res;
      }
    }
  }
</script>
<style>

.accent--text{
  color: #1867c0 !important;
}

.v-icon.material-icons.theme--light.accent--text{
  color: #1867c0 !important;
}
.elevation-1{
  margin-top: 80px;
}

</style>