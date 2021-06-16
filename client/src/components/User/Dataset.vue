<template>
  <v-container class="text-xs-center">

  <!-- Templates Created By user -->
  <v-container v-if="!userSavedTemplates.length">
    <v-layout row wrap>
      <v-flex xs12>
        <h2>You have no templates currently. Go and add some!</h2>
      </v-flex>
    </v-layout>
  </v-container>

  <v-container class="mt-3" v-else>
    <v-flex xs12>
      <h2 class="font-weight-light">Processed Templates by you ({{userSavedTemplates.length}})</h2>
    </v-flex>
    <v-layout row wrap style="justify-content:left; position:relative; margin:0 auto">
      <v-flex xs12 v-for="template in userSavedTemplates" :key="template._id" class="grid-view-cus">
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-btn @click="deleteSavedTemplate(template._id)" color="error" floating fab small dark>
            <v-icon>delete</v-icon>
          </v-btn>

          <span class="v-updated-badge" v-if="template.isUpdated=='1'"><div class="v-updated-badge-shadow">Updated</div></span>

          <!-- <div class="v-template-background" @click="template_view(template._id, template.isUpdated)"></div> -->
          
          <div
            v-if="template.templateType=='single'"
            class="v-template-background"
            @click="template_view(template._id, template.isUpdated)"
          ></div>
          <div
            v-else
            class="v-template-background-1"
             @click="template_view(template._id, template.isUpdated)"
          ></div>

          <v-card-text>{{template.title}}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

    <!-- View Template Dialog -->
    <v-dialog xs6 sm6 offset-sm3 persistent v-model="editTemplateDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Template ({{templateTitle}})</v-card-title>
        <v-container>

          <!-- <v-layout row>
            <v-flex xs12>
              <v-card>
                
                <v-list two-line subheader>
                  
                  <v-list-tile v-for="(item, index) in templateContent" v-bind:key="index" avatar @click="event($event)">
                    <v-list-tile-avatar>
                      <v-icon v-bind:class="[item.iconClass]">{{ item.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-if="item.template_type=='single'">{{ item.node_id }}</v-list-tile-title>
                      <v-list-tile-title v-else>{{ item.file_name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-icon color="grey lighten-1">info</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout> -->

          <v-layout row wrap>
            <v-flex xs12 style="text-align: right">
              <v-data-table
                :headers="headers"
                :items="templateContent"
                :pagination.sync="pagination"
                :rows-per-page-items="[10, 20, 50, 100]"
                select-all
                item-key="_id"
              >
                <template v-slot:headers="props">
                  <tr>
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
                  <tr>
                    <td width="20px">{{ Number(props.item._id)+1 }}</td>
                    <td>
                      <v-layout row v-if="props.item.template_type == 'single'">
                        <v-flex xs12>
                          {{ props.item.node_id }}
                        </v-flex>
                      </v-layout>
                      <v-layout row v-else>
                        <v-flex xs12>
                          {{ props.item.file_name }}
                        </v-flex>
                      </v-layout>
                    </td>
                    <td>
                      <v-layout row v-if="props.item.template_type == 'single'">
                        <v-flex xs12>
                          [ .cfg ] file type
                        </v-flex>
                      </v-layout>
                      <v-layout row v-else>
                        <v-flex xs12>
                          [ {{ props.item.file_type }} ] file type
                        </v-flex>
                      </v-layout>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeTemplate">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
    
              <v-btn color="info" type="button" v-if="!updated" @click="downloadTemplates('old')">
                <v-icon light>download</v-icon>
                Download Templates
              </v-btn>

              <v-btn color="info" type="button" v-if="updated" @click="downloadTemplates('old')">
                <v-icon light>download</v-icon>
                Old Templates
              </v-btn>
              <v-btn color="info" type="button" v-if="updated"  @click="downloadTemplates('new')">
                <v-icon light>download</v-icon>
                New Templates
              </v-btn>
            </v-flex>
          </v-layout>
          
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import JsZip from 'jszip';
  import FileSaver from 'file-saver';
  import { mapState } from "vuex";
  import PostForm from "../Posts/Form";
  import { EventBus } from "@/event";
  export default {
    name: "Dataset",
    components: { PostForm },
    data() {
      return {
        editTemplateDialog: false,
        templateId:'',
        csvTable:[],
        csvHeader:[],
        templateContent:[],
        templateTitle:'',
        templateID:'',
        updated: false,

        //datatable

        pagination: {
          sortBy: 'key'
        },
        headers: [
          {
            text: 'No',
            align: 'left',
            value: 'key'
          },
          { text: 'File Name', value: 'file_name' },
          { text: 'File Type', value: 'file_type' }
        ]
      };
    },
    computed: {
      ...mapState(["user", "userPosts", "userTemplates", "userSavedTemplates"])
    },
    created() {
      this.getUserPosts();
      this.getUserTemplates();
      this.getUserSavedTemplates();
      
      EventBus.$on('submitPostForm', ({parentName, post}) => {
        if (parentName !== this.$options.name) return;
        this.updatePost(post);
      })
    },
    mounted() {
      console.log("H:", this.userSavedTemplates)
    },
    methods: {
      closeTemplate(){
        this.editTemplateDialog = false;
      },
      template_view(id, updated, editTemplateDialog=true){
        this.templateID = id
        console.log(updated)

        this.updated = updated=='1'?true:false

        let templates = this.userSavedTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateTitle = templates[row].title
              let tempArray = new Array()
              console.log(templates[row].templates)
              for(let i in templates[row].templates){
                let temp_row = {}
                console.log(templates[row].node_ids[i])
                temp_row["_id"] = i
                temp_row["template_content"] = templates[row].templates[i]
                temp_row["node_id"] = templates[row].node_ids[i]
                temp_row["file_name"] = `${templates[row].file_names[i]}${templates[row].file_types[i]}`
                temp_row["file_type"] = templates[row].file_types[i]
                temp_row["template_type"] = templates[row].templateType
                temp_row["icon"] = "folder"
                temp_row["iconClass"] = "grey lighten-1 white--text"
                tempArray.push(temp_row)
              }
              this.templateContent = tempArray
              break;
          } 
        } 
        console.log(this.userSavedTemplates)
        this.editTemplateDialog = editTemplateDialog;
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
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        })
      },
      updatePost(post) {
        this.$store.dispatch("updateUserPost", JSON.parse(JSON.stringify(post)));
        this.editTemplateDialog = false;
      },
     
      deleteSavedTemplate(templateId) {
        const deleteSavedTemplate = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (deleteSavedTemplate) {
          this.$store.dispatch("deleteUserSavedTemplate", {
            templateId: templateId
          });
          location.reload()
        }
      },
      event(e){
        console.log("clicked")
      },
      downloadTemplates(type){
        let templates = this.userSavedTemplates;
        let id = this.templateID
        for(let row in templates){
          if(id == templates[row]._id){
            console.log(templates[row])
            this.templateTitle = templates[row].title
            let tempArray = new Array()
            const zip = JsZip();
            for(let i in templates[row].templates){

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
              let template = type=='old'?[templates[row].templates[i]]:[templates[row].newTemplates[i]]
              let file_name = ""
              let file_type = ""
              let blob_type = ""
              if(templates[row].templateType == 'single'){
                file_name = `${templates[row].node_ids[i]}_${timestamp}`
                file_type = 'cfg'
              }else if(templates[row].templateType == 'tree'){
                file_name = templates[row].file_names[i]
                file_type = templates[row].file_types[i].replace('.', '')
              }

              blob_type = `text/${file_type}`

              const blob = new Blob(template, { type: blob_type }) //text/plain //application/pdf
              zip.file(`${file_name}.${file_type}`, blob);

              tempArray.push(templates[row].templates[i])
            }

            zip.generateAsync({type: 'blob'}).then(zipFile => {
      
              const fileName = `${this.templateTitle}.zip`;
              return FileSaver.saveAs(zipFile, fileName);
            });
            break;
          } 
        }
      }
    }
  };
</script>
<style>


.v-dialog {
    width: auto;
}

.v-dataset-background{
    background-image: url(../../../assets/dataset-icon.jpg);
    width: 100%;
    height: 190px;
    background-size: 100% 100%;
}

.v-template-background{
    background-image: url(../../../assets/template-icon.jpg);
    width: 100%;
    height: 265px;
    background-size: 100% 100%;
}

.v-template-background-1{
    background-image: url(../../../assets/template-icon-1.jpg);
    width: 100%;
    height: 265px;
    background-size: 100% 100%;
}

.v-updated-badge {
  position: absolute;
  background-color: #5CACEE;
  text-align:center;
  line-height:50px;
  width:100px;
  height:50px;
  color: white;
}

.v-updated-badge:after {
  content:"";
  position: absolute;
  top: 0px;
  transform: skew(20deg);
  right:-15px;
  width:30px;
  height:inherit;
  background-color: #5CACEE;
  border-radius: 0 4px 4px 0;
}

.v-updated-badge:before {
  content: "";
    position: absolute;
    top: 3px;
    transform: skewY(30deg);
    left: 0px;
    width: 8px;
    height: inherit;
    background-color: #00383e;
    z-index: 0;
}

.v-updated-badge {
  top: 170px;
  left: -8px;
}

.v-updated-badge-shadow{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #5cacee;
}

@media (min-width: 600px){
  .grid-view-cus{
    flex-basis: 200px !important;
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    max-width: 50%;
  }

  .v-template-background{
    background-image: url(../../../assets/template-icon.jpg);
    width: 100%;
    height: 190px;
    background-size: 100% 100%;
  }

  .v-template-background-1{
    background-image: url(../../../assets/template-icon-1.jpg);
    width: 100%;
    height: 190px;
    background-size: 100% 100%;
  }
}

</style>