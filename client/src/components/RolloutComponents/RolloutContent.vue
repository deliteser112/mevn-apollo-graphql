<template>
  <v-card flat class="py-1">
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-layout row>
          <v-flex xs12 class="py-2 flex-center">
            <p class="display-2" v-if="templateData.type === 'single'">Single Templates</p>
            <p class="display-2" v-else-if="templateData.type === 'multiple'">Tree Templates</p>
            <p class="display-2" v-else>Choose rollout type...</p>
            <v-btn-toggle v-model="toggle_one" v-if="templateData.type === 'single'" mandatory>
              <v-btn class="btn-rollout-single" v-for="(item, index) in templateData.data" v-bind:key="index" @click="selectedSingleRollout('single', item.nodeId, item.templateId, item.template)">
                <p />
                <p class="headline font-weight-bold text-initial">
                    {{item.nodeId}}
                </p>
                <p class="font-weight-bold">
                    {{item.templateTitle}}
                </p>
              </v-btn>
            </v-btn-toggle>
            <rollout-multiple-stepper :templateData="templateData" :templateProps="selectedMultiRollout" v-if="templateData.type === 'multiple'"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import RolloutMultipleStepper from "@/components/RolloutComponents/RolloutMultipleStepper";

  export default {
    components: { RolloutMultipleStepper },
    props: {
        templateProps: { type: Function },
        templateData: Object
    },
    data () {
      return {
        toggle_one: 100,
        toggle_multiple: []
      }
    },
    created() {
    //   console.log("MMMM:", this.templateData)
    },
    mounted() {
        // if (this.templateData.length > 0) {
        //     console.log('THis is valu data')
        // }
    },
    methods: {
        selectedSingleRollout (type, nodeId, templateId, template) {
          const resObj = {type, nodeId, templateId, template}
          this.templateProps(resObj);
        },
        selectedMultiRollout (resObj) {
          this.templateProps(resObj);
        }
    }
  }

</script>

<style>
.btn-rollout-single{
    background-color: #146d17 !important;
    border-color: #4caf50 !important;
    margin: 15px !important;
    width: 200px !important;
    height: 100px !important;
    border-radius: 20px !important;
    color: white !important ;
}

.btn-rollout-multi{
    background-color: #064c84 !important;
    border-color: #2196f3 !important;
    margin: 15px !important;
    width: 200px !important;
    height: 100px !important;
    border-radius: 20px !important;
    color: white !important ;
}

.v-btn__content{
    display: block;
}

.flex-center {
    text-align: center;
}

.text-initial {
    text-transform: initial;
}

/* redefine the css */
.v-btn-toggle {
    display: block;
}
.v-btn-toggle--selected {
    box-shadow: none;
}
</style>