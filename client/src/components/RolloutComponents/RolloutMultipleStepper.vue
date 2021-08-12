<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1"
        >Select files for cleanup</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2"
        >Select files for rollout</v-stepper-step
      >

      <v-divider></v-divider>

      <v-stepper-step step="3">Select files for validation</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-5" color="grey lighten-1">
          <v-btn-toggle v-model="cleanupFiles" multiple>
            <v-btn class="btn-rollout-multi" v-for="(item, index) in templateData.data" v-bind:key="index">
              <p />
              <p class="subheading font-weight-bold text-initial">
                  {{item.filename}} {{item.filetype}}
              </p>
              <p class="font-weight-bold">
                  {{item.templateTitle}}
              </p>
            </v-btn>
          </v-btn-toggle>
        </v-card>

        <v-btn color="primary" class="btn-border" @click="e1 = 2"> Continue </v-btn>

        <v-btn flat @click="e1 = 2, cleanupFiles = []" class="btn-border">Skip</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-5" color="grey lighten-1">
          <v-btn-toggle v-model="rolloutFiles" multiple>
            <v-btn class="btn-rollout-multi" v-for="(item, index) in templateData.data" v-bind:key="index">
              <p />
              <p class="subheading font-weight-bold text-initial">
                  {{item.filename}} {{item.filetype}}
              </p>
              <p class="font-weight-bold">
                  {{item.templateTitle}}
              </p>
            </v-btn>
          </v-btn-toggle>
        </v-card>

        <v-btn color="primary" class="btn-border" @click="e1 = 3"> Continue </v-btn>

        <v-btn flat @click="e1 = 3, rolloutFiles = []" class="btn-border">Skip</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" color="grey lighten-1">
          <v-btn-toggle v-model="validationFiles" multiple>
            <v-btn class="btn-rollout-multi" v-for="(item, index) in templateData.data" v-bind:key="index">
              <p />
              <p class="subheading font-weight-bold text-initial">
                  {{item.filename}} {{item.filetype}}
              </p>
              <p class="font-weight-bold">
                  {{item.templateTitle}}
              </p>
            </v-btn>
          </v-btn-toggle>
        </v-card>

        <v-btn color="error" class="btn-border" @click="selectedMultiRollout" dark large> Run Roll-Out </v-btn>
        <!-- <v-btn color="primary" @click="selectedMultiRollout"> Continue </v-btn> -->
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default {
    props: {
        templateProps: { type: Function },
        templateData: Object
    },
    data () {
      return {
        cleanupFiles: [],
        rolloutFiles: [],
        validationFiles: [],
        e1: 0
      }
    },

    methods: {
      selectedMultiRollout () {
        const cleanup = [];
        const rollout = [];
        const validation = [];
        this.cleanupFiles.map((cFile) => {
          const { filename, filetype } = this.templateData.data[cFile];
          const file = `${filename}${filetype}`;
          cleanup.push(file);
        });

        this.rolloutFiles.map((rFile) => {
          const { filename, filetype } = this.templateData.data[rFile];
          const file = `${filename}${filetype}`;
          rollout.push(file);
        });

        this.validationFiles.map((vFile) => {
          const { filename, filetype } = this.templateData.data[vFile];
          const file = `${filename}${filetype}`;
          validation.push(file);
        })

        const resObj = { cleanup, rollout, validation };
        this.templateProps(resObj);
      }
    }
  }
</script>