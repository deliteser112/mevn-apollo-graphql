<template>
  <v-container text-xs-center mt-5 pt-5>
    <h1 v-if="!user">{{ headline }}</h1>
    <h2 v-else>Welcome back</h2>
    <v-form>
      <v-layout v-if="error" row wrap>
        <v-flex xs12 sm4>
          <form-alert :message="error.message"></form-alert>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-card color="secondary" dark>
            <v-container>
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="loginUser">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="email"
                                  :rules="emailRules"
                                  prepend-icon="email"
                                  label="Email"
                                  type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="password"
                                  :rules="passwordRules"
                                  prepend-icon="extension"
                                  label="Password"
                                  type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn :loading="loading" :disabled="!isFormValid" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                      Signin</v-btn>
                    <h3>Not having an account yet?</h3>
                    <router-link class="text--primary font-weight-bold" to="/register">Register
                    </router-link>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "Login",
    data() {
      return {
        headline: 'Login',
        isFormValid: true,
        email: '',
        password: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
        ],
        passwordRules: [
          password => !!password || "Password is required",
          password =>
            password.length >= 4 || "Password must be at least 4 characters"
        ]
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    watch: {
      // if user values change, redirect to home
      user(value) {
        this.$router.push('/');
      }
    },
    methods: {
      loginUser() {
        if(this.$refs.form.validate()) {
          this.$store.dispatch('loginUser', {
            email: this.email,
            password: this.password
          });
        }
      }
    }
  };
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
