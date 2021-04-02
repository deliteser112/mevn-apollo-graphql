<template>
  <div id="app">
    <v-alert
      dismissible
      class="alert info"
      v-model="$store.state.alert"
    >
      Someone saw the message!
    </v-alert>
    <v-app>
      <v-layout
        class="justify-center align-center"
      >
        <router-view/>
      </v-layout>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

#app {
  background-color: rgba(6, 184, 131, 0.03)
}
.alert {
  position: absolute;
  width: 50%;
  font-family: 'Fira Code', sans-serif
}

</style>
