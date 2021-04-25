<template>
  <v-container class="text-xs-center">
    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <!-- <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}} popular</div> -->
                <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} datasets and {{userTemplates.length}} templates Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

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
    <v-layout row wrap style="justify-content:left;">
      <v-flex xs12 v-for="template in userSavedTemplates" :key="template._id" class="grid-view-cus">
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-btn @click="deleteSavedTemplate(template._id)" color="error" floating fab small dark>
            <v-icon>delete</v-icon>
          </v-btn>

          <!-- <v-img :src="template.imageUrl" @click="template_view(template._id)"></v-img> -->
          <div class="v-template-background" @click="template_view(template._id)"></div>
          <v-card-text>{{template.title}}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

    <!-- View Template Dialog -->
    <v-dialog xs6 sm6 offset-sm3 persistent v-model="editTemplateDialog" >
      <v-card>
        <v-card-title class="headline grey lighten-2">Template ({{templateTitle}})</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12>
              <v-card>
                
                <v-list two-line subheader>
                  
                  <v-list-tile v-for="(item, index) in templateContent" v-bind:key="index" avatar @click="">
                    <v-list-tile-avatar>
                      <v-icon v-bind:class="[item.iconClass]">{{ item.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.node_id }}</v-list-tile-title>
                      <!-- <v-list-tile-sub-title>{{ item.template_content }}</v-list-tile-sub-title> -->
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-icon color="grey lighten-1">info</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeTemplate">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
    
              <v-btn color="info" type="button"  @click="downloadTemplates">
                <v-icon light>download</v-icon>
                Download templates
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
    methods: {
      closeTemplate(){
        this.editTemplateDialog = false;
      },
      template_view(id, editTemplateDialog=true){
        this.templateID = id
        let templates = this.userSavedTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateTitle = templates[row].title
              let tempArray = new Array()
              for(let i in templates[row].templates){
                let temp_row = {}
                console.log(templates[row].node_ids[i])
                temp_row["template_content"] = templates[row].templates[i]
                temp_row["node_id"] = templates[row].node_ids[i]
                temp_row["icon"] = "folder"
                temp_row["iconClass"] = "grey lighten-1 white--text"
                tempArray.push(temp_row)
              }
              this.templateContent = tempArray
              break;
          } 
        } 
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
      downloadTemplates(){
        let templates = this.userSavedTemplates;
        let id = this.templateID
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateTitle = templates[row].title
              let tempArray = new Array()
              const zip = JsZip();
              for(let i in templates[row].templates){
                console.log(templates[row])

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
                const blob = new Blob([templates[row].templates[i]], { type: 'text/cfg' }) //text/plain //application/pdf
                zip.file(`${templates[row].node_ids[i]}_${timestamp}.cfg`, blob);

                tempArray.push(templates[row].templates[i])
              }

              zip.generateAsync({type: 'blob'}).then(zipFile => {
                // for getting timestamp
                const d = new Date(); 
                const timestamp = d.getFullYear() + ""
                  + (d.getMonth()+1) + ""
                  + d.getDate() + ""
                  + d.getHours() + ""  
                  + d.getMinutes() + "" 
                  + d.getSeconds() + ""
                  + d.getMilliseconds()
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
    height: 180px;
    background-size: 100% 100%;
}

.v-template-background{
    background-image: url(../../../assets/template-icon.jpg);
    width: 100%;
    height: 265px;
    background-size: 100% 100%;
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
    height: 180px;
    background-size: 100% 100%;
  }
}

</style>