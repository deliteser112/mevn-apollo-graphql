<template>
  <v-container text-xs-center mt-5 pt-5>

    <!-- Add Template Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <h1 class="primary--text">{{ headline }}</h1>
      </v-flex>
    </v-layout>

    <!-- Add Template Form -->
    <v-layout row wrap class="template-ops">
        <template-form :userId="user._id" :parent-name="$options.name"></template-form>
    </v-layout>

  </v-container>
</template>

<script>
  import { mapState } from "vuex";
  import { EventBus } from "@/event";
  import TemplateForm from "@/components/Posts/TemplateForm";

  export default {
    name: "AddTemplate",
    components: { TemplateForm },
    data() {
      return {
        headline: 'Import Template',
      };
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    created() {
      EventBus.$on('submitPostForm', ({parentName, template}) => {
        if (parentName !== this.$options.name) return;
        let createdTemplate = JSON.parse(JSON.stringify(template));
        delete createdTemplate.templateId;
        this.addTemplate(createdTemplate);
      });
    },
    methods:{
      addTemplate(template) {
        this.$store.dispatch('addTemplate', template);
        this.$router.push("/");
      },
    }
  };
</script>
<style>
.layout{
  justify-content: center;
}

@media only screen and (min-width: 959px){
  .template-ops{
      max-width:600px;
      margin-left: 50%;
      transform: translate(-50%, 10px);
  }
}

</style>