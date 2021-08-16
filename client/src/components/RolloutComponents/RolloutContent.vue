<template>
  <v-card flat class="py-1">
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-layout row>
          <v-flex xs12 class="py-2 flex-center">
            <p class="headline" v-if="templateData.type === 'single'">
              Single Templates
            </p>
            <p class="headline" v-else-if="templateData.type === 'multiple'">
              Tree Templates
            </p>
            <p class="headline" style="margin-bottom: 0px" v-else>Choose rollout type...</p>
            <v-btn-toggle v-model="toggle_one" v-if="templateData.type === 'single'">
              <v-flex xs12 v-for="(row, index) in templateData.data" v-bind:key="index" style="text-align: left">
                <p class="font-weight-medium group-divide-text">
                  {{ row.groupTitle }}
                </p>
                <v-divider />
                <v-btn
                  class="btn-rollout-single"
                  v-for="(item, index) in row.groupItems"
                  v-bind:key="`${row.groupTitle}_${index}`"
                  @click="
                    selectedSingleRollout(
                      'single',
                      item.nodeId,
                      item.templateId,
                      item.template
                    )
                  "
                >
                  <p />
                  <p class="subheading font-weight-bold text-initial">
                    {{ item.nodeId }}.cfg
                  </p>
                </v-btn>
              </v-flex>
            </v-btn-toggle>
            <rollout-multiple-stepper
              :templateData="templateData"
              :templateProps="selectedMultiRollout"
              v-if="templateData.type === 'multiple'"
            />
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
    templateData: Object,
  },
  data() {
    return {
      toggle_one: 100,
      toggle_multiple: [],
    };
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
    selectedSingleRollout(type, nodeId, templateId, template) {
      const resObj = { type, nodeId, templateId, template };
      console.log(resObj);
      this.templateProps(resObj);
    },
    selectedMultiRollout(resObj) {
      this.templateProps(resObj);
    },
  },
};
</script>

<style>
.btn-rollout-single {
  background-color: #146d17 !important;
  border-color: #4caf50 !important;
  margin: 4px !important;
  padding: 0 15px !important;
  border-radius: 20px !important;
  color: white !important ;
}

.btn-rollout-multi {
  background-color: #064c84 !important;
  border-color: #2196f3 !important;
  margin: 4px !important;
  padding: 0 15px !important;
  border-radius: 20px !important;
  color: white !important ;
}

.group-divide-text {
  text-align: left;
  margin-bottom: 0px;
  margin-top: 20px;
}

.v-btn__content {
  display: block;
}

.flex-center {
  text-align: left;
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