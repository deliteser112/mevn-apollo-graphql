<template>
  <v-container text-xs-center pt-5>

    <!-- Add Template Title -->
    <v-layout row wrap>
      <v-flex xs12 sm8>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Template Form -->
    <v-layout row wrap>
        <template-form :userId="user._id" :parent-name="$options.name" style="width:100%"></template-form>
    </v-layout>

    <!-- DataSets Created By user -->
    <v-container class="mt-1">
      <v-flex xs12>
        <h2 class="font-weight-light">Sample Templates
          <span class="font-weight-regular">({{sampleTemplates.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap style="justify-content:left;">
        <v-flex xs12 v-for="template in sampleTemplates" :key="template._id" class="grid-view-cus">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <div class="v-template-background" @click="sample_template_view(template._id)"></div>
            <v-card-text>{{template.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- View Sample Template Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="viewSampleTemplateDialog" style="width:100px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Sample Template({{templateTitle}})</v-card-title>
        <v-container>

          <v-layout row>
            <v-flex xs12>
                <textarea v-model="templateContent" class="text-area"></textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn color="info" type="button"  @click="closeSampleViewDialog">
                <v-icon light>close</v-icon>
                Close
              </v-btn>
            </v-flex>
          </v-layout>
          
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import TemplateForm from "@/components/Posts/TemplateForm";
  import {
    GET_TEMPLATES,
  } from "../../queries";
  export default {
    name: "AddTemplate",
    components: { TemplateForm },
    data() {
      return {
        headline: 'Import Template',
        viewSampleTemplateDialog:false,
        templateContent: "",
        templateTitle: ""
      };
    },
    apollo: {
      getTemplates: {
        query: GET_TEMPLATES,
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading', 'userTemplates', 'sampleTemplates'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, template}) => {
        if (parentName !== this.$options.name) return;
        let createdTemplate = JSON.parse(JSON.stringify(template));
        delete createdTemplate.templateId;
        let objAllData = this.userTemplates;
        let titleArr = new Array()
        let double = false
        for(let row in objAllData) titleArr.push(objAllData[row].title)

        for(let i = 0; i < titleArr.length; i++){
          if(titleArr[i]==createdTemplate.title){
            double = true
            break
          } 
        }
        if(double){
          alert("This dataset already exists!")
        }else{
          console.log(createdTemplate)
          this.addTemplate(createdTemplate)
        }
      });
    },

    methods:{
      addTemplate(template) {
        this.$store.dispatch('addTemplate', template);
        const path = `/post/addtemplate`
        if (this.$route.path !== path) this.$router.push(path)
        location.reload()
      },
      sample_template_view(id, viewSampleTemplateDialog=true){
        let templates = this.sampleTemplates;
        for(let row in templates){
          if(id == templates[row]._id){
              this.templateContent = templates[row].content
              this.templateTitle = templates[row].title
              break;
          } 
        } 
        this.viewSampleTemplateDialog = viewSampleTemplateDialog;
      },
      closeSampleViewDialog(){
        this.viewSampleTemplateDialog = false
      }
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}
/* 
@media only screen and (min-width: 959px){
  .template-ops{
      max-width:600px;
      margin-left: 50%;
      transform: translate(-50%, 10px);
  }
} */

</style>