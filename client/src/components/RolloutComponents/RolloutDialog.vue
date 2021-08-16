<template>
  <!-- alert -->
  <v-dialog v-model="runRolloutDialog" class="mx-dialog">
    <v-card class="mx-dialog">
      <v-toolbar
        color="primary"
        dark
      >Template Process</v-toolbar>
      <v-card-text>
        <div class="code-viewer">
          <div v-if="dialogContent.type === undefined && dialogContent.cleanup !== undefined">
            <div v-if="dialogContent.cleanup.length > 0">
              <div class="obj-color">{{dialogContent.cleanup.length}} Selected files for cleanup</div>
              <ul>
                <li v-for="(item, index) of dialogContent.cleanup" :key="index">{{item}}</li>
              </ul>
            </div>
            <div class="obj-color" v-else>{{dialogContent.cleanup.length}} Selected files for cleanup : Skipped</div>

            <div v-if="dialogContent.rollout.length > 0">
              <div class="obj-color">{{dialogContent.rollout.length}} Selected files for rollout</div>
              <ul>
                <li v-for="(item, index) of dialogContent.rollout" :key="index">{{item}}</li>
              </ul>
            </div>
            <div class="obj-color" v-else>{{dialogContent.rollout.length}} Selected files for rollout : Skipped</div>

            <div v-if="dialogContent.validation.length > 0">
              <div class="obj-color">{{dialogContent.validation.length}} Selected files for validation</div>
              <ul>
                <li v-for="(item, index) of dialogContent.validation" :key="index">{{item}}</li>
              </ul>
            </div>
            <div class="obj-color" v-else>{{dialogContent.validation.length}} Selected files for validation : Skipped</div>
          </div>
          <!-- nodeId: "2003"
          template: " Template:\n---\n- \n  \n\n\n  tasks:\n \n  - IP of Node: 103.1.1.8 \n    \n - SM of Node: 255.0.0.0\n    \n - GW of Node: $var_GW \n \n - Name of Node: $var_hostname\n    \n \n Node is located at location: $location\n \n \n For questions please call us at : +49111111111\n \n  \n    \n"
          templateId: "6114dbed497c922d10e3f308" -->

          <div class="font-weigh" style="padding:20px;" v-else>
            <div>
              <span class="obj-color">Type: </span>{{dialogContent.type}}
            </div>
            <div>
              <span class="obj-color">Node ID: </span>{{dialogContent.nodeId}}
            </div>
            <div>
              <span class="obj-color">Template Id: </span>{{dialogContent.templateId}}
            </div>
            <div>
              <span class="obj-color">Content: </span>{{dialogContent.template}}
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="confirm"
        >Ok</v-btn>
        <v-btn
          text
          @click="close"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      runRolloutDialog: Boolean,
      dialogContent: Object,
      Confirm: { type: Function },
      Close: { type: Function }
    },
    data () {
      return {
        toggle_one: 0,
        toggle_multiple: [0, 1, 2]
      }
    },
    methods: {
        confirm () {
          this.Confirm();
        },
        close () {
          this.Close();
        }
    }
  }

</script>

<style scoped>
.mx-dialog {
  max-width: 620px !important;
}

.code-viewer {
    width: 100%;
    background-color: #38383a;
    border-radius: 10px;
    color: #d0782a;
    padding: 20px;
    min-width: 350px;
}
.obj-color {
  color: #96b38a
}

@media (max-width: 500px){
  .code-viewer {
    min-width: 0px;
  }
}

</style>