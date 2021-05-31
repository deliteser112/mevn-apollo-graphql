<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 style="text-align: right">
        <v-btn color="info" type="button" @click="deleteReports">
          <v-icon light>delete</v-icon>
          Delete
        </v-btn>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="userReports"
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
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  secondary
                  hide-details
                ></v-checkbox>
              </td>
              <td>{{ props.item._id }}</td>
              <td class="text-xs-right">{{ props.item.template_name }}</td>
              <td class="text-xs-right">{{ props.item.project_id }}</td>
              <td class="text-xs-right">{{ props.item.node_id }}</td>
              <td class="text-xs-right">{{ props.item.variable }}</td>
              <td class="text-xs-right">{{ props.item.previous }}</td>
              <td class="text-xs-right">{{ props.item.modified }}</td>
              <td class="text-xs-right">{{ convert(props.item.createdDate) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

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

      headers: [
        {
          text: 'Report ID',
          align: 'left',
          value: '_id'
        },
        { text: 'Template Name', value: 'template_name' },
        { text: 'Project ID', value: 'project_id' },
        { text: 'Node ID', value: 'node_id' },
        { text: 'Variable', value: 'variable' },
        { text: 'Previous', value: 'previous' },
        { text: 'Modified', value: 'modified' },
        { text: 'Date', value: 'created_at' }
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
      // let reports = this.userReports;
      // for(let i = 0; i < reports.length; i++){
      //   let row = {}
      //   row.id = reports[i]._id
      //   row.template_name = reports[i].template_name
      //   row.project_id = reports[i].project_id
      //   row.node_id = reports[i].node_id
      //   row.variable = reports[i].variable
      //   row.previous = reports[i].previous
      //   row.modified = reports[i].modified
      //   row.created_at = this.convert(reports[i].createdDate)
        
      //   this.reports.push(row)
      // }
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
        console.log("confirm delete")
        // for(let i in this.selected){
        //   const index = this.userReports.indexOf(this.selected[i])
        //   this.userReports.splice(index, 1)
        // }
        
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