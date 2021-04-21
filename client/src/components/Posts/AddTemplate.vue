<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Template Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Template Form -->
    <v-layout row wrap>
        <template-form :userId="user._id" :parent-name="$options.name" style="width:100%"></template-form>
    </v-layout>

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
      };
    },
    apollo: {
      getTemplates: {
        query: GET_TEMPLATES,
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, template}) => {
        if (parentName !== this.$options.name) return;
        let createdTemplate = JSON.parse(JSON.stringify(template));
        delete createdTemplate.templateId;
        console.log("+++++++++++++", createdTemplate)
        let objAllData = this.getTemplates;
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
          this.addTemplate(createdTemplate)
        }
      });
    },
    methods:{
      addTemplate(template) {
        this.$store.dispatch('addTemplate', template);
        this.$router.push("/post/addtemplate");
        location.reload()
      },
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