<template>
  <v-container>
    <v-container>
      <v-layout>
        <v-card class="card-style">
          <v-btn color="success" class="btn-border" @click="singleRoleout" dark large> Single Rollout </v-btn>
          <v-btn color="info" class="btn-border" @click="multiRollout" dark large> Multi Rollout </v-btn>
        </v-card>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout>
        <v-card class="card-content-style">
          <rollout-content :templateData="rolloutData" :templateProps="rolloutMethod" />
        </v-card>
      </v-layout>
    </v-container>
    <v-container v-if="rolloutData.type !== undefined && isSingle">
      <v-layout>
        <v-btn color="error" class="btn-border" @click="runRollOut" dark large> Run Roll-Out </v-btn>
      </v-layout>
    </v-container>

    <rollout-dialog :runRolloutDialog="runRolloutDialog" :dialogContent="dialogContent" :Confirm="confirm" :Close="close" />
  </v-container>
</template>

<script>
  import { mapState } from "vuex";

  import RolloutContent from "@/components/RolloutComponents/RolloutContent";
  import RolloutDialog from "@/components/RolloutComponents/RolloutDialog";

  export default {
    components: { RolloutContent, RolloutDialog },
    data: () => ({
      show: false,
      rolloutData: {},
      rolloutContent: '',
      isSingle: false,

      // dialog
      runRolloutDialog: false,
      dialogContent: {}
    }),
    computed: {
      ...mapState(["user", "userPosts", "userTemplates", "userSavedTemplates"])
    },
    created() {
      this.getUserPosts();
      this.getUserTemplates();
      this.getUserSavedTemplates();
    },
    mounted() {
      // console.log("H:", this.userSavedTemplates)
    },
    methods: {
      singleRoleout () {
        this.isSingle = true;
        this.rolloutData = {};
        this.rolloutData.type = 'single';
        const data = [];
        this.userSavedTemplates.map((temp) => {
          if (temp.templateType === 'single') {
            temp.templates.map((tp, index) => {
              data.push({
                templateId: temp._id,
                templateTitle: temp.title,
                template: tp,
                nodeId: temp.node_ids[index]
              });
            })
          }
        })
        this.rolloutData.data = data;
      },
      
      multiRollout () {
        this.isSingle = false;
        this.rolloutData = {};
        this.rolloutData.type = 'multiple';
        const data = [];
        this.userSavedTemplates.map((temp) => {
          if (temp.templateType === 'tree') {
            temp.templates.map((tp, index) => {
              data.push({
                templateId: temp._id,
                templateTitle: temp.title,
                template: tp,
                filename: temp.file_names[index],
                filetype: temp.file_types[index]
              });
            })
          }
        })
        this.rolloutData.data = data;
      },

      rolloutMethod(rolloutData) {
        // Do something with the value
        this.rolloutContent = rolloutData;
        if (rolloutData.type === undefined) {
          this.runRollOut();
        }
        console.log(rolloutData);
      },

      // for dialog ------------------------------------------------------------>
      runRollOut() {
        this.runRolloutDialog = true;
        this.dialogContent = this.rolloutContent;
      },

      confirm() {
        this.runRolloutDialog = false;
      },
      close() {
        this.runRolloutDialog = false;
      },


      // fetching the data from database
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
    }
  };
</script>

<style>

.btn-border {
  border-radius: 30px;
  margin: 10px;
}

.card-style {
  border-radius: 30px;
  padding: 5px 10px;
}

.card-content-style {
  border-radius: 30px;
  padding: 5px 10px;
  width: 100%
}

@media (max-width: 500px){
  .btn-border {
    width: 100%;
    margin: 10px auto;
  }
}
</style>